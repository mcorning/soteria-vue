import { Model } from '@vuex-orm/core';
import Credential from './Credential';

export default class Value extends Model {
  static entity = 'values';
  static fields() {
    return {
      id: this.uid(),

      testDate: this.attr(''),
      testType: this.attr(''),
      testSite: this.attr(''),
      subjectID: this.attr(''),
      credential_id: this.attr(null), // used in relationship below
      credential: this.belongsTo(Credential, 'credential_id')
    };
  }
}
