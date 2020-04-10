import { Model } from '@vuex-orm/core';
import Member from './Member';
import Value from './Value';

export default class Credential extends Model {
  static entity = 'credentials';
  static primaryKey = 'credentialId';

  static fields() {
    return {
      credentialId: this.attr(''),
      state: this.attr(''),
      connectionId: this.attr(''),
      definitionId: this.attr(''),
      schemaId: this.attr(''),

      member_id: this.attr(null), // used in relationship below
      member: this.belongsTo(Member, 'member_id'),

      values: this.hasOne(Value, 'credential_id')
    };
  }
}
