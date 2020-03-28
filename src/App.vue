<template>
  <v-app>
    <v-dialog :value="false" max-width="300">
      <v-card>
        <v-card-title class="headline">Quick Start</v-card-title>

        <v-card-text>
          Welcome to Secours. If this is your first time using the Secours
          Safety Page, permit me to show you around.
        </v-card-text>
        <v-card-text>
          On this Activity page you start and stop activities. If you do not or
          cannot stop your activity, it will expire, and Secours will start
          taking emergency actions on your behalf.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-checkbox
            v-model="checkFirstTime"
            label="Do not show again"
          ></v-checkbox>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
import moment from 'moment';

import store from '@/store';

import Member from '@/models/Member';
import Activity from '@/models/Activity';
import Timeline from '@/models/Timeline';
import Preference from '@/models/Preference';

export default {
  name: 'App',
  store,

  computed: {
    now() {
      return moment().format(this.TIME);
    }
  },

  data() {
    return {
      firstTime: false,
      checkFirstTime: !this.firstTime,

      TIME: 'hh:mm a',

      loading: false,

      member: '',
      links: [
        {
          label: 'Me',
          url: '/profile'
        },
        // {
        //   label: 'Test',
        //   url: '/test'
        // },
        {
          label: 'Activity',
          url: '/'
        }
        // {
        //   label: 'About',
        //   url: '/about'
        // }
        // {
        //   label: 'My People',
        //   url: '/people'
        // },
        // {
        //   label: 'Test',
        //   url: '/test'
        // }
        // {
        //   label: 'Login',
        //   url: '/login'
        // }
      ]
    };
  },

  methods: {
    toggleTheme() {
      this.$vuetify.theme.themes.dark.anchor = '#41B883';
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
    },

    async getOrCreateMember() {
      this.member = Member.query()
        .with('activities.timeline')
        .first();
      if (this.member && Object.keys(this.member).length > 0) {
        console.log('\tFetched member', this.member);
      } else {
        console.log('\tNo members yet. Adding default member.');
        Member.$create({
          data: {
            firstName: '',
            lastName: '',
            age: '',
            gender: '',
            image: '',
            activities: [
              {
                departFrom: '',
                arriveAt: '',
                description: '',
                eta: ''
              }
            ]
          }
        }).then(m => {
          console.log('\tnew member', m);
        });
      }
    },

    async getOrCreateActivity(member_id) {
      console.log('\tEnsuring member has default activity');
      this.member = Member.query().first();
      if (!this.member) {
        Activity.$create({
          data: {
            departFrom: '',
            arriveAt: '',
            description: '',
            eta: '',

            member_id: member_id
          }
        }).then(activity => {
          console.log('\tCreated first default activity', activity);
        });
      }
    }
  },
  mounted() {
    this.firstTime = this.$store.state.firstTime;
    this.dialog = this.firstTime;
  },

  async created() {
    console.log(this.now, 'Entering App.vue created()...');
    this.loading = true;

    console.log('\tFetching Members from localForage');
    await Member.$fetch();
    console.log('\tFetching Activities from localForage');
    await Activity.$fetch();
    console.log('\tFetching Preferences from localForage');
    await Preference.$fetch();

    await this.getOrCreateMember();

    await this.getOrCreateActivity();

    await Timeline.$fetch();
    this.loading = false;
    console.log(this.now, '...Leaving App.vue created()\n');
  },
  beforeDestroy() {
    this.$store.state.firstTime = !this.checkFirstTime;
  }
};
</script>
