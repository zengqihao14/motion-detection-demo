<template lang="pug">
  .inner-page-container
    h1.inner-page-title Motion Detection DEMO
    .inner-page-contents
      loading(
        v-if="isLoading"
      )
      .componet-wrapper(
        :class="`${isLoading ? 'isLoading' : ''} ${isDebug ? 'isDebug' : ''}`"
      )
        start(
          v-if="stage === 'start'"
          :start="start"
        )
        question(
          v-else-if="stage === 'quiz'"
          :submitOption="submitOption"
        )
        end(
          v-else-if="stage === 'end'"
          :init="pageReload"
        )
      detect-canvas(
        :submitOption="submitOption"
      )
    button.inner-button-link(
      @click="pageReload"
    ) RESET
</template>

<script>
  import { mapActions } from 'vuex';
  import Loading from '~/components/Loading';
  import Start from '~/components/Start';
  import Question from '~/components/Question';
  import End from '~/components/End';
  import DetectCanvas from '~/components/DetectCanvas';
  import { STAGE } from '~/constants/stage';

  export default {
    name: 'main-page',
    data() {
      return {
      }
    },
    computed: {
      // GlobalState
      stage() {
        return this.$store.state.globalState.stage
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
      Loading,
      Start,
      Question,
      End,
      DetectCanvas
    },
    methods: {
      ...mapActions({
        // Global
        initGlobalState: 'globalState/initGlobalState',
        resetGlobalState: 'globalState/resetGlobalState',
        updateGlobalStage: 'globalState/updateGlobalStage',
        setGlobalDebug: 'globalState/setGlobalDebug',
        unsetGlobalDebug: 'globalState/unsetGlobalDebug',
        updateCurrentQuestionId: 'globalState/updateCurrentQuestionId',
        // Detect
        initDetect: 'detect/initDetect',
        resetDetect: 'detect/resetDetect',
        startDetect: 'detect/startDetect',
        stopDetect: 'detect/stopDetect',
        // MotionState
        initMotionState: 'motionState/updateTrakingPoses',
        // User
        initUser: 'user/initUser',
        updateUserScore: 'user/updateUserScore'
      }),
      init() {
        this.initGlobalState();
        this.initDetect();
        this.initMotionState();
        this.initUser();
      },
      pageReload() {
        location.replace('/');
      },
      reset() {
        this.resetGlobalState();
        this.resetDetect();
        this.initMotionState();
      },
      newQuestion() {
        this.reset();
        if (this.currentQuestionId === this.questions.length - 1) {
          this.updateGlobalStage(STAGE.END);
          // this.$router.push('/end');
        } else {
          this.updateCurrentQuestionId(this.currentQuestionId + 1);
          console.log('start new Question: idx', this.currentQuestionId)
        }
      },
      start() {
        this.newQuestion();
        this.updateGlobalStage(STAGE.QUIZ);
      },
      submitOption(idx) {
        const questionIdx = this.currentQuestionId;
        this.stopDetect();
        console.log('submit questionIdx-optionId', questionIdx, idx);
        const score = this.questions[questionIdx].options[idx].val;
        this.updateUserScore(score);
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
      window.addEventListener('keydown', this.bindKeydown);
    },
    beforeDestroy() {
      window.removeEventListener('keydown', this.bindKeydown);
    }
  }
</script>

<style lang="sass">
  .componet-wrapper
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
    background-color: #EEE
    transition: opacity .38s ease-in-out
    opacity: 1
    z-index: 5
    &.isDebug
      opacity: .7
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
