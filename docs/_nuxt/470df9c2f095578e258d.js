(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{1068:function(t,e,n){var content=n(1074);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(116).default)("67114d8e",content,!0,{sourceMap:!1})},1073:function(t,e,n){"use strict";var o=n(1068);n.n(o).a},1074:function(t,e,n){(t.exports=n(115)(!1)).push([t.i,".inner-page-container{position:relative;box-sizing:border-box;padding:16px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;text-align:center}.inner-page-container .contents{position:relative;display:block;width:100%;margin:20px auto}.inner-page-container .detection-body{position:relative;width:100%;max-width:1024px;height:calc(100vh - 250px);border:1px solid #333;margin:0 auto 25px}.inner-page-container .detection-video{position:absolute;top:0;left:0;width:0;height:0;z-index:-1;display:none}.inner-page-container .detection-canvas{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:1}",""])},1077:function(t,e,n){"use strict";n.r(e);var o={flipHorizontal:!0,maxNumBoxes:20,iouThreshold:.5,scoreThreshold:.6},r={name:"main-page",components:{},methods:{startVideo:function(){var t=this,e=this.$refs.videoEl;e&&handTrack.startVideo(e).then(function(e){console.log("video started",e),e&&t.runDetection()})},runDetection:function(){var t=this,e=this.$refs.videoEl,n=this.$refs.handCanvas,o=n.getContext("2d");e&&n&&this.model&&this.model.detect(e).then(function(r){t.model.renderPredictions(r,n,o,e),requestAnimationFrame(t.runDetection)})}},mounted:function(){var t=this,e=this.$refs.videoEl,n=this.$refs.handCanvas;handTrack&&e&&n&&(console.log("handTrack",handTrack),console.log("handCanvas",n),handTrack.load(o).then(function(e){t.model=e,t.startVideo()}))}},c=(n(1073),n(73)),component=Object(c.a)(r,function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"inner-page-container"},[e("h1",{staticClass:"page-title"},[this._v("Motion Detection DEMO")]),e("div",{staticClass:"contents"},[e("div",{staticClass:"detection-body"},[e("video",{ref:"videoEl",staticClass:"detection-video",attrs:{autoplay:"true"}}),e("canvas",{ref:"handCanvas",staticClass:"detection-canvas"})]),e("router-link",{staticClass:"button-link",attrs:{to:"/"}},[this._v("Back To Top")])],1)])},[],!1,null,null,null);e.default=component.exports}}]);