<template lang="pug">
  .inner-page-container
    h1.inner-page-title Motion Detection DEMO
    .inner-page-contents
      question(
        :submitOption="submitOption"
      )
      detect-canvas(
        :submitOption="submitOption"
      )
    button.inner-button-link(
      @click="reset"
    ) RESET
</template>

<script>
  import { mapActions } from 'vuex';
  import Question from '~/components/Question';
  import DetectCanvas from '~/components/DetectCanvas';

  export default {
    name: 'main-page',
    data() {
      return {
      }
    },
    computed: {
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
      questions() {
        return this.$store.state.globalState.questions
      },
      currentQuestionId() {
        return this.$store.state.globalState.currentQuestionId
      },
      // Detect
      isLoading() {
        return this.$store.state.detect.isLoading
      },
      isStopTrading() {
        return this.$store.state.detect.isStopTrading
      }
    },
    components: {
      Question,
      DetectCanvas
    },
    methods: {
      ...mapActions({
        // Global
        initGlobalState: 'globalState/initGlobalState',
        resetGlobalState: 'globalState/resetGlobalState',
        setGlobalEnd: 'globalState/setGlobalEnd',
        unsetGlobalEnd: 'globalState/unsetGlobalEnd',
        setGlobalDebug: 'globalState/setGlobalDebug',
        unsetGlobalDebug: 'globalState/unsetGlobalDebug',
        updateCurrentQuestionId: 'globalState/updateCurrentQuestionId',
        // Detect
        initDetect: 'detect/initDetect',
        resetDetect: 'detect/resetDetect',
        startDetect: 'detect/startDetect',
        stopDetect: 'detect/stopDetect',
        // MotionState
        initMotionState: 'motionState/updateTrakingPoses'
      }),
      init() {
        this.initGlobalState();
        this.initDetect();
        this.initMotionState();
      },
      reset() {
        this.resetGlobalState();
        this.resetDetect();
        this.initMotionState();
      },
      newQuestion() {
        this.reset();
        if (this.currentQuestionId === this.questions.length - 1) {
          this.setGlobalEnd();
          console.log('end');
          location.replace('/end')
          // this.$router.push('/end');
        } else {
          this.updateCurrentQuestionId(this.currentQuestionId + 1);
          console.log('start new Question: idx', this.currentQuestionId)
        }
      },
      start() {
        this.newQuestion();
      },
      submitOption(idx) {
        const questionIdx = this.currentQuestionId;
        this.stopDetect();
        console.log('submit questionIdx-optionId', questionIdx, idx);
        setTimeout(this.newQuestion, 1000);
      },
      bindKeydown(e) {
        if (e.key.toLowerCase() === 'd') {
          if (this.isDebug) {
            this.unsetGlobalDebug();
          } else {
            this.setGlobalDebug();
          }
        }
        if (e.key.toLowerCase() === 't') {
          if (this.isStopTrading) {
            this.startDetect();
          } else {
            this.stopDetect();
          }
        }
      }
    },
    async mounted() {
      await this.init();
      await this.start();

      window.addEventListener('keydown', this.bindKeydown);
    },
    beforeDestroy() {
      window.removeEventListener('keydown', this.bindKeydown);
    }
  }
</script>

<style lang="sass">
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
