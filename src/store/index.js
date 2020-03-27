import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';
import VuexORMLocalForage from 'vuex-orm-localforage';
import database from '@/database';
import moment from 'moment';

Vue.use(Vuex);

VuexORM.use(VuexORMLocalForage, {
  database,
  localforage: {
    name: 'MichaelDatabase' // Name is required
  }
});

const store = new Vuex.Store({
  state: {
    eta: moment(),
    departFrom: '',
    firstTime: true
  },

  plugins: [VuexORM.install(database)]
});

export default store;
