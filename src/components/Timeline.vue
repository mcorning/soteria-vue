<template>
  <div v-if="loading">
    <h2>Loading...</h2>
  </div>
  <v-row v-else>
    <v-col>
      <Countdown
        :member="member"
        @timeline-add="addTimeline"
        @activity-add="addActivity"
        @update-departure="recordDeparture"
        @update-arrival="recordArrival"
      />
    </v-col>
    <v-col>
      <v-card>
        <v-card-title>
          <h3>{{ heading }}<br />{{ description }}</h3>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-text-field
              class="pa-2"
              width="10"
              readonly
              label="Departed From"
              v-model="departingFrom"
            ></v-text-field>

            <v-text-field
              class="pa-2"
              width="10"
              readonly
              label="Scheduled Departure"
              v-model="departure"
            ></v-text-field>

            <v-text-field
              class="pa-2"
              width="5"
              readonly
              label="Arrived At"
              v-model="arrivingAt"
            ></v-text-field>

            <v-text-field
              class="pa-2"
              width="5"
              readonly
              label="Scheduled Arrival"
              v-model="arrival"
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
            <v-card :color="item.color" dark>
              <v-card-title v-if="item.title" class="title pt-3 pb-3">
                <h3 class="title">
                  {{ `${item.title}` }}
                </h3>
              </v-card-title>

              <v-card-title v-if="item.note" class="title pt-3 pb-3">
                <h3 class="title">
                  NOTES
                </h3>
              </v-card-title>
              <v-card-text v-if="item" class="white text--primary">
                <!-- <p class="pt-3 body-1 mb-0"> -->
                {{ item.title }} at {{ item.updated }}
                <!-- </p> -->
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
    </v-col>
  </v-row>
</template>

<script>
import moment from 'moment';
import Countdown from './Countdown';

// import Member from '@/models/Member';
import Activity from '@/models/Activity';
import Timeline from '@/models/Timeline';

export default {
  name: 'EventTimeline',
  components: {
    Countdown
  },

  props: {
    member: { type: Object },
    heading: { type: String }
  },

  data() {
    return {
      timeline: [],
      lastActivity: {},
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
    getMe() {
      console.log(this.me);
      return this.me;
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

    departingFrom() {
      return this.activity.departFrom;
    },
    arrivingAt() {
      return this.activity.arriveAt;
    },
    // strings used in Text-Field above
    departing() {
      return this.activity.departure;
    },
    arriving() {
      return this.activity.arrival;
    },
    description() {
      return this.activity.description;
    },

    // dates passes as props
    departure() {
      return new Date(this.activity.departure);
    },
    arrival() {
      return new Date(this.activity.arrival);
    },

    // helpers
    formatDate(value) {
      return value ? moment(value).format(this.FULL_DATE) : '';
    },
    getDuration() {
      let eta = moment.duration(
        moment(new Date(this.arrival)).diff(moment(new Date(this.departure)))
      );
      let ata = moment.duration(
        moment(this.getReturned ? this.getReturned : new Date()).diff(
          moment(new Date(this.departure))
        )
      );
      let late = moment
        .duration(
          moment(this.getReturned ? this.getReturned : new Date()).diff(
            moment(new Date(this.arrival))
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
  methods: {
    recordDeparture() {
      this.updateActivityWith({ departure: new Date() });
    },
    recordArrival() {
      this.updateActivityWith({ arrival: new Date() });
    },

    addTimeline(status) {
      Timeline.$create({
        data: {
          activity_id: this.member.lastActivity.id,
          state: status,
          updated: new Date()
        }
      }).then(timeline => (this.timeline = timeline));
    },
    updateTimeline(status) {
      console.log('Adding timeline with...');
      let event = 'update-arrival';
      this.addTimeline(status);
      // this should run after the create mutation
      console.log('DEBUG: timeline', this.member.lastActivity.timeline);

      switch (status) {
        case 'SAFE':
          this.$emit('activity-add');
          break;
        case 'EXPIRED':
          this.sheet = true;
          break;
        case 'ESCALATED':
          // this is where we notify safety team and/or sovrinSecours server
          this.showEscalationAlert = true;
          this.sheet = !this.showEscalationAlert;
          break;
        default:
          event = 'update-departure';
      }
      console.log('Countdown.vue.updateTimeline: emitting event', event);
      this.$emit(event);
    },
    addActivity() {
      Activity.$create({
        data: {
          member_id: this.member.id,
          description: this.description,
          updated: new Date()
        }
      }).then(activity => (this.activity = activity));
    },

    updateActivityWith(payload) {
      console.log(
        `Updating activity ${this.member.lastActivity.id} with ${JSON.stringify(
          payload
        )}`
      );
      Activity.$update({
        where: this.member.lastActivity.id,
        data: payload
      }).then(activity => (this.activity = activity));
    }
  },

  async created() {
    console.log('Member passed in from parent', this.member);
  },
  mounted() {}
};
</script>
