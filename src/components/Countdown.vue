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
      <v-col>
        <!-- This Activity Timeline -->

        <TimelineVue :member="member" heading="I am currently:" />
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
import TimelineVue from './Timeline';

// import L from '@/logger';
// import Member from '@/models/Member';
// import Activity from '@/models/Activity';
// import Timeline from '@/models/Timeline';

export default {
  components: {
    Timer,
    TimelineVue
  },

  props: {
    member: { type: Object },
    arrival: {
      type: Date
    },
    departure: {
      type: Date
    }
  },

  data() {
    return {
      sheet: false,
      showEscalationAlert: false
    };
  },
  methods: {
    addActivity() {
      console.log('Adding activity...');
      // Activity.$create({
      //   data: {
      //     member_id: this.member.id,
      //     description: this.description,
      //     updated: new Date()
      //   }
      // });
      // this.refreshMember();
    },
    // updates should requery state
    updateTimeline(status) {
      console.log('Adding timeline with...');
      let event = 'update-arrival';
      this.addTimeline(status);
      switch (status) {
        case 'SAFE':
          this.$emit('activity-add');
          break;
        case 'EXPIRED':
          this.sheet = true;
          break;
        case 'ESCALATED':
          // this is where we notify safety team and/or sovrinSecours server
          this.showEscalationAlert = true;
          this.sheet = !this.showEscalationAlert;
          break;
        default:
          event = 'update-departure';
      }
      console.log('Countdown.vue.updateTimeline: emitting event', event);
      this.$emit(event);
    },

    addTimeline(status) {
      console.log('...', status);
      this.$emit('timeline-add', status);
    },

    standDown() {
      // this is where we de-notify safety team and/or sovrinSecours server
      this.showEscalationAlert = false;
    }
  },

  async created() {
    // this.refreshMember();
    console.log('memberProp', this.member);
    console.log('Countdown.vue created. Fetching data.');
  },

  mounted() {
    console.log('Countdown.vue mounted');
  }
};
</script>
