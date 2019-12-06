import Vue from 'vue'
import App from './App.vue'
import '@/components/index'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts;

import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper)

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount('#app')
