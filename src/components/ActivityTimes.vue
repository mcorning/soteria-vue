<template>
  <div>
    <v-container class="purple lighten-5">
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
        </v-col>

        <!-- Arrival column -->
        <v-col cols="12" sm="4">
          <h3>Choose an Arrival Time:</h3>

          <v-time-picker
            scrollable
            :ampm-in-title="!use24hrClock"
            v-model="arrivingAt"
          ></v-time-picker>

          <v-text-field
            label="Arriving"
            readonly
            hint="Change time with mouse or scroll"
            persistent-hint
            v-model="arriving"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <Countdown
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

export default {
  components: {
    Countdown
  },
  props: {
    memberProp: {
      type: Object
    }
  },

  computed: {
    use24hrClock() {
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
      isMounted: false,
      member: this.memberProp,

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
    addActivity() {
      console.log('ActivityTimes.vue.addActivity():');
    },
    addTimeline(status) {
      console.log('ActivityTimes.vue.addTimeline():', status);
      this.$emit('timeline-add', status);
    },

    updateDeparture() {
      let departure = new Date();
      console.log(
        'ActivityTimes.updateDeparture: Recording Activity Departure',
        `for ID:  ${this.member.lastActivity.id}
        to ${departure}`
      );
      this.$emit('record-departure');
    },

    updateArrival() {
      let arrival = new Date();
      console.log(
        'ActivityTimes.updateArrival: Recording Activity Departure',
        `for ID:  ${this.member.lastActivity.id}
        to ${arrival}`
      );
      this.$emit('record-arrival');
    }
  },

  created() {
    console.log('ActivityTimes.prop.member', this.member);
  },

  mounted() {
    console.log('ActivityTimes component mounted');
    console.log('member id:', this.member.id);
    this.isMounted = true;
  }
};
</script>
