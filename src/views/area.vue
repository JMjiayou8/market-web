<template>
  <div class="index-page">
    <div class="page-top">
      中国联通营销平台系统<span>(地市)</span>
    </div>
    <div class="page-body">
      <div class="index-top">
        <div class="index-part part1">
          <part-title title="城市订购量排行"></part-title>
          <div class="part-body">
            <div class="part-title">全部地市</div>
            <div id="part1Chart"
                 style="width:100%;height:340px;"></div>
          </div>
        </div>
      </div>
      <div class="index-bottom ">
        <div class="index-part part2">
          <div class="part-body">
            <swiper :options="swiperOption"
                    class="hotel-wrap"
                    ref="mySwiper">
              <swiper-slide v-for="(item,index) in part2data"
                            :key="item.key"
                            class="hotelItem">
                <div class="part2-chart-item">
                  <p class="part2-chart-title">{{item.title}}</p>
                  <div :id="`part2Chart${index}`"
                       style="width:100%;height:340px;"></div>
                </div>
              </swiper-slide>
              <div class="swiper-pagination"
                   slot="pagination"></div>
            </swiper>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAreaAllData, getAreaBottomData } from '@/apis'
export default {
  data () {
    return {
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 30,
        slidesPerGroup: 3,
        // 滚动
        // autoplay: {
        //   delay: 3000,
        //   disableOnInteraction: false
        // },
        // loop: true,
        // loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
      },
      xAxisData:[],
      part1Data: [],
      part2data: [
        { "title": "兰州市", "num": [] },
        { "title": "嘉峪关市", "num": [] },
        { "title": "金昌市", "num": [] },
        { "title": "白银市", "num": [] },
        { "title": "天水市", "num": [] },
        { "title": "武威市", "num": [] },
        { "title": "张掖市", "num": [] },
        { "title": "平凉市", "num": [] },
        { "title": "酒泉市", "num": [] },
        { "title": "庆阳市", "num": [] },
        { "title": "甘南藏族自治州", "num": [] },
        { "title": "定西市", "num": [] },
        { "title": "陇南市", "num": [] },
        { "title": "临夏回族自治州", "num": [] }
      ],
      part2Average: 20,
      average:0
    }
  },
  created () {
    let self = this;
    self.$nextTick(() => {
      self.getTopData();
    })
  },
  methods: {
    async getTopData () {
      let self = this;
      const res = await getAreaAllData();
      console.log(res)
      self.part1Data = res.areaCodeList;
      self.drawPart1Chart();
      self.xAxisData=res.provinceMean.map(item=>item.STAT_MONTH);
      self.average=res.provinceMean.map(item=>item.ORDER_CNT);
      let part2Data=[];
      part2Data=Object.keys(res.areaMap).map((item)=>{
        return{
          title:item,
          num:res.areaMap[item].map(i=>i.ORDER_CNT)
        }
      })
      console.log(part2Data)
     
      self.part2Data = part2Data;
      for (let i = 0; i < part2Data.length; i++) {
        self.drawPart2Chart(i, part2Data[i])
      }

    },
    // async getBottomData () {
    //   let self = this;
    //   const res = await getAreaBottomData()
    //   self.part2Data = res;
    //   for (let i = 0; i < res.length; i++) {
    //     self.drawPart2Chart(i, res[i])
    //   }
    // },
    drawPart1Chart () {
      let myChart = this.$echarts.init(document.getElementById('part1Chart'))
      let xAxisData = this.part1Data.map(item => item.title);
      let yAxisData = this.part1Data.map(item => item.num);
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
              color: '#151f79',

            }
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            fontSize: 18,
            color: '#6971a2',
            interval: 0

          },

          data: xAxisData,
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#1b0e4b'
            }
          },

          splitLine: {
            show: true,
            lineStyle: {
              color: '#1b0e4b'
            }
          },
          axisLabel: {
            fontSize: 18,
            color: '#6971a2'
          }
        },
        series: [{
          data: yAxisData,
          type: 'bar',
          barWidth: 80,
          itemStyle: {
            borderColor: 'rgb(44, 74, 222)',
            barBorderRadius: 2,
            opacity: 0.6
          },
          label: {
            show: true,
            position: 'top',
            color: '#ffc83d',
            fontSize: 16
          }
        }]
      };
      myChart.setOption(option);
    },
    drawPart2Chart (i, data) {
      let self = this;
      if (data) {
        let myChart = self.$echarts.init(document.getElementById(`part2Chart${i}`))
        // let average = new Array(data.num.length).fill(self.part2Average);
        let averageIndex = parseInt(data.num.length / 2) - 1
        let option = {
          color: ['rgb(252, 220, 87)'],
          grid: {
            top: 90,
            bottom: 30
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data:self.xAxisData,
            axisLabel: {
              color: '#646d9d',
              fontSize: 16
            },
            axisLine: {
              lineStyle: {
                color: '#716cbb'
              }
            },
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              color: '#646d9d',
              fontSize: 16
            },
            axisLine: {
              lineStyle: {
                color: '#716cbb'
              }
            },
            splitLine: {
              show: false
            }
          },
          series: [
            {
              name: '订购量',
              type: 'line',
              data: data.num,
              itemStyle: {
                shadowColor: 'rgb(252, 220, 87)',
                shadowBlur: 20
              },
              lineStyle: {
                color: 'rgb(252, 220, 87)'
              },
              symbolSize: 5,
              symbol: 'circle',
              z: 1

            },
            {
              name: '订购量',
              type: 'line',
              data: self.average,
              lineStyle: {
                color: '#eb666c',
                type: 'dashed'
              },
              symbolSize: 1,
              label: {
                show: true,
                position: 'top',
                color: '#eb666c',
                fontSize: 16,
                // formatter (value) {
                //   if (value.dataIndex == averageIndex) {
                //     return '全省平均值：' + value.data
                //   } else {
                //     return ''
                //   }

                // }
              },
              z: 2
            }
          ]
        };
        myChart.setOption(option);
      }
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
    .index-top {
      width: 100%;
      height: 480px;
    }
    .index-bottom {
      width: 100%;
    }
  }
  .part1 {
    position: relative;
    .part-title {
      width: 160px;
      font-size: 18px;
      color: #35fefc;
      text-align: center;
      top: 68px;
      right: 40px;
      position: absolute;
    }
    .part-body {
      background: url("../assets/images/areaBg.png") no-repeat center/cover;
      padding: 40px 20px 0 0;
    }
  }
  .part2 {
    font-size: 20px;
    color: #fff;
    .part2-chart-item {
      position: relative;
      width: 580px;
      height: 350px;
      background: url("../assets/images/areaSmallBg.png") no-repeat center;
    }
    .part2-chart-title {
      height: 55px;
      line-height: 55px;
      font-size: 24px;
      color: #35fefc;
      padding-left: 60px;
      position: absolute;
    }
  }
}
</style>
