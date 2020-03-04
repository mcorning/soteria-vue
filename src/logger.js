'use strict';

import util from 'util';
import moment from 'moment';
import colors from 'colors/safe';
export default {
  logger: {
    colorsMap: {
      success: colors.green,
      warning: colors.yellow,
      danger: colors.red,
      error: colors.red,
      info: colors.cyan,
      object: colors.magenta,
      code_blue: colors.blue,
      cmd: colors.yellow,
      line: colors.white,
      duration: colors.white
    },

    trace: label => value => {
      console.log(label, util.inspect(value, false, null, true));
      return value;
    },

    duration: function(message, startDateTime, dueBackDateTime) {
      const s = moment(startDateTime);
      const d = moment(dueBackDateTime);
      const duration = moment.duration(d.diff(s));
      this.log('duration', message, duration);
    },

    cmd: function(message) {
      console.log(this.colorsMap.cmd(message));
    },

    line: function(message) {
      this.log('line', message);
    },

    success: function(message) {
      this.log('success', message);
    },

    warning: function(message) {
      this.log('warning', message);
    },

    error: function(message, obj) {
      this.log('error', message, obj);
    },

    danger: function(message, obj) {
      this.log('danger', message, obj);
    },

    fatal: function(message) {
      this.log('code_blue', message);
    },

    info: function(message) {
      this.log('info', message);
    },

    object: function(message, obj) {
      this.log('object', message, obj);
    },

    log: function(type, message, obj) {
      var record = this.timestamptMessage(
        util.format('%s: %s', type.toUpperCase(), this.formatMessage(message))
      );
      console.log(this.colorsMap[type](record));
      if (obj) {
        console.log(this.colorsMap[type](util.inspect(obj, false, null, true)));
      }
    },

    formatMessage: function(message) {
      return typeof message === 'string' ? message : JSON.stringify(message);
    },

    timestamptMessage: function(message) {
      return util.format('[%s] %s', moment(), message);
    }
  }
};
