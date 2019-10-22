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
                <p class="total-num">{{total.totalActivity}}<i class="total-unit">个</i></p>
              </li>
              <li class="total-li">
                <span class="total-title">有效活动</span>
                <p class="total-num">{{total.effectiveActivities}}<i class="total-unit">个</i></p>
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
import {getIndexData} from '@/apis'
import geoJson from '@/apis/gansu.json'
import cityJson from '@/apis/gansu_city.json'
export default {
  data () {
    return {
      total:{},
      saleInfoList: [],
      part1Max: 0,
      cityOrders: [],
      pushOrderCnt:{
         PUSH_CNT:0,
        ORDER_CNT:0
      },
      part3Chart1Data: [],
      part3Chart1Max:100,
      part3Chart2Data: [],
      part4Max: 70000,
      products: [],
      areaCodeList:[]
    }
  },
  created(){
    this.getData()
  },
  mounted () {

    this.drawMapChart();
  },
  computed:{
    total1(){
      return this.transBigData(this.pushOrderCnt.ORDER_CNT)
    },
    total2(){
      return this.transBigData(this.pushOrderCnt.PUSH_CNT)
    }
  },
  methods: {
    async getData(){
      let self=this;
      const res=await getIndexData();
      self.total=res.total;
      console.log(res)
      self.part3Chart1Data=res.chnlInfos.map((item=>{return {name:item.CHNL_NAME||'',value:item.PUSH_CNT||0}}))
      self.part3Chart1Max = Math.max(...res.chnlInfos.map(item=>item.PUSH_CNT))+80;
      self.drawPart3Chart1();
      self.part3Chart2Data=res.chnlInfos.map((item=>{return {name:item.CHNL_NAME||'',value:item.ORDER_CNT||0}}))
      self.drawPart3Chart2();
      self.saleInfoList=res.saleInfoList;
      let max=Math.max(...res.saleInfoList.map(item=>item.ORDER_CNT));
      //活动最大值
      self.part1Max=max+200;
      self.products=res.products;
      self.part4Max=Math.max(...res.products.map(item=>item.ORDER_CNT))+200;
      self.pushOrderCnt=res.pushOrderCnt;
      self.cityOrders=res.cityOrders.map((item=>{return {title:item.AREA_NAME||'',num:item.ORDER_CNT||0}}));
      self.drawPart2Chart();
       self.areaCodeList=res.areaCodeList;
       this.drawMapChart();
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
    drawPart2Chart () {
      let myChart = this.$echarts.init(document.getElementById('part2Chart'))
      let xAxisData = this.cityOrders.map(item => item.title);
      let yAxisData = this.cityOrders.map(item => item.num);
      let option = {
        color: ['rgb(44, 74, 222)'],
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
      let self=this;
      let myChart = this.$echarts.init(document.getElementById('part3Chart1'))
      // self.part3Chart1Max = Math.max(...res.chnlInfos.map(item=>item.ORDER_CNT))+100;
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
              value: self.part3Chart1Max - data[i].value,
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
      let objData = this.array2obj(this.part3Chart1Data, "name");
      let optionData = getData(this.part3Chart1Data)
      let option = {
        legend: {
          x: 'center',
          y: '55%',
          itemGap: 16,
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
    drawPart3Chart2 () {
      let self = this;
      let myChart = this.$echarts.init(document.getElementById('part3Chart2'))
      let option = {
        color: pieColor,
        legend: {
          x: 'center',
          y: '55%',
          itemGap: 10,
          itemWidth: 15,
          itemHeight: 15,
          icon: 'rect',
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
    drawMapChart () {
      let self = this;
      let myChart = self.$echarts.init(document.getElementById('mapChart'))
      self.$echarts.registerMap('gansu', geoJson)
      let convertData = function (data) {
        let res = []
        for (let i = 0; i < data.length; i++) {
          let geoCoord = cityJson.find(item => item.name == data[i].name)
          if (geoCoord) {
            for (let j = 0; j < 3; j++) {
              res.push(geoCoord.cp.concat(data[i].value))
            }
          }
        }
        return res
      }
      let option = {
        visualMap: {
          top: 'bottom',
          left: 80,
          color: ['#ff4601', '#fffc00', '#87cffa'],
          min: 800,
          max: 5000,
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
            data: convertData(self.areaCodeList)
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
      height:400px;
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
