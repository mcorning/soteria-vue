<template>
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
          v-model="dateRangeText"
          label="Date range"
          readonly
          hint="Toggle date to [de]select one (round trip) or two (excursion) dates"
          persistent-hint
        ></v-text-field
      ></v-col>

      <!-- Departure column -->
      <v-col cols="12" sm="4">
        <h3>Choose a Departure Time:</h3>
        <v-time-picker
          scrollable
          :ampm-in-title="true"
          v-model="departingAt"
          @change="onChangeDeparture"
        ></v-time-picker>

        <v-text-field
          label="Departing"
          readonly
          v-model="departing"
          hint="Change time with mouse or scroll"
          persistent-hint
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
          :value="arriving"
          hint="Change time with mouse or scroll"
          persistent-hint
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <Countdown :arrival="arrival" :departure="departure" />
    </v-row>
  </v-container>
</template>

<script>
// import { mapState, mapActions } from 'vuex';
// import { mapFields } from 'vuex-map-fields';

import moment from 'moment';
// import L from '@/logger';
import Countdown from './Countdown';

export default {
  components: {
    Countdown
  },

  computed: {
    // ...mapState(['use24hrClock', 'activity']),

    // ...mapFields(['activity.expectedArrival', 'activity.plannedDeparture']),
    use24hrClock() {
      return false;
    },
    dateRangeText() {
      return this.dates.join(' - ');
    },

    // Countdown prop
    arrival() {
      let a = this.dates[1] || this.dates[0];
      let adt = `${a} ${this.arrivingAt}`;
      return new Date(adt);
    },

    // arrival time-picker label value
    arriving() {
      this.onChangeArrival();
      return moment(this.arrival).format(this.FULL_DATE);
    },

    departure() {
      let ddt = `${this.dates[0]} ${this.departingAt}`;
      return new Date(ddt);
    },

    // departure time-picker label value
    departing() {
      this.onChangeDeparture();
      return moment(this.departure).format(this.FULL_DATE);
    }
  },

  data() {
    return {
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
    // ...mapActions(['updateActivity']),
    test(that) {
      console.log(that);
    },
    onChange(event) {
      console.log(event.target.name, event.target.value);
    },
    onChangeDeparture() {
      // this.updateActivity({ field: 'plannedDeparture', value: this.departure });
    },
    onChangeArrival() {
      // this.updateActivity({ field: 'expectedArrival', value: this.arrival });
    }
  },

  mounted() {
    console.log('ActivityTimes component mounted');
  }
};
</script>
