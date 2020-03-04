import moment from 'moment';

export const PomodoroTimer = {
  startCountdown: (endDateTime, callback) => {
    let interval = null;

    function countdown() {
      let x = moment();
      let y = new moment(endDateTime);
      let et = moment.duration(y.diff(x)).asHours();
      callback(et);
      if (et === 0) clearInterval(interval);
    }

    interval = setInterval(function() {
      countdown();
    }, 1000);

    countdown();
    return interval;
  },

  stopCountdown: intervalId => {
    clearInterval(intervalId);
  },

  // called by parent component
  remainingTime: et => {
    let frac = et % 1;
    let hrs = et - frac;
    let mins = 60 * frac;
    let secs = 60 * (mins % 1);
    return {
      hrs: hrs,
      mins: mins,
      secs: secs,
      running: et > 0
    };
  }
};
