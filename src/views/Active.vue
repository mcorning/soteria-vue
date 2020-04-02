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
        Welcome to your ACTIVITY page.
      </div>
      <div slot="goal">
        Use the following steps to complete the page:
      </div>
      <div slot="detail">
        <ol>
          <li>
            Enter your "Starting Place", this could be you leaving your house
          </li>
          <li>
            Enter your "Ending Place: where you intend to go. It could be the
            grocery store
          </li>
          <li>Enter your "Activity" like shopping</li>
          <li>
            Enter how long you think it will take for you to get to the "Ending
            Place". This could be minutes or hours or both
          </li>
          <li>
            Destination buttons, when you leave your "Starting Place" click on
            the depart button, when you arrive at the "Ending Place" click on
            the arrive button, should you need help or are lost click on the
            Help Me button. Click on the Help Me button it will connect you to
            our Emergency Operations Centre and someone you trust.
          </li>
          <li>
            If you go over your estimated time the alarm will sound to prompt
            you. If you don't want that alarm you can click on the cancel button
            at the bottom of the page.
          </li>
        </ol>
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
    lastActivity() {
      return this.member.lastActivity;
    },
    payload() {
      return {
        origin: this.origin,
        destination: this.destination ? this.destination : this.origin,
        description: this.description,
        eta: moment()
          .add(this.duration, 'minutes')
          .toISOString(),
        member_id: this.member.id
      };
    },
    now() {
      return moment().format(this.TIME);
    }
  },

  data() {
    return {
      loading: false,
      origin: '',
      destination: '',
      description: '',
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
    activityStarted() {
      console.log('\tExpect member returns by', this.payload.eta);
      this.updateActivity();
    },
    handleOrigin(val) {
      this.origin = val;
    },
    handleDestination(val) {
      this.destination = val;
    },
    handleDescription(val) {
      console.log(val);
      this.description = val;
    },

    updateActivity() {
      console.log('payload:', JSON.stringify(this.payload));
      let id = this.lastActivity ? this.lastActivity.id : '';
      Activity.$update({
        where: id,
        data: this.payload
      }).then(activity => {
        console.log('\tNew actvity:', activity);
        console.log('new lastActivity', this.lastActivity);
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

    async updateQuickStartPref(showQuickStart) {
      // to get new data to localForage, you must use the $create() method (not create())
      // and you must wrap the updated fields with the  data:{} object
      const perfs = await Preference.$update({
        where: this.perfID,
        data: {
          // databaseName: '',
          showQuickStarts: showQuickStart
          // showHelpIcons: '',
        }
      });
      console.log('updated perfs:', perfs);
    }
  },
  async created() {
    this.loading = true;
    console.log(this.now, 'Entering Active.vue created()...');

    await Activity.$fetch();
    await Member.$fetch();
    console.log('Member', this.member.id);
    await Preference.$fetch();
    console.log('Preference', this.perfID);

    console.log(this.now, '...Leaving Active.vue created()\n');
    console.log('');
    this.loading = false;
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
