import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import router from './router'
import accounting from 'accounting'
import moment from 'moment-timezone'
import axios from 'axios'
import Vuex from 'vuex'
import storePlugin from './storePlugin'
import VueAuthenticate from 'vue-authenticate'
import { store } from './store/store'
import qs from 'qs'

axios.interceptors.request.use(function (config) {
  config.headers.common['Content-Type'] = 'application/json'
  config.headers.common['User'] = localStorage.getItem('user');
  config.headers.common['Authorization'] = localStorage.getItem('token');
  config.headers.common['Accept'] = 'Token'
  return config
}, function (error) {
  return Promise.reject(error)
})

// axios.interceptors.response.use(undefined, function (err) {
//   if (err.response && err.response.status === 401) {
//     // handle current login and 
//     // alert('wew call from intercetop')
//     // TODO must fix this code
//   }
//   throw err;
// });

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(accounting)
Vue.use(storePlugin)


Vue.filter('formatMoney', function (value) {
  return accounting.formatMoney(value, "Rp. ", 0, ".", ",");
});

Vue.filter('noHyphen', function (value) {
  const dash = value
  return dash.replace(/-/&&/_/g, ' ')
});

Vue.filter('showDateOnly', function (value) {
  let d = new Date(value)
  let m = d.getMonth() + 1
  return  d.getFullYear() + ((m + 1) < 10 ? '0' + m : m) + d.getDate() + '/' + '/'
});

Vue.filter('disburseDate', function (value) {
  let d = new Date(value)
  d.setDate(d.getDate() + 20)
  let m = d.getMonth() + 1
  return d.getDate() + '-' + ((m + 1) < 10 ? '0' + m : m) + '-' + d.getFullYear()
});

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

// function refreshToken() {
//   setInterval(() => {
//       rToken();
//     },(5*60000-2000))
//   }
  // refreshToken()

// function rToken() {
//   const instance = axios.create({
//     baseURL: process.env.VUE_APP_AUTHORIZATION, 
//   });
//   let params = {
//     refreshToken: localStorage.getItem('rToken'),
//   }
//   let config = {
//     headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//         'Authorization': 'Bearer ' + localStorage.getItem('token'),
//     }
//   }
//   if (router.history.current.name != 'login') {
//     instance.post('', qs.stringify(params), config)
//     .then((result) => {
//       localStorage.setItem('rToken', result.data.refreshToken)
//       localStorage.setItem('token', result.data.token)
//     })
//     .catch((err) => {
//       if (err) {
//         alert('Your Session has expired, please login to continue')
//         localStorage.clear();
//         window.location.href = process.env.VUE_APP_DASHBOARD_BASE_URL
//       }
//     })
//   }
// }

Vue.mixin({
  methods: {
    formatDateWithTimezone: function (htmlDate) {
      //2018-03-27 10:00:00.000 +00:00
      return moment(htmlDate, 'YYYY-MM-DD').tz("Asia/Jakarta").format('YYYY-MM-DD');
    },
  }
})

Vue.use(Vuex);
// const store = new Vuex.Store({
//   state: {
//     count: 0
//   },
//   mutations: {
//   	increment: state => state.count++,
//     decrement: state => state.count--
//   }
// })

new Vue({
  el: '#app',
  data: {color: '#673AB7'},
  render: h => h(App),
  router,
}).$mount('#app')
