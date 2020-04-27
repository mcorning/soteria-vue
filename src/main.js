import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VPopover from 'vue-js-popover';

Vue.config.productionTip = false;
Vue.use(VPopover, { tooltip: true });

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
