<template lang="pug">
  .start-content
    button.start-button(@click="handleClick") START
</template>

<script>
  export default {
    name: 'end-component',
    data() {
      return {
      }
    },
    computed: {
    },
    props: {
      start: Function
    },
    components: {
    },
    methods: {
      handleClick() {
        this.start();
      }
    },
    mounted() {
    }
  }
</script>

<style lang="sass">
  .start-content
    position: absolute
    display: block
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    width: 100%
    margin: 0 auto
    .start-button
      position: relative
      box-sizing: border-box
      display: block
      margin: 0 auto
      color: #FFF
      background-color: #333
      border-radius: 20px
      border: none
      font-size: 48px
      font-weight: bold
      text-align: center
      letter-spacing: 5px
      line-height: 1
      padding: 8px 25px
      width: 280px
      height: 140px
      cursor: pointer
      transition: background-color .38s ease-in-out, color .38s ease-in-out, z-index .38s ease-in-out, opacity .38s ease-in-out
      opacity: 1
      z-index: 1
      &:hover,
      &.isHovered
        color: #FFF
        background-color: #777
</style>
