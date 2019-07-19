<template lang="pug">
  .loading-body
    p.loading-text LOADING...
</template>

<script>
  export default {
    name: 'loading-component',
    data() {
      return {
      }
    },
    computed: {
    },
    components: {
    },
    props: {
    },
    methods: {
    },
    mounted() {
    }
  }
</script>

<style lang="sass">
  .loading-body
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
    z-index: 8
    .loading-text
      position: absolute
      top: 50%
      left: 50%
      transform: translate(-50%, -50%)
      text-align: center
      font-size: 32px
      font-weight: bold
      color: #333
</style>
