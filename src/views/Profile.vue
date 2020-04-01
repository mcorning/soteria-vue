<template>
  <div>
    <div v-if="loading">
      <h2>Loading Profile Card</h2>
    </div>
    <v-container v-else>
      <div class="home">
        <QuickStart
          v-if="showQuickStart"
          :showQuickStart="showQuickStart"
          @quick-start-pref-change="updateQuickStartPref"
        >
          <div slot="subheading">
            Welcome to your ME page.
          </div>
          <div slot="goal">
            The purpose of this page is for you to tell us a bit more about
            yourself.
          </div>
          <div slot="detail">
            Enter all of the requested data, if you don't have a picture that's
            okay.
          </div>
        </QuickStart>
        <ProfileCard />
      </div>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment';

// @ is an alias to /src
import ProfileCard from '@/components/ProfileCard.vue';
import QuickStart from '@/components/dialogs/QuickStart.Home.vue';

import Member from '@/models/Member';
import Preference from '@/models/Preference';
export default {
  name: 'profile',

  data: () => ({
    TIME: 'hh:mm',
    loading: false
  }),

  components: {
    ProfileCard,
    QuickStart
  },
  computed: {
    isReady() {
      return Member.all().length > 0;
    },
    members() {
      console.log(this.isReady ? ' member ready' : 'no member ');

      let m = Member.query()
        .with('preferences')
        .get();
      console.log('returning member', m);
      return m;
    },
    showQuickStart() {
      console.log(this.isReady ? ' member ready' : 'no member ');

      return this.member && this.member.preferences
        ? this.member.preferences.showQuickStarts
        : false;
    },
    member() {
      return this.members[0];
    },
    now() {
      return moment().format(this.TIME);
    }
  },
  methods: {
    // async setup() {
    //   console.log('\t', this.now, 'Fetching Member:');
    //   await Member.$fetch();
    //   // this.member = Member.query()
    //   //   .with('preferences')
    //   //   .first();
    //   // if (!this.member) {
    //   //   console.log('\t\t', this.now, 'Creating member:');

    //   //   this.member = await Member.$create({
    //   //     data: {
    //   //       firstName: '',
    //   //       lastName: '',
    //   //       age: '',
    //   //       gender: '',
    //   //       image: '',
    //   //       updated: new Date().toISOString(),
    //   //       preferences: {
    //   //         databaseName: '',
    //   //         showQuickStarts: true,
    //   //         showHelpIcons: true
    //   //       },
    //   //       activities: [
    //   //         {
    //   //           departFrom: '',
    //   //           arriveAt: '',
    //   //           description: '',
    //   //           eta: '',
    //   //           member_id: ''
    //   //         }
    //   //       ]
    //   //     }
    //   //   });
    //   // }
    //   await Preference.$fetch();
    //   console.log('\t', this.now, 'Fetching Preferences:');
    //   // let m = Member.query()
    //   //   .with('preferences')
    //   //   .first();
    //   // this.prefs = m.preferences;
    //   // if (!this.prefs) {
    //   //   let p = Preference.query().where('member_id', m.id);
    //   //   this.prefs = p;
    //   // }

    //   // this.dialog = m.preferences.showQuickStarts;
    //   // console.log('\t\t', this.now, 'show dialog?', this.dialog);
    // },

    async updateQuickStartPref(showQuickStart) {
      // to get new data to localForage, you must use the $create() method (not create())
      // and you must wrap the updated fields with the  data:{} object

      if (!this.prefs) {
        console.log('\t', this.now, 'Fetching Preferences:');
        let m = Member.query()
          .with('preferences')
          .first();
        this.prefs = m.preferences;
        if (!this.prefs) {
          let p = Preference.query().where('member_id', m.id);
          this.prefs = p;
        }
      }
      const prefs = await Preference.$update({
        where: this.prefs.id,
        data: {
          // databaseName: '',
          showQuickStarts: showQuickStart
          // showHelpIcons: '',
        }
      });

      // is prefs an object or an array?
      this.prefs = prefs.showQuickStarts ? prefs : prefs[0];

      console.log(
        this.now,
        this.member.id,
        'set quick starts to',
        this.prefs.showQuickStarts
      );
    }
  },
  async created() {
    this.loading = true;
    console.log(this.now, 'Entering Profile.vue created()');
    console.log('Fetching Member and Preference models');
    await Member.$fetch();
    await Preference.$fetch();
    console.log(this.now, 'Leaving Profile created()');
    this.loading = false;
  }
};
</script>
