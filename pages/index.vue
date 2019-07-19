<template lang="pug">
  .inner-page-container
    h1.inner-page-title Motion Detection DEMO
    .inner-page-contents
      question
      detect-canvas
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
      // Detect
      isLoading() {
        return this.$store.state.detect.isLoading
      },
      isStopTrading() {
        return this.$store.state.detect.isStopTrading
      },
    },
    components: {
      Question,
      DetectCanvas
    },
    methods: {
      ...mapActions({
        // Global
        initGlobalState: 'globalState/initGlobalState',
        setGlobalDebug: 'globalState/setGlobalDebug',
        unsetGlobalDebug: 'globalState/unsetGlobalDebug',
        // Detect
        initDetect: 'detect/initDetect',
        startDetect: 'detect/startDetect',
        stopDetect: 'detect/stopDetect',
        // MotionState
        initMotionState: 'motionState/updateTrakingPoses'
      }),
      reset() {

      }
    },
    async mounted() {
      window.addEventListener('keydown', (e) => {
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
      });
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
    .inner-page-contents
      position: relative
      box-sizing: border-box
      display: block
      width: 100%
      height: auto
      padding: 0
      padding-top: 56.25%
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
