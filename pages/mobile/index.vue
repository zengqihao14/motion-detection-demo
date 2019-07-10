<template lang="pug">
  .container
    h1.page-title Motion Detection DEMO
    h2.page-subTitle (Mobile)
    .contents
      router-link.button-link(to="/") Back To Top
</template>

<script>
  export default {
    name: 'mobile-page',
    components: {
    }
  }
</script>

<style lang="sass">
  .container
    margin: 0 auto
    min-height: 100vh
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center
    text-align: center
    .contents
      position: relative
      display: block
      width: 100%
      margin: 20px auto
</style>
