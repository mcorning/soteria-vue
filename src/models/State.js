import { Model } from '@vuex-orm/core';

export default class State extends Model {
  static entity = 'state';

  static fields() {
    return {
      id: this.number(0), // without a fvixed id, update() creates a record
      roomId: this.string(''),
      connectionId: this.string(''),
      roomInvitationUrl: this.string(''),
      isRoomRiskManager: this.boolean(false),
      // must be number (not string) for v-select to work
      roomRiskThreshold: this.number(0),
      incubationPeriod: this.number(14),
      showHardwareSetup: this.boolean(true)
    };
  }
  static async changeRoomInvitationUrl(val) {
    let p = await this.$update({
      data: { id: 0, roomInvitationUrl: val }
    });
    return p;
  }
  static async changeRoomId(val) {
    let p = await this.$update({
      data: { id: 0, roomId: val }
    });
    return p;
  }
  static async changeConnectionId(val) {
    let p = await this.$update({
      data: { id: 0, connectionId: val }
    });
    return p;
  }
  static async changeIsRoomRiskManager(val) {
    let p = await this.$update({
      data: { id: 0, isRoomRiskManager: val }
    });
    return p;
  }
  static async changeRoomRiskThreshold(val) {
    let p = await this.$update({
      data: { id: 0, roomRiskThreshold: val }
    });
    return p;
  }
  static async toggleShowHardwareSetup(val) {
    let p = await this.$update({
      data: { id: 0, showHardwareSetup: val }
    });
    return p;
  }
}
