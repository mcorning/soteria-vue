<template>
  <v-container class="purple lighten-5">
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>When you are ready to go... </v-card-title>
          <v-card-subtitle>...hit the Depart button</v-card-subtitle>
          <Pomodoro
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
import Pomodoro from './Pomodoro';
import { mapState, mapActions } from 'vuex';
// import L from '@/logger';

export default {
  components: {
    Pomodoro
  },

  computed: {
    ...mapState(['activity', 'timeline', 'history', 'use24hrClock'])
  },

  data() {
    return {
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
  props: {
    arrival: {
      type: Date
    },
    departure: {
      type: Date
    }
  },
  methods: {
    ...mapActions(['newTimeline', 'addStep', 'closeTimeline']),

    openActivity() {
      // console.log(
      //   `Opening activity for Activity ID: ${this.nextActivity.activity}`
      // );
      let step = {
        title: 'Opened',
        status: 'ACTIVE',
        updated: new Date()

        // color: 'yellow darken-1',
        // icon: 'mdi-door-open'
      };

      this.newTimeline(step);
    },

    closeActivity() {
      // console.log(
      //   `Closing activity for Activity ID: ${this.nextActivity.activity}`
      // );
      let step = {
        title: 'Closed',
        status: 'SAFE',
        updated: new Date()

        // color: 'green lighten-1',
        // icon: 'mdi-gift'
      };
      // L.info('Closing activity', this.nextActivity.activity);
      // L.object('with', step);
      this.addStep(step);
      this.closeTimeline();
    },

    expireActivity() {
      console.log(
        `Activity expired for Activity ID: ${this.nextActivity.activity}`
      );
      let step = {
        title: 'Expired',
        status: 'UNKNOWN',
        updated: new Date(),

        color: 'orange lighten-1',
        icon: 'mdi-bell-alert'
      };
      this.addStep(step);

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
        updated: new Date(),

        color: 'blue lighten-1',
        icon: 'mdi-gift'
      };
      this.addStep(step);
      this.closeTimeline(step);
    },

    escalateActivity() {
      console.log(
        `Escalating Activity ID: ${this.nextActivity.activity} to sovrinSecours server...`
      );
      let step = {
        title: 'Escalated ',
        status: 'ESCALATED',
        updated: new Date(),

        color: 'red lighten-1',
        icon: 'mdi-shield-alert'
      };
      this.addStep(step);
      this.showEscalationAlert = true;
      this.sheet = !this.showEscalationAlert;
      // this is where we notify safety team and/or sovrinSecours server
    },

    standDown() {
      // this is where we de-notify safety team and/or sovrinSecours server
      this.showEscalationAlert = false;
    }
  },
  mounted() {
    console.log('Countdown.vue mounted');
  }
};
</script>
