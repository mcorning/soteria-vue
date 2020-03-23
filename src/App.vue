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
import store from '@/store';
import Member from '@/models/Member';
import Activity from '@/models/Activity';
import Timeline from '@/models/Timeline';

export default {
  name: 'App',
  store,

  computed: {},

  data() {
    return {
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
          label: 'My Data',
          url: '/'
        },
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
    },

    async getOrCreateMember() {
      this.member = Member.query()
        .with('activities.timeline')
        .first();
      if (Object.keys(this.member).length > 0) {
        console.log('Fetched member', this.member);
      } else {
        console.log('No members yet. Adding default member.');
        Member.$create({
          data: {
            firstName: '',
            lastName: '',
            age: '',
            gender: '',
            image: '',
            activities: [
              {
                departFrom: 'Starting place',
                arriveAt: 'Some place else',
                description: 'What are you up to?',
                eta: ''
              }
            ]
          }
        }).then(m => {
          console.log('new member', m);
        });
      }
    },

    async getOrCreateActivity(member_id) {
      console.log('Ensuring member has default activity');
      this.member = Member.query().first();
      if (!this.member) {
        Activity.$create({
          data: {
            departFrom: 'Starting place',
            arriveAt: 'Some place else',
            description: 'What are you up to?',
            eta: '',

            member_id: member_id
          }
        }).then(activity => {
          console.log('Created first default activity', activity);
        });
      }
    }
  },
  mounted() {},

  async created() {
    this.loading = true;

    console.log('Fetching Members from localForage');
    await Member.$fetch();
    console.log('Fetching Activities from localForage');
    await Activity.$fetch();

    await this.getOrCreateMember();

    await this.getOrCreateActivity();

    // let mid = Activity.query().first().member_id;
    // if (mid) {
    //   console.log('member_id', mid);
    // } else {
    //   Activity.$update({
    //     where: Activity.query().first().id,
    //     data: { member_id: Member.query().first().id }
    //   });
    // }

    await Timeline.$fetch();
    this.loading = false;
  }
};
</script>
