// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import './stylus/main.styl'
import clientMenu from './components/layout/clientMenu'
import providerMenu from './components/layout/providerMenu'
import AuthLayout from './components/auth/auth'
import {Bar} from 'vue-chartjs'
import {store} from './store'
import draggable from 'vuedraggable'
import Axios from 'axios'
import VueAxios from 'vue-axios'
import Notifications from 'vue-notification'
import 'vue-stripe-elements-plus'

const moment = require('moment')
require('moment/locale/fr')

Vue.use(VueAxios, Axios);
Vue.use(Notifications);
Vue.use(Bar);
Vue.use(require('vue-moment'), {
    moment
}),
Vue.use(Vuetify, { theme: {
  primary: '#019AE8',
  secondary: '#424242',
  accent: '#635BCF',
  error: '#F0534F',
  info: '#2196F3',
  success: '#60D3A0',
  success_light: '#60D3A0',
  warning: '#F5A623',
  warning_light: '#b3b3b3',
  header: '#2E3E50'
}})

Vue.config.productionTip = false

Vue.component('clientMenu', clientMenu);
Vue.component('providerMenu', providerMenu);
Vue.component('AuthLayout', AuthLayout);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
      App,
      draggable
  },
  template: '<App/>'
})
