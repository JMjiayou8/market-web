<template>
  <div id="app"
       :style="{transform:getScale}">
    <router-view />
  </div>
</template>
<script>

export default {
  computed: {
    getScale () {
      return 'scale(' + document.body.clientWidth / 1920 + ',' + document.body.clientWidth / 1920 + ')'
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
  background: url("./assets/images/title-bg.png") no-repeat center/cover;
}

.page-body {
  padding: 0 24px;
}
#app {
  width: 1920px;
  height: 1080px;
  transform-origin: left top 0;
  background: #000 url("./assets/images/bg.png") no-repeat center/cover;
  box-sizing: border-box;
}
</style>
