<template>
  <div>
    <div v-if="loading">
      <H2>Loading Activity.vue...</H2>
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
              v-model="departureTime"
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
              v-model="arrivalTime"
            ></v-time-picker>

            <v-text-field
              label="Arriving"
              readonly
              hint="Change time with mouse or scroll"
              persistent-hint
              v-model="arriving"
            ></v-text-field>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment';
import Member from '@/models/Member';
import Activity from '@/models/Activity'; // needed to fetch this in order to get a non-null member.lastActivity reference

export default {
  computed: {
    h24() {
      return false;
    },
    dateRangeText() {
      return this.dates.join(' - ');
    },

    // This will be a Countdown prop
    arrival() {
      return new Date(this.arriving);
    },

    // This will be a Countdown prop
    departure() {
      return new Date(this.departing);
    },

    // arrival time-picker label text value
    arriving() {
      let a = this.dates[1] || this.dates[0];
      let adt = `${a} ${this.arrivalTime}`;
      return adt;
    },

    // departure time-picker label text value
    departing() {
      return `${this.dates[0]} ${this.departureTime}`;
    }
  },
  arrivalDefault: '',
  departureDefault: '',
  data() {
    return {
      a: '',
      d: '',
      loading: false,
      isMounted: false,
      FULL_DATE: 'ddd, MMM Do YYYY, hh:mm a',

      // arrival time-picker label value
      arrivalTime: {
        get() {
          return this.a;
        },
        set(newVal) {
          this.a = newVal;
        }
      },
      // // departure time-picker label value
      departureTime: {
        get() {
          return this.d;
        },
        set(newVal) {
          this.d = newVal;
        }
      },

      // date-picker value(s)
      dates: [moment().format('YYYY-MM-DD')]
    };
  },
  watch: {
    arrival: function(val) {
      this.updateActivityWith({ arrival: val });
    },
    departure: function(val) {
      this.updateActivityWith({ departure: val });
    }
  },

  methods: {
    updateActivityWith(payload) {
      console.log(
        `Updating activity ${this.member.lastActivity.id} with ${JSON.stringify(
          payload
        )}`
      );
      Activity.$update({
        where: this.member.lastActivity.id,
        data: payload
      }).then(activity => console.log('Updated activity', activity));
    }
  },

  async created() {
    this.loading = true;
    await Activity.$fetch();
    await Member.$fetch();
    this.member = Member.query()
      .with('activities.timeline')
      .first();
    let time = this.member.lastActivity
      ? this.member.lastActivity.arrivalTime.format('HH:mm')
      : moment()
          .add(30, 'minutes')
          .format('HH:mm');
    this.arrivalTime = time;
    console.log('arrivalDefault', this.arrivalTime);

    time = this.member.lastActivity
      ? this.member.lastActivity.departureTime.format('HH:mm')
      : moment().format('HH:mm');
    this.departureTime = time;
    console.log('arrivalDefault', this.departureDefault);

    console.info('Fetched member Last Activity:', this.member.lastActivity);
    this.loading = false;
  },

  mounted() {}
};
</script>
