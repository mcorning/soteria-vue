import Vue from 'vue';
import Vuex from 'vuex';
import VuexORM from '@vuex-orm/core';
import VuexORMLocalForage from 'vuex-orm-localforage';
import database from '@/database';
// import sync from './sync';

Vue.use(Vuex);

VuexORM.use(VuexORMLocalForage, {
  database,
  localforage: {
    name: 'MichaelDatabase' // Name is required
  }
});

const store = new Vuex.Store({
  state: {
    eta: new Date()
  },

  plugins: [VuexORM.install(database)]
  // plugins: [sync, VuexORM.install(database)]
});

export default store;
