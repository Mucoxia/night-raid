import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
// 注册全局组件
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
