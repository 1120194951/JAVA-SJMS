import Vue from 'vue'
import App from './App.vue'
import router from './router'


import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';

//添加全局样式
import './assets/css/global.css'

//引入图标
import './assets/font/iconfont.css'

import axios from 'axios'

Vue.use(ElementUI);


//注载axios
Vue.prototype.$http=axios
//设置访问更路径
axios.defaults.baseURL = "http://localhost:9000"




Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
