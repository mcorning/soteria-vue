// @ts-check
import { Model } from '@vuex-orm/core';

export default class Connection extends Model {
  static entity = 'connections';
  static primaryKey = 'connectionId';

  static fields() {
    return {
      connectionId: this.attr(''),
      date: this.attr(''),
      isRoomId: this.attr(''),
      inviteUrl: this.attr('')
    };
  }
  static async deleteAll() {
    let p = await this.deleteAll();
    return p;
  }
}
