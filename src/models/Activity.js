// import uuidv4 from 'uuid/v4';
import moment from 'moment';
import { Model } from '@vuex-orm/core';
import Member from './Member';
import Timeline from './Timeline';

export default class Activity extends Model {
  static entity = 'activities';

  get hasDeparted() {
    let timeline = this.$query()
      .with('timeline')
      .first().timeline;
    return timeline.length > 0;
  }

  get isSafe() {
    let timeline = this.$query()
      .with('timeline')
      .first().timeline;
    let x = timeline.map(s => {
      return s.state;
    });
    return x.includes('SAFE');
  }

  get arrivalTime() {
    return moment(this.arrival);
  }
  get departureTime() {
    return moment(this.departure);
  }
  get duration() {
    return this.arrivalTime.diff(this.departureTime);
  }

  static fields() {
    return {
      // id: this.uid(() => uuidv4()),
      id: this.uid(),
      origin: this.attr(''),
      destination: this.attr(''),
      description: this.string('Name me'),
      // departure: this.string(''),
      // arrival: this.string(''),
      eta: this.string(''),
      // eta: this.hasOne(Eta, 'activity_id'),

      // Activity is a child of Member, so we need an member_id here
      member_id: this.attr(null), // used in relationship below

      // relationships (be sure you import any entity listed below)
      // this activity can only belong to one single member
      member: this.belongsTo(Member, 'member_id'),
      // activity_id connects this activity with its timeline(s)
      timeline: this.hasMany(Timeline, 'activity_id')
    };
  }
}
