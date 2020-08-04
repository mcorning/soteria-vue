<template>
  <v-app>
    <v-app-bar app color="primary" dark dense>
      <v-btn text rounded to="/">BLUF</v-btn>

      <v-spacer></v-spacer>
      <v-btn
        v-for="link in links"
        :key="`${link.label}-header-link`"
        text
        rounded
        :to="link.url"
        >{{ link.label }}</v-btn
      >

      <!-- <v-btn v-if="image" height="0" width="0" to="/profile">
        <v-avatar min-width="36" width="36" height="36">
          <img :src="image" alt="Me" /> </v-avatar
      ></v-btn> -->

      <!-- <v-btn v-else to="/profile" text rounded> Track</v-btn> -->
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <v-footer color="primary lighten-1" padless>
      <v-layout justify-center wrap align-center>
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
        <!-- <v-btn v-if="image" height="0" width="0" to="/profile">
          <v-avatar min-width="30" width="30" height="30">
            <v-img :src="image" alt="Me"></v-img> </v-avatar
        ></v-btn> -->

        <!-- <v-btn to="/profile" color="white" text rounded> Track</v-btn> -->
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
import lctVer from '@/lct.ver.json';

import moment from 'moment';

import Member from '@/models/Member';
import store from '@/store';

export default {
  name: 'App',
  store,
  components: {},

  computed: {
    shipString() {
      return moment(lctVer.VER, 'MM.DD.hh.mm');
    },

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
      ver: lctVer.VER,
      prefs: null,

      homeRoute: '',

      TIME: 'hh:mm a',

      loading: false,

      links: [
        {
          label: 'Room',
          url: '/Room'
        },
        {
          label: 'Visitor',
          url: '/Visitor'
        },
        {
          label: 'Profile',
          url: '/profile'
        }
        // {
        //   label: 'Check',
        //   url: '/risk'
        // }

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
