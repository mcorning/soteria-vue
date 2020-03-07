<template>
  <div>
    <v-btn class="icon" @click="setDebug">
      Debug
    </v-btn>
    <v-spacer />
    <div>
      <input
        class="input"
        :value="activity.description"
        placeholder="Enter activity description"
        @input="
          e => {
            update(activity, e.target.value);
          }
        "
      />
      <v-btn @click="updateTimeline(activity, 'ACTIVE')" :disabled="active">
        Depart</v-btn
      >
      <v-btn @click="updateTimeline(activity, 'SAFE')" :disabled="active">
        Arrive</v-btn
      >
      <v-btn @click="destroy(activity)"> Delete</v-btn>
    </div>

    <TimelineVue :activity="activity" />
    <pre v-if="debug">{{ memberAll }} </pre>
  </div>
</template>

<script>
// import * as R from 'ramda';

import Activity from '@/models/Activity';
import Member from '@/models/Member';
import Timeline from '@/models/Timeline';
import TimelineVue from '@/components/Timeline';

export default {
  components: { TimelineVue },

  computed: {
    member() {
      let x = Member.query().first();
      return x;
    },
    memberAll() {
      let x = Member.query()
        .with('activities.timeline')
        .first();
      return x;
    },

    activity() {
      let x = Member.query()
        .with('activities.timeline')
        .last();
      // this needs to be an active activity, not just the first
      return x.activities[0];
    }
  },

  data() {
    return {
      debug: true,
      active: false
    };
  },

  methods: {
    setDebug() {
      this.debug = !this.debug;
    },

    updateTimeline(activity, status) {
      Timeline.$create({
        data: { activity_id: activity.id, state: status, updated: new Date() }
      });
      // when safe, create a new record with the saved record's data
      if (status === 'SAFE') {
        Activity.$create({
          data: {
            member_id: activity.member_id,
            description: activity.description,
            timeline: []
          }
        });
      }
    },

    update(activity, description) {
      Activity.$update({
        where: activity.id,
        data: { description }
      });
    },

    destroy(activity) {
      console.log('Deleting activity ID:', activity.id);
      // Timeline.$delete(timeline => timeline.activity_id == activity.id);
      Activity.$delete(activity.id);
    }
  },

  async mounted() {
    if (this.member) {
      let x = Activity.all();
      if (x.length == 0) {
        Activity.$create({
          data: {
            member_id: this.member.id,
            timeline: []
          }
        });
      }
    }
  }
};
</script>
