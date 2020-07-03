import { Model } from '@vuex-orm/core';

export default class Connection extends Model {
  static entity = 'connections';
  static fields() {
    return {
      date: this.attr(''),
      connectionId: this.attr(''),
      isRoomId: this.attr(''),
      inviteUrl: this.attr('')
    };
  }
}
