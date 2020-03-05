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
        <v-flex primary lighten-2 py-4 text-center white--text xs12>
          {{ new Date().getFullYear() }} —
          <strong>Secours.io</strong>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
// import L from './logger';
import * as R from 'ramda';
import store from '@/store';
import Activity from '@/models/Activity';
import Member from '@/models/Member';
import Timeline from '@/models/Timeline';
export default {
  name: 'App',
  store,

  data() {
    return {
      members: [],
      links: [
        {
          label: 'Me',
          url: '/profile'
        },
        {
          label: 'My Data',
          url: '/'
        },
        {
          label: 'My People',
          url: '/people'
        },
        // {
        //   label: 'Test',
        //   url: '/test'
        // }
        // {
        //   label: 'Login',
        //   url: '/login'
        // },

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
  async mounted() {
    // Fetch data from indexeddb
    Member.$fetch().then(m => {
      if (R.isEmpty(m)) {
        Member.$create({
          data: {
            firstName: '',
            lastName: '',
            age: '',
            gender: '',
            image: ''
          }
        }).then(x => console.log('Added first empty member record', x));
      }
    });
    Activity.$fetch().then(a => {
      if (R.isEmpty(a)) {
        Activity.$create({
          data: {
            departFrom: '',
            arriveAt: '',
            description: '',
            departure: '',
            arrival: '',
            member_id: ''
          }
        }).then(x => console.log('Added first empty activity record', x));
      }
    });
    Timeline.$fetch();
  },
  created() {
    console.log('App.vue created');
  }
};
</script>
