import { Model } from '@vuex-orm/core';
import Member from './Member';

export default class Profile extends Model {
  static entity = 'profiles';

  static fields() {
    return {
      id: this.uid(),
      email: this.string(''),
      mobile: this.attr(''),
      address: this.attr(''),

      // Profile is a child of Member, so we need an member_id here
      member_id: this.attr(''), // used in relationship below

      // relationships
      // user_id connects this profile with its user via user_id
      member: this.belongsTo(Member, 'member_id')
    };
  }
}
