<template>
  <div v-if="loading">
    <h2>Loading Active.vue...</h2>
  </div>
  <div v-else>
    <QuickStart
      v-if="showQuickStart"
      :showQuickStart="showQuickStart"
      @quick-start-pref-change="updateQuickStartPref"
    >
      <div slot="subheading">
        Welcome to your ACTIVITY page.
      </div>
      <div slot="goal">
        Use the following steps to complete the page:
      </div>
      <div slot="detail">
        <ol>
          <li>
            Enter your ORIGIN: this could be you leaving your "house"
          </li>
          <li>
            Enter your DESTINATION: where you intend to go. It could be the
            "grocery store" (or, for roundtrips, it's the same as ORIGIN)
          </li>
          <li>Enter your ACTIVITY: like "shopping"</li>
          <li>
            Enter how long you think it will take for you to get to your
            DESTINATION. This could be minutes or hours or both
          </li>
          <li>
            When you leave your ORIGIN, click on the DEPART button. When you
            arrive at the DESTINATION, click on the ARRIVE button. Should you
            need help or are lost, click on the HELP ME button; and it will
            connect you to our Emergency Operations Centre and someone you can
            trust.
          </li>
          <li>
            If you go over your estimated time the alarm will sound to prompt
            you. If you don't want that alarm, use the toggle button at the
            bottom of the page.
          </li>
          <li>
            Use the CANCEL button to disregard an activity.
          </li>
        </ol>
      </div>
    </QuickStart>
    <v-container class="purple lighten-5" fluid>
      <v-row>
        <v-col>
          <!-- Description Card-->
          <v-row no-gutters>
            <Description
              @entered-origin="handleOrigin"
              @entered-destination="handleDestination"
              @entered-description="handleDescription"
            />
          </v-row>

          <!-- Duration Card -->
          <v-row no-gutters>
            <Duration
              @started-activity="activityStarted"
              @stopped-activity="activityStopped"
              @expired-activity="activityExpired"
              @escalated-activity="activityEscalated"
            />
          </v-row>
        </v-col>
      </v-row>

      <!-- Timeline -->
      <v-row no-gutters
        ><v-col>
          <v-container class="pl-0 pr-5 pt-3 pb-0">
            <v-subheader>Your activity timeline:</v-subheader>
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
                    <h3 class="title">State is {{ item.title }}</h3>
                    <small> {{ item.text }}</small>
                  </v-card-title>

                  <v-card-title v-if="item.note" class="title pt-3 pb-3">
                    <h3 class="title">
                      NOTES
                    </h3>
                  </v-card-title>
                  <v-card-text v-if="item" class="white text--primary">
                    {{ item.updated }}
                  </v-card-text>
                  <v-card-text v-if="item.note" class="white text--primary">
                    <p class="pt-3 body-1 mb-0">
                      {{ item.note }}
                    </p>
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
            {{ summary }}
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment';
import Description from '@/components/Description';
import Duration from '@/components/Duration';
import QuickStart from '@/components/dialogs/QuickStart.Home.vue';

import Member from '@/models/Member';
import Activity from '@/models/Activity';
import Timeline from '@/models/Timeline';
import Preference from '@/models/Preference';
import DataRepository from '@/store/repository.js';

export default {
  components: {
    Description,
    Duration,
    QuickStart
  },

  computed: {
    members() {
      let m = Member.query()
        .with('preferences')
        .with('activities.timeline')
        .get();
      console.info('returning member', m);
      return m;
    },

    member() {
      return this.members[0];
    },

    showQuickStart() {
      return this.member.preferences.showQuickStarts;
    },
    perfID() {
      if (!this.member.preferences) {
        this.fixPrefs();
      }
      return this.member.preferences.id;
    },
    lastActivity() {
      const x = Activity.query()
        .with('timeline')
        .where('member_id', this.member.id)
        .orderBy('created')
        .last();
      console.info('ORDERED ACTIVITY', x);
      return x;
    },

    activeTimeline() {
      if (!this.lastTimeline) {
        return [];
      }
      let x = [];
      let late = 0;
      let lost = 0;
      this.lastTimeline.forEach(element => {
        let t = this.timelineKeys.get(element.state);
        x.push({
          title: element.state,
          text:
            element.state == 'ACTIVE'
              ? 'You started out'
              : element.state == 'UNKNOWN'
              ? "Don't know if you're safe"
              : element.state == 'ESCALATED'
              ? 'You need emegency help'
              : 'You closed your activity',
          updated: moment(element.updated).format(this.FULL_DATE),
          color: t.color,
          icon: t.icon
        });
        if (element.state == 'UNKNOWN') {
          late = moment(element.updated);
        }

        if (element.state == 'ESCALATED') {
          lost = moment(element.updated);
        }
        if (element.state == 'SAFE') {
          console.log('computing delinquencies');
          console.log('late', late);
          console.log('lost', lost);
          console.log('-------------------------------------');
          if (late) {
            this.late = moment.duration(this.arrived.diff(late)).humanize();
          }
          if (this.arrived && lost) {
            this.lost = moment.duration(this.arrived.diff(lost)).humanize();
          }
        }
      });
      console.log('\tAnnotated timeline', x);
      return x;
    },
    lastTimeline() {
      return this.lastActivity ? this.lastActivity.timeline : [];
    },
    payload() {
      return {
        origin: this.origin,
        destination: this.destination ? this.destination : this.origin,
        description: this.description,
        eta: moment()
          .add(this.duration, 'minutes')
          .toISOString(),
        created: new Date().toISOString(),
        member_id: this.member.id
      };
    },
    departed() {
      return this.lastTimeline.length > 0
        ? moment(this.lastTimeline[0].updated)
        : null;
    },

    arrived() {
      let x = this.lastTimeline
        ? this.lastTimeline.reduce((a, c) => {
            if (c.state === 'SAFE') {
              return c;
            }
          }, {})
        : null;
      console.info(x);
      return x ? moment(x.updated) : null;
    },

    summary() {
      if (this.arrived && this.departed) {
        let msg = `You were active for ${moment
          .duration(this.arrived.diff(this.departed))
          .humanize()}`;
        if (this.lost) {
          msg = `You were lost for ${this.lost}`;
        } else if (this.late) {
          msg = `You were late for ${this.late}`;
        }
        return msg;
      }
      return '';
    },

    now() {
      return moment().format(this.TIME);
    }
  },

  data() {
    return {
      late: 0,
      lost: 0,
      gone: 0,
      loading: false,
      origin: '',
      destination: '',
      description: '',
      sheet: false,
      showEscalationAlert: false,
      TIME: 'hh:mm a',
      FULL_DATE: 'ddd, MMM Do YYYY, hh:mm a',
      ampm: 'ampm',
      dates: [moment().format('YYYY-MM-DD')],

      thisTimeline: {
        id: '',
        activity: '',
        departedFrom: '',
        arrivedAt: '',
        departure: '',
        arrival: ''
      },
      timelineKeys: new Map([
        ['ACTIVE', { color: 'yellow darken-1', icon: 'mdi-door-open' }],
        ['SAFE', { color: 'green lighten-1', icon: 'mdi-gift' }],
        ['UNKNOWN', { color: 'orange lighten-1', icon: 'mdi-bell-alert' }],
        ['ESCALATED', { color: 'red lighten-1', icon: 'mdi-shield-alert' }]
      ]),
      departingAt: moment().format('HH:mm'),
      arrivingAt: moment()
        .add(30, 'minutes')
        .format('HH:mm'),

      test: {}
    };
  },

  methods: {
    fixPrefs() {
      Preference.fixQuickStart(this.member.id);
    },
    activityStarted() {
      console.info(this.now, 'Member expects to return by', this.payload.eta);
      this.createActivity();
      this.updateTimeline('ACTIVE');
    },

    activityStopped(source) {
      console.info(
        this.now,
        `Member ended ${source === 'rescued' ? 'Emergency' : 'Activity'}`
      );
      this.updateTimeline('SAFE');
    },
    activityExpired() {
      console.error(this.now, 'Member has not returned on time.');
      this.updateTimeline('UNKNOWN');
    },
    activityEscalated() {
      console.error(this.now, 'Activity escalated to first responders.');
      this.updateTimeline('ESCALATED');
    },

    handleOrigin(val) {
      this.origin = val;
    },
    handleDestination(val) {
      this.destination = val;
    },
    handleDescription(val) {
      console.info(val);
      this.description = val;
    },

    createActivity() {
      console.log('payload:', JSON.stringify(this.payload));
      Activity.$create({
        data: this.payload
      }).then(activity => {
        console.log('\tNew actvity:', activity);
        console.info('new lastActivity', this.lastActivity);
      });
    },
    updateTimeline(state) {
      Timeline.$update({
        data: {
          activity_id: this.lastActivity.id,
          state: state,
          updated: new Date().toISOString()
        }
      });
    },
    destroy() {
      console.log('\t|activities|', this.member.hasActivity === 1);
      Timeline.$delete(
        timeline => timeline.activity_id == this.member.lastActivity.id
      );
      Activity.$delete(this.member.lastActivity.id).then(() => {
        // reset the lastActivity
        console.log(this.member.lastActivity.id);
        console.log(this.member.lastActivity);
      });
    },

    hasStartedActivity() {
      let timeline = Member.query()
        .has('activities.timeline')
        .get();
      return timeline.length ? true : false;
    },

    async updateQuickStartPref(showQuickStart) {
      // to get new data to localForage, you must use the $create() method (not create())
      // and you must wrap the updated fields with the  data:{} object
      const perfs = await Preference.$update({
        where: this.perfID,
        data: {
          // databaseName: '',
          showQuickStarts: showQuickStart
          // showHelpIcons: '',
        }
      });
      console.log('updated perfs:', perfs);
    }
  },
  async created() {
    this.loading = true;
    console.log(this.now, 'Entering Active.vue created()...');
    await DataRepository.getMember();
    await Preference.$fetch();
    await Activity.$fetch();
    await Timeline.$fetch();
    this.loading = false;

    console.info(this.now, '\tFinished Loading');
    console.info(this.now, '\tMember', this.member.id);
    console.info(this.now, '\tPreference', this.perfID);
    console.info(this.now, '\tlastActivity', this.lastActivity);
    console.info(this.now, '\tlast timeline', this.lastTimeline);
    console.info(this.now, '...Leaving Active.vue created()\n');
    console.info('');
  },

  mounted() {}
};
</script>

<style scoped>
#styled-input {
  height: 40px;
  font-size: 20pt;
}
.styled-input label[for] {
  height: 40px;
  font-size: 20pt;
}
</style>
