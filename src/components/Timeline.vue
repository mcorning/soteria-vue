<template>
  <v-card>
    <v-card-title>
      <v-row>
        <v-col cols="12" class="pt-0 pb-0">
          <h3>{{ heading }}<br />{{ getActivity }}</h3>
        </v-col>
      </v-row>
    </v-card-title>
    <!-- <v-card-text>
      <v-row>
        <v-text-field
          class="pa-2"
          width="10"
          readonly
          label="Departed From"
          v-model="getDepartingFrom"
        ></v-text-field>

        <v-text-field
          class="pa-2"
          width="10"
          readonly
          label="Scheduled Departure"
          v-model="departing"
        ></v-text-field>

        <v-text-field
          class="pa-2"
          width="5"
          readonly
          label="Arrived At"
          v-model="getArrivingAt"
        ></v-text-field>

        <v-text-field
          class="pa-2"
          width="5"
          readonly
          label="Scheduled Arrival"
          v-model="arriving"
        ></v-text-field>
      </v-row>
    </v-card-text> -->

    <v-timeline align-top :dense="true">
      <v-timeline-item v-for="(item, i) in activeTimeline" :key="i" fill-dot>
        <!-- <v-card :color="item.color" dark> -->
        <v-card dark>
          <!-- <v-card-title v-if="item.title" class="title pt-3 pb-3">
            <h3 class="title">
              {{ `${item.title}: at ${formatDate(item.updated)}` }}
            </h3>
          </v-card-title> -->
          <!-- <v-card-title v-if="item.note" class="title pt-3 pb-3">
            <h3 class="title">
              NOTES
            </h3>
          </v-card-title> -->
          <v-card-text v-if="item" class="white text--primary">
            <!-- <pre>{{ formatTimeline(item.state) }}</pre> -->
            <pre>state {{ item.state }}</pre>
            <p class="pt-3 body-1 mb-0">
              {{ item.state }} at {{ item.updated }}
            </p>
          </v-card-text>
          <!-- <v-card-text v-if="item.note" class="white text--primary">
            <p class="pt-3 body-1 mb-0">
              {{ item.note }}
            </p>
          </v-card-text> -->
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-card>
</template>

<script>
import moment from 'moment';
// import L from '@/logger';

export default {
  name: 'EventTimeline',

  props: {
    heading: { type: String },
    activity: { type: Object }
  },

  data() {
    return {
      FULL_DATE: 'hh:mm A MM/DD/YYYY',
      memberID: ''
    };
  },
  computed: {
    activeTimeline() {
      return this.activity ? this.activity.timeline : [];
    },

    getDepartingFrom() {
      return this.memberActivities
        ? this.memberActivities.departFrom
        : 'loading timeline';
    },
    getArrivingAt() {
      return this.activity ? this.activity.arriveAt : 'loading timeline';
    },
    departing() {
      return this.activity ? this.activity.getDeparture : 'loading timeline';
    },
    arriving() {
      return this.activity ? this.activity.getArrival : 'loading timeline';
    },
    getActivity() {
      return this.activity ? this.activity.description : '';
    },
    getDeparture() {
      return this.activity ? this.activity.departure : 'loading timeline';
    },
    getArrival() {
      return this.activity ? this.activity.arrival : 'loading timeline';
    }
  },
  methods: {
    formatDate(value) {
      return value ? moment(value).format(this.FULL_DATE) : '';
    },
    getDuration() {
      let eta = moment.duration(
        moment(new Date(this.getArrival)).diff(
          moment(new Date(this.getDeparture))
        )
      );
      let ata = moment.duration(
        moment(this.getReturned ? this.getReturned : new Date()).diff(
          moment(new Date(this.getDeparture))
        )
      );
      let late = moment
        .duration(
          moment(this.getReturned ? this.getReturned : new Date()).diff(
            moment(new Date(this.getArrival))
          )
        )
        .asMinutes();
      let et =
        late === 0
          ? `${eta.humanize()} (0 minutes late)` // what about being early?
          : `${ata.humanize()} (${late.toFixed(1)} minutes late)`;
      return et;
    }
  },
  mounted() {}
};
</script>
