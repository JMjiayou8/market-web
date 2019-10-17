<template>
  <div :class="`part-title-wrap ${dir}`">
    <slot name="left"></slot>
    <span :class="`part-title`">{{title}}<i></i>
    </span>
    <slot name="right"></slot>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '活动总览'
    },
    dir: {
      type: String,
      default: 'left'
    }
  }
}
</script>
<style lang="scss" scoped>
.part-title-wrap {
  width: 100%;
  overflow: hidden;
  .sub-title {
    font-size: 24px;
    color: #fff;
    float: right;
  }
  .part-title {
    font-size: 24px;
    color: #fff;
    border-width: 0 0 1px 1px;
    border-color: #315e91;
    border-style: solid;
    padding: 0 16px 10px 16px;
    margin-bottom: 10px;
    display: inline-block;
    position: relative;
    float: left;
    &::before {
      content: "";
      width: 8px;
      height: 34px;
      background: #ffd200;
      position: absolute;
      top: 0;
      left: -4px;
    }
    &::after {
      content: "";
      width: 4px;
      height: 4px;
      background: #ffd200;
      border-radius: 50%;
      position: absolute;
      right: 0;
      bottom: -2px;
    }
    i {
      width: 45px;
      height: 1px;
      background: #5cb7fe;
      position: absolute;
      left: 20px;
      bottom: -1px;
    }
  }
  &.right {
    .sub-title {
      font-size: 24px;
      color: #fff;
      float: left;
    }
    .part-title {
      float: right;
      border-width: 0 1px 1px 0;
      &::before {
        content: "";
        left: auto;
        right: -4px;
      }
      &::after {
        content: "";
        left: 0;
      }
      i {
        left: auto;
        right: 20px;
      }
    }
  }
}
</style>