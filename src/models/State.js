import { Model } from '@vuex-orm/core';

export default class State extends Model {
  static entity = 'state';

  static fields() {
    return {
      id: this.number(0), // without a fvixed id, update() creates a record
      isRoomRiskManager: this.boolean(false),
      // must be number (not string) for v-select to work
      roomRiskThreshold: this.number(0),
      showHardwareSetup: this.boolean(true)
    };
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
