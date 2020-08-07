<template>
  <v-container fluid>
    <div class="text-center">
      <v-overlay v-model="overlay">
        {{ msg }}
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
    </div>
    <v-row align="stretch">
      <v-col>
        <v-card color="black" dark flat tile>
          <v-card-title class="title font-weight-regular justify-space-between">
            <span>{{ currentTitle }}</span>
            <v-avatar
              color="primary lighten-2"
              class="subheading white--text"
              size="24"
              v-text="step"
            ></v-avatar>
          </v-card-title>
          <!-- 
          checkinRoom=1,
          reviewVisits=2,
          monitorAlerts=3,
          alertOthers=4, 
          bravoZulu=5, 
          -->
          <v-window v-model="step">
            <v-window-item :value="checkinRoom">
              <v-card class="mb-3" tile outlined>
                <v-row align="center" justify="end" no-gutters>
                  <v-col>
                    <v-card-subtitle
                      >Select a Room and click the
                      <v-icon color="green">mdi-account-check</v-icon
                      >icon</v-card-subtitle
                    >
                    <v-card-subtitle>
                      Contact {{ organization }} if the Room you need isn't
                      listed.
                    </v-card-subtitle>
                  </v-col>

                  <v-col>
                    <v-row align="baseline" justify="center" no-gutters dense>
                      <v-col cols="12"></v-col>
                    </v-row>
                    <v-row no-gutters dense>
                      <v-col cols="12">
                        <v-card-text class="pa-0">
                          <v-list shaped dense>
                            <v-list-item-group
                              v-model="room"
                              mandatory
                              color="green"
                            >
                              <v-list-item v-for="(room, i) in rooms" :key="i">
                                <v-list-item-content>
                                  <v-list-item-title
                                    v-text="room"
                                  ></v-list-item-title>
                                </v-list-item-content>
                                <v-list-item-icon>
                                  <v-icon @click="onRoomSignIn()"
                                    >mdi-account-check</v-icon
                                  >
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
            </v-window-item>

            <v-window-item :value="reviewVisits">
              <v-card>
                <v-card-subtitle
                  >Room interactions (they are Connections stored on your
                  phone):</v-card-subtitle
                >
                <v-card-text>
                  <v-data-table
                    :headers="connectionHeaders"
                    :items="connections"
                    :items-per-page="1"
                    item-key="id"
                    dense
                    group-by="connectionId"
                    class="elevation-1"
                    show-group-by
                  >
                    >
                    <template v-slot:item.date="{ item }">
                      {{ visitedDate(item.date) }}
                    </template>
                  </v-data-table>
                </v-card-text>
              </v-card>
            </v-window-item>

            <v-window-item :value="monitorAlerts">
              <v-data-table
                :headers="alertHeaders"
                :items="alerts"
                item-key="id"
                dense
                class="elevation-1"
              >
                <template v-slot:item.sentTime="{ item }">
                  {{ visitedDate(item.sentTime) }}
                </template>
              </v-data-table>
            </v-window-item>

            <v-window-item :value="alertOthers">
              <v-card>
                <v-card-text>{{ alertText }}</v-card-text>
                <v-dialog v-model="dialog" persistent max-width="290">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      dark
                      block
                      v-bind="attrs"
                      v-on="on"
                      :disabled="!roomSet.length"
                      v-model="alertRoom"
                      >Alert Rooms</v-btn
                    >
                  </template>
                  <v-card>
                    <v-card-title class="headline"
                      >Ready to alert Rooms?</v-card-title
                    >
                    <v-card-text
                      >This will send a message to each Room you occupied in the
                      last {{ incubationPeriod }} days.</v-card-text
                    >
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="green darken-1" text @click="alertRooms"
                        >Yes</v-btn
                      >
                      <v-btn color="green darken-1" text @click="dialog = false"
                        >No</v-btn
                      >
                    </v-card-actions>
                  </v-card>
                </v-dialog>
                <v-alert
                  v-model="roomAlerted"
                  dark
                  border="top"
                  icon="mdi-home"
                  transition="scale-transition"
                  type="success"
                  dismissible
                >
                  <p>
                    You have successfully done your part. You have successfully
                    alerted Rooms you occupied. Well done.
                  </p>
                </v-alert>

                <v-row align="start" justify="space-between" dense>
                  <v-col>
                    <v-list dense>
                      <v-list-item-group color="primary">
                        <v-list-item v-for="(room, i) in roomSet" :key="i">
                          <v-list-item-content>
                            <v-list-item-title
                              v-text="room"
                            ></v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col> </v-col>
                </v-row>
              </v-card>
            </v-window-item>

            <v-window-item :value="bravoZulu">
              <div class="pa-4 text-center">
                <v-img
                  class="mb-4"
                  contain
                  height="128"
                  src="../assets/soteriaLogoCovidRed.jpg"
                ></v-img>
                <h4 class="title font-weight-light mb-2">
                  Thank you for doing your part to win the war against the
                  virus.
                </h4>
                <span class="caption grey--text">Stay safe out there...</span>
              </div>
            </v-window-item>
          </v-window>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn :disabled="step === 1" text @click="step--">
              Back
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="step === bravoZulu"
              color="primary"
              depressed
              @click="step++"
            >
              Next
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-system-bar
          color="secondary"
          :height="height"
          :lights-out="lightsOut"
          :window="window"
        >
          <span>Room: {{ roomName }}</span>
          <v-spacer></v-spacer>
          <span>
            API:
            {{ this.api }}
          </span>
          <v-spacer></v-spacer>
          <span>Visitor: {{ connectionId }}</span>
        </v-system-bar>
      </v-col>
    </v-row>

    <v-dialog v-model="connectionDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Mobile Phone Name</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="connectionId"
              label="Phone name*"
              hint="Phone name must be unique in Organization"
              persistent-hint
              required
            ></v-text-field>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="connectionDialog = false"
            >Close</v-btn
          >
          <v-btn color="blue darken-1" text @click="connectionDialog = false"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
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
    alertText() {
      let msg;
      if (this.alerts.length) {
        msg =
          'You have alerts. Go into quarantine, and Alert Rooms listed below.';
      } else {
        msg =
          'You have no alerts. But if you get sick yourself, or if you go into quarantine because somebody exposed you to the virus, Alert Rooms listed below.';
      }
      return msg;
    },

    currentTitle() {
      switch (this.step) {
        case 1:
          return 'Check-in';
        case 2:
          return 'Alert Room';
        case 3:
          return 'Review Your Travels';
        case 4:
          return 'Monitor Your Alerts';
        default:
          return 'Bravo Zulu';
      }
    },
    checkinColor(val) {
      return val == this.roomName ? 'green' : 'orange';
    },

    roomSet() {
      let s = new Set(this.connections.map(v => v.connectionId));
      return Array.from(s);
    },
    messageSet() {
      let s = new Set(this.messages.map(v => v.sender));
      return Array.from(s);
    },
    messageCount() {
      return this.messages.length;
    },

    noWord() {
      return this.messages.length == 0;
    },

    newRoleCardTitle() {
      return 'Join Local Contact Tracing';
    },

    newRoleLabel() {
      return "Your phone's name";
    },

    newRoleHint() {
      return 'You can use the name of your phone';
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

    roomId: {
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
    }
  },
  watch: {
    // overlay(val) {
    //   val &&
    //     setTimeout(() => {
    //       this.overlay = false;
    //     }, 10000);
    // },
  },
  data() {
    return {
      connectionDialog: false,
      today: 'YYYY-MM-DD',
      roomAlerted: false,
      checkinRoom: 1,
      alertOthers: 2,
      reviewVisits: 3,
      monitorAlerts: 4,
      bravoZulu: 5,
      step: 1,
      msg: '',
      dialog: false,
      dialogCheckin: false,
      visitFormat: 'MMM d, HH:mm',
      alertRoom: false,
      api: '',
      overlay: false,
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
      connectionHeaders: [
        { text: 'Room', value: 'connectionId' },
        { text: 'Date Visited', value: 'date' },
        { text: 'Visit Type', value: 'type' }
      ],
      alertHeaders: [
        { text: 'Room', value: 'sender' },
        { text: 'Date of Alert', value: 'sentTime' }
        // { text: 'Message', value: 'text' }
      ],

      loading: false,
      rooms: [],
      room: 0,
      state: null,
      risks: [
        { score: 3, desc: 'Acceptable' },
        { score: 5, desc: 'Risky' },
        { score: 7, desc: 'Dangerous' },
        { score: 9, desc: 'Barking mad' }
      ]
    };
  },

  methods: {
    // In workflow order
    // Visitor perspective

    // Visitor sends a login message to Room when they enter.
    // They select a room from Rooms with Local Contact Tracing and presses the mdi-account icon.
    onGetRooms() {
      // this.overlay = true;
      this.api = 'onGetRooms()';
      axios('/connections/list/?state=Invited').then(s => {
        console.log('Invited connections:', s);
        this.rooms = s.data.connections
          .filter(v => v.multiParty)
          .map(v => v.connectionId);
        // this.overlay = false;
      });
    },

    // Because a phone connectionId is a guid, we cache the roomName and message type
    onRoomSignIn() {
      this.dialogCheckin = false;
      if (!this.connectionId) {
        this.connectionDialog = true;
      }
      if (!this.roomName) {
        alert('Select a Room first.');
        return;
      }
      // this.overlay = true;

      let text = JSON.stringify({
        sender: this.connectionId,
        text: 'visiting (make this dynamic)',
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
          // this.overlay = false;
        })
        .catch(e => console.error(e));
    },

    // Alert Rooms when they get sick
    async alertRooms() {
      this.dialog = false;
      this.roomAlerted = true;
      this.roomSet.forEach(async v => {
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
    },

    // Go into quarantine if they get exposed
    tryParse(str) {
      let json = {};
      try {
        json = JSON.parse(str);
      } catch {
        console.log();
      }
      return json;
    },

    onGetCovidAlerts() {
      if (!this.connectionId) {
        // Probably a first time user who didn't know they need to tell the app their phone name
        // Send them to the JoinRole sheet
        this.sheet = true;
        return;
      }
      console.log('this.connectionId', this.connectionId);

      this.overlay = true;

      axios(`/messages/connection/?connectionId=${this.connectionId}`).then(
        s => {
          this.alerts = s.data
            .map(v => this.tryParse(v.text))
            .filter(v => {
              if (v.sender && this.isToday(v.sentTime)) return v;
            });
          this.overlay = false;
        }
      );
    },

    // Other functions
    isToday(date) {
      let x = moment(date).format(this.today);
      let y = moment().format(this.today);
      return x == y;
    },

    visitedDate(date) {
      return moment(new Date(date)).format(this.visitFormat);
    },

    onGetConnections(val) {
      return this.connections.filter(v => v.type == val);
    },

    async makeConnection() {
      this.sheet = !this.sheet;

      // this.overlay = true;

      console.log(`getting QR code for ${this.connectionId}`);
      await axios('/connections/?name=' + this.connectionId).then(s => {
        console.log('New Visitor QR:', s);
        this.roomInvitationUrl = s.data.url;
        // this.invitationSetup(s.data.invite);
        // this.overlay = false;
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

    async connectionDelete(id) {
      let c = await Connection.$delete(id);
      console.log('result of Connection.$delete()', c);
    },

    // re-enable if we want to delete Connections in IndexedDB
    // async deleteConnection(id) {
    //   if (
    //     this.selected.length &&
    //     confirm(`Deleting ${this.selected.length} occupancies`)
    //   ) {
    //     this.selected.forEach(async key => {
    //       console.log(key.id, 'deleted');
    //       await this.connectionDelete(key.id);
    //       await Connection.$fetch();
    //       console.log('this.connections:', this.connections);
    //     });
    //   } else {
    //     if (confirm('Deleting ' + id)) {
    //       await this.connectionDelete(id);
    //       await Connection.$fetch();
    //       console.log('this.connections:', this.connections);
    //     }
    //   }
    // },

    abort() {
      this.dialogCheckin = false;
    },

    async getState() {
      console.log('in RoleCard.getState()');
      let s = await DataRepository.getState();
      // console.log('state:', s);
      this.state = s;
      console.log('in RoleCard this.state:', this.state);
      this.roomInvitationUrl = s.roomInvitationUrl;
      this.roomId = s.roomId;
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
    this.onGetCovidAlerts();

    this.loading = false;
    this.overlay = false;
  }
};
</script>

<style lang="scss" scoped></style>
