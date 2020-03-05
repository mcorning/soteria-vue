// import uuidv4 from 'uuid/v4';
import { Model } from '@vuex-orm/core';
import Activity from './Activity';
import Profile from './Profile';

export default class Member extends Model {
  static entity = 'members';

  static fields() {
    return {
      // id: this.uid(() => uuidv4()),
      id: this.uid(),
      firstName: this.string(''),
      lastName: this.string(''),
      age: this.string(''),
      gender: this.attr(''),
      image: this.attr(''),

      // relationships (be sure you import any entity listed below)
      profile: this.hasOne(Profile, 'member_id'),

      activities: this.hasMany(Activity, 'member_id')
    };
  }
}
