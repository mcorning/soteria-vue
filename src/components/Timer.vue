<template>
  <div class="vuemodoro" :class="vuemodoroTheme">
    <div>Arrival time: <br />{{ arrivalTime }}</div>
    <div id="vuemodoro-label">{{ pomodoroLabel }}</div>
    <div id="vuemodoro-timer">
      <span id="vuemodoro-counter">{{ currentTime }}</span>
    </div>
    <div id="vuemodoro-buttons">
      <button
        id="vuemodoro-start"
        class="btn"
        :disabled="isStartDisabled"
        @click="runCountdown"
      >
        {{ startLabel }}
      </button>
      <button
        id="vuemodoro-help"
        class="btn"
        :disabled="false"
        @click="sosCountdown"
      >
        {{ helpLabel }}
      </button>
      <button
        id="vuemodoro-reset"
        class="btn"
        :disabled="isResetDisabled"
        @click="resetCountdown"
      >
        {{ resetLabel }}
      </button>
      <button
        id="vuemodoro-cancel"
        class="btn"
        :disabled="false"
        @click="cancelCountdown"
      >
        Cancel
      </button>
    </div>
    <v-checkbox
      v-model="mute"
      id="vuemodoro-muted"
      label="Mute alarm"
      class="checkbox"
      @change="$v.checkbox.$touch()"
      @blur="$v.checkbox.$touch()"
    ></v-checkbox>
  </div>
</template>

<script>
import { PomodoroTimer } from './lib/timer.js';
import { AudioPlayer } from './lib/audio.js';
import moment from 'moment';

export default {
  name: 'PomodoroTimer',
  props: {
    arrivalDateTime: {
      type: Date
    },
    adt: {
      type: Date
    },
    pomodoroLabel: {
      type: String,
      default: 'Pomodoro timer'
    },
    startLabel: {
      type: String,
      default: 'Depart'
    },
    helpLabel: {
      type: String,
      default: 'Help'
    },
    resetLabel: {
      type: String,
      default: 'Return'
    },
    muted: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      validator: function(value) {
        return value === 'bare' || value === 'dark' || value === 'light';
      },
      default: 'light'
    }
  },

  data() {
    return {
      secs: 0,
      mins: 0,
      hrs: 0,
      timerId: 0,
      audio: null,
      running: false,
      help: false,
      stopped: true,
      mute: this.muted,
      alerted: false,
      initialized: false
    };
  },

  mounted: function() {
    if (!this.mute) this.audio = AudioPlayer.createAudio();
  },

  beforeMount() {},

  computed: {
    endTime() {
      return this.arrivalDateTime;
    },
    arrivalTime() {
      let x = moment();
      let y = moment(this.arrivalDateTime);
      let et = moment.duration(y.diff(x)).asHours();
      // if (this.stopped) {
      //   return 'stopped';
      // }
      this.updateComponentTime(et);
      return this.arrivalDateTime ? this.arrivalDateTime : 'no value';
    },

    currentTime: function() {
      let hrs = this.hrs || 0;
      let mins = this.mins || 0;
      let secs = this.secs || 0;
      return `${hrs.toFixed(0)}:${mins.toFixed(0)}:${secs.toFixed(0)}`;
    },

    isStartDisabled: function() {
      return this.running;
    },
    isHelpDisabled: function() {
      return this.stopped || this.help;
    },
    isResetDisabled: function() {
      return false;
    },
    vuemodoroTheme: function() {
      return {
        light: this.theme === 'light',
        dark: this.theme === 'dark'
      };
    }
  },

  methods: {
    run: function() {
      this.running = true;
      this.help = false;
      this.stopped = false;
    },

    helped: function() {
      this.running = false;
      this.help = true;
      this.stopped = false;
    },

    stop: function() {
      this.running = false;
      this.help = false;
      this.stopped = true;
    },

    runCountdown: function() {
      if (this.stopped === true) {
        AudioPlayer.stopAlarm(this.audio);
        this.hrs = this.hours;
        this.mins = this.minutes;
        this.secs = this.seconds;
      }
      this.$emit('open-activity');

      this.initialized = true;
      this.timerId = PomodoroTimer.startCountdown(
        this.endTime,
        this.updateComponentTime
      );
      this.run();
    },

    updateComponentTime: function(et) {
      let time = PomodoroTimer.remainingTime(et);
      this.hrs = Number(time.hrs);
      this.mins = Number(time.mins);
      this.secs = Number(time.secs);

      if (this.initialized && !this.alerted && this.secs < 0) {
        this.alerted = true;
        this.$emit('expire-activity');
      }

      if (time.running === false) {
        this.stop();
        AudioPlayer.playAlarm(this.mute, this.audio);
      }
    },

    sosCountdown: function() {
      this.$emit('sos');
      PomodoroTimer.stopCountdown(this.timerId);
      this.helped();
    },

    resetCountdown: function() {
      this.$emit('close-activity');
      PomodoroTimer.stopCountdown(this.timerId);
      this.hrs = 0;
      this.mins = 0;
      this.secs = 0;
      this.stop();
      AudioPlayer.stopAlarm(this.audio);
    },

    cancelCountdown: function() {
      this.$emit('cancel-activity');
      PomodoroTimer.stopCountdown(this.timerId);
      this.hrs = 0;
      this.mins = 0;
      this.secs = 0;
      this.stop();
      AudioPlayer.stopAlarm(this.audio);
    }
  }
};
</script>

<style scoped>
.vuemodoro {
  display: block;
  width: 300px;
  margin: 0.5rem auto;
  border: 0.25rem solid #ccc;
  text-align: center;
  padding: 1rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
}

.vuemodoro .btn {
  text-align: center;
  cursor: pointer;
  margin: 4px 2px;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: 0.25rem;
  vertical-align: middle;
  font-weight: 600;
}

.vuemodoro #vuemodoro-label,
.vuemodoro #vuemodoro-timer {
  margin-bottom: 1rem;
}

.vuemodoro #vuemodoro-label {
  font-size: 1.5rem;
}

.vuemodoro #vuemodoro-timer {
  font-size: 3rem;
  font-weight: 400;
}

/*Dark theme*/
.vuemodoro.dark {
  background: #1d2a33;
  border: 0.25rem solid #1d2a33;
  border-radius: 0.25rem;
  color: #f8f8f2;
}

.vuemodoro.dark .btn {
  color: #f8f8f2;
}
.vuemodoro.dark .checkbox {
  color: white;
}

.vuemodoro.dark #vuemodoro-label {
  color: #c1ebf2;
  border-bottom: 1px solid #44c2b9;
}

.vuemodoro.dark #vuemodoro-start {
  background-color: #3fceef;
  border-color: #3fceef; /*#7adcc9;*/
}

.vuemodoro.dark #vuemodoro-help {
  background-color: #d9a93d;
  border-color: #d9a93d; /*#c17ec8;*/
}
.vuemodoro.dark #vuemodoro-muted {
  background-color: #d9a93d;
  border-color: #d9a93d; /*#c17ec8;*/
}

.vuemodoro.dark #vuemodoro-reset {
  background-color: #c22772;
  border-color: #c22772;
}
.vuemodoro.dark #vuemodoro-cancel {
  background-color: #eeeeee;
  border-color: #eeeeee;
}
.vuemodoro.dark #vuemodoro-start:disabled,
.vuemodoro.dark #vuemodoro-help:disabled,
.vuemodoro.dark #vuemodoro-reset:disabled {
  background: #858588;
  border-color: #858588;
  color: #3a4a43;
  cursor: not-allowed;
}
/*End of dark theme*/

/*Light theme*/
.vuemodoro.light {
  background: #f7f7f3;
  color: #676766;
  border: 0.25rem solid #fefef5;
  border-radius: 0.25rem;
}

.vuemodoro.light .btn {
  color: #fefef5;
}

.vuemodoro.light #vuemodoro-label {
  color: #57749b;
  border-bottom: 1px solid #57749b;
}

.vuemodoro.light #vuemodoro-start {
  background-color: #ffb300;
  border-color: #ffb300;
}

.vuemodoro.light #vuemodoro-help {
  background-color: #d32f2f;
  border-color: #d32f2f;
}

.vuemodoro.light #vuemodoro-reset {
  background-color: #43a047;
  border-color: #43a047;
}
.vuemodoro.light #vuemodoro-cancel {
  background-color: #504b4b;
  border-color: #504b4b;
}
.vuemodoro.light #vuemodoro-start:disabled,
.vuemodoro.light #vuemodoro-help:disabled,
.vuemodoro.light #vuemodoro-reset:disabled {
  background: #707070;
  border-color: #707070;
  cursor: not-allowed;
  color: #999999;
}
/*End of Light theme*/
</style>
