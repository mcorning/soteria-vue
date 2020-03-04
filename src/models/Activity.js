import uuidv4 from 'uuid/v4';
import { Model } from '@vuex-orm/core';
import Member from './Member';
import Timeline from './Timeline';

export default class Activity extends Model {
  static entity = 'activities';

  static fields() {
    return {
      id: this.uid(() => uuidv4()),
      departFrom: this.attr(''),
      arriveAt: this.attr(''),
      description: this.string(''),
      departure: this.string(''),
      arrival: this.string(''),

      // Activity is a child of Member, so we need an member_id here
      member_id: this.attr(''), // used in relationship below

      // relationships (be sure you import any entity listed below)
      // this activity can only belong to one single member
      member: this.belongsTo(Member, 'member_id'),
      // activity_id connects this activity with its timeline(s)
      timeline: this.hasMany(Timeline, 'activity_id')
    };
  }
}
