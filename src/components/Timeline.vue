<template>
  <div v-if="loading">
    <h2>Loading...</h2>
  </div>
  <div v-else>
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="12" class="pt-0 pb-0">
            <h3>{{ heading }}<br />{{ getActivity }}</h3>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
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
      </v-card-text>

      <v-timeline align-top :dense="true">
        <v-timeline-item
          v-for="(item, i) in activeTimeline"
          :key="i"
          fill-dot
          :icon="item.icon"
          :color="item.color"
        >
          <!-- <v-card :color="getColor(item)" dark> -->
          <v-card :color="item.color" dark>
            <v-card-title v-if="item.title" class="title pt-3 pb-3">
              <h3 class="title">
                {{ `${item.title}: at ${item.updated}` }}
              </h3>
            </v-card-title>

            <v-card-title v-if="item.note" class="title pt-3 pb-3">
              <h3 class="title">
                NOTES
              </h3>
            </v-card-title>
            <v-card-text v-if="item" class="white text--primary">
              <!-- 

              <pre>{{ formatTimeline(item.state) }}</pre>
            <pre>state {{ item.state }}</pre> -->
              <p class="pt-3 body-1 mb-0">
                {{ item.state }} at {{ item.updated }}
              </p>
            </v-card-text>
            <v-card-text v-if="item.note" class="white text--primary">
              <p class="pt-3 body-1 mb-0">
                {{ item.note }}
              </p>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-card>
  </div>
</template>

<script>
import moment from 'moment';
// import Member from '@/models/Member';
// import Activity from '@/models/Activity';
// import L from '@/logger';

export default {
  name: 'EventTimeline',

  props: {
    memberProp: { type: Object },
    heading: { type: String }
  },

  data() {
    return {
      loading: false,
      FULL_DATE: 'hh:mm A MM/DD/YYYY',

      timelineKeys: new Map([
        ['ACTIVE', { color: 'yellow darken-1', icon: 'mdi-door-open' }],
        ['SAFE', { color: 'green lighten-1', icon: 'mdi-gift' }],
        ['UNKNOWN', { color: 'orange lighten-1', icon: 'mdi-bell-alert' }],
        ['ESCALATED', { color: 'red lighten-1', icon: 'mdi-shield-alert' }]
      ])
    };
  },
  computed: {
    member() {
      return this.memberProp;
    },

    activity() {
      return this.member.lastActivity;
    },
    activeTimeline() {
      console.log('this.activity', this.activity);
      let x = [];
      this.activity.timeline.forEach(element => {
        let t = this.timelineKeys.get(element.state);
        x.push({
          title: element.state,
          updated: element.updated,
          color: t.color,
          icon: t.icon
        });
      });
      console.log('annotated timeline', x);
      return x;
    },

    getDepartingFrom() {
      return this.activity.departFrom;
    },
    getArrivingAt() {
      return this.activity.arriveAt;
    },
    departing() {
      return this.activity.getDeparture;
    },
    arriving() {
      return this.activity.getArrival;
    },
    getActivity() {
      return this.activity.description;
    },
    getDeparture() {
      return this.activity.departure;
    },
    getArrival() {
      return this.activity.arrival;
    },
    // },
    // methods: {
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
  async created() {
    // this.loading = true;
    // await Activity.$fetch();
    // await Member.$fetch();
    // let m = Member.query()
    //   .with('activities')
    //   .first();
    // console.info('\tMember for timeline:', m);
    // this.member = m;
    // this.loading = false;
  },
  mounted() {
    console.log('Timeline mounted');
  }
};
</script>
