<template>
  <div v-if="loading">
    <h2>Loading...</h2>
  </div>
  <v-row v-else>
    <v-col>
      <v-btn @click="pause" style="display:none">Pause</v-btn>
      <Countdown :member="member" @timeline-add="addTimeline" />
    </v-col>
    <v-col>
      <v-container>
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
      </v-container>
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
    heading: { type: String },
    arrival: { type: String }
  },

  computed: {
    now() {
      return moment().format(this.TIME);
    },
    getMe() {
      console.log(this.me);
      return this.me;
    },

    activeTimeline() {
      console.log('\tmember id', this.member.id);
      console.log('\tactivity id', this.member.lastActivity.id);

      let tl = Timeline.query()
        .where('activity_id', this.member.lastActivity.id)
        .get();
      console.log('\tactivity timelines', tl);
      console.log('\tthis.lastActivity', this.member.lastActivity);
      let x = [];
      // this.member.lastActivity.timeline.forEach(element => {
      tl.forEach(element => {
        let t = this.timelineKeys.get(element.state);
        x.push({
          title: element.state,
          updated: element.updated,
          color: t.color,
          icon: t.icon
        });
      });
      console.log('\tAnnotated timeline', x);
      return x;
    },

    departingFrom() {
      return this.member.lastActivity.departFrom;
    },
    arrivingAt() {
      return this.member.lastActivity.arriveAt;
    },

    // strings used in Text-Field above
    departing() {
      return this.member.lastActivity.departure;
    },

    description() {
      return this.member.lastActivity.description;
    },

    // helpers
    formatDate(value) {
      return value ? moment(value).format(this.FULL_DATE) : '';
    },
    getDuration() {
      let eta = moment.duration(
        moment(this.arrival).diff(moment(this.departing))
      );
      let ata = moment.duration(
        moment(this.getReturned ? this.getReturned : moment()).diff(
          moment(this.departing)
        )
      );
      let late = moment
        .duration(
          moment(this.getReturned ? this.getReturned : moment()).diff(
            moment(this.arrival)
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

  data() {
    return {
      disablePause: true,
      timeline: [],
      lastActivity: {},
      loading: false,
      TIME: 'hh:mm A',

      FULL_DATE: 'hh:mm A MM/DD/YYYY',

      timelineKeys: new Map([
        ['ACTIVE', { color: 'yellow darken-1', icon: 'mdi-door-open' }],
        ['SAFE', { color: 'green lighten-1', icon: 'mdi-gift' }],
        ['UNKNOWN', { color: 'orange lighten-1', icon: 'mdi-bell-alert' }],
        ['ESCALATED', { color: 'red lighten-1', icon: 'mdi-shield-alert' }]
      ])
    };
  },

  methods: {
    pause() {
      console.log('\tarrival', moment(this.arrival));
    },

    recordArrival() {
      this.updateActivityWith({
        eta: moment().toISOString()
      });
    },

    async addTimeline(status) {
      let timeline = await Timeline.$create({
        data: {
          activity_id: this.member.lastActivity.id,
          state: status,
          updated: new Date().toISOString() // error thrown when using moment(). why?
        }
      }).catch(e => console.log(this.now, 'Error adding timeline', e));
      if (timeline) {
        this.timeline = timeline;
        console.log('\t', this.now, 'new timeline', timeline);
        if (status === 'SAFE') {
          this.addActivity();
          console.log(
            '\t',
            this.now,
            'new activity ID',
            this.member.lastActivity.id
          );
        }
      }
    },

    updateTimeline(status) {
      console.log('\tAdding timeline with...');
      let event = 'update-arrival';
      this.addTimeline(status);
      // this should run after the create mutation
      console.log('\t\tDEBUG: timeline', this.member.lastActivity.timeline);

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
      console.log('\tCountdown.vue.updateTimeline: emitting event', event);
      this.$emit(event);
    },

    addActivity() {
      Activity.$create({
        data: {
          member_id: this.member.id,
          description: this.description,
          eta: ''
        }
      }).then(activity => (this.lastActivity = activity));
    },

    updateActivityWith(payload) {
      console.log(
        `'\tUpdating activity ${
          this.member.lastActivity.id
        } with ${JSON.stringify(payload)}`
      );
      Activity.$update({
        where: this.member.lastActivity.id,
        data: payload
      }).then(activity => (this.lastActivity = activity));
    }
  },

  watch: {},

  async created() {},
  mounted() {
    console.log(this.now, '\nEntering Timeline.vue mounted...');
    console.log('\tMounted: Member passed in from parent', this.member);
    console.log('\tMounted: arrival', this.arrival);
    console.log(this.now, '...Leaving Timeline.vue mounted\n');
  }
};
</script>
