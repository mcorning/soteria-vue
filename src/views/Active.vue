<template>
  <v-container class="purple lighten-5">
    <v-row>
      <!-- New Activity -->
      <v-col>
        <!-- <NextActivity /> -->
        <v-row><NextActivityForm /> </v-row>

        <!-- DateTime Section -->
        <v-row>
          <!-- Includes the Countdown component -->
          <ActivityTimes />
        </v-row>

        <!-- This Activity Timeline -->
        <v-row>
          <TimelineVue heading="This time I am:" />
        </v-row>

        <!-- Last Activity Timeline -->
        <v-row v-if="lastTimeline">
          <!-- <TimelineVue heading="Last time I was:" /> -->
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment';
import TimelineVue from '../components/Timeline';
import NextActivityForm from '../components/NextActivityForm';
import ActivityTimes from '../components/ActivityTimes';
import Member from '@/models/Member';
// import Activity from '@/models/Activity';
// import Timeline from '@/models/Timeline';
// import L from '@/logger';

export default {
  components: {
    TimelineVue,
    NextActivityForm,
    ActivityTimes
  },

  data() {
    return {
      member: Member.query().first(),
      memberAll: Member.query()
        .with('activities.timeline')
        .first(),
      activity: Member.query()
        .with('activities.timeline')
        .last(),
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

  computed: {
    lastTimeline() {
      return this.history;
    }
  },

  methods: {
    getInitialActivity() {
      // Activity.$create({
      //   data: {
      //     member_id: this.member.id,
      //     timeline: []
      //   }
      // });
    }
  },

  async created() {
    console.log('Active.vue created. ');
  },

  mounted() {
    console.log('Active.vue mounted');
    // if (!this.member.hasActivity) {
    //   console.log('Member has no activity. NOT Creating a default.');
    //   // this.getInitialActivity();
    // }
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
