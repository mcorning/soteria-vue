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
            v-model="dateRangeText"
            label="Date range"
            readonly
            hint="Round trips: Toggle date.  Multiday excursions: toggle two dates"
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
    <v-container>
      <v-row>
        <v-col cols="12">
          lastActivity:
          <pre>{{ member.lastActivity }} </pre>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          Member Activities
          <pre>{{ member }} </pre>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment';
// import L from '@/logger';
import Countdown from './Countdown';
import Member from '@/models/Member';
import Activity from '@/models/Activity';

export default {
  components: {
    Countdown
  },

  computed: {
    use24hrClock() {
      return false;
    },
    dateRangeText() {
      return this.dates.join(' - ');
    },

    // Countdown prop
    arrival: {
      get() {
        let a = this.dates[1] || this.dates[0];
        let adt = `${a} ${this.arrivingAt}`;
        return new Date(adt);
      },
      set(newVal) {
        console.log('Updating Arrival prop');
        this.update({ arrival: newVal });
      }
    },

    departure: {
      get() {
        let ddt = `${this.dates[0]} ${this.departingAt}`;
        return new Date(ddt);
      },
      set(newVal) {
        console.log('Updating Departure computed property');
        this.update({ departure: newVal });
      }
    },

    // arrival time-picker label value
    arriving() {
      this.onChangeArrival();
      // let x = moment(this.arrival).format(this.FULL_DATE);
      return this.arrival;
    },

    // departure time-picker label value
    departing() {
      this.onChangeDeparture();
      // return moment(this.departure).format(this.FULL_DATE);
      return this.departure;
    }
  },

  data() {
    return {
      member: '',

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
      // if (this.member.lastActivity.id === this.member.activities[0].id) {
      //   this.addActivity();
      // }
      console.log('refreshMember():', this.description, this.state);
    },
    update(payload) {
      Activity.$update({
        where: this.member.lastActivity.id,
        data: payload
      });
      this.refreshMember();
    },

    onChangeDeparture() {
      console.log(
        'Updating Activity Departure',
        this.member.lastActivity
          ? `for ID:  ${this.member.lastActivity.id} to ${this.departure}`
          : 'while loading app'
      );

      this.update({ departure: this.departure });
    },

    onChangeArrival() {
      if (!this.member.lastActivity) {
        // Loading: no updated possible
        return;
      }
      // without this guard, we get in an endless loop where even when arrival doesn't change,
      // it triggers a loop that does not happen with updateing departure above. odd.
      if (this.member.lastActivity.arrival == this.arrival) {
        // Arrival has not changed. No update necessary.
        return;
      }

      console.log(
        'Updating Activity Arrival',
        this.activity
          ? `for ID:  ${this.member.lastActivity.id} to ${this.arrival}`
          : ' while loading app...'
      );
      this.update({ arrival: this.arrival });
    }
  },

  created() {
    this.refreshMember();
  },

  mounted() {
    console.log('ActivityTimes component mounted');
    console.log('member id:', this.member.id);
  }
};
</script>
