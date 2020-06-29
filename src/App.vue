<template>
  <v-app>
    <v-app-bar app color="primary" dark dense>
      <a href="/">
        <v-img
          src="./assets/covid.jpg"
          max-height="4em"
          max-width="4em"
          class="pl-0"
        ></v-img>
      </a>

      <v-toolbar-title></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        v-for="link in links"
        :key="`${link.label}-header-link`"
        text
        rounded
        :to="link.url"
        >{{ link.label }}</v-btn
      >
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-footer color="primary lighten-1" padless>
      <v-layout justify-center wrap>
        <v-btn
          v-for="link in links"
          :key="`${link.label}-footer-link`"
          color="white"
          text
          rounded
          class="mx-2"
          :to="link.url"
          >{{ link.label }}</v-btn
        >
        <v-flex
          prepend-icon="mdi-tm"
          primary
          lighten-2
          py-4
          text-center
          white--text
          xs12
        >
          <v-row no-gutters>
            <v-col>
              <small>Version {{ ver }}</small>
            </v-col>

            <v-col>
              &copy; {{ new Date().getFullYear() }} —
              <strong>Soteria.id</strong>
            </v-col>
            <v-col>
              <small>{{ shipString }}</small>
            </v-col>
          </v-row>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
require('dotenv').config();
import config from '@/config.json';
import moment from 'moment';

import store from '@/store';

export default {
  name: 'App',
  store,
  components: {},

  computed: {
    now() {
      return moment().format(this.TIME);
    }
  },

  data() {
    return {
      ver: config.VER,
      shipString: config.SHIP_STRING,
      prefs: null,

      homeRoute: '',

      TIME: 'hh:mm a',

      loading: false,

      member: '',
      links: [
        {
          label: 'Me',
          url: '/profile'
        },
        {
          label: 'PHI',
          url: '/phi'
        },
        {
          label: 'Risk',
          url: '/risk'
        },
        {
          label: 'Trace',
          url: '/tracing'
        },
        {
          label: 'About',
          url: '/about'
        }
      ]
    };
  },

  methods: {
    toggleTheme() {
      this.$vuetify.theme.themes.dark.anchor = '#41B883';
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  },
  mounted() {},

  async created() {
    console.log(this.now, 'Entering App.vue created()...');
    this.loading = true;

    this.loading = false;
    console.log(this.now, '...Leaving App.vue created()\n');
  },
  beforeDestroy() {}
};
</script>
