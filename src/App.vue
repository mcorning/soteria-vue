<template>
  <v-app>
    <!-- <QuickStart
      v-if="dialog"
      :showQuickStart="showQuickStart"
      @quick-start-pref-change="updateQuickStartPref"
    >
      <div slot="subheading">
        Welcome to Secours.
      </div>
      <div slot="context">
        If this is your first time using the Secours Safety Page, permit me to
        show you around.
      </div>

      <div slot="goal">
        The Secours Safety Page has two sections:
        <ul>
          <li>
            Your ME page holds your personal identifying information. There is
            just enough information here for first responders to know who they
            are looking for in an emergency. See ME for more details.
          </li>
          <li>
            Your ACTIVITY page is where you allow friends and family to have
            your back if an adventure turns into a misadventure. See ACTIVITY
            for more details.
          </li>
        </ul>
      </div>

      <div slot="detail">
        Uncheck the box when you are ready.
      </div>
    </QuickStart> -->

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

// import Member from '@/models/Member';
// import Activity from '@/models/Activity';
// import Timeline from '@/models/Timeline';
// import Preference from '@/models/Preference';

// import QuickStart from '@/components/dialogs/QuickStart.Home.vue';

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
        // {
        //   label: 'Test',
        //   url: '/test'
        // },
        {
          label: 'Activity',
          url: '/Activity'
        },
        {
          label: 'About',
          url: '/about'
        }
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
    }

    // async getOrCreateMember() {
    //   this.member = Member.query()
    //     .with('activities.timeline')
    //     .first();
    //   if (this.member && Object.keys(this.member).length > 0) {
    //     console.log('\tFetched member', this.member);
    //   } else {
    //     console.log('\tNo members yet. Adding default member.');
    //     Member.$create({
    //       data: {
    //         firstName: '',
    //         lastName: '',
    //         age: '',
    //         gender: '',
    //         image: '',
    //         updated: new Date().toISOString(),
    //         preferences: {
    //           databaseName: '',
    //           showQuickStarts: true,
    //           showHelpIcons: true
    //         },
    //         activities: [
    //           {
    //             departFrom: '',
    //             arriveAt: '',
    //             description: '',
    //             eta: ''
    //           }
    //         ]
    //       }
    //     }).then(m => {
    //       console.log('\tnew member', m);
    //     });
    //   }
    // },
    // async getOrCreateActivity(member_id) {
    //   console.log('\tEnsuring member has default activity');
    //   this.member = Member.query().first();
    //   if (!this.member) {
    //     Activity.$create({
    //       data: {
    //         departFrom: '',
    //         arriveAt: '',
    //         description: '',
    //         eta: '',

    //         member_id: member_id
    //       }
    //     }).then(activity => {
    //       console.log('\tCreated first default activity', activity);
    //     });
    //   }
    // },
    // async updateQuickStartPref(showQuickStart) {
    //   // to get new data to localForage, you must use the $create() method (not create())
    //   // and you must wrap the updated fields with the  data:{} object
    //   const prefs = await Preference.$update({
    //     where: this.prefs.id,
    //     data: {
    //       // databaseName: '',
    //       showQuickStarts: showQuickStart
    //       // showHelpIcons: '',
    //     }
    //   });

    //   // is prefs an object or an array?
    //   this.prefs = prefs.showQuickStarts ? prefs : prefs[0];

    //   console.log(
    //     this.now,
    //     this.member.id,
    //     'set quick starts to',
    //     this.prefs.showQuickStarts
    //   );
    // },
    // async getPrefs() {
    //   console.log('\t', this.now, 'Fetching Preferences:');
    //   let p = await Preference.$fetch();
    //   if (Object.keys(p).length > 0) {
    //     console.log('\tFetched preferences', p);
    //     console.log(
    //       '\tQuerying for',
    //       this.member.id,
    //       'showQuickStart preference'
    //     );
    //     this.prefs = Preference.query()
    //       .where('member_id', this.member.id)
    //       .last();
    //     this.dialog = this.prefs.showQuickStarts;
    //     console.log('\tdialog set to', this.dialog);
    //   } else {
    //     console.log('\t', this.now, 'Creating Preference for', this.member.id);
    //     // to get new data to localForage, you must use the $create() method (not create())
    //     // and you must wrap the updated fields with the  data:{} object
    //     const prefs = await Preference.$create({
    //       data: {
    //         // databaseName: '',
    //         // showQuickStarts: '',
    //         // showHelpIcons: '',

    //         member_id: this.member.id
    //       }
    //     });

    //     // is prefs an object?
    //     console.log('prefs', prefs);
    //     this.prefs = prefs.showQuickStarts ? prefs : prefs[0];

    //     console.log(
    //       this.now,
    //       this.member.id,
    //       'set quick starts to',
    //       this.prefs.showQuickStarts
    //     );
    //   }
    // }
  },
  mounted() {},

  async created() {
    console.log(this.now, 'Entering App.vue created()...');
    this.loading = true;

    // console.log('\tFetching Members from localForage');
    // await Member.$fetch();

    // console.log('\tFetching Activities from localForage');
    // await Activity.$fetch();

    // console.log('\tFetching Preferences from localForage');
    // await Preference.$fetch();
    // // await this.getPrefs();

    // // await this.getOrCreateMember();

    // // await this.getOrCreateActivity();

    // await Timeline.$fetch();
    this.loading = false;
    console.log(this.now, '...Leaving App.vue created()\n');
  },
  beforeDestroy() {}
};
</script>
