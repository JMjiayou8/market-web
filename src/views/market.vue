<template>
  <div class="index-page">
    <div class="page-top">中国联通营销平台系统<span>(活动)</span></div>
    <div class="page-body">
      <div class="index-left">
        <div class="index-part part1">
          <div class="part1-top-title">活动订购量TOP10</div>
          <div class="part-body">
            <ul class="order-list">
              <li v-for="(item,index) in part1Data"
                  :key="index"
                  :class="`order-item`">
                <div v-if="item">
                  <p class="top-wrap">
                    <span class="order-title">{{item.title}}</span>
                    <span :class="`part1-trend ${item.trend}`">{{item.rate}}%</span>
                  </p>
                  <div class="bottom-wrap">
                    <div class="order-pro"
                         :style="{width:item.num/part1Max*240+'px'}">
                    </div>
                    <span class="order-num">{{item.num}}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="index-right ">
        <p class="right-title">{{activeTitle}}</p>
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
            <ul class="order-list">
              <li v-for="(item,index) in part4Data"
                  :key="index"
                  :class="`order-item `">
                <div v-if="item">
                  <p class="top-wrap">
                    <span class="order-title">{{item.title}}</span>
                  </p>
                  <div class="bottom-wrap">
                    <span class="order-num">{{item.num}}</span>
                    <div class="order-pro"
                         :style="{width:item.num/part4Max*240+'px'}">
                    </div>
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
import { getMapData } from '@/apis'
let intervel, intervel2;
export default {
  data () {
    return {
      activeIndex: 0,
      activeTitle: '',
      part1Data: [],
      part1Max: 0,
      part4Max: 0,
      part4Data: [],
    }
  },
  //created和beforeDestroy实现定时器功能
  created () {
    // let self = this;
    // self.getData()
    intervel = setInterval(function () {
      // self.getData()
    }, 86400000)//1天刷新
  },
  beforeDestroy () {
    clearInterval(intervel)
    clearInterval(intervel2)
  },
  methods: {
    async getData () {
      const self = this;
      const res = await getMapData();
      // console.log(res.saleList)
      //活动订购量TOP10
      self.part1Data = res.saleList;
      self.part1Max = Math.max(...res.saleList.map(item => item.num));
      self.setData(res)
      intervel2 = setInterval(function () {
        self.setData(res)
      }, 6000)//每1分钟轮播右侧区域，不需要请求接口
    },
    setData (res) {
      const self = this;
      // 地市TOP5
      self.part4Data = res.saleList[self.activeIndex].areas;
      self.part4Max = Math.max(...self.part4Data.map(item => item.num))
      //当前轮播活动名称
      self.activeTitle = res.saleList[self.activeIndex].title;
      //触点TOP5
      self.drawPart2Chart(res.saleList);
      self.activeIndex = (self.activeIndex + 1) % 10;
    },
    async drawPart2Chart (list) {
      const self = this;
      let saleList = list[self.activeIndex].chnlInfos;
      let part2Data = {
        title: saleList.map(item => item.CHNL_NAME),
        data: saleList.map(item => item.ORDER_CNT),
      }
      let myChart = this.$echarts.init(document.getElementById('part2Chart'))
      let option = {
        grid: {
          top: 100
        },
        xAxis: {
          data: part2Data.title,
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
          data: part2Data.data,
          z: 10
        }, {
          name: 'glyph',
          type: 'pictorialBar',
          barGap: '-100%',
          symbolPosition: 'end',
          symbolSize: 50,
          symbolOffset: [0, -80],
          data: [{
            value: part2Data.data[0] || 0,
            symbol: pathSymbols.duanxin,
            symbolSize: [50, 40]
          }, {
            value: part2Data.data[1] || 0,
            symbol: pathSymbols.wangting,
            symbolSize: [45, 45]
          }, {
            value: part2Data.data[2] || 0,
            symbol: pathSymbols.kefu,
            symbolSize: [35, 50]
          }, {
            value: part2Data.data[3] || 0,
            symbol: pathSymbols.CBSS,
            symbolSize: [50, 40]
          }, {
            value: part2Data.data[4] || 0,
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
<style lang="scss" scoped>
.index-page {
  width: 100%;
  height: 100%;
  .page-body {
    position: relative;
    height: calc(100% - 180px);
    top: -60px;
    background: url("../assets/images/marketBg.png") no-repeat center;
    .index-left {
      position: absolute;
      top: 0;
      left: 0px;
      max-width: 520px;
    }
    .index-right {
      position: absolute;
      top: 0;
      left: 540px;
      width: calc(100% - 540px);
      height: 100%;
      .right-title {
        color: rgb(0, 255, 255);
        font-size: 30px;
        position: absolute;
        right: 120px;
        top: 46px;
        width: 480px;
        text-align: center;
      }
    }
  }
  .order-list {
    width: 100%;
    .order-item {
      width: 100%;
      height: 78px;
      padding: 20px 20px 0 100px;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      box-sizing: border-box;
      flex-direction: column;
      position: relative;
      .top-wrap {
        .order-title {
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
        // justify-content: space-between;
        .order-pro {
          height: 20px;
          background-image: linear-gradient(
            90deg,
            rgb(217, 1, 236) 0%,
            rgb(26, 189, 249) 100%
          );
        }
        .order-num {
          color: #fff;
          font-size: 18px;
          margin-left: 20px;
        }
      }
      &::before {
        content: "";
        width: 40px;
        height: 60px;
        position: absolute;
        top: 0;
        left: 20px;
        color: #fff;
        font-size: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
  .part1 {
    .part1-top-title {
      width: 325px;
      height: 70px;
      font-size: 24px;
      color: #fff;
      text-align: center;
      line-height: 70px;
    }
  }
  .part3 {
    position: absolute;
    width: 860px;
    top: 100px;
    .part3-top-title {
      height: 50px;
      font-size: 24px;
      color: #fff;
      text-align: center;
      line-height: 50px;
      margin-bottom: 20px;
    }
    .part-body {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .part4 {
    position: absolute;
    right: 92px;
    top: 210px;
    display: flex;
    align-items: center;
    flex-direction: column;
    min-width: 420px;
    .part4-top-title {
      width: 200px;
      height: 60px;
      font-size: 24px;
      color: #fff;
      text-align: center;
      line-height: 60px;
      margin-bottom: 15px;
    }
    .order-list {
      background: none;
      .order-item {
        width: 100%;
        height: 90px;
        padding: 0 85px 0 20px;
        align-items: flex-end;
        flex-direction: column;
        .top-wrap {
          text-align: right;
        }
        .order-num {
          margin-right: 20px;
        }
        &::before {
          right: 10px;
          left: auto;
        }
      }
    }
  }
}
</style>
