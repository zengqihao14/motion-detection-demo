(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{1067:function(t,e,n){var content=n(1072);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(116).default)("40e6e5de",content,!0,{sourceMap:!1})},1071:function(t,e,n){"use strict";var o=n(1067);n.n(o).a},1072:function(t,e,n){(t.exports=n(115)(!1)).push([t.i,".inner-page-container[data-v-2e709ac6]{position:relative;box-sizing:border-box;padding:16px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;text-align:center}.inner-page-container .contents[data-v-2e709ac6]{position:relative;display:block;width:100%;margin:20px auto}.inner-page-container .detection-body[data-v-2e709ac6]{position:relative;width:100%;max-width:1024px;height:calc(100vh - 250px);border:1px solid #333;margin:0 auto 25px}.inner-page-container .detection-video[data-v-2e709ac6]{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:1;opacity:0}.inner-page-container .detection-canvas[data-v-2e709ac6]{position:absolute;top:0;left:0;width:120px;height:60px;z-index:0}",""])},1076:function(t,e,n){"use strict";n.r(e);var o={flipHorizontal:!0,maxNumBoxes:20,iouThreshold:.5,scoreThreshold:.6},r={name:"pc-page",data:function(){return{model:null}},components:{},methods:{startVideo:function(){var t=this,e=this.$refs.videoEl;e&&handTrack.startVideo(e).then(function(e){console.log("video started",e),e&&t.runDetection()})},runDetection:function(){var t=this,e=this.$refs.videoEl,n=this.$refs.handCanvas,o=n.getContext("2d");e&&n&&this.model&&this.model.detect(e).then(function(r){t.model.renderPredictions(r,n,o,e),requestAnimationFrame(t.runDetection)})}},mounted:function(){var t=this,e=this.$refs.videoEl,n=(this.$refs.handImg,this.$refs.handCanvas);handTrack&&e&&n&&(console.log("handTrack",handTrack),console.log("handCanvas",n),handTrack.load(o).then(function(e){t.model=e,t.startVideo()}))}},c=(n(1071),n(73)),component=Object(c.a)(r,function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"inner-page-container"},[e("h1",{staticClass:"page-title"},[this._v("Motion Detection DEMO")]),e("h2",{staticClass:"page-subTitle"},[this._v("(PC)")]),e("div",{staticClass:"contents"},[e("div",{staticClass:"detection-body"},[e("video",{ref:"videoEl",staticClass:"detection-video",attrs:{autoplay:"true"}}),e("canvas",{ref:"handCanvas",staticClass:"detection-canvas"})]),e("router-link",{staticClass:"button-link",attrs:{to:"/"}},[this._v("Back To Top")])],1)])},[],!1,null,"2e709ac6",null);e.default=component.exports}}]);