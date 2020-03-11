<template>
  <div>
    <v-btn class="icon" @click="setDebug">
      Debug
    </v-btn>
    <v-spacer />
    <div>
      <input
        class="input"
        :value="description"
        placeholder="Enter activity description"
        @input="
          e => {
            update(e.target.value);
          }
        "
      />
      <v-btn @click="updateTimeline('ACTIVE')" :disabled="active">
        Depart</v-btn
      >
      <v-btn @click="updateTimeline('SAFE')" :disabled="active"> Arrive</v-btn>
      <v-btn @click="destroy(activity)"> Delete</v-btn>
    </div>

    <!-- <TimelineVue :activity="activity" /> -->
    <v-row>
      <v-col>
        Current Activity
        <pre v-if="debug">{{ member.activities[0] }} </pre>
      </v-col>
      <v-col>
        All Member Data
        <pre v-if="debug">{{ member }} </pre>
      </v-col>
    </v-row>
  </div>
</template>

<script>
// import * as R from 'ramda';

import Activity from '@/models/Activity';
import Member from '@/models/Member';
import Timeline from '@/models/Timeline';
// import TimelineVue from '@/components/Timeline';

export default {
  // components: { TimelineVue },

  computed: {},

  data() {
    return {
      errors: [
        {
          error: `Uncaught (in promise) TypeError: Cannot read property '$self' of null`,
          fix: 'ensure arg is not null'
        }
      ],
      debug: true,
      active: false,
      activityID: '',
      description: 'Gimme a name',
      member: Member.query()
        .with('activities.timeline')
        .last(),
      hasStartedActivity: Member.query()
        .has('activities.timeline')
        .get()
    };
  },

  methods: {
    getInitialActivity() {
      console.log('Providing a default activity for ', this.member.firstName);
      Activity.$create({
        data: {
          member_id: this.member.id
        }
      }).then(x => {
        this.activityID = x[0].id;
        console.log('New activity id:', this.activityID);
      });
    },

    setDebug() {
      this.debug = !this.debug;
    },

    updateTimeline(status) {
      Timeline.$create({
        data: {
          activity_id: this.member.activities[0].id,
          state: status,
          updated: new Date()
        }
      });
      // when safe, create a new record with the saved record's data
      if (status === 'SAFE') {
        console.log(
          `Member is SAFE. Creating new default activity, ${this.member.activities[0].description}, for next time`
        );
        Activity.$create({
          data: {
            member_id: this.member.id,
            description: this.member.activities[0].description,
            timeline: []
          }
        });
      }
    },

    update(description) {
      Activity.$update({
        where: this.activityID,
        data: { description }
      });
    },

    destroy() {
      console.log('Deleting activity ID:', this.activityID);
      Timeline.$delete(timeline => timeline.activity_id == this.activityID);
      Activity.$delete(this.activityID);
    }
  },

  created() {
    console.log(
      'Value of member is: ' + JSON.stringify(this.member.activities)
    );
  },

  mounted() {
    if (!this.member.hasStartedActivity) {
      // this.getInitialActivity();
    }
  }
};
</script>
