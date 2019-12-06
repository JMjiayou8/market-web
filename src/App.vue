<template>
  <div id="app"
       :style="{transform:getScale}">
    <div class="pre-page"
         @click="goOtherPage('prev')">
      <img :src="require('@/assets/images/left.png')"
           alt="">
    </div>
    <router-view />
    <div class="next-page"
         @click="goOtherPage('next')">
      <img :src="require('@/assets/images/right.png')"
           alt="">
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    getScale () {
      return 'scale(' + document.body.clientWidth / 1920 + ',' + document.body.clientWidth / 1920 + ')'
    }
  },
  data () {
    return {
      arr: ['index', 'market', 'area']
    }
  },
  created () {
    let self = this;
    let i = 0;
    setInterval(function () {
      self.$router.push(self.arr[i]);
      i = (i + 1) % 3;
    }, 1000 *2)
  },
  methods: {
    goOtherPage (dir) {
      let self = this;
      let index = self.arr.indexOf(self.$route.name)
      let newIndex = dir == 'prev' ? (index + 2) % 3 : (index + 1) % 3;
      self.$router.push({ name: self.arr[newIndex] })
    },
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
#app {
  width: 1920px;
  height: 1080px;
  transform-origin: left top 0;
  background: #000 url("./assets/icons/bg.png") no-repeat center/cover;
  box-sizing: border-box;
}
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

.pre-page,
.next-page {
  width: 200px;
  position: fixed;
  top: 0;
  bottom: 0;
  cursor: pointer;
  z-index: 9;
  display: flex;
  align-items: center;
  img {
    display: none;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.1);
    img {
      display: block;
    }
  }
}
.pre-page {
  left: 0;
}
.next-page {
  right: 0;
}
</style>
