import { Model } from '@vuex-orm/core';

export default class State extends Model {
  static entity = 'state';

  static fields() {
    return {
      id: this.number(0), // without a fvixed id, update() creates a record

      organization: this.string(''),
      roomId: this.string(''),
      myId: this.string(''),
      connectionId: this.string(''),

      zipCode: this.string(''),
      incubationPeriod: this.number(14)
    };
  }
  static async updateOrg(val) {
    let p = await this.$update({
      data: { id: 0, organization: val }
    });
    return p;
  }

  static async changeRoomId(val) {
    let p = await this.$update({
      data: { id: 0, roomId: val }
    });
    return p;
  }
  static async changeMyId(val) {
    console.log('State0.changeMyId()', val);
    let p = await this.$update({
      data: { id: 0, myId: val }
    });
    return p;
  }
  static async changeConnectionId(val) {
    console.log('State0.changeconnectionId()', val);
    let p = await this.$update({
      data: { id: 0, connectionId: val }
    });
    return p;
  }
  static async changeZipCode(val) {
    let p = await this.$update({
      data: { id: 0, zipCode: val }
    });
    return p;
  }

  static isRoom() {
    return this.roomId == this.myId;
  }
}
