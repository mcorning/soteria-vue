<template>
  <div>
    <div class="text-center">
      <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </div>
    <!-- Select a Room -->
    <v-card class="mb-3" tile outlined>
      <v-row align="center" justify="end" no-gutters>
        <v-col>
          <div class="pl-4">
            <h3>Select your Room</h3>
          </div>
          <v-card-subtitle v-if="isRoomManager">
            You manage {{ managedRoom }}. Only you can alert
            {{ managedRoom }} Visitors.
          </v-card-subtitle>
          <v-card-subtitle>You can manage only one room at a time.</v-card-subtitle>
          <v-card-subtitle>
            Contact {{ organization }} if a Room you need isn't
            listed
          </v-card-subtitle>
        </v-col>
        <v-col>
          <v-row align="baseline" justify="center" no-gutters dense>
            <v-col></v-col>
            <v-col cols="2" class="pt-3 pb=0">Manage</v-col>
          </v-row>

          <v-row no-gutters dense justify="end">
            <v-col cols="12">
              <v-card-text class="pa-0">
                <v-list shaped dense>
                  <v-list-item-group v-model="room" mandatory color="primary">
                    <v-list-item v-for="(room, i) in rooms" :key="i">
                      <v-list-item-content>
                        <v-list-item-title v-text="room"></v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-icon v-if="room == managedRoom">
                        <v-icon
                          @click="alertVisitors"
                          color="red"
                          :disabled="!messageSet.length"
                        >mdi-alert</v-icon>
                      </v-list-item-icon>
                      <v-list-item-icon v-else>
                        <v-icon @click="manageRoom(room)" color="green">mdi-account-plus</v-icon>
                      </v-list-item-icon>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>

    <!-- Visitor Messages -->
    <v-card>
      <div class="pl-4">
        <h3>Visitor Interactions with {{ managedRoom }}:</h3>
      </div>
      <v-card-text>
        <v-row align="baseline" justify="start" no-gutters dense>
          <v-col cols="5" sm="2">
            <v-select
              v-model="messageType"
              autofocus
              :items="['Check-in', 'Negative', 'Presumptive', 'Positive']"
              label="Interaction"
              @change="onGetRoomWarnings"
              hide-details
            ></v-select>
          </v-col>

          <v-col cols="7" sm="4">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-col>

          <v-col cols="3" sm="2">
            <v-text-field
              v-model="daysBack"
              label="Days past"
              @change="onGetRoomWarnings"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="8" sm="3">
            <v-text-field v-model="lookBackDate" readonly hide-details label="Look-back date"></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-icon class="pl-2" @click="onGetRoomWarnings">mdi-email-sync</v-icon>
          </v-col>
          <v-col cols="12">
            <v-data-table
              v-model="selected"
              :headers="messageHeaders"
              :items="messages"
              item-key="id"
              dense
              class="elevation-1"
              :search="search"
              :footer-props="{
                showFirstLastPage: true,
                firstIcon: 'mdi-arrow-collapse-left',
                lastIcon: 'mdi-arrow-collapse-right',
                prevIcon: 'mdi-minus',
                nextIcon: 'mdi-plus',
                itemsPerPageOptions: [1, 5, 10, -1]
              }"
            >
              <template v-slot:item.sender="{ item }">{{ item.sender }}</template>
              <template v-slot:item.text="{ item }">{{ item.text }}</template>
              <template v-slot:item.type="{ item }">{{ item.type }}</template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card>
      <v-card-title>Alert List</v-card-title>
      <v-row align="start" justify="space-between" dense no-gutters>
        <v-col>
          <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item v-for="(msg, i) in messageSet" :key="i">
                <v-list-item-content>
                  <v-list-item-title v-text="msg"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-btn
            :disabled="!messageSet.length"
            color="primary"
            @click="alertVisitors"
          >Alert Visitors</v-btn>
        </v-col>
      </v-row>
    </v-card>
    <div v-if="sla > 0">
      <v-row v-if="showDetail">
        <v-col cols="6">
          <v-card-subtitle>
            You can scan this QR code to make a connection with the Room in
            your digital wallet. You would do this is you want to exchange
            credentials with the Room.
          </v-card-subtitle>
        </v-col>
        <v-col cols="6">
          <v-img
            id="qrRoom"
            class="white--text align-end"
            :src="qrSourceRoom"
            height="200"
            width="200"
          ></v-img>
        </v-col>

        <v-col cols="12">
          <v-card-title class="pa-0">Stipulate Room's risk tolerance:</v-card-title>
        </v-col>

        <v-col cols="6">
          <v-card-text class="pt-0">
            <v-select
              :disabled="!isRoomRiskManager"
              v-model="select"
              @change="roomRiskThreshold = select.score"
              :items="risks"
              item-text="desc"
              item-value="score"
              label="Select"
              return-object
              single-line
              dense
            ></v-select>
          </v-card-text>
        </v-col>
        <v-col cols="6">
          <v-card-subtitle>Room risk (max): {{ select.score }}</v-card-subtitle>
        </v-col>
        <v-col cols="12">
          <v-card-subtitle class="pa-0">Visitors can enter based on the Room's riskiness.</v-card-subtitle>
        </v-col>
      </v-row>
      <v-row v-if="!isRoomRiskManager" align="center" no-gutters>
        <v-col cols="12">
          <v-text-field dense label="Phone ID:" :loading="loading1">{{ connectionId }}</v-text-field>
        </v-col>
        <div v-if="showDetail">
          <v-col cols="6">
            <v-card-subtitle>Connection Invitation for {{ connectionId }}</v-card-subtitle>
            <v-img
              id="qrRoom"
              class="white--text align-end"
              :src="qrSourceRoom"
              height="200"
              width="200"
            ></v-img>
          </v-col>
          <v-col cols="6">
            <v-card-subtitle>
              Rooms can scan this QR code to make a connection (as secure
              communication channel) with your digital wallet. You would do this
              is you want to exchange credentials with the
              Room.
            </v-card-subtitle>
          </v-col>
        </div>
      </v-row>
    </div>
    <v-system-bar color="secondary" :height="height" :lights-out="lightsOut" :window="window">
      <span>Room: {{ roomName }}</span>
      <v-spacer></v-spacer>
      <span>
        Selected Room:
        {{ selectedRoom }}
      </span>
      <span>
        Selected Room:
        {{ selectedConnection }}
      </span>
      <v-spacer></v-spacer>
      <span>Visitor: {{ connectionId }}</span>
    </v-system-bar>
  </div>
</template>

<script>
import moment from 'moment';
import config from '@/config.json';
import axios from 'axios';
axios.defaults.baseURL = config.DEBUG
  ? config.BASEURL_LOCAL
  : config.BASEURL_AZURE;

import State from '@/models/State';
import Connection from '@/models/Connection';
import DataRepository from '@/store/repository.js';

export default {
  computed: {
    messageSet() {
      let s = new Set(this.messages.map(v => v.sender));
      return Array.from(s);
    },
    messageCount() {
      return this.messages.length;
    },

    selectedConnection() {
      if (this.selected.length) {
        if (this.selected.length > 1) {
          return 'Multiple';
        } else return this.selected[0].connectionId;
      }
      return '';
    },

    noWord() {
      return this.messages.length == 0;
    },

    newRoleCardTitle() {
      return 'Make your Room a safer space';
    },

    newRoleLabel() {
      return 'Room name';
    },

    newRoleHint() {
      return 'Any name unique to other Rooms';
    },

    connections() {
      let c = Connection.all();
      return c;
    },
    roomName() {
      return this.rooms[this.room];
    },

    qrSourceRoom() {
      console.log('Room url', this.roomInvitationUrl);

      return `https://chart.googleapis.com/chart?cht=qr&chl=${this.roomInvitationUrl}&chs=200x200&chld=L|1`;
    },
    role() {
      // return this.state?.isRoomRiskManager ? 'Room' : 'Visitor';
      return this.roles[this.roleIndex]?.name;
    },

    managedRoom: {
      get() {
        return this.state?.roomId;
      },
      set(newVal) {
        State.changeRoomId(newVal).then(state => {
          // ORM returns an array of State objects
          this.state = state[0];
        });
      }
    },

    isRoomRiskManager: {
      get() {
        return this.state?.isRoomRiskManager;
      },
      set(newVal) {
        State.changeIsRoomRiskManager(newVal).then(state => {
          // ORM returns an array of State objects
          this.state = state[0];
          this.$emit('changed-is-room-risk-manager', this.isRoomRiskManager);
        });
      }
    },
    roomRiskThreshold: {
      get() {
        return this.state?.roomRiskThreshold;
      },
      set(newVal) {
        State.changeRoomRiskThreshold(newVal).then(state => {
          // ORM returns an array of State objects
          this.state = state[0];
          this.$emit('changed-room-risk-threshold', this.roomRiskThreshold);
        });
      }
    },
    connectionId: {
      get() {
        return this.state?.connectionId;
      },
      set(newVal) {
        State.changeConnectionId(newVal).then(state => {
          // ORM returns an array of State objects
          this.state = state[0];
        });
      }
    },
    lookBackDate() {
      return moment()
        .add(-this.daysBack, 'day')
        .toISOString();
    },
    isRoomManager() {
      return this.state?.roomId == this.roomName;
    }
  },
  watch: {
    overlay(val) {
      val &&
        setTimeout(() => {
          this.overlay = false;
        }, 10000);
    },
    loader() {
      const l = this.loader;
      console.log('loader', l);
      this[l] = !this[l];
      if (l == 'loading1') {
        this.onGetNewVisitorQr().then(() => {
          this[l] = false;
          this.loader = null;
        });
      }
    }
  },
  data() {
    return {
      overlay: false,
      selectedRoom: '',
      organization: config.ORGANIZATION,

      missingPhoneNamePrompt: 'Please provide a unique name for your phone',
      sla: 0,
      height: 30,
      lightsOut: true,
      window: true,
      messageType: 'Check-in',
      messageText: 'Presented symptoms',
      daysBack: 5,
      sheet: false,
      sheet2: false,
      roles: [
        {
          name: 'Room',
          icon: 'mdi-account-multiple-plus'
        },
        { name: 'Visitor', icon: 'mdi-account-plus' }
      ],
      roleIndex: 1,
      search: '',
      message: '',
      messages: [],
      alerts: [],
      messageHeaders: [
        { text: 'Occupant', value: 'sender' },
        { text: 'Message', value: 'text' },
        { text: 'Type', value: 'type' },
        { text: 'Room saw message ', value: 'sentTime' }
      ],
      showDetail: false,
      incubationPeriod: 14,
      transition: 'scale-transition',
      singleSelect: true,
      selected: [],
      headers: [
        { text: 'Room ID', value: 'connectionId' },
        { text: 'Connected', value: 'date' },
        { text: 'Type', value: 'types' },
        { text: 'Delete', value: 'delete' },
        { text: 'Alert', value: 'alert' }
      ],
      loader: null,
      loading: false,
      loading1: false,
      rooms: [],
      room: 0,
      roomInvitationUrl: '',
      state: null,
      select: {},
      risks: [
        { score: 3, desc: 'Acceptable' },
        { score: 5, desc: 'Risky' },
        { score: 7, desc: 'Dangerous' },
        { score: 9, desc: 'Barking mad' }
      ],
      e6: 1,
      btnColor: 'red lighten-2',
      loaded: false
    };
  },

  methods: {
    manageRoom(room) {
      this.managedRoom = room;
    },

    alertVisitors() {
      if (!this.managedRoom) {
        alert(
          'Houston, we have a problem. We have a null value for this.managedRoom in alertVisitors()'
        );
        return;
      }
      this.messageSet.forEach(visitor => {
        console.info(`${this.managedRoom} alerting ${visitor}`);
        let text = JSON.stringify({
          sentTime: new Date(),
          sender: this.managedRoom,
          text:
            'You may have been exposed to Covid-19 within the last 14 days.',
          type: 'CovidAlert',
          id: Date.now()
        });
        console.info(text);
        let payload = {
          connectionId: visitor,
          text: text
        };

        axios({ url: '/messages', data: payload, method: 'POST' })
          .then(() => {
            console.log(`Alerted: ${this.managedRoom}`);
            DataRepository.connect({
              connectionId: this.managedRoom,
              type: 'alert'
            });
            Connection.$fetch();
          })
          .catch(e => console.error(e));
      });
    },

    onGetCovidAlerts() {
      if (!this.connectionId) {
        // Probably a first time user who didn't know they need to tell the app their phone name
        // Send them to the JoinRole sheet
        this.sheet = true;
        return;
      }
      console.log('this.connectionId', this.connectionId);

      axios(`/messages/connection/?connectionId=${this.connectionId}`).then(
        s => {
          this.alerts = s.data
            .map(v => this.tryParse(v.text))
            .filter(v => {
              if (v.sender) return v;
            });
        }
      );
    },

    test() {
      alert('test');
    },

    async onJoinRole() {
      this.sheet = !this.sheet;

      this.onGetNewRoomQr();
    },

    onGetNewRoomQr() {
      if (!this.managedRoom) {
        alert(
          'Houston, we have a problem. We have a null value for this.managedRoom in onGetNewRoomQR()'
        );
        return;
      }
      console.log(`getting QR code for room ${this.managedRoom}`);

      axios('/invitations/?id=' + this.managedRoom).then(s => {
        console.log('New Room QR:', s);
        this.roomInvitationUrl = s.data.url;
        this.onGetRooms();
        // this.invitationSetup(s.data.invite);
      });
      console.log('Room connection invitation url', this.roomInvitationUrl);
    },

    async onGetNewVisitorQr() {
      console.log(`getting QR code for ${this.connectionId}`);
      axios('/connections/?name=' + this.connectionId).then(s => {
        console.log('New Visitor QR:', s);
        this.roomInvitationUrl = s.data.url;
        // this.invitationSetup(s.data.invite);
      });
      console.log('Visitor connection invitation url', this.roomInvitationUrl);
    },

    async onDeleteRole() {
      confirm(`Delete ${this.role}?`);
    },

    async onGetConnectionId() {
      let m = await DataRepository.getMember();
      this.connectionId = m.connectionId;
    },

    deleteObjectStore() {
      this.connectionCt = Connection.all().forEach(async c => {
        this.connectionCt = c.id;
      });
    },

    filterDate(t) {
      let z = moment().add(-this.daysBack, 'day');
      let tm = moment(t);

      return tm.isAfter(z);
    },
    filterType(t) {
      console.log('Message type:', t);

      return t == this.messageType.toLowerCase();
    },

    onGetRoomWarnings() {
      if (!this.roomName) {
        this.onGetRooms();
      }
      axios(`/messages/connection/?connectionId=${this.managedRoom}`).then(
        s => {
          // console.log('Messages from server:', s);
          // let mappedMsgs = new Map(
          //   s.data.map(v => [v.sentTime, this.tryParse(v.text)])
          // );
          let m = s.data
            .map(v => {
              let t = v.sentTime;

              let x = this.tryParse(v.text);
              if (x) {
                x.sentTime = t;
              }
              return x;
            })
            .filter(v => this.filterDate(v.sentTime))
            .filter(v => this.filterType(v.type));
          console.dir('m:', m, { depth: 3 });
          this.messages = m;
          console.log();
        }
      );
    },

    // Visitor sends a login message to Room when they enter.
    // They select a room from Rooms with Local Contact Tracing and presses the mdi-account icon.
    // Because the connectionId is a guid (because its On their phone, we cache the roomName and message type
    onRoomSignIn() {
      if (!this.connectionId || !this.roomName) {
        alert(
          'Houston, we have a problem. onRoomSignIn() needs values for both this.connectionId and this.roomName.'
        );
        return;
      }
      let text = JSON.stringify({
        sender: this.connectionId,
        text: 'day shift',
        type: 'check-in',
        id: Date.now()
      });
      let payload = {
        connectionId: this.roomName,
        text: text
      };
      console.log('Signing in with payload:', payload);
      const connectionId = this.roomName;
      axios({ url: '/messages', data: payload, method: 'POST' })
        .then(() => {
          console.log(`Signed into: ${connectionId}`);
          DataRepository.connect({
            connectionId: connectionId,
            type: 'check-in'
          });
          Connection.$fetch();
        })
        .catch(e => console.error(e));
    },

    onWarnRooms() {
      this.sheet2 = !this.sheet2;
      if (!this.selectedConnection) {
        alert('Check one or more of the rooms listed');
        return;
      }
      console.warn(this.connectionId, this.selectedConnection);
      let id = this.connectionId;

      let text = JSON.stringify({
        sender: id,
        text: this.messageText,
        type: this.messageType.toLowerCase(),
        id: Date.now()
      });
      console.warn(text);
      let payload = {
        connectionId: this.selectedConnection,
        text: text
      };

      axios({ url: '/messages', data: payload, method: 'POST' });
    },

    tryParse(str) {
      console.log('trying to parse:', str);
      let json = {};
      try {
        json = JSON.parse(str);
      } catch {
        console.log('oops. no can do.');
      }
      return json;
    },

    onGetRooms() {
      axios('/connections/list/?state=Invited').then(s => {
        console.log('Invited connections:', s);
        this.rooms = s.data.connections
          .filter(v => v.multiParty)
          .map(v => v.connectionId);
      });
    },

    onDeleteRoom() {
      if (!this.roomName) {
        alert(
          'Houston, we have a problem. We have a null value for this.roomName in onDeleteRoom()'
        );
        return;
      }
      console.log('Deleting Room:', this.roomName);
      axios({
        url: `/invitations/?id=${this.roomName}`,
        method: 'DELETE'
      }).then(r => {
        console.log(r, 'deleted');
        this.onGetRooms();
      });
    },

    async connectionDelete(id) {
      let c = await Connection.$delete(id);
      console.log('result of Connection.$delete()', c);
    },

    async deleteConnection(id) {
      if (
        this.selected.length &&
        confirm(`Deleting ${this.selected.length} occupancies`)
      ) {
        this.selected.forEach(async key => {
          console.log(key.id, 'deleted');
          await this.connectionDelete(key.id);
          await Connection.$fetch();
          console.log('this.connections:', this.connections);
        });
      } else {
        if (confirm('Deleting ' + id)) {
          await this.connectionDelete(id);
          await Connection.$fetch();
          console.log('this.connections:', this.connections);
        }
      }
    },

    alertRooms(id) {
      if (!id) {
        alert(
          'Houston, we have a problem. We have a null value for the id arg passed to alertRooms().'
        );
        return;
      }
      if (!this.connectionId) {
        alert(
          'Houston, we have a problem. We have a null value for this.connectionId in alertRooms().'
        );
        return;
      }
      if (this.selected.length) {
        if (confirm(`Alerting ${this.selected.length} rooms`)) {
          new Set(this.selected.map(v => v.connectionId)).forEach(v => {
            let payload = {
              connectionId: v,
              text: `ALERT: ${this.connectionId} is in quarantine.`
            };
            console.log('Alerting:', payload);
            axios({
              url: '/messages',
              data: payload,
              method: 'POST'
            }).catch(e => console.error(e));
          });
        }
      } else {
        if (confirm('Alerting room ' + id)) {
          console.log(id, 'alerted');
        }
      }
    },

    onChangeRiskThreshold() {
      this.roomRiskThreshold = this.select.score;
      this.$emit('changed-room-risk-threshold', this.roomRiskThreshold);
    },

    async getState() {
      console.log('in RoleCard.getState()');
      let s = await DataRepository.getState();
      // console.log('state:', s);
      this.state = s;
      console.log('in RoleCard this.state:', this.state);
      this.roomInvitationUrl = s.roomInvitationUrl;
      this.managedRoom = s.roomId;
      this.incubationPeriod = s.incubationPeriod;
      this.connectionId = s.connectionId;
      this.select = { score: s.roomRiskThreshold, desc: '' };
      this.$emit('changed-is-room-risk-manager', s.isRoomRiskManager);
    }
  },

  async created() {
    this.overlay = true;
    this.loading = true;

    let c = await Connection.$fetch();
    console.log('Connections found:', c.connections?.length);
    console.log('Entering created() in RoleCard: getting State');
    await this.getState();
    console.log(axios.defaults.baseURL);
    console.log('Leaving created() in RoleCard');
    this.onGetRooms();
    this.onGetRoomWarnings();
    this.onGetCovidAlerts();

    this.loading = false;
    this.overlay = false;
  }
};
</script>

<style lang="scss" scoped></style>
