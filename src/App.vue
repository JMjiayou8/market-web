<template>
  <div id="app"
       :style="{transform:getScale}">
    <swiper :options="swiperOption"
            class="page-wrap"
            ref="mySwiper">
      <swiper-slide>
        <indexCom />
      </swiper-slide>
      <swiper-slide>
        <marketCom />
      </swiper-slide>
      <swiper-slide>
        <areaCom />
      </swiper-slide>
      <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
    </swiper>
  </div>
</template>
<script>
import indexCom from '@/views/index.vue'
import marketCom from '@/views/market.vue'
import areaCom from '@/views/area.vue'
export default {
  components: { indexCom, marketCom, areaCom },
  computed: {
    getScale () {
      return 'scale(' + document.body.clientWidth / 1920 + ',' + document.body.clientWidth / 1920 + ')'
    }
  },
  data () {
    return {
      swiperOption: {
        autoplay: {
          delay: 6000,//每1分钟轮播
          disableOnInteraction: false
        },
        loop: true,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
      },
    }
  }
}
</script>
<style lang="scss" >
body,
html,
div,
p,
ul,
li {
  margin: 0;
  padding: 0;
}
ul,
li {
  list-style: none;
}
html,
body,
#app {
  overflow: hidden;
}

div {
  box-sizing: border-box;
}

.page-top {
  width: 100%;
  height: 164px;
  font-size: 40px;
  font-family: "Adobe Heiti Std";
  color: #fff;
  line-height: 72px;
  text-align: center;
  text-shadow: 1px 2px 8px rgba(1, 21, 59, 0.004);
  background: url("./assets/icons/title-bg.png") no-repeat center/cover;
  span {
    font-size: 32px;
    margin-left: 10px;
  }
  p {
    background: url("./assets/icons/title-cover.png") no-repeat center/cover;
  }
}

.page-body {
  padding: 0 24px;
}
.page-wrap {
  width: 100%;
  height: 100%;
}
#app {
  width: 1920px;
  height: 1080px;
  transform-origin: left top 0;
  background: #000 url("./assets/icons/bg.png") no-repeat center/cover;
  box-sizing: border-box;
}

// 轮播组件
.swiper-pagination {
  position: fixed !important;
  bottom: 110px !important;
}
.swiper-pagination-bullet {
  width: 69px !important;
  height: 8px !important;
  background: rgb(4, 35, 87);
  border-radius: 10px !important;
}
.swiper-pagination-bullet-active {
  background: #12bba5 !important;
}

.swiper-button-prev, .swiper-button-next{
  opacity: 0;
  width: 100px!important;
  height: 100px!important;
  background-size: 100%!important;
  &:hover{
    opacity: 1;
  }
}
.swiper-button-prev{
  background-image: url('./assets/images/left.png')!important;
}
.swiper-button-next{
  background-image: url('./assets/images/right.png')!important;
}
</style>
