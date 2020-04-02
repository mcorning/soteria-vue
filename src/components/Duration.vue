<template>
  <div>
    <v-container>
      <v-row align="center" justify="center" class="pb-0">
        <v-col class="pb-0"
          ><h4 class="pb-0">
            How long will you be gone for?
          </h4></v-col
        >

        <!-- Snackbar here -->
        <v-col cols="1" class="pb-0">
          <div class="text-center">
            <v-btn color="primary" fab x-small dark @click="snackbar = true">
              <v-icon>mdi-help</v-icon>
            </v-btn>
            <v-snackbar
              v-model="snackbar"
              bottom
              color="secondary"
              :timeout="timeoutPref"
              :multi-line="multiLine"
            >
              Use the slider(s) to set the minutes and hours you expect to be
              gone for.
              <v-btn
                text
                dark
                elevation="4"
                color="white"
                @click="snackbar = false"
              >
                Close
              </v-btn>
            </v-snackbar>
          </div>
        </v-col>
      </v-row>

      <!-- Feedback -->
      <v-row
        align="center"
        justify="center"
        class="font-weight-light caption pt-0 pb-4"
      >
        <v-col cols="8">
          <v-text-field
            v-model="eta"
            hide-details
            readonly
            class="font-weight-light caption"
            label="Expected Time of Arrival"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-text-field
            :value="durationHumanized"
            hide-details
            readonly
            class="font-weight-light caption"
            label="Duration"
          ></v-text-field>
          <!-- Duration: <br />{{ durationHumanized }}  -->
        </v-col>
      </v-row>

      <!-- Sliders -->
      <v-row align="center" justify="center">
        <v-col>
          <v-slider
            v-model="minutes"
            value="1"
            label="Minutes:"
            thumb-label="always"
            :thumb-size="18"
            min="0"
            max="60"
            step="15"
            ticks="always"
            tick-size="4"
            :tick-labels="ticksLabels"
          >
          </v-slider> </v-col
      ></v-row>
      <v-row>
        <v-col>
          <v-slider
            hide-details
            v-model="hours"
            label="Hours:"
            thumb-label="always"
            :thumb-size="18"
            min="0"
            step="1"
            ticks="always"
            :max="23"
          >
          </v-slider>
        </v-col>
      </v-row>

      <!-- Feedback -->
      <v-row align="center" justify="center" class="font-weight-light caption">
        <v-col v-if="late"> Late: {{ spentHumanized }} </v-col>
        <v-col v-else> Active: {{ spentHumanized }} </v-col>
      </v-row>

      <!-- Feedback -->
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-row align="center" justify="center">
            <v-btn-toggle v-model="toggle_exclusive" mandatory rounded>
              <v-btn
                color="yellow"
                darken-1
                :running="true"
                :disabled="running"
                @click="depart"
              >
                <span>Depart</span>
                <v-icon>mdi-door-open</v-icon>
              </v-btn>
              <v-btn color="green" lighten-1 :running="arrive" @click="arrive">
                <span>Arrive</span>
                <v-icon>mdi-door-closed</v-icon>
              </v-btn>
              <v-btn color="red" lighten-1 @click="emergency">
                <span>Help Me</span>
                <v-icon>mdi-shield-alert</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-row>

          <v-spacer></v-spacer>
          <v-row align="center" justify="center">
            <v-progress-circular
              v-if="active"
              :rotate="-90"
              :size="100"
              :width="15"
              :value="timeUsed"
              color="primary"
              >{{ timeUsed }}%
            </v-progress-circular>

            <v-alert
              :value="late"
              color="pink"
              dark
              border="top"
              icon="mdi-shield-alert"
              prominent
              transition="scale-transition"
            >
              <p>
                Your activity has expired. Unless you close it shortly, I am
                going to notify your safety team.
              </p>
              Delinquent: {{ spent / 1000 }}
            </v-alert>
            <v-alert prominent type="error" :value="escalated">
              <v-row align="center">
                <v-col class="grow">
                  <p>
                    Secours escalated your activity.
                  </p>
                  <p>
                    Once you are safe, hit the I am safe button to regain
                    control of the app.
                  </p>
                </v-col>
                <v-col class="shrink">
                  <v-btn @click="standDown">I am safe</v-btn>
                </v-col>
              </v-row>
            </v-alert>
          </v-row>
          <v-spacer></v-spacer>
          <!-- help Cancel help -->
          <v-row align="center" justify="center" no-gutters="">
            <v-col cols="3">
              <div class="text-center">
                <v-btn
                  color="primary"
                  fab
                  x-small
                  dark
                  @click="snackbar2 = true"
                >
                  <v-icon>mdi-help</v-icon>
                </v-btn>
                <v-snackbar
                  v-model="snackbar2"
                  bottom
                  color="secondary"
                  :timeout="timeoutPref"
                  :multi-line="multiLine"
                >
                  Start your activity with Depart button. A timer will begin. To
                  stop the timer and end your actvity, hit the Arrive buttton.
                  <v-btn
                    text
                    dark
                    elevation="4"
                    color="white"
                    @click="snackbar2 = false"
                  >
                    Close
                  </v-btn>
                </v-snackbar>
              </div>
            </v-col>
            <v-col>
              <v-btn class="pl-10">
                <span class="pr-2" @click="cancel"> Cancel</span>
                <v-icon>mdi-bell-alert</v-icon>
              </v-btn></v-col
            >

            <v-col cols="3">
              <div class="text-center">
                <v-btn
                  color="primary"
                  fab
                  x-small
                  dark
                  @click="snackbar3 = true"
                >
                  <v-icon>mdi-help</v-icon>
                </v-btn>
                <v-snackbar
                  v-model="snackbar3"
                  bottom
                  color="secondary"
                  :timeout="timeoutPref"
                  :multi-line="multiLine"
                >
                  Help Me button will connect you to our Secours Emergency
                  Operations Centre and someone you trust.
                  <v-btn
                    text
                    dark
                    elevation="4"
                    color="white"
                    @click="snackbar3 = false"
                  >
                    Close
                  </v-btn>
                </v-snackbar>
              </div>
            </v-col>
          </v-row>
          <v-row align="center" justify="center" no-gutters>
            <v-col cols="4"></v-col>
            <v-col cols="6">
              <v-checkbox
                v-model="mute"
                dense
                id="muted"
                :label="alarmOrClock"
                on-icon="mdi-clock"
                off-icon="mdi-alarm"
                class="checkbox"
                :hint="alarmOrClockHint"
                persistent-hint
              ></v-checkbox
            ></v-col>
            <v-col cols="2"></v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment';
// import DurationHelp from '@/components/snackbars/DurationHelp.vue';
import { AudioPlayer } from './lib/audio.js';

export default {
  components: {
    // DurationHelp
  },
  data() {
    return {
      ticksLabels: ['01', ' 15', '30', '45', '60'],
      active: false,
      late: false,
      escalated: false,
      loading: true,
      runner: undefined,
      running: false,
      wait: 1,

      snackbar: false,
      snackbar2: false,
      snackbar3: false,
      multiLine: true,
      durationHelpText: '',
      timeoutPref: 10000,
      audio: null,
      mute: false,

      minutes: 1,
      hours: 0,
      days: 0,
      startTime: '',
      endTime: '',
      toggle_exclusive: undefined,
      spent: 0,
      intervals: [],
      timeouts: [],
      FULL_DATE: 'ddd, MMM Do YYYY, hh:mm a'
    };
  },
  watch: {
    runner() {
      if (this.runner == null) {
        return;
      }
      console.log('loading', this.loading);
      const l = this.runner;
      this[l] = !this[l];
      console.log(this.now, 'runner:', l, 'status', this[l]);
      this.active = true;
      let my = this;
      this.timeouts.push(
        setTimeout(function() {
          console.log(moment().format('hh:mm'), 'activity expired');
          my.active = false;
          my.late = true;
          my.spent = 0;
          my.expired();
        }, this.duration)
      );

      this.startCountdown();

      this.runner = null;
    }
  },
  computed: {
    alarmOrClockHint() {
      return this.mute ? 'Click to hear alarm' : 'Click to mute alarm';
    },
    alarmOrClock() {
      return this.mute ? 'Clock' : 'Alarm';
    },
    eta() {
      return moment()
        .add(this.hours, 'hours')
        .add(this.minutes, 'minutes')
        .format(this.FULL_DATE);
    },
    timeUsed() {
      return (100 - 100 * (this.spent / this.duration)).toFixed(0);
    },

    now() {
      let m = moment().format('hh:mm');
      return m;
    },

    durationHumanized() {
      let x = moment.duration(this.duration).humanize();
      return x;
    },

    spentHumanized() {
      // late resets spent to 0
      return moment.duration(this.spent).humanize();
    },

    duration() {
      let milliSecondsInMinutes = this.minutes * 60000;
      let milliSecondsInHours = this.hours * 3600000;
      let milliSecondsInDays = this.days * 86400000;
      return milliSecondsInMinutes + milliSecondsInHours + milliSecondsInDays;
    }
  },
  methods: {
    expired() {
      console.log('Is member late?', this.late);
      this.stopCountdowns();
      this.spent = 0;
      AudioPlayer.playAlarm(this.mute, this.audio);

      this.startCountdown();
    },

    standDown() {
      // this is where we de-notify safety team and/or sovrinSecours server
      this.escalated = false;
    },

    emergency() {
      this.escalated = true;
    },

    depart() {
      this.$emit('started-activity', this.duration);
      this.startTime = moment();
      this.endTime = this.startTime.add(this.duration);
      this.spent = 0;
      this.runner = 'running';
      console.log(this.runner);
    },

    cancel() {
      this.spent = 0;
      this.running = false;
      this.escalated = false;
      this.stopCountdowns();

      console.log('Disregarding activity');
    },

    arrive() {
      this.spent = 0;
      this.running = false;
      this.active = false;
      this.late = false;
      this.escalated = false;

      this.stopCountdowns();
      console.log('Stopping');
    },

    startCountdown() {
      let my = this;
      let wait = this.wait * 1000;
      this.intervals.push(
        setInterval(function() {
          my.spent = my.spent + wait;
        }, wait)
      );
    },

    stopCountdowns() {
      AudioPlayer.stopAlarm(this.audio);

      this.intervals.forEach(interval => {
        console.log('interval ID:', interval);
        clearInterval(interval);
      });
      this.intervals = [];

      this.timeouts.forEach(timeout => {
        console.log('timeout ID:', timeout);
        clearInterval(timeout);
      });
      this.timeouts = [];
    }
  },

  mounted() {
    this.loading = false;
    if (!this.mute) this.audio = AudioPlayer.createAudio();
    console.log('Timer mounted');
  },

  beforeDestroy() {
    console.log(this.now, 'Before closing page, will stop remaining timeouts');
    this.stopCountdowns();
  }
};
</script>

<style scoped>
.checkbox {
  color: white;
}
</style>
