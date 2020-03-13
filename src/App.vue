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
      firstMember: Member.query().first(),
      links: [
        {
          label: 'Me',
          url: '/profile'
        },
        {
          label: 'Test',
          url: '/test'
        },
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
    }
  },
  mounted() {},

  async created() {
    console.log('Fetching Members from localForage');
    let m = await Member.$fetch();
    if (Object.keys(m).length > 0) {
      console.log('Fetched members', m);
    } else {
      console.log('No members yet. Adding default member.');
      m = Member.$create({
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
              departure: '',
              arrival: '',
              member_id: ''
            }
          ]
        }
      }).then(m => {
        console.log('new member', m);
      });
    }

    console.log('Fetching Activities from localForage');
    await Activity.$fetch();
    let mid = Activity.query().first().member_id;
    if (mid) {
      console.log('member_id', mid);
    } else {
      Activity.$update({
        where: Activity.query().first().id,
        data: { member_id: Member.query().first().id }
      });
    }

    await Timeline.$fetch();
  }
};
</script>
