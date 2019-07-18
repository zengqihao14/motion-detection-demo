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

  import { drawKeypoints } from '~/utils/canvas';
  import { loadVideo } from '~/utils/video';
  import { INPUT_OPTIONS, SINGLE_POSE_OPTIONS, OUTPUT_OPTIONS } from '~/constants';

  export default {
    name: 'detect-canvas',
    components: {
    },
    data() {
      return {
      }
    },
    computed: {
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
      }
    },
    methods: {
      ...mapActions({
        initDetect: 'detect/initDetect',
        setDetect: 'detect/setDetect',
        startDetect: 'detect/startDetect',
        stopDetect: 'detect/stopDetect',
        setDetectLoading: 'detect/setDetectLoading',
        unsetDetectLoading: 'detect/unsetDetectLoading'
      }),
      detectPostion(trakingPoses) {
        if (trakingPoses) {
          let rightWristScore = 0;
          let leftWristScore = 0;
          let rightWristPosition = null;
          let leftWristPosition = null;
          // 右手
          if (trakingPoses['rightWrist']) {
            rightWristScore = trakingPoses['rightWrist'].score || 0;
            rightWristPosition = trakingPoses['rightWrist'].position;
          }
          // 左手
          if (trakingPoses['leftWrist']) {
            leftWristScore = trakingPoses['leftWrist'].score || 0;
            leftWristPosition = trakingPoses['leftWrist'].position;
          }
        }
      },
      async poseDetectionFrame() {
        if (!this.stopTrading) {
          const ctx = this.canvas.getContext('2d');
          const flipPoseHorizontal = true;
          let poses = [];

          ctx.clearRect(0, 0, this.video.width, this.video.height);
          ctx.save();
          ctx.scale(-1, 1);
          ctx.translate(-this.video.width, 0);
          ctx.drawImage(this.video, 0, 0, this.video.width, this.video.height);
          ctx.restore();

          const pose = await this.net.estimatePoses(this.video, {
            flipHorizontal: flipPoseHorizontal,
            decodingMethod: 'single-person'
          });

          if (pose && pose.length && pose[0].score > 0.7) {
            poses = poses.concat(pose);
            const score = pose[0].score;
            const keypoints = pose[0].keypoints;
            const trakingPoses = {};

            await poses.forEach(({score, keypoints}) => {
              drawKeypoints(keypoints, ctx);
            });

            Object.keys(keypoints).forEach(key => {
              const keypoint = keypoints[key];
              if (keypoint.part === 'rightWrist') {
                if (score > 0.56) {
                  trakingPoses['rightWrist'] = keypoint;
                }
              } else if (keypoint.part === 'leftWrist') {
                if (score > 0.56) {
                  trakingPoses['leftWrist'] = keypoint;
                }
              } else if (keypoint.part === 'rightElbow') {
                if (score > 0.6) {
                  trakingPoses['rightElbow'] = keypoint;
                }
              } else if (keypoint.part === 'leftElbow') {
                if (score > 0.6) {
                  trakingPoses['leftElbow'] = keypoint;
                }
              } else if (keypoint.part === 'rightShoulder') {
                if (score > 0.6) {
                  trakingPoses['rightShoulder'] = keypoint;
                }
              } else if (keypoint.part === 'leftShoulder') {
                if (score > 0.6) {
                  trakingPoses['leftShoulder'] = keypoint;
                }
              }
            });
            this.detectPostion(trakingPoses);
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
        canvas.width = bodyEl.offsetWidth;
        canvas.height = bodyEl.offsetHeight;
        video.width = bodyEl.offsetWidth;
        video.height = bodyEl.offsetHeight;

        const net = await posenet.load(INPUT_OPTIONS);

        if (video  && canvas && net) {
          try {
            const loadedVideo = await loadVideo(video);

            await this.setDetect({
              video: loadedVideo,
              canvas,
              net
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

      window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'd') {
          this.isDebug = !this.isDebug
        }
      });
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
