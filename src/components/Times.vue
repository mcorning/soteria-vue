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
          <v-date-picker full-width v-model="datePart"></v-date-picker>

          <v-text-field
            class=" sm-12 pt-7"
            label="Date range"
            readonly
            hint="Round trips: Toggle date.  Multiday excursions: toggle two dates"
            persistent-hint
            v-model="dateRangeText"
          ></v-text-field
        ></v-col>

        <!-- Arrival column -->
        <v-col cols="12" sm="4">
          <h3>Choose an Arrival Time:</h3>
          <div>
            <v-time-picker
              scrollable
              :ampm-in-title="!h24"
              v-model="timePart"
            ></v-time-picker>

            <v-text-field
              label="Estimated Time of Arrival"
              readonly
              hint="Change time with mouse or scroll"
              persistent-hint
              v-model="eta"
            ></v-text-field>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <!-- This Activity Timeline -->
        <Timelines :member="member" />
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment';
import Member from '@/models/Member';

// needed to fetch to get a non-null member.lastActivity.eta reference
import Activity from '@/models/Activity';

// components
import Timelines from '@/components/Timeline';

export default {
  components: {
    Timelines
  },

  computed: {
    eta() {
      let x = moment(new Date(`${this.datePart}T${this.timePart}`)).format(
        this.FULL_DATE
      );
      console.log('ETA', x);
      return x;
    },

    h24() {
      return false;
    },
    dateRangeText() {
      // this version limits to single day activity
      // return this.dates.join(' - ');
      return moment(this.datePart).format(this.SHORT_DATE);
    }
  },

  data() {
    return {
      range: false,
      dep: '',
      loading: false,
      isMounted: false,
      SHORT_DATE: 'ddd, MMM Do YYYY',
      FULL_DATE: 'ddd, MMM Do YYYY, hh:mm a',
      datePart: '',
      timePart: '',
      dates: [moment().format('YYYY-MM-DD')]
    };
  },

  filters: {
    eta: function(value) {
      return moment(this.datePart, ' ', value).format();
    }
  },

  // dates must be ISO formatted
  watch: {
    datePart: function(val) {
      this.updateState(new Date(`${val}T${this.timePart}`));
    },
    timePart: function(val) {
      this.updateState(new Date(`${this.datePart}T${val}`));
    }
  },

  methods: {
    updateState(val) {
      console.assert(this.isValidDate(val), val + ' is not a valid date');
      this.$store.state.eta = val.toISOString();
    },
    isValidDate(d) {
      return d instanceof Date && !isNaN(d);
    },

    async updateActivityWith(payload) {
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
  },

  async mounted() {
    // check and see if lastActivity is still active.
    // if not, use the timeline duration for default
    // arrival time (assuming new activity starts now)

    this.member = Member.query()
      .with('activities.timeline')
      .first();
    if (!this.member.lastActivity.eta) {
      await this.updateActivityWith({
        eta: moment()
          .add(30, 'minutes')
          .toISOString()
      });
    }
    let eta = moment(this.member.lastActivity.eta);
    console.log('Member default eta', eta);

    this.datePart = eta.format('YYYY-MM-DD');
    console.log('eta datePart', this.datePart);

    this.timePart = eta.format('hh:mm');
    console.log('eta timePart', this.timePart);

    console.info('Fetched member Last Activity:', this.member.lastActivity);

    this.loading = false;
  }
};
</script>
