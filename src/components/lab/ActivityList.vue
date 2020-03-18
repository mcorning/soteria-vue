<template>
  <div>
    {{ member.lastActivity.description }}
    <v-autocomplete
      style="width:290px"
      :items="[
        'Backpacking',
        'Baseball',
        'Basejump',
        'Basketball',
        'Biking',
        'Boating',
        'Hiking',
        'Hockey',
        'Land sailing',
        'Mountain Biking',
        'Road trip',
        'Running',
        'Sailing',
        'Shopping',
        'Skiing',
        'Soccer',
        'Walking',
        'Unlisted'
      ]"
      label="Activity"
      hint="Choose an activity to help us help you if necessary"
      persistent-hint
      v-model="description"
      @change="updateActivity"
    ></v-autocomplete>

    member has departed disables
    <v-btn
      @click="updateTimeline('ACTIVE')"
      hint="member.hasDeparted"
      :disabled="disableDepart"
    >
      Depart
    </v-btn>

    timeline includes SAFE disables
    <v-btn @click="updateTimeline('SAFE')" :disabled="disableArrive">
      Arrive
    </v-btn>
    member has 1 activity disables
    <v-btn @click="destroy()" :disabled="member.hasActivity === 1">
      Delete
    </v-btn>
    <v-row>
      <v-col>
        state
        <pre>{{ state }} </pre>
      </v-col>
    </v-row>
    <!-- <v-row>
      <v-col>
        lastActivity:
        <pre>{{ member.lastActivity }} </pre>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        Member Activities
        <pre>{{ member }} </pre>
      </v-col>
    </v-row> -->
  </div>
</template>

<script>
import Member from '@/models/Member';
import Activity from '@/models/Activity';
import Timeline from '@/models/Timeline';

export default {
  components: {},

  computed: {
    disableDepart() {
      return this.state !== 'UNDEFINED';
    },
    disableArrive() {
      return ['SAFE', 'UNDEFINED'].includes(this.state);
    }
  },

  data() {
    return {
      member: '',
      description: '',
      state: ''
    };
  },

  methods: {
    //vuexorm state is not reactive out of the box, so queries belong in methods
    refreshMember() {
      this.member = Member.query()
        .with('activities.timeline')
        .first();
      if (this.member.lastActivity) {
        this.description = this.member.lastActivity.description;
        this.state =
          this.member.lastActivity.timeline.length > 0
            ? this.member.lastActivity.timeline[
                this.member.lastActivity.timeline.length - 1
              ].state
            : 'UNDEFINED';
      }
      // add a default activity if the only activity left is also the last activity
      if (this.member.lastActivity.id === this.member.activities[0].id) {
        this.addActivity();
      }
      console.log(
        'ActivityList.refreshMember():',
        this.description,
        this.state
      );
    },

    // updates should requery state
    updateTimeline(status) {
      this.addTimeline(status);
      if (status === 'SAFE') {
        this.addActivity();
      }
    },

    addTimeline(status) {
      Timeline.$create({
        data: {
          activity_id: this.member.lastActivity.id,
          state: status,
          updated: new Date()
        }
      });
      this.hasDeparted = false;
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

    updateActivity() {
      console.log(
        'Updating Activity',
        this.member.lastActivity.id,
        'with',
        this.description
      );
      Activity.$update({
        where: this.member.lastActivity.id,
        data: { description: this.description }
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

  created() {
    // get member data
    this.refreshMember();
    console.log(
      'ActivityList.created(): Member has',
      this.member.hasActivity,
      'activities'
    );
    if (this.member.hasActivity == 0) {
      console.log('Adding default activity for ', this.member.firstName);
      this.addActivity();
      alert('Be sure to give new activity a name before you depart');
    }
    this.hasDeparted = this.member.hasDeparted;
    this.hasActivity = this.member.hasActivity == 1 ? true : false;
    this.lastActivity = this.member.lastActivity;
  }
};
</script>
