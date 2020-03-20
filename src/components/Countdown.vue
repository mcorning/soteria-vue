<template>
  <v-container class="purple lighten-5">
    <v-card>
      <v-card-title>When you are ready to go... </v-card-title>
      <v-card-subtitle>...hit the Depart button</v-card-subtitle>
      <Timer
        :arrivalDateTime="arrival"
        pomodoroLabel="Estimated Time of Return"
        resetLabel="Arrival"
        @open-activity="this.emit('timeline-add', 'ACTIVE')"
        @close-activity="this.emit('timeline-add', 'SAFE')"
        @expire-activity="this.emit('timeline-add', 'UNKNOWN')"
        @cancel-activity="this.emit('timeline-add', 'SAFE')"
        @sos="this.emit('timeline-add', 'ESCALATED')"
      />
      <v-card-text>When you are safe again, hit the Arrive button </v-card-text>
    </v-card>

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
import Activity from '@/models/Activity'; // needed to fetch this in order to get a non-null member.lastActivity reference

export default {
  components: {
    Timer
  },

  props: {
    member: { type: Object }
  },

  data() {
    return {
      sheet: false,
      showEscalationAlert: false
    };
  },
  methods: {
    standDown() {
      // this is where we de-notify safety team and/or sovrinSecours server
      this.showEscalationAlert = false;
    }
  },

  async created() {
    console.log('Member passed from timeline', this.member);
    let activity = Activity.query()
      .where('member_id', this.member.id)
      .last();
    this.arrival = new Date(activity.arrival);
    this.departure = new Date(activity.departure);
    console.log(
      'Arrival/Departure from store',
      this.arrival,
      '/',
      this.departure
    );
  },

  mounted() {}
};
</script>
