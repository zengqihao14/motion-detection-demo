<template lang="pug">
  .inner-page-container
    h1.inner-page-title Motion Detection DEMO
    .inner-page-contents
      .end-content
        h2.end-title END
        button.end-button(@click="handleReturnClick") RETURN
</template>

<script>
  export default {
    name: 'end-page',
    data() {
      return {
      }
    },
    computed: {
    },
    components: {
    },
    methods: {
      handleReturnClick() {
        // this.$router.push('/');
        location.replace('/')
      }
    },
    mounted() {
    }
  }
</script>

<style lang="sass">
  .end-content
    position: absolute
    display: block
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
    width: 100%
    margin: 0 auto
    .end-title
      width: 100%
      margin: 0 auto 60px
      font-size: 68px
      font-weight: bold
      text-align: center
    .end-button
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
