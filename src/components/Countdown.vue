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
            @open-activity="updateTimeline('ACTIVE')"
            @close-activity="updateTimeline('SAFE')"
            @expire-activity="updateTimeline('UNKNOWN')"
            @cancel-activity="updateTimeline('SAFE')"
            @sos="updateTimeline('ESCALATED')"
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
      member: '',
      // member: Member.query().first(),
      // memberAll: Member.query()
      //   .with('activities.timeline')
      //   .first(),
      // activity: Member.query()
      //   .with('activities.timeline')
      //   .last(),
      // hasActivity: Member.query()
      //   .has('activities.timeline')
      //   .get(),

      sheet: false,
      showEscalationAlert: false
      // nextActivity: {
      //   id: '',
      //   activity: '',
      //   departedFrom: '',
      //   arrivedAt: '',
      //   departure: '',
      //   arrival: ''
      // }
    };
  },
  methods: {
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
      // if (this.member.lastActivity.id === this.member.activities[0].id) {
      //   this.addActivity();
      // }
      console.log('refreshMember():', this.description, this.state);
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
    // updates should requery state
    updateTimeline(status) {
      this.addTimeline(status);
      switch (status) {
        case 'SAFE':
          this.addActivity();
          break;
        case 'EXPIRED':
          this.sheet = true;
          break;
        case 'ESCALATED':
          // this is where we notify safety team and/or sovrinSecours server
          this.showEscalationAlert = true;
          this.sheet = !this.showEscalationAlert;
          break;
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
      this.refreshMember();
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
    },

    standDown() {
      // this is where we de-notify safety team and/or sovrinSecours server
      this.showEscalationAlert = false;
    }
  },

  async created() {
    this.refreshMember();
    console.log('Countdown.vue created. Fetching data.');
  },

  mounted() {
    console.log('Countdown.vue mounted');
  }
};
</script>
