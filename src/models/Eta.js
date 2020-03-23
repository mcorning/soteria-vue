// import uuidv4 from 'uuid/v4';
// import moment from 'moment';

import { Model } from '@vuex-orm/core';
import Activity from './Activity';

// be sure you register this database in database/index.js
export default class Eta extends Model {
  static entity = 'etas';

  // get string() {
  //   return `${this.datePart}T${this.timePart}`;
  // }
  // get dateTime() {
  //   return new Date(`${this.datePart}T${this.timePart}`);
  // }
  // get moment() {
  //   return moment(`${this.datePart}T${this.timePart}`).format(
  //     'ddd, MMM Do YYYY, hh:mm a'
  //   );
  // }

  static fields() {
    return {
      id: this.uid(),
      datePart: this.attr(''),
      timePart: this.attr(''),

      //apparently, setting updated to anything but ''
      //throws a runtime error or corrupts the joins
      //this.attr(() => new Date()),
      updated: this.attr(''),

      // Eta is a child of activity, so we need an activity_id here
      activity_id: this.attr(null), // used in relationship below

      // relationships (be sure you import any entity listed below)
      activity: this.belongsTo(Activity, 'activity_id')
    };
  }
}
