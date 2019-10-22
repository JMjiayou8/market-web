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
                            :key="index"
                            class="hotelItem">
                <div class="part2-chart-item"
                     v-if="item">
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
import { getAreaAllData } from '@/apis'
let intervel;
export default {
  data () {
    return {
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 30,
        slidesPerGroup: 3,
        autoplay: {
          delay: 6000,//每1分钟轮播
          disableOnInteraction: false
        },
        // loop: true,
        // loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
      },
      part2data: [],
    }
  },
  //created和beforeDestroy实现定时器功能
  created () {
    let self = this;
    self.getData()
    intervel = setInterval(function () {
      self.getData()
    }, 6000)//1分钟刷新
  },
  beforeDestroy () {
    clearInterval(intervel)
  },
  methods: {
    async getData () {
      let self = this;
      const res = await getAreaAllData();
      // console.log(res)
      //全部地市
      self.drawPart1Chart(res.areaCodeList);
      //单个地市
      self.drawPart2Chart(res.provinceMean, res.areaMap)
    },
    drawPart1Chart (areaCodeList) {
      let myChart = this.$echarts.init(document.getElementById('part1Chart'))
      let xAxisData = areaCodeList.map(item => item.title);
      let yAxisData = areaCodeList.map(item => item.num);
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
            borderColor: '#4d80e1',
            barBorderRadius: 2,
            opacity: 0.8
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
    drawPart2Chart (provinceMean, areaMap) {
      let self = this;
      let xAxisData = provinceMean.map(item => item.STAT_MONTH);
      let part2Average = provinceMean.map(item => item.ORDER_CNT);
      let part2Data = Object.keys(areaMap).map((item) => {
        return {
          title: item,
          num: areaMap[item].map(i => i.ORDER_CNT)
        }
      })
      self.part2data = part2Data;
      self.$nextTick(() => {
        for (let i = 0; i < part2Data.length; i++) {
          let data = part2Data[i]
          let myChart = self.$echarts.init(document.getElementById(`part2Chart${i}`))
          let option = {
            color: ['rgb(252, 220, 87)'],
            grid: {
              top: 90,
              bottom: 30
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xAxisData,
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
                label: {
                  show: true,
                  position: 'bottom',
                  color: '#fff',
                  fontSize: 16,
                },
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
                data: part2Average,
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
                },
                z: 2
              }
            ]
          };
          myChart.setOption(option);
        }
      })

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
