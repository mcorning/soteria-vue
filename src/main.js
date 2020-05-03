import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VPopover from 'vue-js-popover';
import * as VueGoogleMaps from 'vue2-google-maps';
// import VSocket from 'vue-socket.io';

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyC4cGc7JfhDw5UddLOFO6TrRC0mBTRgvik',
    libraries: 'geometry' // This is required when working with polygons
  }
});
// Vue.use(
//   new VSocket({
//     debug: true,
//     connection: 'http://localhost:5001'
//   })
// );

Vue.config.productionTip = false;
Vue.use(VPopover, { tooltip: true });

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
