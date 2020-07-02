<template>
  <v-app>
    <v-app-bar app color="primary" dark dense>
      <!-- <a href="/">
        <v-img
          src="./assets/covid.jpg"
          max-height="4em"
          max-width="3em"
          class="pa-0"
        ></v-img>
      </a> -->
      <v-btn text rounded to="/onboard">Stop a virus</v-btn>

      <v-spacer></v-spacer>
      <v-btn
        v-for="link in links"
        :key="`${link.label}-header-link`"
        text
        rounded
        :to="link.url"
        >{{ link.label }}</v-btn
      >

      <v-btn height="0" width="0" to="/profile">
        <v-avatar> <img :src="image" alt="Me" /> </v-avatar
      ></v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
    <!-- <v-system-bar window dark>
      <v-icon>mdi-message</v-icon>
      <span>10 unread messages</span>
      <v-spacer></v-spacer>
      <v-icon>mdi-minus</v-icon>
      <v-icon>mdi-checkbox-blank-outline</v-icon>
      <v-icon>mdi-close</v-icon>
    </v-system-bar> -->
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

import Member from '@/models/Member';
import store from '@/store';

export default {
  name: 'App',
  store,
  components: {},

  computed: {
    member() {
      let m = Member.query().first();

      console.log('returning member', m);
      return m;
    },
    isReady() {
      return Member.all().length > 0;
    },

    now() {
      return moment().format(this.TIME);
    },
    image() {
      let image = this.isReady ? this.member.image : '';
      return image;
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

      links: [
        // {
        //   label: 'PHI',
        //   url: '/phi'
        // },
        {
          label: 'Us',
          url: '/tracing'
        },
        {
          label: 'Them',
          url: '/risk'
        }

        // {
        //   label: 'About',
        //   url: '/about'
        //    }
      ]
    };
  },

  methods: {
    go() {
      alert('go');
    },
    toggleTheme() {
      this.$vuetify.theme.themes.dark.anchor = '#41B883';
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    }
  },
  mounted() {},

  async created() {
    console.log(this.now, 'Entering App.vue created()...');
    this.loading = true;
    await Member.$fetch();
    this.loading = false;
    console.log(this.now, '...Leaving App.vue created()\n');
  },
  beforeDestroy() {}
};
</script>
