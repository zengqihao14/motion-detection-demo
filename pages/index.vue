<template lang="pug">
  .inner-page-container
    h1.inner-page-title Motion Detection DEMO
    .contents
      .detection-body(ref="bodyEl")
        video.detection-video(ref="videoEl" autoplay="true")
        canvas.detection-canvas(ref="handCanvas")
    button.inner-button-link(
      @click="startVideo"
    ) START
</template>

<script>
  // import * as handTrack from 'handtrackjs';

  const modelParams = {
    flipHorizontal: true,   // flip e.g for video
    maxNumBoxes: 2,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.79,    // confidence threshold for predictions.
  };

  export default {
    name: 'main-page',
    data() {
      return {
        aspect: 1,
        center: {
          x: 0,
          y: 0
        },
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
            this.detectPostion(predictions[0]);
            this.model.renderPredictions(predictions, handCanvas, context, videoEl);
            requestAnimationFrame(this.runDetection);
          });
        }
      },
      detectPostion(prediction) {
        const bodyEl = this.$refs.bodyEl;
        const handCanvas = this.$refs.handCanvas;
        if (bodyEl && prediction) {
          const bbox = prediction.bbox
          const rect = bodyEl.getBoundingClientRect();
          const bodySize = {
            width: rect.width,
            height: rect.height
          }
          const center = {
            x: (bbox[2] / 2) + bbox[0],
            y: (bbox[3] / 2) + bbox[1]
          }
          if (this.center.x !== 0 && this.center.y !== 0) {
            const offsetX = this.center.x - center.x;
            const offsetY = this.center.y - center.y;
            if (Math.abs(offsetX) > 30) {
              if (offsetX > 0) {
                console.log('left')
              } else {
                console.log('right')
              }
            }
            if (Math.abs(offsetY) > 30) {
              if (offsetY > 0) {
                console.log('up')
              } else {
                console.log('dowm')
              }
            }
          }
          this.center = center
        }
      },
      handleMousePosition(e) {
        const bodyEl = this.$refs.bodyEl;
        const rect = bodyEl.getBoundingClientRect();
        const x = e.clientX - rect.left; //x position within the element.
        const y = e.clientY - rect.top;  //y position within the element.
        console.log('x, y', x, y);
        console.log('rect', rect);
      }
    },
    mounted() {
      const bodyEl = this.$refs.bodyEl;
      const videoEl = this.$refs.videoEl;
      const handCanvas = this.$refs.handCanvas;
      handCanvas.width = bodyEl.offsetWidth / 2;
      handCanvas.height = bodyEl.offsetHeight / 2;
      videoEl.width = bodyEl.offsetWidth;
      videoEl.height = bodyEl.offsetHeight;

      this.aspect = handCanvas.width / handCanvas.height;
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
    .contents
      position: relative
      display: block
      width: 100%
      height: 100vh
    .detection-body
      position: relative
      box-sizing: border-box
      width: 100%
      padding: 0
      padding-top: 62.25%
      height: auto
      border: 1px solid #333
      margin: 0 auto
    .detection-video
      position: absolute
      top: 0
      left: 0
      width: 10px
      height: 10px
      z-index: -1
      display: none
    .detection-canvas
      position: absolute
      top: 0
      left: 0
      right: 0
      bottom: 0
      width: 100%
      height: 100%
      z-index: 1
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
    line-height: 1
    padding: 3px 8px
    cursor: pointer
    z-index: 12
</style>
