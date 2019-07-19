<template lang="pug">
  .question-body(
    ref="bodyEl"
    v-if="question"
    :class="isDebug ? 'isDebug' : ''"
  )
    h3.question-title {{question.title}}
    .question-option-wrapper
      .question-option-content
        .question-option(
          v-for="(option, idx) in question.options"
          :key="idx"
          :class="selectedOptionId === idx ? 'isHovered' : ''"
          :data-idx="idx"
          :data-val="option.val"
        )
          p.question-option-text {{option.text}}
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'question-component',
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
      question() {
        return this.$store.state.globalState.questions[this.$store.state.globalState.currentQuestionId]
      },
      currentQuestionId() {
        return this.$store.state.globalState.currentQuestionId
      },
      selectedOptionId() {
        return this.$store.state.globalState.selectedOptionId
      }
    },
    methods: {
      ...mapActions({
        // Detect
        initDetect: 'detect/initDetect',
        startDetect: 'detect/startDetect',
        stopDetect: 'detect/stopDetect',
        setDetectLoading: 'detect/setDetectLoading',
        unsetDetectLoading: 'detect/unsetDetectLoading'
      }),
    },
    mounted() {
    }
  }
</script>

<style lang="sass">
  .question-body
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
    background-color: #DDD
    transition: opacity .38s ease-in-out
    opacity: 1
    z-index: 5
    &.isDebug
      opacity: .7
    .question-title
      position: relative
      box-sizing: border-box
      width: 100%
      color: #333
      font-size: 38px
      font-weight: 500
      text-align: center
      height: 150px
      line-height: 150px
      margin: 0
      padding: 0
    .question-option-wrapper
      position: relative
      box-sizing: border-box
      width: 100%
      margin: 0
      padding: 0
      padding-top: calc(56.25% - 150px)
      .question-option-content
        position: absolute
        box-sizing: border-box
        display: inline-flex
        justify-content: space-between
        top: 0
        left: 0
        right: 0
        bottom: 0
        padding: 30px 0 45px
        margin: 0 auto
        width: 80vw
        height: 100%
        overflow: hidden
        .question-option
          flex: 1
          position: relative
          box-sizing: border-box
          margin: 0 50px 0 0
          background-color: #FFF
          color: #333
          transition: transform .18s linear, z-index .18s ease-in-out, opacity .38s ease-in-out, background-color .18s ease-in-out, color .18s ease-in-out, box-shadow .18s ease-in-out
          transform: translateY(0)
          cursor: pointer
          opacity: 1
          z-index: 1
          &:last-child
            margin: 0
          &:hover,
          &.isHovered
            background-color: #333
            color: #FFF
            box-shadow: 1px 2px 3px 0 rgba(0, 0, 0, .15)
            transform: translateY(-25px)
          .question-option-text
            position: absolute
            top: 50%
            left: 50%
            transform: translate(-50%, -50%)
            font-size: 80px
            line-height: 1
</style>
