<template>
  <div v-if="loading">
    <h2>Loading Active.vue...</h2>
  </div>
  <div v-else>
    <v-container class="purple lighten-5">
      <v-row>
        <v-col>
          <v-row>
            <Description />
            <!-- <NextActivity /> -->
          </v-row>

          <v-row>
            <!-- DateTime Section -->
            <Times />
          </v-row>

          <v-row>
            <!-- This Activity Timeline -->
            <Timelines :member="member" />
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
import Description from '@/components/Description';
import Times from '@/components/Times';
import Timelines from '@/components/Timeline';

import Member from '@/models/Member';
import Activity from '@/models/Activity';
import Timeline from '@/models/Timeline';
// import L from '@/logger';

export default {
  components: {
    Description,
    Times,
    Timelines
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
    destroy() {
      console.log('|activities|', this.member.hasActivity === 1);
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
    }
  },
  async created() {
    this.loading = true;
    await Activity.$fetch();
    await Member.$fetch();
    let m = Member.query()
      .with('activities.timeline')
      .first();
    if (!m.lastActivity) {
      console.log('Ensuring member has default activity');
      Activity.$create({
        data: {
          departFrom: 'Starting place',
          arriveAt: 'Some place else',
          description: 'What are you up to?',
          departure: '',
          arrival: '',
          member_id: m.id
        }
      }).then(activity => {
        console.log('First default activity', activity);
      });
    }

    this.loading = false;

    console.info('Current member with activities and timeline:', m);
    this.member = m;
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
