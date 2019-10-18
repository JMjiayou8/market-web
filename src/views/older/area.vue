<template>
  <div class="index-page">
    <div class="page-top">中国联通营销平台系统<span>(地市)</span></div>
    <div class="page-body">
      <div class="index-left">
        <div class="index-part part1">
          <part-title title="活动总览"></part-title>
          <div class="part-body ">
            <ul class="total-list">
              <li class="total-li">
                <span class="total-title">活动总量</span>
                <p class="total-num">897<i class="total-unit">个</i></p>
              </li>
              <li class="total-li">
                <span class="total-title">有效活动</span>
                <p class="total-num">897<i class="total-unit">个</i></p>
              </li>
            </ul>
            <ul class="part1-list">
              <li v-for="item in part1Data"
                  :key="item.level"
                  :class="`part1-item level${item.level}`">
                <span class="part1-title">{{item.title}}</span>
                <div class="part1-pro">
                  <span :style="{width:item.num/part1Max*100+'%'}"></span>
                </div>
                <span class="part1-num">{{item.num}}</span>
              </li>
            </ul>
          </div>
        </div>
        <div class="split"></div>
        <div class="index-part part2">
          <part-title title="城市订购量排行">
            <span slot="right"
                  class="sub-title">TOP 5</span></part-title>
          <div class="part-body">
            <div id="part2Chart"
                 style="width: 525px;height:230px;"></div>
          </div>
        </div>
      </div>
      <div class="index-center">
        <div class="total-wrap">
          <div class="total1">
            <span>总订购量</span>
            <ul class="total-list">
              <li v-for="(item,index) in transBigData(total1)"
                  :key="index"
                  :class="item.type">
                {{item.text}}
              </li>
            </ul>
          </div>
          <div class="total2">
            <span>总推送量</span>
            <ul class="total-list">
              <li v-for="(item,index) in transBigData(total2)"
                  :key="index"
                  :class="item.type">
                {{item.text}}
              </li>
            </ul>
          </div>
        </div>
        <div class="map-wrap">

        </div>
      </div>
      <div class="index-right part3">
        <div class="index-part">
          <part-title title="触点反馈"
                      dir="right">
          </part-title>
          <div class="part-body">
            <div id="part3Chart1"
                 style="width:280px;height:420px;"></div>
            <div id="part3Chart2"
                 style="width:280px;height:420px;"></div>
          </div>
        </div>
        <div class="split"></div>
        <div class="index-part part4">
          <part-title title="产品订购量排行"
                      dir="right">
            <span slot="left"
                  class="sub-title">TOP 5</span></part-title>
          <div class="part-body">
            <ul class="part4-list">
              <li v-for="item in part4Data"
                  :key="item.id"
                  :class="`part4-item`">
                <span class="part4-title">{{item.title}}</span>
                <div class="part4-pro">
                  <span :style="{width:item.num/part4Max*100+'%'}"></span>
                </div>
                <span class="part4-num">{{item.num}}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { pieLegendStyle, pieColor } from '@/utils/echartsConfig'

export default {
  data () {
    return {
      part1Data: [
        { title: '单产品转融合', num: 67377, level: 1 },
        { title: '集团客户活动', num: 63463, level: 2 },
        { title: '不限量流量包20元', num: 52672, level: 3 },
        { title: '不限量流量包30元', num: 42115, level: 4 },
        { title: '低销送流量 ', num: 27868, level: 5 }
      ],
      part1Max: 70000,
      part2Data: [
        {
          title: '兰州', num: 9826
        },
        {
          title: '嘉峪关', num: 8240
        },
        {
          title: '张掖', num: 8006
        },
        {
          title: '白银', num: 7845
        },
        {
          title: '天水', num: 7017
        }
      ],
      total1: 10637892,
      total2: 121334300,
      part3Chart1Data: [{
        name: "短信",
        value: 90
      },
      {
        name: "外呼",
        value: 80
      },
      {
        name: "ESS",
        value: 70
      },
      {
        name: "CBSS",
        value: 40
      },
      {
        name: "客服",
        value: 30
      }
      ],
      part3Chart2Data: [{
        name: "短信",
        value: 70
      },
      {
        name: "外呼",
        value: 40
      },
      {
        name: "其它",
        value: 30
      }],

      part4Max: 70000,
      part4Data: [
        { title: '腾讯大王卡59元', num: 67377, id: 1 },
        { title: '天王卡99元送视频会员', num: 63463, id: 2 },
        { title: '10元5G流量包', num: 52672, id: 3 },
        { title: '5元2G流量包', num: 42115, id: 4 },
        { title: '畅越冰激凌99元套餐', num: 27868, id: 5 }
      ],
    }
  },
  computed: {

  },
  created () {
  },
  mounted () {
    this.drawPart2Chart();

    this.drawPart3Chart1();
    this.drawPart3Chart2();
  },
  methods: {
    transBigData (a) {
      return a.toLocaleString().split('').map((item) => {
        return { text: item, type: item == ',' ? 'unit' : "num" }      })
    },
    getArrayValue (array, key = "value") {
      var res = [];
      if (array) {
        array.forEach(function (t) {
          res.push(t[key]);
        });
      }
      return res;
    },
    array2obj (array, key) {
      var resObj = {};
      for (var i = 0; i < array.length; i++) {
        resObj[array[i][key]] = array[i];
      }
      return resObj;
    },
    drawPart2Chart () {
      let myChart = this.$echarts.init(document.getElementById('part2Chart'))
      let xAxisData = this.part2Data.map(item => item.title);
      let yAxisData = this.part2Data.map(item => item.num);
      var option = {
        color: ['rgb(44, 74, 222)'],
        grid: {
          left: 80,
          top: 25,
          bottom: 40
        },
        xAxis: {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#151f79'
            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 18,
            color: '#fff'
          },

          data: xAxisData,
        },
        yAxis: {
          type: 'value',

          axisLine: {
            lineStyle: {
              color: '#151f79'
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#151f79'
            }
          },
          axisLabel: {
            fontSize: 18,
            color: '#fff'
          }
        },
        series: [{
          data: yAxisData,
          type: 'bar',
          barWidth: 34,
          itemStyle: {
            borderColor: 'rgb(44, 74, 222)',
            barBorderRadius: 2,
            opacity: 0.3
          },
          label: {
            show: true,
            position: 'top',
            color: 'rgb(32, 253, 250)',
            fontSize: 16
          }
        }]
      };
      myChart.setOption(option);
    },
    drawPart3Chart1 () {
      let myChart = this.$echarts.init(document.getElementById('part3Chart1'))
      // let arrName = this.getArrayValue(this.part3Chart1Data, "name");
      // let arrValue = getArrayValue(data, "value");
      let objData = this.array2obj(this.part3Chart1Data, "name");
      let optionData = getData(this.part3Chart1Data)
      function getData (data) {
        var res = {
          series: [],
          yAxis: []
        };
        for (let i = 0; i < data.length; i++) {
          res.series.push({
            name: '',
            type: 'pie',
            clockWise: false, //顺时加载
            hoverAnimation: false, //鼠标移入变大
            radius: [73 - i * 8 + '%', 68 - i * 8 + '%'],
            center: ["50%", "30%"],
            label: {
              show: false
            },
            itemStyle: {
              label: {
                show: false,
              },
              labelLine: {
                show: false
              },
              borderWidth: 5,
            },
            data: [{
              value: data[i].value,
              name: data[i].name
            }, {
              value: 100 - data[i].value,
              name: '',
              itemStyle: {
                color: "rgb(2, 31, 62)",
                borderWidth: 0
              },
              tooltip: {
                show: false
              },
              hoverAnimation: false
            }]
          });
        }
        return res;
      }
      var option = {
        legend: {
          x: 'center',
          y: '60%',
          itemGap: 16,
          formatter: function (name) {
            return "{title|" + name + "}{value|" + (objData[name].value) + "}"
          },
          textStyle: pieLegendStyle,
        },
        color: pieColor,
        grid: {
          top: '0',
          left: "50%",
          containLabel: false
        },
        yAxis: [{
          type: 'category',
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            interval: 0,
            inside: true,
            textStyle: {
              color: "#fff",
              fontSize: 16,
            },
            show: true
          },
          data: optionData.yAxis
        }],
        xAxis: [{
          show: false
        }],
        series: optionData.series
      };
      myChart.setOption(option);
    },
    drawPart3Chart2 () {
      let self = this;
      let myChart = this.$echarts.init(document.getElementById('part3Chart2'))
      var option = {
        color: pieColor,
        legend: {
          x: 'center',
          y: '60%',
          orient: 'vertical',
          itemGap: 16,
          formatter: function (name) {
            let value = self.part3Chart2Data.find(item => item.name == name).value
            return "{title|" + name + "}{value|" + value + "}"
          },
          textStyle: pieLegendStyle,
        },
        series: [
          {
            name: '面积模式',
            type: 'pie',
            radius: [40, 100],
            center: ["50%", "30%"],
            roseType: 'area',
            clockwise: false,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            lableLine: {
              normal: {
                show: false
              },
              emphasis: {
                show: true
              }
            },
            data: this.part3Chart2Data
          }
        ]
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
    .index-left {
      width: 540px;
    }
    .index-center {
      width: 800px;
      margin: 0 20px;
    }
    .index-right {
      width: 540px;
    }
  }
  .part1 {
    .total-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      .total-li {
        width: 45%;
        text-align: center;
        border-bottom: 1px dashed rgb(28, 101, 254);
        .total-title {
          font-size: 24px;
          color: #fff;
        }
        .total-num {
          font-size: 32px;
          color: #20fdfa;
        }
        .total-unit {
          font-size: 18px;
          font-style: normal;
        }
      }
    }
    .part1-list {
      .part1-item {
        width: 100%;
        height: 75px;
        padding: 20px 20px 0 55px;
        margin-bottom: 10px;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        .part1-title {
          font-size: 20px;
          width: 200px;
        }
        .part1-pro {
          width: 200px;
          height: 9px;
          background-image: linear-gradient(
            0deg,
            rgb(170, 238, 255) 0%,
            rgb(127, 207, 255) 44%,
            rgb(156, 183, 244) 99%
          );
          border-radius: 20px;
          position: relative;
          span {
            height: 9px;
            position: absolute;
            top: 0;
            left: 0;
            background-image: linear-gradient(
              0deg,
              rgb(0, 175, 109) 0%,
              rgb(49, 210, 149) 100%
            );
            border-radius: 20px;
          }
        }
        .part1-num {
          color: #77ffff;
          font-size: 20px;
          margin-left: 20px;
        }
        &.level1 {
          background: url("../assets/icons/1.png") no-repeat center/cover;
        }
        &.level2 {
          background: url("../assets/icons/2.png") no-repeat center/cover;
        }
        &.level3 {
          background: url("../assets/icons/3.png") no-repeat center/cover;
        }
        &.level4 {
          background: url("../assets/icons/4.png") no-repeat center/cover;
        }
        &.level5 {
          background: url("../assets/icons/5.png") no-repeat center/cover;
        }
      }
    }
  }
  .total-wrap {
    width: 100%;
    height: 260px;
    background: url("../assets/icons/total-down.png") no-repeat center bottom;
    .total-list {
      display: flex;
    }
    .total1 {
      width: 100%;
      height: 115px;
      background: url("../assets/icons/total-bg.png") no-repeat center;
      font-size: 30px;
      color: rgb(79, 217, 252);
      display: flex;
      align-items: center;
      justify-content: center;
      .total-list {
        .num,
        .unit {
          font-size: 36px;
          color: rgb(238, 75, 74);
          font-weight: bold;
        }
        .num {
          background-color: rgba(0, 16, 92, 0.4);
          margin-left: 10px;
          line-height: 60px;
          padding: 0 5px;
        }
        .unit {
          bottom: -10px;
          position: relative;
        }
      }
    }
    .total2 {
      width: 100%;
      font-size: 18px;
      color: rgb(79, 217, 252);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 30px;
      .total-list {
        .num,
        .unit {
          font-size: 32px;
          color: rgb(254, 208, 0);
        }
        .num {
          border: 1px solid rgb(76, 249, 255);
          margin-left: 10px;
          line-height: 42px;
          padding: 0 5px;
        }
        .unit {
          bottom: -10px;
          position: relative;
        }
      }
    }
  }
  .map-wrap {
    width: 100%;
    height: 620px;
    background: url("../assets/icons/map-bg.png") no-repeat center bottom;
  }
  .part3 {
    .part-body {
      display: flex;
    }
  }
  .part4 {
    .part4-list {
      width: 100%;
      margin: 20px 10px 0 10px;
      .part4-item {
        width: 100%;
        margin-bottom: 30px;
        color: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        .part4-title {
          font-size: 20px;
          width: 210px;
        }
        .part4-pro {
          width: 200px;
          height: 9px;
          background-image: linear-gradient(
            0deg,
            rgb(170, 238, 255) 0%,
            rgb(127, 207, 255) 44%,
            rgb(156, 183, 244) 99%
          );
          border-radius: 20px;
          position: relative;
          span {
            height: 9px;
            position: absolute;
            top: 0;
            left: 0;
            background-image: linear-gradient(
              0deg,
              rgb(14, 109, 233) 0%,
              rgb(0, 122, 219) 100%
            );
            border-radius: 20px;
          }
        }
        .part4-num {
          color: #77ffff;
          font-size: 20px;
          margin-left: 20px;
        }
      }
    }
  }
  .split {
    width: 100%;
    height: 50px;
    background: url("../assets/icons/part-split.png") no-repeat center;
    background-size: 100% 10px;
  }
}
</style>
