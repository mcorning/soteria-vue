<template>
  <div>
    <v-container fluid>
      <v-row align="center" justify="center">
        <v-col cols="9">
          How long will you be active?
        </v-col>
        <v-col cols="3">
          <div class="text-center">
            <v-btn color="primary" fab x-small dark @click="snackbar = true">
              <v-icon>mdi-help</v-icon>
            </v-btn>
            <v-snackbar
              v-model="snackbar"
              top
              color="secondary"
              :timeout="timeoutPref"
              :multi-line="multiLine"
            >
              {{ durationHelpText }}
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
      <v-row align="center" justify="center">
        <!-- Sliders -->
        <v-col cols="6">
          <v-slider
            v-model="minutes"
            label="Minutes:"
            thumb-label="always"
            :thumb-size="18"
            min="0"
            :max="60"
          >
          </v-slider>
        </v-col>
        <v-col cols="6">
          <v-slider
            v-model="hours"
            label="Hours:"
            thumb-label="always"
            :thumb-size="18"
            min="0"
            :max="23"
          >
          </v-slider>
        </v-col>
        <!-- should this be its own row? -->
        <v-col> Duration: {{ durationHumanized }} </v-col>
        <v-col>
          {{ late ? 'Late' : 'Active' }}: {{ spent / 1000 }} seconds
        </v-col>
        <v-col cols="12">
          <v-row align="center" justify="center">
            <v-btn-toggle v-model="toggle_exclusive" mandatory rounded>
              <v-btn
                color="yellow"
                class="pl-3"
                darken-1
                :running="true"
                :disabled="running"
                @click="depart"
              >
                <span class="pr-3">Depart</span>
                <v-icon>mdi-door-open</v-icon>
              </v-btn>
              <v-btn
                color="green"
                lighten-1
                class="pl-3"
                :running="arrive"
                @click="arrive"
              >
                <span class="pr-3">Arrive</span>
                <v-icon>mdi-door-closed</v-icon>
              </v-btn>
              <v-btn color="red" lighten-1 class="pl-3" @click="emergency">
                <span class="pr-2">SOS</span>
                <v-icon>mdi-shield-alert</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-row>

          <!-- <v-row align="center" justify="center">
            Active? {{ active }} Late? {{ late }}
          </v-row> -->
          <v-row class="pt-5" align="center" justify="center">
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
          <v-row class="pt-5" align="center" justify="center">
            <v-btn class="pr-3">
              <span class="pr-3" @click="cancel"> Cancel</span>
              <v-icon>mdi-bell-alert</v-icon>
            </v-btn></v-row
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment';
// import DurationHelp from '@/components/snackbars/DurationHelp.vue';

export default {
  components: {
    // DurationHelp
  },
  data() {
    return {
      active: false,
      late: false,
      escalated: false,
      loading: true,
      runner: undefined,
      running: false,
      wait: 1,

      snackbar: false,
      multiLine: true,
      durationHelpText:
        'Use the slider(s) to set the minutes and hours you expect to be busy. Hit the Depart button when you leave. Hit the Arrive button when you return.',
      timeoutPref: 10000,

      minutes: 1,
      hours: 0,
      days: 0,
      toggle_exclusive: undefined,
      spent: 0,
      intervals: [],
      timeouts: []
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
          my.expired();
        }, this.duration)
      );

      this.startCountdown();

      this.runner = null;
    }
  },
  computed: {
    timeUsed() {
      return (100 - 100 * (this.spent / this.duration)).toFixed(0);
    },
    now() {
      let m = moment().format('hh:mm');
      return m;
    },

    durationHumanized() {
      return this.duration / 60000 + ' minutes';
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
  },

  beforeDestroy() {
    console.log(this.now, 'Before closing page, will stop remaining timeouts');
    this.stopCountdowns();
  }
};
</script>
