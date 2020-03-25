<template>
  <div>
    <div v-if="loading">
      <H2>Loading Activity.vue...</H2>
    </div>

    <v-container v-else class="purple lighten-5">
      <!-- DateTime Section -->
      <v-row>
        <!-- Date column -->
        <!-- <v-col style="width: 400px; flex: 0 1 auto;" class="md-12"> -->
        <v-col cols="12" sm="4">
          <h3>Choose your activity's starting date</h3>

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
          <h3>Estimate your Time of Arrival:</h3>
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
    now() {
      return moment().format(this.TIME);
    },

    eta() {
      let m = moment(`${this.datePart} ${this.timePart}`, this.CUSTOM_DATE);
      console.log('\tETA', m);
      return m.format(this.FULL_DATE);
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
      TIME: 'hh:mm A',
      DATE_PART: 'YYYY-MM-DD',
      TIME_PART: 'HH:mm',
      SHORT_DATE: 'ddd, MMM Do YYYY',
      FULL_DATE: 'ddd, MMM Do YYYY, hh:mm a',
      CUSTOM_DATE: 'YYYY-MM-DD hh:mm A',
      datePart: moment().format(this.SHORT_DATE),
      timePart: moment().format(this.TIME)
    };
  },

  filters: {},

  watch: {
    datePart: function(val) {
      this.updateState(moment(`${val} ${this.timePart}`, this.CUSTOM_DATE));
    },
    timePart: function(val) {
      this.updateState(moment(`${this.datePart} ${val}`, this.CUSTOM_DATE));
    }
  },

  methods: {
    print(msg, val) {
      console.log('\t', this.now, msg, val, '\n');
    },
    updateState(val) {
      this.$store.state.eta = val.toISOString();
    },

    async updateActivityWith(payload) {
      console.log(
        `\tUpdating activity ${
          this.member.lastActivity.id
        } with ${JSON.stringify(payload)}`
      );
      console.log('\tOld this.lastActivity', this.lastActivity);
      let la = await Activity.$update({
        where: this.member.lastActivity.id,
        data: payload
      });
      console.log('\tNew this.lastActivity', la);
      this.lastActivity = la;
    },

    async setup(eta) {
      let etaM = eta ? moment(eta) : moment().add(30, 'minutes');
      console.log('\tMember default eta', etaM);

      this.datePart = etaM.format(this.DATE_PART);
      console.log('\teta datePart', this.datePart);

      this.timePart = etaM.format(this.TIME_PART);
      console.log('\teta timePart', this.timePart);

      console.info('\tFetched member Last Activity:', etaM);
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
    console.log(this.now, '\nEntering Times.vue mounted...');
    this.member = Member.query()
      .with('activities.timeline')
      .first();
    console.log('\tthis.member', this.member);
    if (this.member.lastActivity.eta) {
      this.print('this.member.lastActivity.eta', this.member.lastActivity.eta);
    } else {
      await this.updateActivityWith({
        eta: moment()
          .add(30, 'minutes')
          .toISOString()
      });
    }
    this.lastActivity = this.member.lastActivity;
    this.setup(this.member.lastActivity.eta);
    console.log(this.now, '...Leaving Times.vue mounted\n');
    console.log('.');
    this.loading = false;
  }
};
</script>
