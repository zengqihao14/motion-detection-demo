<template lang="pug">
  .question-body(
    ref="bodyEl"
    v-if="question"
  )
    h3.question-title(
      :class="stateClassName"
    ) {{question.title}}
    .question-option-wrapper
      .question-option-content
        .question-option(
          v-for="(option, idx) in question.options"
          :key="idx"
          :class="`${stateClassName} ${selectedOptionId === idx ? 'isHovered' : ''}`"
          :data-idx="idx"
          :data-val="option.val"
          @click="() => handleOptionClick(idx)"
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
      stage() {
        return this.$store.state.globalState.stage
      },
      isBusy() {
        return this.$store.state.globalState.isBusy
      },
      isDebug() {
        return this.$store.state.globalState.isDebug
      },
      // Quiz
      question() {
        return this.$store.state.quiz.questions[this.$store.state.quiz.currentQuestionId]
      },
      currentQuestionId() {
        return this.$store.state.quiz.currentQuestionId
      },
      selectedOptionId() {
        return this.$store.state.quiz.selectedOptionId
      },
      isCreating() {
        return this.$store.state.quiz.isCreating
      },
      isReady() {
        return this.$store.state.quiz.isReady
      },
      isSubmitting() {
        return this.$store.state.quiz.isSubmitting
      },
      stateClassName() {
        if (this.isCreating) {
          return 'isCreating';
        } else if (this.isReady) {
          return 'isReady';
        } else if (this.isSubmitting) {
          return 'isSubmitting';
        }
      }
    },
    props: {
      submitOption: Function
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
      handleOptionClick(idx) {
        this.submitOption(idx);
      }
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
      opacity: 0
      &.isCreating
        animation: titleCreating .75s ease-in
      &.isReady
        opacity: 1
      &.isSubmitting
        animation: titleRemoving .75s ease-in
    .question-option-wrapper
      position: relative
      box-sizing: border-box
      width: 100%
      margin: 0
      padding: 0
      padding-top: calc(56.25% - 200px)
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
          opacity: 0
          z-index: 1
          &:last-child
            margin: 0
          &:hover,
          &.isHovered
            background-color: #333
            color: #FFF
            box-shadow: 1px 2px 3px 0 rgba(0, 0, 0, .15)
            transform: translateY(-25px)
            &.isSubmitting
              animation: optionSubmitting .75s ease-out !important
          &.isReady
            opacity: 1
          &.isSubmitting
            animation: optionRemoving .75s ease-out
          &:nth-child(0)
            &.isCreating
              animation: optionCreating .75s ease-out
          &:nth-child(1)
            &.isCreating
              animation: optionCreating .75s ease-out .1s
          &:nth-child(2)
            &.isCreating
              animation: optionCreating .75s ease-out .2s
          &:nth-child(3)
            &.isCreating
              animation: optionCreating .75s ease-out .3s
          &:nth-child(4)
            &.isCreating
              animation: optionCreating .75s ease-out .4s
          .question-option-text
            position: absolute
            top: 50%
            left: 50%
            transform: translate(-50%, -50%)
            font-size: 80px
            line-height: 1
</style>
