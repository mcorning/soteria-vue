<template>
  <div>
    <div v-if="loading">
      <H2>Loading ActivityTimes.vue...</H2>
    </div>

    <v-container v-else class="purple lighten-5">
      <!-- DateTime Section -->
      <v-row justify="end">
        <!-- Date column -->
        <!-- <v-col style="width: 400px; flex: 0 1 auto;" class="md-12"> -->
        <v-col cols="12" sm="4">
          <h3>Choose activity's date range</h3>

          <!-- DatePicker -->
          <v-date-picker full-width v-model="dates" range></v-date-picker>

          <v-text-field
            class=" sm-12 pt-7"
            label="Date range"
            readonly
            hint="Round trips: Toggle date.  Multiday excursions: toggle two dates"
            persistent-hint
            v-model="dateRangeText"
          ></v-text-field
        ></v-col>

        <!-- Departure column -->
        <v-col cols="12" sm="4">
          <h3>Choose a Departure Time:</h3>
          <div>
            <v-time-picker
              scrollable
              :ampm-in-title="true"
              v-model="departingAt"
            ></v-time-picker>

            <v-text-field
              label="Departing"
              readonly
              hint="Change time with mouse or scroll"
              persistent-hint
              v-model="departing"
            ></v-text-field>
          </div>
        </v-col>

        <!-- Arrival column -->
        <v-col cols="12" sm="4">
          <h3>Choose an Arrival Time:</h3>
          <div>
            <v-time-picker
              scrollable
              :ampm-in-title="!h24"
              v-model="arrivingAt"
            ></v-time-picker>

            <v-text-field
              label="Arriving"
              readonly
              hint="Change time with mouse or scroll"
              persistent-hint
              v-model="arriving"
            ></v-text-field>
          </div>

          <!-- <Timeselector
            v-model="arrival"
            :utc="false"
            :h24="false"
            displayFormat="hh:mm a"
            returnFormat="hh:mm a"
            :initialView="false"
            :padTime="true"
            :interval="{ h: 1, m: 15 }"
            @formatedTime="formatedTime"
            @input="changeArrival"
          >
            <template slot="hours">
              <span>Hours</span>
              <span>Minutes</span>
            </template>
          </Timeselector>
          <v-text-field
            label="Arriving"
            readonly
            v-model="arrivalString"
          ></v-text-field> -->
        </v-col>
      </v-row>

      <v-row>
        <Countdown
          :member="member"
          :arrival="arrival"
          :departure="departure"
          @timeline-add="addTimeline"
          @activity-add="addActivity"
          @update-departure="updateDeparture"
          @update-arrival="updateArrival"
        />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment';
// import L from '@/logger';
import Countdown from './Countdown';
import Member from '@/models/Member';
import Activity from '@/models/Activity'; // needed to fetch this in order to get a non-null member.lastActivity reference

// import Timeselector from 'vue-timeselector';
// import Timeselector from './Timeselector';

export default {
  components: {
    Countdown
    // Timeselector
  },

  computed: {
    myArrivalTime() {
      return this.getArrivalDateTime();
    },
    activeDate() {
      return new Date(this.dates[1] || this.dates[0]);
    },

    h24() {
      return false;
    },
    dateRangeText() {
      return this.dates.join(' - ');
    },

    // This will be a Countdown prop
    arrival: {
      get() {
        let a = this.dates[1] || this.dates[0];
        let adt = `${a} ${this.arrivingAt}`;
        return new Date(adt);
      },
      set(newVal) {
        console.log('Updating Arrival prop with ', newVal);
      }
    },

    // This will be a Countdown prop
    departure: {
      get() {
        let ddt = `${this.dates[0]} ${this.departingAt}`;
        return new Date(ddt);
      },
      set(newVal) {
        console.log('Updating Departure computed property with ', newVal);
      }
    },

    // arrival time-picker label value
    arriving() {
      return this.arrival;
    },

    // departure time-picker label value
    departing() {
      return this.departure;
    }
  },

  data() {
    return {
      loading: false,
      arrivalTime: null,
      isMounted: false,

      FULL_DATE: 'ddd, MMM Do YYYY, hh:mm a',

      // date-picker value(s)
      dates: [moment().format('YYYY-MM-DD')],

      // departure time-picker label value
      departingAt: moment().format('HH:mm'),

      // arrival time-picker label value
      arrivingAt: moment()
        .add(30, 'minutes')
        .format('HH:mm')
    };
  },

  methods: {
    change() {
      this.time = new Date();
    },
    formatedTime(e) {
      console.log('formated: ' + e);
    },
    getArrivalDateTime() {
      let a = this.dates[1] || this.dates[0];
      let adt = `${a} ${this.arrivalTime}`;
      return new Date(adt);
    },

    addActivity() {
      console.log('addActivity():');
    },
    addTimeline(status) {
      console.log('addTimeline():', status);
      this.$emit('timeline-add', status);
    },

    updateDeparture() {
      let departure = new Date();
      console.log(
        'Recording Activity Departure',
        `for ID:  ${this.member.lastActivity.id}
        to ${departure}`
      );
      this.$emit('record-departure');
    },

    updateArrival() {
      let arrival = new Date();
      console.log(
        'Recording Activity Departure',
        `for ID:  ${this.member.lastActivity.id}
        to ${arrival}`
      );
      this.$emit('record-arrival');
    },

    changeArrival(e) {
      console.log('Changing arrival to', e);
      this.arrivalString = e;
    }
  },

  async created() {
    this.loading = true;
    await Activity.$fetch();
    await Member.$fetch();
    let m = Member.query()
      .with('activities.timeline')
      .first();
    this.loading = false;

    console.info('Fetched member with Activities and Timeline:', m);
    this.member = m;
  },

  mounted() {}
};
</script>
