<template lang="pug">
  .inner-page-container
    h1.page-title Motion Detection DEMO
    h2.page-subTitle (PC)
    .contents
      .detection-body
        video.detection-video(ref="videoEl" autoplay="true")
        canvas.detection-canvas(ref="handCanvas")
      router-link.button-link(to="/") Back To Top

</template>

<script>
  // import * as handTrack from 'handtrackjs';

  const modelParams = {
    flipHorizontal: true,   // flip e.g for video
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
  };

  export default {
    name: 'pc-page',
    data() {
      return {
        model: null
      }
    },
    components: {
    },
    methods: {
      startVideo() {
        const videoEl = this.$refs.videoEl;
        if (videoEl) {
          handTrack.startVideo(videoEl).then((status) => {
            console.log("video started", status);
            if (status) {
              this.runDetection()
            }
          });
        }
      },
      runDetection() {
        const videoEl = this.$refs.videoEl;
        const handCanvas = this.$refs.handCanvas;
        const context = handCanvas.getContext("2d");
        if (videoEl && handCanvas && this.model) {
          this.model.detect(videoEl).then(predictions => {
            // console.log("Predictions: ", predictions);
            this.model.renderPredictions(predictions, handCanvas, context, videoEl);
            requestAnimationFrame(this.runDetection);
          });
        }
      }
    },
    mounted() {
      const videoEl = this.$refs.videoEl;
      const handImg = this.$refs.handImg;
      const handCanvas = this.$refs.handCanvas;
      if (handTrack && videoEl  && handCanvas) {
        console.log('handTrack', handTrack);
        console.log('handCanvas', handCanvas);
        // Load the model.
        handTrack.load(modelParams).then(lmodel => {
          this.model = lmodel;
          this.startVideo();
        });
      }
    }
  }
</script>

<style lang="sass" scoped>
  .inner-page-container
    position: relative
    box-sizing: border-box
    padding: 16px
    margin: 0 auto
    min-height: 100vh
    display: flex
    flex-direction: column
    text-align: center
    .contents
      position: relative
      display: block
      width: 100%
      margin: 20px auto
    .detection-body
      position: relative
      width: 100%
      max-width: 1024px
      height: calc(100vh - 250px)
      border: 1px solid #333
      margin: 0 auto 25px
    .detection-video
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      width: 100%
      height: 100%
      z-index: 1
      opacity: 0
    .detection-canvas
      position: absolute
      top: 0
      left: 0
      width: 120px
      height: 60px
      z-index: 0
</style>
