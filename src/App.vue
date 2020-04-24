<template>
  <v-app>
    <v-app-bar app color="primary" dark dense>
      <a href="http://secours.io">
        <v-img
          src="./assets/Secours.ioLogo400X310.png"
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
          >&copy; {{ new Date().getFullYear() }} —
          <strong>Secours.io</strong>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import moment from 'moment';

import store from '@/store';

export default {
  name: 'App',
  store,
  components: {
    // QuickStart
  },

  computed: {
    now() {
      return moment().format(this.TIME);
    }
  },

  data() {
    return {
      showQuickStart: true,
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
          label: 'Covid-19',
          url: '/covid'
        },

        {
          label: 'Activity',
          url: '/Activity'
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
