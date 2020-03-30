<template>
  <v-container>
    <div class="home">
      <QuickStart
        v-if="dialog"
        :showQuickStart="showQuickStart"
        @quick-start-pref-change="updateQuickStartPref"
      >
        <div slot="subheading">
          Your ME page.
        </div>
        <div slot="context">
          This where you start to make the Secours web site your very own.
        </div>
        <div slot="goal">
          This page holds your personal identifying information
        </div>
        <div slot="detail">
          One way Secours protects your privacy is by minimizing personal
          information. These five fields are sufficient to help first responders
          identify you in an emergency.
        </div>
      </QuickStart>
      <ProfileCard />
    </div>
  </v-container>
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
    dialog: true,
    showQuickStart: true,
    prefs: null,
    member: null,
    TIME: 'hh:mm'
  }),

  components: {
    ProfileCard,
    QuickStart
  },
  computed: {
    now() {
      return moment().format(this.TIME);
    }
  },
  methods: {
    async setup() {
      await Member.$fetch();
      this.member = Member.query().first();
      if (!this.member) {
        this.member = await Member.$create({
          data: {
            firstName: '',
            lastName: '',
            age: '',
            gender: '',
            image: '',
            updated: new Date().toISOString(),
            preferences: {
              databaseName: '',
              showQuickStarts: true,
              showHelpIcons: true
            },
            activities: [
              {
                departFrom: '',
                arriveAt: '',
                description: '',
                eta: '',
                member_id: ''
              }
            ]
          }
        });
      }
      console.log('\t', this.now, 'Fetching Preferences:');
      let p = await Preference.$fetch();
      if (Object.keys(p).length > 0) {
        console.log('\tFetched preferences', p);
        console.log(
          '\tQuerying for',
          this.member.id,
          'showQuickStart preference'
        );
        this.prefs = Preference.query()
          .where('member_id', this.member.id)
          .last();
        this.dialog = this.prefs.showQuickStarts;
        console.log('\tdialog set to', this.dialog);
      } else {
        console.log('\t', this.now, 'Creating Preference for', this.member.id);
        // to get new data to localForage, you must use the $create() method (not create())
        // and you must wrap the updated fields with the  data:{} object
        const prefs = await Preference.$create({
          data: {
            // databaseName: '',
            // showQuickStarts: '',
            // showHelpIcons: '',

            member_id: this.member.id
          }
        });

        // is prefs an object?
        console.log('prefs', prefs);
        this.prefs = prefs.showQuickStarts ? prefs : prefs[0];

        console.log(
          this.now,
          this.member.id,
          'set quick starts to',
          this.prefs.showQuickStarts
        );
      }
    },
    async updateQuickStartPref(showQuickStart) {
      // to get new data to localForage, you must use the $create() method (not create())
      // and you must wrap the updated fields with the  data:{} object
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
    console.log(this.now, 'Entering Profile.vue created');
    await this.setup();
    console.log(this.now, 'Leaving Profile created()');
  }
};
</script>
