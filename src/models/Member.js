// import uuidv4 from 'uuid/v4';
import { Model } from '@vuex-orm/core';
import Profile from './Profile';
import Preference from './Preference';
import Credential from './Credential';

export default class Member extends Model {
  static entity = 'members';

  static fields() {
    return {
      // id: this.uid(() => uuidv4()),
      id: this.uid(),
      firstName: this.string(''),
      lastName: this.string(''),
      connectionId: this.string(''),
      email: this.string(''),
      age: this.string(''),
      gender: this.attr(''),
      zipCode: this.attr(''),
      image: this.attr(''),
      updated: this.attr(null),

      // relationships (be sure you import any entity listed below)
      profile: this.hasOne(Profile, 'member_id'),
      preferences: this.hasOne(Preference, 'member_id'),

      credentials: this.hasMany(Credential, 'member_id')
    };
  }
}
