<template>
  <div class="index-page">
    <div class="page-top">中国联通营销平台系统总览</div>
    <div class="page-body">
      <div class="index-left">
        <div class="index-part part1">
          <part-title title="活动总览"></part-title>
          <div class="part-body ">
            <ul class="total-list">
              <li class="total-li">
                <span class="total-title">活动总量</span>
                <p class="total-num">{{part1Total.totalActivity}}<i class="total-unit">个</i></p>
              </li>
              <li class="total-li">
                <span class="total-title">有效活动</span>
                <p class="total-num">{{part1Total.effectiveActivities}}<i class="total-unit">个</i></p>
              </li>
            </ul>
            <ul class="part1-list">
              <li v-for="(item,index) in saleInfoList"
                  :key="index"
                  :class="`part1-item level${index}`">
                <span class="part1-title">{{item.SALE_NAME}}</span>
                <div class="part1-pro">
                  <span :style="{width:item.ORDER_CNT/part1Max*100+'%'}"></span>
                </div>
                <span class="part1-num">{{item.ORDER_CNT}}</span>
              </li>
            </ul>
          </div>
        </div>

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
              <li v-for="(item,index) in total1"
                  :key="index"
                  :class="item.type">
                {{item.text}}
              </li>
            </ul>
          </div>
          <div class="total2">
            <span>总推送量</span>
            <ul class="total-list">
              <li v-for="(item,index) in total2"
                  :key="index"
                  :class="item.type">
                {{item.text}}
              </li>
            </ul>
          </div>
        </div>
        <div class="map-wrap">
          <p class="map-title">热力图</p>
          <div id="mapChart"
               style="width:750px;height:580px;"></div>
        </div>
      </div>
      <div class="index-right ">
        <div class="index-part part3">
          <part-title title="触点反馈"
                      dir="right">
          </part-title>
          <div class="part-body">
            <div class="chart-wrap left">
              <div id="part3Chart1"
                   style="width:250px;height:420px;"></div>
              <div class="title">推送</div>
            </div>
            <div class="chart-wrap right">
              <div id="part3Chart2"
                   style="width:250px;height:420px;"></div>
              <div class="title">订购</div>
            </div>

          </div>
        </div>

        <div class="index-part part4">
          <part-title title="产品订购量排行"
                      dir="right">
            <span slot="left"
                  class="sub-title">TOP 5</span></part-title>
          <div class="part-body">
            <ul class="part4-list">
              <li v-for="item in products"
                  :key="item.SERVICE_ID"
                  :class="`part4-item`">
                <span class="part4-title">{{item.SERVER_NAME}}</span>
                <div class="part4-pro">
                  <span :style="{width:item.ORDER_CNT/part4Max*100+'%'}"></span>
                </div>
                <span class="part4-num">{{item.ORDER_CNT}}</span>
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
import { getIndexData } from '@/apis'
import geoJson from '@/apis/gansu.json'
let intervel = null;
export default {
  data () {
    return {
      part1Total: {},
      saleInfoList: [],
      part1Max: 0,
      pushOrderCnt: {
        PUSH_CNT: 0,
        ORDER_CNT: 0
      },
      part4Max: 0,
      products: [],

    }
  },
  //created和beforeDestroy实现定时器功能
  created () {
    // let self = this;
    // self.getData()
    intervel = setInterval(function () {
      // self.getData()
    }, 6000)//1分钟刷新
  },
  beforeDestroy () {
    clearInterval(intervel)
  },
  computed: {
    total1 () {
      return this.transBigData(this.pushOrderCnt.ORDER_CNT)
    },
    total2 () {
      return this.transBigData(this.pushOrderCnt.PUSH_CNT)
    }
  },
  methods: {
    async getData () {
      let self = this;
      const res = await getIndexData();
      // console.log(res)
      // 活动总览区域
      self.part1Total = res.total;
      let max = Math.max(...res.saleInfoList.map(item => item.ORDER_CNT));
      self.part1Max = max + 200;//活动最大值
      self.saleInfoList = res.saleInfoList;
      //产品订购量排行区域
      self.products = res.products;
      self.part4Max = Math.max(...res.products.map(item => item.ORDER_CNT)) + 200;
      //页面总推送量和总订购量
      self.pushOrderCnt = res.pushOrderCnt;
      //城市订购量排行
      self.drawPart2Chart(res.cityOrders);
      //触点反馈
      self.drawPart3Chart1(res.chnlInfos);
      self.drawPart3Chart2(res.chnlInfos);
      //热力图
      self.drawMapChart(res.areaCodeList);
    },
    transBigData (a) {
      return a.toLocaleString().split('').map((item) => {
        return { text: item, type: item == ',' ? 'unit' : "num" }      })
    },
    array2obj (array, key) {
      let resObj = {};
      for (let i = 0; i < array.length; i++) {
        resObj[array[i][key]] = array[i];
      }
      return resObj;
    },
    drawPart2Chart (cityOrders) {
      let orderData = cityOrders.map((item => { return { title: item.AREA_NAME || '', num: item.ORDER_CNT || 0 } }));
      let myChart = this.$echarts.init(document.getElementById('part2Chart'))
      let xAxisData = orderData.map(item => item.title);
      let yAxisData = orderData.map(item => item.num);
      let option = {
        color: ['#3f60b4'],
        grid: {
          left: 80,
          top: 25,
          bottom: 40,
          right: 10
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
            borderColor: '#4d80e1',
            barBorderRadius: 2,
            opacity: 0.6
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
    drawPart3Chart1 (chnlInfos) {
      let part3Chart1Data = chnlInfos.map((item => { return { name: item.CHNL_NAME || '', value: item.PUSH_CNT || 0 } }))
      let part3Chart1Max = Math.max(...chnlInfos.map(item => item.PUSH_CNT)) + 80;
      let myChart = this.$echarts.init(document.getElementById('part3Chart1'))
      function getData (data) {
        let res = {
          series: [],
          yAxis: []
        };
        for (let i = 0; i < data.length; i++) {
          res.series.push({
            name: '',
            type: 'pie',
            clockWise: false,
            hoverAnimation: false,
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
              value: part3Chart1Max - data[i].value,
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
      let objData = this.array2obj(part3Chart1Data, "name");
      let optionData = getData(part3Chart1Data)
      let option = {
        legend: {
          x: 'center',
          y: '55%',
          itemGap: 20,
          itemWidth: 15,
          itemHeight: 15,
          icon: 'rect',
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
    drawPart3Chart2 (chnlInfos) {
      let part3Chart2Data = chnlInfos.map((item => { return { name: item.CHNL_NAME || '', value: item.ORDER_CNT || 0 } }))
      let myChart = this.$echarts.init(document.getElementById('part3Chart2'))
      let option = {
        color: pieColor,
        legend: {
          x: 'center',
          y: '55%',
          itemGap: 20,
          itemWidth: 15,
          itemHeight: 15,
          icon: 'rect',
          formatter: function (name) {
            let value = part3Chart2Data.find(item => item.name == name).value
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
            data: part3Chart2Data
          }
        ]
      };
      myChart.setOption(option);
    },
    drawMapChart (areaCodeList) {
      const self = this;
      let areaList = areaCodeList.map((item) => {
        return [item.LONGITUDE, item.LATITUDE, item.num]
      });
      let areaData = [];
      areaList.map(item => {//扩大热力图效果
        areaData.push(...new Array(3).fill(item))
      })
      let mapMax = Math.max(...areaList.map(item => item[2]))
      let mapMin = Math.min(...areaList.map(item => item[2]))
      let myChart = self.$echarts.init(document.getElementById('mapChart'))
      self.$echarts.registerMap('gansu', geoJson)
      let option = {
        visualMap: {
          top: 'bottom',
          left: 80,
          color: ['#ff4601', '#fffc00', '#87cffa'],
          min: mapMin,
          max: mapMax,
          calculable: true,
          textStyle: {
            color: '#fff',
            fontSize: 12
          }
        },
        geo: {
          map: 'gansu',
          layoutCenter: ['55%', '50%'],
          layoutSize: 650,
          top: 0,
          label: {
            normal: {
              show: true,
              color: '#fff'
            },
            emphasis: {
              color: '#fff'
            }
          },
          itemStyle: {
            normal: {
              areaColor: '#17439a',
              borderColor: '#fff'
            },
            emphasis: {
              areaColor: '#17439a',
              borderColor: '#fff'
            }
          }
        },
        series: [
          {
            name: 'AQI',
            type: 'heatmap',
            coordinateSystem: 'geo',
            blurSize: 40,
            data: areaData
          }
        ]
      }
      myChart.setOption(option);
    }
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
    background: url("../assets/images/indexBg.png") no-repeat center;
    .index-left {
      position: absolute;
      top: 0;
      left: 20px;
      max-width: 520px;
    }
    .index-center {
      position: absolute;
      top: 0;
      left: 540px;
      margin: 0 20px;
      min-width: 800px;
    }
    .index-right {
      position: absolute;
      top: 0;
      left: 1390px;
      max-width: 500px;
    }
  }
  .part1 {
    .total-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 30px 10px 15px 10px;
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
      height: 400px;
      .part1-item {
        width: 100%;
        height: 80px;
        padding: 0 20px 0 70px;
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
      }
    }
  }
  .part2 {
    margin-top: 45px;
  }
  .total-wrap {
    width: 100%;
    height: 300px;
    .total-list {
      display: flex;
    }
    .total1 {
      width: 100%;
      height: 140px;
      font-size: 30px;
      color: rgb(79, 217, 252);
      display: flex;
      align-items: center;
      justify-content: center;
      .total-list {
        .num,
        .unit {
          font-size: 60px;
          color: rgb(238, 75, 74);
          font-weight: bold;
        }
        .num {
          background-color: rgba(0, 16, 92, 0.4);
          margin-left: 10px;
          line-height: 66px;
          min-width: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
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
      margin-top: 20px;
      .total-list {
        .num,
        .unit {
          font-size: 32px;
          color: rgb(254, 208, 0);
        }
        .num {
          border: 1px solid rgb(76, 249, 255);
          margin-left: 10px;
          line-height: 44px;
          min-width: 32px;
          text-align: center;
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

    position: relative;
    .map-title {
      color: #fff;
      font-size: 24px;
      position: absolute;
      right: 80px;
      top: 30px;
    }
  }
  .part3 {
    .part-body {
      display: flex;
    }
    .chart-wrap {
      position: relative;
      .title {
        color: #fff;
        font-size: 20px;
        position: absolute;
        left: 10px;
        top: 16px;
        width: 220px;
        height: 220px;
        border: 1px solid #052b8d;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
      }
      &.left {
        .title {
          border: 0;
        }
      }
    }
  }
  .part4 {
    margin-top: 90px;
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
}
</style>
