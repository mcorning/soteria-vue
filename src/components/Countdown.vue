<template>
  <v-container class="purple lighten-5">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>When you are ready to go... </v-card-title>
          <v-card-subtitle>...hit the Depart button</v-card-subtitle>
          <Timer
            :arrivalDateTime="arrival"
            pomodoroLabel="Estimated Time of Return"
            resetLabel="Arrival"
            @open-activity="openActivity"
            @close-activity="closeActivity"
            @expire-activity="expireActivity"
            @cancel-activity="cancelActivity"
            @sos="escalateActivity"
          />
          <v-card-text
            >When you are safe again, hit the Arrive button
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showEscalationAlert">
      <v-alert prominent type="error">
        <v-row align="center">
          <v-col class="grow">
            <p>
              Secours escalated your activity.
            </p>
            <p>
              Once you are safe, hit the I am safe button to regain control of
              the app.
            </p>
          </v-col>
          <v-col class="shrink">
            <v-btn @click="standDown">I am safe</v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </v-dialog>

    <!-- Alternative UX for expiration -->
    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" height="200px">
        <v-btn class="mt-6" text color="red" @click="sheet = !sheet"
          >close</v-btn
        >
        <div class="py-3">
          Your activity has expired. Unless you close it shortly, I am going to
          notify your safety team
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
import Timer from './Timer';
// import L from '@/logger';
import Member from '@/models/Member';
import Activity from '@/models/Activity';
import Timeline from '@/models/Timeline';

export default {
  components: {
    Timer
  },

  props: {
    arrival: {
      type: Date
    },
    departure: {
      type: Date
    }
  },

  timelineKey: [
    {
      state: 'ACTIVE',
      color: 'yellow darken-1',
      icon: 'mdi-door-open'
    },
    {
      state: 'SAFE',
      color: 'orange lighten-1',
      icon: 'mdi-gift'
    },
    {
      state: 'UNKNOWN',
      color: 'yellow darken-1',
      icon: 'mdi-bell-alert'
    },
    {
      state: 'ESCALATED',
      color: 'red lighten-1',
      icon: 'mdi-shield-alert'
    }
  ],

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
      nextActivity: {
        id: '',
        activity: '',
        departedFrom: '',
        arrivedAt: '',
        departure: '',
        arrival: ''
      }
    };
  },
  methods: {
    getInitialActivity() {
      // Activity.$create({
      //   data: {
      //     member_id: this.member.id,
      //     timeline: []
      //   }
      // });
    },

    updateTimeline(payload) {
      Timeline.$create({
        data: { payload }
      });
      // when safe, create a new record with the saved record's data
      if (status === 'SAFE') {
        // Activity.$create({
        //   data: {
        //     member_id: this.activity.member_id,
        //     description: this.activity.description,
        //     timeline: []
        //   }
        // });
      }
    },

    openActivity() {
      // console.log(
      //   `Opening activity for Activity ID: ${this.nextActivity.activity}`
      // );
      let step = {
        state: 'ACTIVE',
        updated: new Date(),
        activity_id: this.activity.id

        // color: 'yellow darken-1',
        // icon: 'mdi-door-open'
      };
      this.updateTimeline(step);
    },

    closeActivity() {
      // console.log(
      //   `Closing activity for Activity ID: ${this.nextActivity.activity}`
      // );
      let step = {
        title: 'Closed',
        status: 'SAFE',
        updated: new Date()
      };
      this.updateTimeline(step);
    },

    expireActivity() {
      console.log(
        `Activity expired for Activity ID: ${this.nextActivity.activity}`
      );
      let step = {
        title: 'Expired',
        status: 'UNKNOWN',
        updated: new Date()
      };
      this.updateTimeline(step);

      // this is where we remind the member to close the activity
      this.sheet = true;
    },

    cancelActivity() {
      console.log(
        `Activity cancelled for Activity ID: ${this.nextActivity.activity}`
      );
      let step = {
        title: 'Cancelled',
        status: 'SAFE',
        updated: new Date()
      };
      this.updateTimeline(step);
    },

    escalateActivity() {
      console.log(
        `Escalating Activity ID: ${this.nextActivity.activity} to sovrinSecours server...`
      );
      let step = {
        title: 'Escalated ',
        status: 'ESCALATED',
        updated: new Date()
      };
      this.updateTimeline(step);

      // this is where we notify safety team and/or sovrinSecours server
      this.showEscalationAlert = true;
      this.sheet = !this.showEscalationAlert;
    },

    standDown() {
      // this is where we de-notify safety team and/or sovrinSecours server
      this.showEscalationAlert = false;
    }
  },

  async created() {
    console.log('Countdown.vue created. Fetching data.');
  },

  mounted() {
    console.log('Countdown.vue mounted');
    // if (!this.member.hasActivity) {
    //   this.getInitialActivity();
    // }
  }
};
</script>
