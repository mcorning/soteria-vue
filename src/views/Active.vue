<template>
  <v-container class="purple lighten-5">
    <v-row>
      <!-- New Activity -->
      <v-col>
        <!-- <NextActivity /> -->
        <v-row><NextActivityForm :activity="activity" /> </v-row>

        <!-- DateTime Section -->
        <v-row>
          <!-- Includes the Countdown component -->
          <ActivityTimes />
        </v-row>
        <!-- This Activity Timeline -->
        <v-row>
          <Timeline
            :activity="activity"
            :timeline="timeline"
            heading="This time I am:"
          />
        </v-row>
        <!-- Last Activity Timeline -->
        <v-row v-if="lastTimeline">
          <Timeline
            :activity="activity"
            :timeline="lastTimeline"
            heading="Last time I was:"
          />
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';

import moment from 'moment';
import Timeline from '../components/Timeline';
import NextActivityForm from '../components/NextActivityForm';
import ActivityTimes from '../components/ActivityTimes';
// import L from '@/logger';

export default {
  components: {
    Timeline,
    NextActivityForm,
    ActivityTimes
  },

  data() {
    return {
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
    // mix the getters into computed with object spread operator
    ...mapState(['activity', 'timeline', 'history', 'use24hrClock']),

    lastTimeline() {
      return this.history;
    }
  },

  created() {},
  mounted() {
    console.log('Active.vue mounted');
  },

  methods: {}
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
