import { Model } from '@vuex-orm/core';
import Member from './Member';

export default class Preference extends Model {
  static entity = 'preferences';

  static fields() {
    return {
      id: this.uid(),
      databaseName: this.string(''),

      symptomsScore: this.string('0'),

      // Profile is a child of Member, so we need an member_id here
      member_id: this.attr(''), // used in relationship below

      // relationships
      // user_id connects this profile with its user via user_id
      member: this.belongsTo(Member, 'member_id')
    };
  }

  static async changeSymptomsScore(perfID, val) {
    let p = await this.$update({
      data: { id: perfID, symptomsScore: val }
    });
    return p;
  }
}
