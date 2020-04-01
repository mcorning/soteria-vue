<template>
  <div v-if="loading">
    <h2>Loading Active.vue...</h2>
  </div>
  <div v-else>
    <QuickStart
      v-if="showQuickStart"
      :showQuickStart="showQuickStart"
      @quick-start-pref-change="updateQuickStartPref"
    >
      <div slot="subheading">
        Your ACTIVITY page.
      </div>
      <div slot="context">
        Use this app to store personal data on your personal device (such as
        your phone) and to share your data while protecting your privacy.
      </div>
      <div slot="goal">
        The most common personal data stored with your web page is activity
        data. This data can save your life.
      </div>
      <div slot="detail">
        On this Activity page you start and stop activities. If you do not or
        cannot stop your activity, it will expire, and Secours will start taking
        emergency actions on your behalf.
      </div>
    </QuickStart>
    <v-container class="purple lighten-5">
      <v-row>
        <v-col>
          <v-row>
            <!-- <NextActivity /> -->
            <Description
              @entered-origin="handleOrigin"
              @entered-destination="handleDestination"
              @entered-description="handleDescription"
            />
          </v-row>

          <v-row>
            <!-- DateTime Section -->
            <Duration @started-activity="activityStarted" />
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment';
import Description from '@/components/Description';
import Duration from '@/components/Duration';
import QuickStart from '@/components/dialogs/QuickStart.Home.vue';

import Member from '@/models/Member';
import Activity from '@/models/Activity';
import Timeline from '@/models/Timeline';
import Preference from '@/models/Preference';

export default {
  components: {
    Description,
    Duration,
    QuickStart
  },

  computed: {
    members() {
      let m = Member.query()
        .with('preferences')
        .get();
      console.log('returning member', m);
      return m;
    },
    member() {
      return this.members[0];
    },
    showQuickStart() {
      return this.member.preferences.showQuickStarts;
    },
    perfID() {
      if (!this.member.preferences) {
        this.fixPrefs();
      }
      return this.member.preferences.id;
    },
    showQuickStartX() {
      return this.member.preferences
        ? this.member.preferences.showQuickStarts
        : true;
    },

    now() {
      return moment().format(this.TIME);
    }
  },

  data() {
    return {
      payload: {
        origin: '',
        destination: '',
        description: '',
        eta: '',

        dialog: true,
        prefs: null,
        member: null
      },

      loading: false,
      hasActivity: Member.query()
        .has('activities.timeline')
        .get(),

      sheet: false,
      showEscalationAlert: false,
      TIME: 'hh:mm a',
      FULL_DATE: 'ddd, MMM Do YYYY, hh:mm a',
      ampm: 'ampm',
      dates: [moment().format('YYYY-MM-DD')],

      thisTimeline: {
        id: '',
        activity: '',
        departedFrom: '',
        arrivedAt: '',
        departure: '',
        arrival: ''
      },
      departingAt: moment().format('HH:mm'),
      arrivingAt: moment()
        .add(30, 'minutes')
        .format('HH:mm'),

      test: {}
    };
  },

  methods: {
    fixPrefs() {
      Preference.fixQuickStart(this.member.id);
    },
    activityStarted(duration) {
      this.payload.eta = moment()
        .add(duration, 'minutes')
        .toISOString();
      console.log('\tExpect member returns by', this.payload.eta);
      this.updateActivity();
    },
    handleOrigin(val) {
      this.payload.origin = val;
    },
    handleDestination(val) {
      this.payload.Destination = val;
    },
    handleDescription(val) {
      this.payload.description = val;
    },

    updateActivity() {
      console.log(
        `'\tUpdating activity ${
          this.member.lastActivity.id
        } with ${JSON.stringify(this.payload)}`
      );
      Activity.$update({
        where: this.member.lastActivity.id,
        data: this.payload
      }).then(activity => {
        this.lastActivity = activity;
        console.log('\tNew actvity:', activity);
      });
    },

    destroy() {
      console.log('\t|activities|', this.member.hasActivity === 1);
      Timeline.$delete(
        timeline => timeline.activity_id == this.member.lastActivity.id
      );
      Activity.$delete(this.member.lastActivity.id).then(() => {
        // reset the lastActivity
        console.log(this.member.lastActivity.id);
        console.log(this.member.lastActivity);
      });
    },

    hasStartedActivity() {
      let timeline = Member.query()
        .has('activities.timeline')
        .get();
      return timeline.length ? true : false;
    },
    // async setup() {
    //   await Member.$fetch();
    //   this.member = Member.query().first();

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
    // },
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
    this.loading = true;
    console.log(this.now, 'Entering Active.vue created()...');

    // await this.setup();

    await Activity.$fetch();
    await Member.$fetch();
    await Preference.$fetch();
    console.log('Preference', this.perfID);

    // let m = Member.query()
    //   .with('activities.timeline')
    //   .first();
    // if (!m.lastActivity) {
    //   console.log('\tDouble checking default activity');
    //   Activity.$create({
    //     data: {
    //       departFrom: '',
    //       arriveAt: '',
    //       description: '',
    //       eta: '',

    //       member_id: m.id
    //     }
    //   }).then(activity => {
    //     console.log("\tMember's first default activity", activity);
    //   });
    // }

    this.loading = false;

    // console.info('\tCurrent member with activities and timeline:', m);
    // this.member = m;
    console.log(this.now, '...Leaving Active.vue created()\n');
    console.log('');
  },

  mounted() {}
};
</script>

<style scoped>
#styled-input {
  height: 40px;
  font-size: 20pt;
}
.styled-input label[for] {
  height: 40px;
  font-size: 20pt;
}
</style>
