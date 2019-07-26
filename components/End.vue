<template lang="pug">
  .end-content
    h2.end-title END
    p.end-description {{name}}
    p.end-description SCORE: {{printScore()}}
    img.end-qrCode(:src="qrCodeUrl")
    button.end-button(@click="handleReturnClick") RETURN
</template>

<script>
  import QRCode from 'qrcode';
  import { mapActions } from 'vuex';

  export default {
    name: 'end-component',
    data() {
      return {
        qrCodeUrl: null
      }
    },
    computed: {
      // User
      name() {
        return this.$store.state.user.name
      },
      score() {
        return this.$store.state.user.score
      }
    },
    components: {
    },
    props: {
      init: Function
    },
    methods: {
      printScore() {
        let _score = 0;
        if (this.score) {
          this.score.forEach(item => {
            _score += item;
          })
        }
        return _score;
      },
      handleReturnClick() {
        this.init();
      },
      createQrCode() {
        QRCode.toDataURL(`name: ${this.name}; score: ${this.score}`, {
          errorCorrectionLevel: 'H',
          version: 4
        }).then(url => {
          this.qrCodeUrl = url;
        }).catch(err => {
          console.log('createQrCode err', err)
        });
      }
    },
    beforeMount() {
      this.createQrCode();
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
      margin: 0 auto 25px
      font-size: 48px
      font-weight: bold
      text-align: center
    .end-description
      width: 100%
      margin: 0 auto 5px
      font-size: 22px
      font-weight: bold
      text-align: center
    .end-qrCode
      position: relative
      box-sizing: border-box
      display: block
      margin: 10px auto
      width: 180px
      height: 180px
      border: 1px solid #333
    .end-button
      position: relative
      box-sizing: border-box
      display: block
      margin: 35px auto 0
      color: #FFF
      background-color: #333
      border-radius: 20px
      border: none
      font-size: 38px
      font-weight: bold
      text-align: center
      letter-spacing: 5px
      line-height: 1
      padding: 8px 20px
      width: 280px
      height: 90px
      cursor: pointer
      transition: background-color .38s ease-in-out, color .38s ease-in-out, z-index .38s ease-in-out, opacity .38s ease-in-out
      opacity: 1
      z-index: 1
      &:hover,
      &.isHovered
        color: #FFF
        background-color: #777
</style>
