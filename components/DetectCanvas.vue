<template lang="pug">
  .detection-body(ref="bodyEl")
    p(v-if="isLoading") LOADING
    p(v-if="isStopTrading") STOP
    video.detection-video(
      ref="videoEl"
      autoplay="true"
      playsinline
    )
    canvas.detection-canvas(
      ref="canvasEl"
      class="isDebug"
    )
</template>

<script>
  import { mapActions } from 'vuex';

  import { drawKeypoints, drawSkeleton } from '~/utils/canvas';
  import { loadVideo } from '~/utils/video';
  import { poseFilter, detectPose, detectArea } from '~/utils/detectPose';
  import { INPUT_OPTIONS, SINGLE_POSE_OPTIONS, OUTPUT_OPTIONS, SCORE_THRESHOLDS } from '~/constants';

  export default {
    name: 'detect-canvas',
    components: {
    },
    data() {
      return {
        containerWidth: 0,
        containerHeight: 0
      }
    },
    computed: {
      // Detect
      isLoading() {
        return this.$store.state.detect.isLoading
      },
      isStopTrading() {
        return this.$store.state.detect.isStopTrading
      },
      video() {
        return this.$store.state.detect.video
      },
      canvas() {
        return this.$store.state.detect.canvas
      },
      net() {
        return this.$store.state.detect.net
      },
      bodyNet() {
        return this.$store.state.detect.bodyNet
      },
      // MotionState
      trakingPoses() {
        return this.$store.state.motionState.trakingPoses
      },
      rightWristState() {
        return this.$store.state.motionState.rightWristState
      },
      leftWristState() {
        return this.$store.state.motionState.leftWristState
      },
      // GlobalState
      isStarting() {
        return this.$store.state.globalState.isStarting
      },
      isBusy() {
        return this.$store.state.globalState.isBusy
      },
      isDebug() {
        return this.$store.state.globalState.isDebug
      },
      selectedOptionId() {
        return this.$store.state.globalState.selectedOptionId
      }
    },
    props: {
      submitOption: Function
    },
    methods: {
      ...mapActions({
        // Global
        updateSelectedOptionId: 'globalState/updateSelectedOptionId',
        // Detect
        initDetect: 'detect/initDetect',
        setDetect: 'detect/setDetect',
        startDetect: 'detect/startDetect',
        stopDetect: 'detect/stopDetect',
        setDetectLoading: 'detect/setDetectLoading',
        unsetDetectLoading: 'detect/unsetDetectLoading',
        // MotionState
        updateTrakingPoses: 'motionState/updateTrakingPoses',
        updateRightWristState: 'motionState/updateRightWristState',
        updateLeftWristState: 'motionState/updateLeftWristState',
      }),
      reset() {
        // Important to purge variables and free up GPU memory
        this.net.dispose();
      },
      handlePose() {
        if (this.trakingPoses) {
          // 右手
          if (this.trakingPoses.rightWrist) {
            detectPose(this.trakingPoses, 'right', this.canvas, this.updateRightWristState)
          }
          // 左手
          if (this.trakingPoses.leftWrist) {
            detectPose(this.trakingPoses, 'left', this.canvas, this.updateLeftWristState)
          }

          let mainWrist = null;
          if ((this.rightWristState === 'up' || this.rightWristState === 'overSholder') &&
            (this.leftWristState === 'up' || this.leftWristState === 'overSholder')) {
            if (this.trakingPoses.rightWrist && this.trakingPoses.leftWrist) {
              mainWrist = this.trakingPoses.rightWrist.position.y < this.trakingPoses.leftWrist.position.y ?
                this.trakingPoses.rightWrist :  this.trakingPoses.leftWrist
            }
          } else if ((this.rightWristState === 'up' || this.rightWristState === 'overSholder') && this.trakingPoses.rightWrist) {
            mainWrist = this.trakingPoses.rightWrist;
          } else if ((this.leftWristState === 'up' || this.leftWristState === 'overSholder') && this.trakingPoses.leftWrist) {
            mainWrist = this.trakingPoses.leftWrist;
          }
          detectArea(mainWrist, this.trakingPoses, this.canvas, this.updateSelectedOptionId)

          if (this.selectedOptionId >= 0 && mainWrist && mainWrist.part === 'rightWrist') {
            if (this.rightWristState === 'overSholder') {
              this.submitOption(this.selectedOptionId);
            }
          } else if (this.selectedOptionId >= 0 && mainWrist && mainWrist.part === 'leftWrist') {
            if (this.leftWristState === 'overSholder') {
              this.submitOption(this.selectedOptionId);
            }
          }

          if (this.rightWristState === 'down' && this.leftWristState === 'down') {
            // 双手放下，不选择
            this.updateSelectedOptionId(-1);
          }
        }
      },
      async poseDetectionFrame() {
        if (!this.isStopTrading) {
          const ctx = this.canvas.getContext('2d');
          const flipPoseHorizontal = false;
          let poses = [];
          let minPoseConfidence;
          let minPartConfidence;

          const personSegmentation = await this.bodyNet.estimatePersonSegmentation(this.video, 16, 0.2);
          const maskBackground = true;
          const opacity = 1;
          const maskBlurAmount = 3;
          const flipHorizontal = true;
          const maskImage = await bodyPix.toMaskImageData(personSegmentation, maskBackground);

          ctx.clearRect(0, 0, this.containerWidth, this.containerHeight);
          await bodyPix.drawMask(this.canvas, this.video, maskImage, opacity, maskBlurAmount, flipHorizontal);
          const imageData = ctx.getImageData(0, 0, this.containerWidth, this.containerHeight);
          const pose = await this.net.estimatePoses(imageData, {
            flipHorizontal: flipPoseHorizontal,
            decodingMethod: 'single-person'
          });

          if (pose && pose.length && pose[0].score > SCORE_THRESHOLDS.main) {
            poses = poses.concat(pose);
            minPoseConfidence = +SINGLE_POSE_OPTIONS.minPoseConfidence;
            minPartConfidence = +SINGLE_POSE_OPTIONS.minPartConfidence;

            // render in Debug Model
            poses.forEach(({score, keypoints}) => {
              if (score > minPoseConfidence) {
                const handState = {
                  rightWristState: this.rightWristState,
                  leftWristState: this.leftWristState
                };
                drawKeypoints(keypoints, minPartConfidence, ctx, 1, handState);
                drawSkeleton(keypoints, minPartConfidence, ctx, 1, posenet);
              }
            });

            poseFilter(pose, this.updateTrakingPoses);
            this.handlePose();
          }
        }
        requestAnimationFrame(this.poseDetectionFrame);
      },
      detectPoseInRealTime() {
        this.poseDetectionFrame();
      },
      async launchDetect() {
        await this.initDetect()
        await this.setDetectLoading()

        const bodyEl = this.$refs.bodyEl;
        const video = this.$refs.videoEl;
        const canvas = this.$refs.canvasEl;

        this.containerWidth = bodyEl.offsetWidth;
        this.containerHeight = bodyEl.offsetHeight;
        canvas.width = this.containerWidth;
        canvas.height = this.containerHeight;
        video.width = this.containerWidth;
        video.height = this.containerHeight;

        const bodyNet = await bodyPix.load();
        const net = await posenet.load(INPUT_OPTIONS);

        if (video  && canvas && net && bodyNet) {
          try {
            const loadedVideo = await loadVideo(video);

            await this.setDetect({
              video: loadedVideo,
              canvas,
              net,
              bodyNet
            });
            await this.startDetect();
            await this.unsetDetectLoading();
            this.detectPoseInRealTime();
          } catch (e) {
            throw e;
          }
        }
      }
    },
    async mounted() {
      await this.launchDetect();
    }
  }
</script>

<style lang="sass">
  .detection-body,
  .detection-video,
  .detection-canvas
    position: absolute
    box-sizing: border-box
    display: block
    top: 0
    left: 0
    right: 0
    bottom: 0
    padding: 0
    margin: 0
    width: 100%
    height: 100%
    overflow: hidden
    z-index: 1
  .detection-video
    display: none
    z-index: -1
  .detection-canvas
    display: block
    z-index: 1
    opacity: 0
    transition: opacity .38s ease-in-out
    &.isDebug
      opacity: 1
</style>
