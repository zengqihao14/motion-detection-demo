<template lang="pug">
  .inner-page-container
    h1.inner-page-title Motion Detection DEMO
    .contents
      .detection-body(ref="bodyEl")
        .main-content(:class="isDebug ? 'isDebug' : ''")
          .question-body(
            ref="questionBodyEl"
            :class="showQuestion ? 'show' : ''"
          )
            h3.question-title Q: {{questions[currentQuestionId].title}}
            .question-contents
              .question-option(
                v-for="(option, idx) in questions[currentQuestionId].options"
                :class="questions[currentQuestionId].type === 2 ? 'two' : ''"
                :style="`height: ${itemHeight}px`"
                :key="idx"
                :data-val="option.val"
                :data-idx="idx"
                @click="submitAnswer"
              )
                p.question-option-text {{option.text}}
          button.content-button-link(
            ref="startBtnEl"
            :class="started ? 'isStarted' : ''"
            :disabled="started"
            @click="startQuestion"
          ) START
        video.detection-video(
          ref="videoEl"
          autoplay="true"
          playsinline
        )
        canvas.detection-canvas(
          ref="canvasEl"
          :class="isDebug ? 'isDebug' : ''"
        )
    button.inner-button-link(
      @click="reset"
    ) RESET
</template>

<script>
  // import * as posenet from '@tensorflow-models/posenet';
  import { drawKeypoints } from '~/utils/canvas'
  import { loadVideo } from '~/utils/video';
  import { calcArmAngle, detectHandState, detectOverSholder, detectWaving } from '~/utils/detectPose';
  import { INPUT_OPTIONS, SINGLE_POSE_OPTIONS, OUTPUT_OPTIONS } from '~/constants';

  const QUESTION_LIST = [
    {
      title: '燕子是不是不美????',
      type: 1,
      options: [
        {
          label: 'A',
          text: '美',
          val: 1
        },
        {
          label: 'B',
          text: '美',
          val: 1
        },
        {
          label: 'C',
          text: '美',
          val: 1
        },
        {
          label: 'D',
          text: '美',
          val: 1
        },
      ]
    },
    {
      title: '燕子是不是很美????',
      type: 1,
      options: [
        {
          label: 'A',
          text: '是',
          val: 1
        },
        {
          label: 'B',
          text: '是',
          val: 1
        },
        {
          label: 'C',
          text: '是',
          val: 1
        },
        {
          label: 'D',
          text: '是',
          val: 1
        },
      ]
    }
  ];

  // const QUESTION_LIST = [
  //   {
  //     title: '燕子是不是很美??',
  //     type: 2,
  //     options: [
  //       {
  //         label: 'A',
  //         text: '是',
  //         val: 1
  //       },
  //       {
  //         label: 'B',
  //         text: '是',
  //         val: 1
  //       },
  //     ]
  //   },
  //   {
  //     title: '燕子是不是很美????',
  //     type: 1,
  //     options: [
  //       {
  //         label: 'A',
  //         text: '是',
  //         val: 1
  //       },
  //       {
  //         label: 'B',
  //         text: '是',
  //         val: 1
  //       },
  //       {
  //         label: 'C',
  //         text: '是',
  //         val: 1
  //       },
  //       {
  //         label: 'D',
  //         text: '是',
  //         val: 1
  //       },
  //     ]
  //   }
  // ];

  export default {
    name: 'main-page',
    data() {
      return {
        video: null,
        canvas: null,
        net: null,
        itemHeight: 100,
        tempOptionIdx: -1,
        tempTrakingPoses: {},
        righthandState: '',
        lefthandState: '',
        aspect: 1,
        isDebug: true,
        stopTrading: true,
        started: false,
        showQuestion: false,
        answered: false,
        currentQuestionId: 0,
        hoveredOptionIdx: -1,
        questions: QUESTION_LIST
      }
    },
    components: {
    },
    methods: {
      reset() {
        this.started = false;
        this.stopTrading = true;
        this.answered = false;
        this.showQuestion = false;
        this.righthandState = '';
        this.lefthandState = '';
        this.tempOptionIdx = -1;
        this.tempTrakingPoses = {};
        this.hoveredOptionIdx = -1;
        this.currentQuestionId = 0;
        this.startVideo();
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

            console.log('pose', pose[0])

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
            poses.forEach(({ score, keypoints }) => {
              drawKeypoints(keypoints, ctx);
            });
          }
        }
        requestAnimationFrame(this.poseDetectionFrame);
      },
      detectPoseInRealTime() {
        this.poseDetectionFrame();
      },
      detectPostion(trakingPoses) {
        if (trakingPoses) {
          const currentQuestion = this.questions[this.currentQuestionId];
          const type = currentQuestion.type;
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

          this.detectAction(trakingPoses, 'right');
          this.detectAction(trakingPoses, 'left');

          if (type === 1) {
            if (this.righthandState === 'up') {
              this.detectInOption(rightWristPosition, trakingPoses);
            } else if (this.lefthandState === 'up') {
              this.detectInOption(leftWristPosition, trakingPoses);
            } else {
              this.hoveredOptionIdx = -1;
            }
          }
        }
      },
      startQuestion() {
        this.started = true
        this.currentQuestionId = this.currentQuestionId ? 0 : 1
        // this.currentQuestionId = 0
        setTimeout(() => {
          this.createQuestion(this.questions[this.currentQuestionId]);
        }, 1000);
      },
      createQuestion(question) {
        const optionEls = document.querySelectorAll('.question-option');
        optionEls.forEach((optionEl, idx) => {
          optionEl.classList.remove('isSelected');
          optionEl.classList.remove('isDroped');
        });
        this.showQuestion = true;
        this.stopTrading = false;
      },
      detectInOption(pos, trakingPoses) {
        const optionEls = document.querySelectorAll('.question-option');
        if (pos) {
          optionEls.forEach((optionEl, idx) => {
            const rect = optionEl.getBoundingClientRect();
            const top = rect.y
            const bottom = rect.y + rect.height
            const left = rect.x
            const right = rect.x + rect.width
            if (
              left < pos.x &&
              right > pos.x
            ) {
              this.hoveredOptionIdx = idx;
              if (this.tempOptionIdx !== idx) {
                this.tempOptionIdx = idx
                this.tempTrakingPoses = trakingPoses
              }
              if (!optionEl.classList.contains('isHovered')) {
                optionEl.classList.add('isHovered');
              }
            } else {
              optionEl.classList.remove('isHovered');
            }
          })
        }
      },
      detectAction(trakingPoses, hand = 'right') {
        const currentQuestion = this.questions[this.currentQuestionId];
        if (currentQuestion) {
          const type = currentQuestion.type;
          let wristPos = null;
          let elbowPos = null;
          let shoulderPos = null;
          let prevWristPos = null;
          let prevElbowPos = null;
          let prevShoulderPos = null;
          if (hand === 'right') {
            wristPos = trakingPoses['rightWrist'] ? trakingPoses['rightWrist'].position : null;
            elbowPos = trakingPoses['rightElbow'] ? trakingPoses['rightElbow'].position : null;
            shoulderPos = trakingPoses['rightShoulder'] ? trakingPoses['rightShoulder'].position : null;

            prevWristPos = this.tempTrakingPoses['rightWrist'] ? this.tempTrakingPoses['rightWrist'].position : null;
            prevElbowPos = this.tempTrakingPoses['rightElbow'] ? this.tempTrakingPoses['rightElbow'].position : null;
            prevShoulderPos = this.tempTrakingPoses['rightShoulder'] ? this.tempTrakingPoses['rightShoulder'].position : null;
          } else if (hand === 'left') {
            wristPos = trakingPoses['leftWrist'] ? trakingPoses['leftWrist'].position : null;
            elbowPos = trakingPoses['leftElbow'] ? trakingPoses['leftElbow'].position : null;
            shoulderPos = trakingPoses['leftShoulder'] ? trakingPoses['leftShoulder'].position : null;

            prevWristPos = this.tempTrakingPoses['leftWrist'] ? this.tempTrakingPoses['leftWrist'].position : null;
            prevElbowPos = this.tempTrakingPoses['leftElbow'] ? this.tempTrakingPoses['leftElbow'].position : null;
            prevShoulderPos = this.tempTrakingPoses['leftShoulder'] ? this.tempTrakingPoses['leftShoulder'].position : null;
          }

          const angle = calcArmAngle(wristPos, elbowPos, shoulderPos);
          const prevAngle = calcArmAngle(prevWristPos, prevElbowPos, prevShoulderPos);
          const handState = detectHandState(wristPos, elbowPos, shoulderPos);
          const overHead = detectOverSholder(wristPos, elbowPos, shoulderPos);
          const waving = detectWaving(wristPos, prevWristPos, hand);

          if (hand === 'right') {
            if (type === 2 && this.righthandState !== 'up' && handState === 'up') {
              this.tempTrakingPoses = trakingPoses
            }
            this.righthandState = handState
          } else {
            if (type === 2 && this.lefthandState !== 'up' && handState === 'up') {
              this.tempTrakingPoses = trakingPoses
            }
            this.lefthandState = handState
          }

          if (type === 2 && handState === 'down') {
            this.tempTrakingPoses = {}
          }

          if (type === 1) {
            if (this.hoveredOptionIdx > -1 &&
              overHead &&
              handState === 'up'
            ) {
              this.stopTrading = true;
              this.tempOptionIdx = -1;
              this.tempTrakingPoses = {};
              this.righthandState = '';
              this.lefthandState = '';
              this.submitAnswerByHand(this.hoveredOptionIdx);
            }
          } else if (type === 2) {
            if (
              waving &&
              handState === 'up'
            ) {
              this.hoveredOptionIdx = waving === 'left' ? 0 : 1;
              this.stopTrading = true;
              this.tempOptionIdx = -1;
              this.tempTrakingPoses = {};
              this.righthandState = '';
              this.lefthandState = '';
              const optionEls = document.querySelectorAll('.question-option');
              optionEls.forEach((optionEl, idx) => {
                if (this.hoveredOptionIdx === idx) {
                  this.hoveredOptionIdx = idx;
                  if (!optionEl.classList.contains('isHovered')) {
                    optionEl.classList.add('isHovered');
                  }
                } else {
                  optionEl.classList.remove('isHovered');
                }
              });
              this.submitAnswerByHand(this.hoveredOptionIdx);
            }
          }
        }
      },
      freeAllOption() {
        const optionEls = document.querySelectorAll('.question-option');
        optionEls.forEach((optionEl, idx) => {
          optionEl.classList.remove('isHovered');
        });
        this.hoveredOptionIdx = -1;
      },
      submitAnswer(e) {
        const targetEl = e.target;
        const targetIdx = parseInt(targetEl.getAttribute('data-idx'));
        const optionEls = document.querySelectorAll('.question-option');
        optionEls.forEach((optionEl, idx) => {
          if (idx === targetIdx) {
            if (!optionEl.classList.contains('isSelected')) {
              optionEl.classList.add('isSelected');
            }
          } else {
            if (!optionEl.classList.contains('isDroped')) {
              optionEl.classList.add('isDroped');
            }
          }
        });
        setTimeout(() => {
          this.answered = false;
          this.showQuestion = false;
          this.currentQuestionId = this.currentQuestionId ? 0 : 1;
          // this.currentQuestionId = 0
          this.createQuestion(this.questions[this.currentQuestionId]);
        }, 500);
      },
      submitAnswerByHand(targetIdx) {
        console.log('submit targetIdx', targetIdx)
        const currentQuestion = this.questions[this.currentQuestionId];
        const type = currentQuestion.type;
        const optionEls = document.querySelectorAll('.question-option');
        optionEls.forEach((optionEl, idx) => {
          if (idx === targetIdx) {
            if (type === 1) {
              if (!optionEl.classList.contains('isSelected')) {
                optionEl.classList.add('isSelected');
              }
            } else if (type === 2) {
              if (targetIdx === 0) {
                if (!optionEl.classList.contains('isWaving-left')) {
                  optionEl.classList.add('isWaving-left');
                }
              } else {
                if (!optionEl.classList.contains('isWaving-right')) {
                  optionEl.classList.add('isWaving-right');
                }
              }
            }
          } else {
            if (!optionEl.classList.contains('isDroped')) {
              optionEl.classList.add('isDroped');
            }
          }
        })
        setTimeout(() => {
          this.answered = false
          this.showQuestion = false
          this.currentQuestionId = this.currentQuestionId ? 0 : 1
          // this.currentQuestionId = 0
          this.hoveredOptionIdx = -1
          this.createQuestion(this.questions[this.currentQuestionId]);
        }, 500);
      }
    },
    async mounted() {
      const bodyEl = this.$refs.bodyEl;
      this.video = this.$refs.videoEl;
      this.canvas = this.$refs.canvasEl;
      this.canvas.width = bodyEl.offsetWidth;
      this.canvas.height = bodyEl.offsetHeight;
      this.video.width = bodyEl.offsetWidth;
      this.video.height = bodyEl.offsetHeight;
      this.itemHeight = bodyEl.offsetHeight - 120 - 100 - 30;

      window.myCanvas = this.canvas;

      this.aspect = this.canvas.width / this.canvas.height;

      this.net = await posenet.load(INPUT_OPTIONS);
      if (this.net && this.video  && this.canvas) {
          try {
              this.video = await loadVideo(this.video);
              console.log('this.video', this.video)
              this.detectPoseInRealTime();
          } catch (e) {
              throw e;
          }
      }

      window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'd') {
          this.isDebug = !this.isDebug
        }
      })
    }
  }
</script>

<style lang="sass">
  .inner-page-container
    position: relative
    box-sizing: border-box
    padding: 0
    margin: 0 auto
    min-height: 100vh
    display: flex
    flex-direction: column
    text-align: center
    .inner-page-title
      box-sizing: border-box
      position: absolute
      display: block
      padding: 3px 8px
      font-size: 14px
      font-weight: bold
      color: #FFF
      background-color: #333
      width: 100%
      z-index: 10
    .contents
      position: relative
      display: block
      width: 100%
      height: 100vh
    .main-content
      box-sizing: border-box
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      width: 100%
      height: 100%
      background-color: #EEE
      transition: opacity .56s ease-in-out
      padding: 60px 45px 30px
      opacity: 1
      z-index: 2
      &.isDebug
        opacity: .7
    .content-button-link
      position: absolute
      box-sizing: border-box
      display: block
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      color: #FFF
      background-color: #333
      border-radius: 20px
      border: none
      font-size: 68px
      font-weight: bold
      text-align: center
      letter-spacing: 15px
      line-height: 1
      padding: 15px 25px
      width: 380px
      height: 140px
      cursor: pointer
      transition: background-color .38s ease-in-out, color .38s ease-in-out, z-index .38s ease-in-out, opacity .38s ease-in-out
      opacity: 1
      z-index: 1
      &:hover,
      &.isHovered
        color: #FFF
        background-color: #777
      &.isStarted
        opacity: 0
        z-index: -100
    .question-body
      position: relative
      width: 100%
      height: auto
      transition: transform .58s ease-in-out, z-index .38s ease-in-out, opacity .38s ease-in-out
      transform: scale(1)
      opacity: 0
      z-index: 1
      &.show
        transform: scale(1)
        opacity: 1
      .question-title
        position: relative
        display: block
        width: 100%
        text-align: center
        font-size: 42px
        line-height: 60px
        letter-spacing: 3px
        height: 60px
        margin: 0 0 60px
      .question-contents
        position: relative
        display: flex
        flex-direction: row
        justify-content: space-between
        width: 100%
        height: auto
        .question-option
          flex: 2
          position: relative
          width: calc((100% / 4 - (3 * 50px)))
          height: calc(100vh - 60px - 30px - 60px)
          background-color: #FFF
          color: #333
          transition: transform .18s linear, z-index .18s ease-in-out, opacity .38s ease-in-out, background-color .18s ease-in-out, color .18s ease-in-out, box-shadow .18s ease-in-out
          transform: translateY(0)
          margin: 0 45px 0 0
          cursor: pointer
          opacity: 1
          z-index: 1
          &:hover,
          &.isHovered
            background-color: #333
            color: #FFF
            box-shadow: 1px 2px 3px 0 rgba(0, 0, 0, .15)
            transform: translateY(-25px)
          &:last-child
            margin: 0
          &.isSelected
            animation-fill-mode: both
            animation: picked .56s ease-in-out
          &.isWaving-left
            animation-fill-mode: both
            animation: isWaving-left .56s linear
          &.isWaving-right
            animation-fill-mode: both
            animation: isWaving-right .56s linear
          &.isDroped
            animation-fill-mode: both
            animation: droped .56s ease-in-out
          &.two
            flex: 0.24

        .question-option-text
          position: absolute
          top: 50%
          left: 50%
          transform: translate(-50%, -50%)
          font-size: 80px
          line-height: 1
    .point
      position: absolute
      box-sizing: border-box
      display: block
      top: 0
      left: 0
      transform: translate3d(0, 0, 0)
      width: 45px
      height: 45px
      margin: 0
      padding: 0
      border: none
      border-radius: 50%
      background-color: rgba(220, 50, 50, .25)
      z-index: 5
  .inner-button-link
    position: absolute
    box-sizing: border-box
    display: block
    right: 25px
    top: 4px
    color: #333
    background-color: #FFF
    border-radius: 3px
    border: 1px solid #FFF
    font-size: 10px
    font-weight: bold
    text-align: center
    line-height: 1
    padding: 3px 8px
    cursor: pointer
    z-index: 12
</style>
