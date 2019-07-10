<template lang="pug">
  .container
    h1.page-title Motion Detection DEMO
    .contents
      router-link.button-link(to="pc") PC
      router-link.button-link(to="mobile") Mobile
</template>

<script>
export default {
  name: 'main-page',
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
    width: 100%
    max-width: 720px
    margin: 0 auto
    .contents
      position: relative
      display: block
      width: 100%
      margin: 20px auto
</style>
