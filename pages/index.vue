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
        )
        canvas.detection-canvas(
          ref="handCanvas"
          :class="isDebug ? 'isDebug' : ''"
        )
    button.inner-button-link(
      @click="reset"
    ) RESET
</template>

<script>
  // import * as handTrack from 'handtrackjs';

  const modelParams = {
    flipHorizontal: true,   // flip e.g for video
    maxNumBoxes: 1,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.9,    // confidence threshold for predictions.
  };

  const QUESTION_LIST = [
    {
      title: '燕子是不是很美??',
      type: 2,
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

  export default {
    name: 'main-page',
    data() {
      return {
        aspect: 1,
        center: {
          x: 0,
          y: 0
        },
        isDebug: true,
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
        this.started = false
        this.answered = false
        this.showQuestion = false
        this.hoveredOptionIdx = -1
        this.currentQuestionId = 0
        this.startVideo();
      },
      startVideo() {
        const videoEl = this.$refs.videoEl;
        if (videoEl) {
          handTrack.startVideo(videoEl).then((status) => {
            if (status) {
              this.runDetection()
            }
          });
        }
      },
      runDetection() {
        const videoEl = this.$refs.videoEl;
        const handCanvas = this.$refs.handCanvas;
        const context = handCanvas.getContext("2d");
        if (videoEl && handCanvas && this.model) {
          this.model.detect(videoEl).then(predictions => {
            // console.log("Predictions: ", predictions);
            if (!predictions.length) {
              this.freeAllOption();
            }
            this.detectPostion(predictions[0]);
            this.model.renderPredictions(predictions, handCanvas, context, videoEl);
            requestAnimationFrame(this.runDetection);
          });
        }
      },
      detectPostion(prediction) {
        const bodyEl = this.$refs.bodyEl;
        const startBtnEl = this.$refs.startBtnEl
        const handCanvas = this.$refs.handCanvas;
        if (bodyEl && prediction) {
          const bbox = prediction.bbox
          const rect = bodyEl.getBoundingClientRect();
          const bodySize = {
            width: rect.width,
            height: rect.height
          }
          const center = {
            x: (bbox[2] / 2) + bbox[0],
            y: (bbox[3] / 2) + bbox[1]
          }
          if (this.center.x !== 0 && this.center.y !== 0) {
            const offsetX = this.center.x - center.x;
            const offsetY = this.center.y - center.y;
            if (Math.abs(offsetX) > 30) {
              if (offsetX > 0) {
                // console.log('left')
              } else {
                // console.log('right')
              }
            }
            if (Math.abs(offsetY) > 200) {
              if (offsetY > 0) {
                console.log('up')
                if (this.hoveredOptionIdx >= 0) {
                  this.submitAnswerByHand(this.hoveredOptionIdx);
                }
              } else {
                // console.log('dowm')
              }
            }
          }
          this.center = center
          this.detectInOption(this.center)
        }
      },
      startQuestion() {
        this.started = true
        this.currentQuestionId = this.currentQuestionId ? 0 : 1
        setTimeout(() => {
          this.createQuestion(this.questions[this.currentQuestionId]);
        }, 1000);
      },
      createQuestion(question) {
        this.showQuestion = true
      },
      detectInOption(pos) {
        const optionEls = document.querySelectorAll('.question-option');
        optionEls.forEach((optionEl, idx) => {
          const rect = optionEl.getBoundingClientRect();
          const top = rect.y
          const left = rect.x
          const bottom = rect.y + rect.height
          const right = rect.x + rect.width
          if (top < pos.y &&
            left < pos.x &&
            bottom > pos.y &&
            right > pos.x
          ) {
            this.hoveredOptionIdx = idx;
            if (!optionEl.classList.contains('isHovered')) {
              optionEl.classList.add('isHovered');
            }
          } else {
            optionEl.classList.remove('isHovered');
          }
        })
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
            optionEl.classList.add('isSelected');
          } else {
            optionEl.classList.add('isDroped');
          }
        })
        setTimeout(() => {
          this.answered = false
          this.showQuestion = false
          this.currentQuestionId = this.currentQuestionId ? 0 : 1
          this.createQuestion(this.questions[this.currentQuestionId]);
        }, 1000);
      },
      submitAnswerByHand(idx) {
        const optionEls = document.querySelectorAll('.question-option');
        const targetIdx = idx;
        optionEls.forEach((optionEl, idx) => {
          if (idx === targetIdx) {
            optionEl.classList.add('isSelected');
          } else {
            optionEl.classList.add('isDroped');
          }
        })
        setTimeout(() => {
          this.answered = false
          this.showQuestion = false
          this.currentQuestionId = this.currentQuestionId ? 0 : 1
          this.hoveredOptionIdx = -1
          this.createQuestion(this.questions[this.currentQuestionId]);
        }, 1000);
      }
    },
    mounted() {
      const bodyEl = this.$refs.bodyEl;
      const videoEl = this.$refs.videoEl;
      const handCanvas = this.$refs.handCanvas;
      handCanvas.width = bodyEl.offsetWidth / 2;
      handCanvas.height = bodyEl.offsetHeight / 2;
      videoEl.width = bodyEl.offsetWidth;
      videoEl.height = bodyEl.offsetHeight;

      this.aspect = handCanvas.width / handCanvas.height;
      if (handTrack && videoEl  && handCanvas) {
        // Load the model.
        handTrack.load(modelParams).then(lmodel => {
          this.model = lmodel;
          this.startVideo();
        });
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
    .detection-body
      position: relative
      box-sizing: border-box
      width: 100%
      padding: 0
      padding-top: 62.25%
      height: auto
      border: 1px solid #333
      margin: 0 auto
    .detection-video
      position: absolute
      top: 0
      left: 0
      width: 10px
      height: 10px
      z-index: -1
      display: none
    .detection-canvas
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      width: 100%
      height: 100%
      display: none
      z-index: 1
      &.isDebug
        display: block
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
        font-size: 32px
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
            animation: picked 1s ease-in-out
          &.isDroped
            animation-fill-mode: both
            animation: droped 1s ease-in-out
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
