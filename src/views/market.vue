<template>
  <div class="index-page">
    <div class="page-top">中国联通营销平台系统<span>(活动)</span></div>
    <div class="page-body">
      <div class="index-left">
        <div class="index-part part1">
          <div class="part1-top-title">活动订购量TOP10</div>
          <div class="part-body">
            <ul class="part1-list">
              <li v-for="item in part1Data"
                  :key="item.level"
                  :class="`part1-item level${item.level}`">
                <p class="top-wrap">
                  <span class="part1-title">{{item.title}}</span>
                  <span :class="`part1-trend ${item.trend}`">{{item.rate}}</span>
                </p>
                <div class="bottom-wrap">
                  <div class="part1-pro"
                       :style="{width:item.num/part1Max*240+'px'}">
                  </div>
                  <span class="part1-num">{{item.num}}</span>
                </div>

              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="index-right ">
        <p class="right-title">不限量流量包20元</p>
        <div class="index-part part3">
          <div class="part3-top-title">触点TOP5</div>
          <div class="part-body">
            <div id="part2Chart"
                 style="width:540px;height:540px;"></div>
          </div>
        </div>
        <div class="index-part part4">
          <div class="part4-top-title">地市TOP5</div>
          <div class="part-body">
            <ul class="part4-list">
              <li v-for="item in part4Data"
                  :key="item.level"
                  :class="`part4-item level${item.level}`">
                <p class="top-wrap">
                  <span class="part4-title">{{item.title}}</span>
                </p>
                <div class="bottom-wrap">
                  <span class="part4-num">{{item.num}}</span>
                  <div class="part4-pro"
                       :style="{width:item.num/part1Max*240+'px'}">
                  </div>
                </div>

              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { pathSymbols } from '@/utils/echartsConfig'
export default {
  data () {
    return {
      part1Data: [
        { title: '不限量流量包20元', num: 67377, level: 1, rate: '2.63%', trend: 'up' },
        { title: '集团客户活动', num: 63463, level: 2, rate: '5.3%', trend: 'down' },
        { title: '不限量流量包20元', num: 52672, level: 3, rate: '0', trend: 'none' },
        { title: '不限量流量包30元', num: 42115, level: 4, rate: '0', trend: 'none' },
        { title: '低销送流量 ', num: 27868, level: 5, rate: '0', trend: 'none' },
        { title: '不限量流量包20元', num: 17377, level: 6, rate: '1.33%', trend: 'up' },
        { title: '集团客户活动', num: 3463, level: 7, rate: '2.6%', trend: 'down' },
        { title: '不限量流量包20元', num: 2672, level: 8, rate: '0', trend: 'none' },
        { title: '不限量流量包30元', num: 1159, level: 9, rate: '0', trend: 'none' },
        { title: '低销送流量 ', num: 680, level: 10, rate: '0', trend: 'none' }
      ],
      part1Max: 70000,
      part4Data: [
        { title: '兰州市', num: 67377, level: 1 },
        { title: '嘉峪关', num: 63463, level: 2 },
        { title: '张掖市', num: 52672, level: 3 },
        { title: '武夷市', num: 42115, level: 4 },
        { title: '天水市 ', num: 27868, level: 5 },
      ],
    }
  },

  mounted () {
    this.drawPart2Chart();
  },
  methods: {
    drawPart2Chart () {
      let myChart = this.$echarts.init(document.getElementById('part2Chart'))
      let option = {
        xAxis: {
          data: ['短信', '网厅', '客服', 'CBSS', '外呼'],
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            textStyle: {
              fontSize: 24,
              color: '#fff'
            }
          }
        },
        yAxis: {
          splitLine: { show: false },
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: { show: false }
        },
        color: ['rgb(8, 249, 246)'],
        series: [{
          name: 'hill',
          type: 'pictorialBar',
          barCategoryGap: '-130%',

          symbol: 'path://M0,10 L10,10 C5.5,10 5.5,5 5,0 C4.5,5 4.5,10 0,10 z',
          label: {
            show: true,
            position: 'top',
            textStyle: {
              color: '#fff',
              fontSize: 20
            }
          },
          itemStyle: {
            normal: {
              opacity: 0.702
            },
            emphasis: {
              opacity: 1
            }
          },
          data: [123, 60, 25, 18, 12],
          z: 10
        }, {
          name: 'glyph',
          type: 'pictorialBar',
          barGap: '-100%',
          symbolPosition: 'end',
          symbolSize: 50,
          symbolOffset: [0, -80],
          data: [{
            value: 123,
            symbol: pathSymbols.duanxin,
            symbolSize: [50, 40]
          }, {
            value: 60,
            symbol: pathSymbols.wangting,
            symbolSize: [45, 45]
          }, {
            value: 25,
            symbol: pathSymbols.kefu,
            symbolSize: [35, 50]
          }, {
            value: 18,
            symbol: pathSymbols.CBSS,
            symbolSize: [50, 40]
          }, {
            value: 12,
            symbol: pathSymbols.waifu,
            symbolSize: [40, 50]
          }]
        }]
      };
      myChart.setOption(option);
    },
  }
}
</script>
<style lang="scss">
.index-page {
  width: 100%;
  height: 100%;
  .page-body {
    display: flex;
    margin-top: -60px;
    justify-content: space-between;
    padding: 20px 0 0 0;
    .index-left {
      width: 540px;
    }
    .index-right {
      width: calc(100% - 540px);
      background: url("../assets/images/marketRightBg.png") no-repeat left top;
      position: relative;
      background-size: contain;
      .right-title {
        color: rgb(0, 255, 255);
        font-size: 30px;
        position: absolute;
        right: 220px;
        top: 36px;
      }
    }
  }
  .part1 {
    .part1-top-title {
      width: 325px;
      height: 50px;
      font-size: 24px;
      color: #fff;
      text-align: center;
      line-height: 50px;
      background: url("../assets/images/market-title.png") no-repeat left center;
    }
    .part1-list {
      width: 100%;
      height: 843px;
      background: url("../assets/images/marketLeftBg.png") no-repeat center;
      overflow: hidden;
      .part1-item {
        width: 100%;
        height: 60px;
        padding: 0 20px;
        margin-top: 20px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        box-sizing: border-box;
        background: url("../assets/images/marketLeftLiBg.png") no-repeat
          center/cover;
        flex-direction: column;
        .top-wrap {
          .part1-title {
            font-size: 18px;
            width: 200px;
          }
          .part1-trend {
            margin-left: 24px;
            &.up {
              color: #900261;
              &::before {
                content: "↑+";
              }
            }
            &.down {
              color: #0e664e;
              &::before {
                content: "↓-";
              }
            }
            &.none {
              font-size: 0;
              &::before {
                content: "-";
                color: #00ffff;
                font-size: 16px;
              }
            }
          }
        }
        .bottom-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .part1-pro {
            height: 20px;
            background-image: linear-gradient(
              90deg,
              rgb(217, 1, 236) 0%,
              rgb(26, 189, 249) 100%
            );
          }
          .part1-num {
            color: #fff;
            font-size: 18px;
            margin-left: 20px;
          }
        }
      }
    }
  }

  .part3 {
    position: absolute;
    left: 40px;
    top: 86px;
    left: 216px;
    .part3-top-title {
      height: 50px;
      font-size: 24px;
      color: #fff;
      text-align: center;
      line-height: 50px;
      margin-bottom: 20px;
    }
  }
  .part4 {
    position: absolute;
    width: 420px;
    right: 70px;
    top: 196px;
    .part4-top-title {
      height: 50px;
      font-size: 24px;
      color: #fff;
      text-align: center;
      line-height: 50px;
      margin-bottom: 20px;
    }
    .part4-list {
      width: 100%;
      overflow: hidden;
      .part4-item {
        width: 100%;
        height: 60px;
        padding: 0 20px;
        margin-top: 20px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: flex-end;
        box-sizing: border-box;
        background: url("../assets/images/marketRightLiBg.png") no-repeat
          center/cover;
        flex-direction: column;
        .top-wrap {
          .part4-title {
            font-size: 18px;
            width: 200px;
          }
        }
        .bottom-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .part4-pro {
            height: 20px;
            background-image: linear-gradient(
              90deg,
              rgb(217, 1, 236) 0%,
              rgb(26, 189, 249) 100%
            );
          }
          .part4-num {
            color: #fff;
            font-size: 18px;
            margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>
