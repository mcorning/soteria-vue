// @ts-check
import { Model } from '@vuex-orm/core';

export default class Connection extends Model {
  static entity = 'connections';

  static fields() {
    return {
      // use a unique ID if you want to insert records with the connectionId
      id: this.uid(),
      connectionId: this.attr(''),
      type: this.attr(''),
      date: this.attr(''),
      isRoomId: this.attr(''),
      inviteUrl: this.attr('')
    };
  }
}
