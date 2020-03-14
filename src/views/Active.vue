<template>
  <div v-if="loading">
    <h2>Loading Active.vue...</h2>
  </div>
  <div v-else>
    <v-container class="purple lighten-5">
      <!-- <v-row v-if="loading"> -->
      <v-row>
        <!-- New Activity -->
        <v-col>
          <!-- <NextActivity /> -->
          <v-row>
            <NextActivityForm
              @departFrom-set="updateActivityWith"
              @arriveAt-set="updateActivityWith"
              @description-set="updateActivityWith"
            />
          </v-row>

          <!-- DateTime Section -->
          <v-row>
            <!-- Includes the Countdown component -->
            <ActivityTimes
              @set-time="setTime"
              @timeline-add="addTimeline"
              @record-departure="recordDeparture"
              @record-arrival="recordArrival"
            />
          </v-row>

          <!-- This Activity Timeline -->
          <v-row>
            <TimelineVue :memberProp="member" heading="This time I am:" />
          </v-row>

          <!-- Last Activity Timeline -->
          <!-- <v-row v-if="lastTimeline"> -->
          <!-- <TimelineVue heading="Last time I was:" /> -->
          <!-- </v-row> -->
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment';
import NextActivityForm from '../components/NextActivityForm';
import ActivityTimes from '../components/ActivityTimes';
import TimelineVue from '../components/Timeline';

import Member from '@/models/Member';
import Activity from '@/models/Activity';
import Timeline from '@/models/Timeline';
// import L from '@/logger';

export default {
  components: {
    TimelineVue,
    NextActivityForm,
    ActivityTimes
  },

  computed: {},

  data() {
    return {
      loading: false,
      member: {},
      hasActivity: Member.query()
        .has('activities.timeline')
        .get(),

      sheet: false,
      showEscalationAlert: false,

      FULL_DATE: 'ddd, MMM Do YYYY, hh:mm a',
      ampm: 'ampm',
      dates: [moment().format('YYYY-MM-DD')],
      memberID: 1,

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
    setTime(payload) {
      console.log(
        `Updating time for Activity ${this.member.lastActivity.id}`,
        payload
      );
      this.updateActivityWith(payload);
    },

    //vuexorm state is not reactive out of the box, so queries belong in methods
    refreshMember() {
      this.member = Member.query()
        .with('activities.timeline')
        .first();
      console.assert(
        this.member.lastActivity,
        'This member does not have a default activity'
      );
      this.description = this.member.lastActivity.description;
      this.state =
        this.member.lastActivity.timeline.length > 0
          ? this.member.lastActivity.timeline[
              this.member.lastActivity.timeline.length - 1
            ].state
          : 'UNDEFINED';

      console.log('Active.vue.refreshMember():', this.description, this.state);
    },

    recordDeparture() {
      this.updateActivityWith({ departure: new Date() });
    },
    recordArrival() {
      this.updateActivityWith({ arrival: new Date() });
    },

    addTimeline(status) {
      Timeline.$create({
        data: {
          activity_id: this.member.lastActivity.id,
          state: status,
          updated: new Date()
        }
      });
      this.refreshMember();
    },

    addActivity() {
      Activity.$create({
        data: {
          member_id: this.member.id,
          description: this.description,
          updated: new Date()
        }
      });
      this.refreshMember();
    },

    updateActivityWith(payload) {
      console.log(
        `Updating activity ${this.member.lastActivity.id} with ${JSON.stringify(
          payload
        )}`
      );
      Activity.$update({
        where: this.member.lastActivity.id,
        data: payload
      });
      this.refreshMember();
    },

    destroy() {
      console.log('|activities|', this.member.hasActivity === 1);
      Timeline.$delete(
        timeline => timeline.activity_id == this.member.lastActivity.id
      );
      Activity.$delete(this.member.lastActivity.id);
      // reset the lastActivity
      this.refreshMember();
      console.log(this.member.lastActivity.id);
      console.log(this.member.lastActivity);
    },

    hasStartedActivity() {
      let timeline = Member.query()
        .has('activities.timeline')
        .get();
      return timeline.length ? true : false;
    }
  },
  async created() {
    this.loading = true;
    await Activity.$fetch();
    await Member.$fetch();
    let m = Member.query()
      .with('activities')
      .first();
    this.loading = false;

    console.info('NextActivityForm.vue.activities:', m);
    this.member = m;
  },

  async createdAsync() {
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
      this.refreshMember();
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
  },

  mounted() {
    console.log('Active.vue mounted');
  }
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
