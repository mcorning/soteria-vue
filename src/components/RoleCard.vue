<template>
  <div>
    <v-card class="mb-3">
      <!-- Your Role -->
      <v-row align="center" justify="end" no-gutters dense>
        <v-col> <v-card-title>Your Role:</v-card-title> </v-col>
        <v-col>
          <v-row align="baseline" justify="center" no-gutters dense>
            <v-col></v-col
            ><v-col cols="3" class="pt-3 pb=0"> Add a role </v-col>
          </v-row>
          <v-row no-gutters dense>
            <v-col cols="12">
              <v-card-text class="pa-0">
                <!-- Room/Visitor List -->
                <v-list shaped dense>
                  <v-list-item-group v-model="roleIndex" color="primary">
                    <v-list-item v-for="(role, i) in roles" :key="i">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="role.name"
                        ></v-list-item-title>
                      </v-list-item-content>

                      <v-list-item-icon>
                        <v-bottom-sheet v-model="sheet" persistent>
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon v-bind="attrs" v-on="on"
                              >{{ role.icon }}
                            </v-icon>
                          </template>
                          <v-sheet class="text-center">
                            <v-card>
                              <v-card-title>{{
                                newRoleCardTitle
                              }}</v-card-title>
                              <v-card-text>
                                <v-text-field
                                  v-model="newName"
                                  :label="newRoleLabel"
                                  :hint="newRoleHint"
                                ></v-text-field
                              ></v-card-text>
                              <v-card-actions>
                                <v-btn
                                  class="mt-6"
                                  text
                                  color="error"
                                  @click="onJoinRole"
                                  >Add</v-btn
                                >
                                <v-btn
                                  class="mt-6"
                                  text
                                  color="error"
                                  @click="sheet = !sheet"
                                  >cancel</v-btn
                                ></v-card-actions
                              ></v-card
                            >
                          </v-sheet>
                        </v-bottom-sheet>
                      </v-list-item-icon>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text></v-col
            ></v-row
          >
        </v-col>
      </v-row>
    </v-card>

    <!-- Select a Room -->
    <v-card class="mb-3" tile outlined>
      <v-row align="center" justify="end" no-gutters>
        <v-col>
          <v-card-title
            >Select a Room to {{ isVisitor ? `Enter` : 'Manage' }}</v-card-title
          >
          <v-card-subtitle v-if="!isVisitor"
            >You manage {{ roomId }}</v-card-subtitle
          >
        </v-col>

        <v-col>
          <v-row align="baseline" justify="center" no-gutters dense>
            <v-col></v-col>
            <v-col cols="3" class="pt-3 pb=0">{{
              isVisitor ? 'Check-in' : '   Delete'
            }}</v-col>
          </v-row>
          <v-row no-gutters dense>
            <v-col cols="12">
              <v-card-text class="pa-0">
                <v-list shaped dense>
                  <v-list-item-group v-model="room" color="primary">
                    <v-list-item v-for="(room, i) in rooms" :key="i">
                      <v-list-item-content>
                        <v-list-item-title v-text="room"></v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-icon v-if="isVisitor">
                        <v-icon @click="onRoomSignIn()">
                          mdi-account-check
                        </v-icon></v-list-item-icon
                      >

                      <v-list-item-icon v-if="!isVisitor">
                        <v-icon @click="onDeleteRoom" color="yello">
                          mdi-delete</v-icon
                        ></v-list-item-icon
                      >

                      <v-list-item-icon v-if="!isVisitor">
                        <v-icon @click="alertVisitors" color="red">
                          mdi-alert</v-icon
                        ></v-list-item-icon
                      >
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-card-text></v-col
            >
          </v-row>
        </v-col>
      </v-row>
    </v-card>

    <!-- Room Interactions -->
    <div v-if="isVisitor">
      <v-card>
        <v-card-title>Room Interactions </v-card-title>
        <template>
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="connections"
            :items-per-page="5"
            item-key="id"
            show-select
            class="elevation-1"
            :footer-props="{
              showFirstLastPage: true,
              firstIcon: 'mdi-arrow-collapse-left',
              lastIcon: 'mdi-arrow-collapse-right',
              prevIcon: 'mdi-minus',
              nextIcon: 'mdi-plus',
              itemsPerPageOptions: [1, 5, 10, -1]
            }"
          >
            <template v-slot:item.connectionId="{ item }">
              {{ item.connectionId }}
            </template>
            <template v-slot:item.date="{ item }">
              {{
                item.date.toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })
              }}
            </template>
            <template v-slot:item.types="{ item }">
              <v-icon :color="item.isRoomId ? 'red' : 'black'">{{
                item.isRoomId
                  ? 'mdi-account-multiple-check'
                  : 'mdi-account-check'
              }}</v-icon>
            </template>
            <template v-slot:item.delete="{ item }">
              <v-icon @click="deleteConnection(item.id)">
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:item.alert="{}">
              <v-bottom-sheet
                v-if="selectedConnection"
                v-model="sheet2"
                persistent
                inset
                width="400"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on">mdi-alert </v-icon>
                </template>
                <v-sheet class="text-center">
                  <v-card>
                    <v-card-title> Notify Rooms</v-card-title>
                    <v-card-text>
                      <v-text-field
                        v-model="messageText"
                        label="Text (optional)"
                      ></v-text-field>
                      <v-select
                        v-model="messageType"
                        :items="['Negative', 'Presumptive', 'Positive']"
                        label="Room notification type"
                        outlined
                      ></v-select
                    ></v-card-text>
                    <v-card-actions>
                      <v-btn
                        class="mt-6"
                        text
                        color="error"
                        @click="onWarnRooms"
                        >Add</v-btn
                      >
                      <v-btn
                        class="mt-6"
                        text
                        color="error"
                        @click="sheet2 = !sheet2"
                        >cancel</v-btn
                      ></v-card-actions
                    ></v-card
                  >
                </v-sheet>
              </v-bottom-sheet>
              <!-- <v-icon @click="onWarnRooms()">
              mdi-alert
            </v-icon> -->
            </template>
          </v-data-table>
        </template>
      </v-card>
      <v-card>
        <v-card-title>Covid Alert:</v-card-title>
        <v-card-text>
          <v-row align="baseline" justify="space-between" no-gutters dense>
            <template>
              <v-col cols="6">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  outlined
                ></v-text-field
              ></v-col>
              <v-spacer></v-spacer>
              <v-col cols="auto">
                <v-icon x-large @click="onGetCovidAlerts"
                  >mdi-email-sync</v-icon
                ></v-col
              >
              <v-col cols="12">
                <v-data-table
                  v-model="selected"
                  :headers="messageHeaders"
                  :items="alerts"
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
                  <template v-slot:item.sender="{ item }">
                    {{ item.sender }}
                  </template>
                  <template v-slot:item.text="{ item }">
                    {{ item.text }}
                  </template>
                  <template v-slot:item.type="{ item }">
                    {{ item.type }}
                  </template>
                </v-data-table>
              </v-col>
            </template>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- Visitor Messages -->
    <div v-else>
      <v-card>
        <v-card-title>Visitor Messages:</v-card-title>
        <v-card-text>
          <v-row align="baseline" justify="space-between" no-gutters dense>
            <v-col cols="2"
              ><v-text-field
                v-model="daysBack"
                label="Look-back days"
                @change="onGetRoomWarnings"
                outlined
              ></v-text-field
            ></v-col>
            <v-col cols="auto"
              ><v-text-field
                v-model="lookBackDate"
                readonly
                label="Look-back date"
                outlined
              ></v-text-field
            ></v-col>
          </v-row>

          <v-row
            v-if="!isVisitor"
            align="baseline"
            justify="space-between"
            no-gutters
            dense
          >
            <v-col cols="4">
              <v-select
                v-model="messageType"
                autofocus
                :items="['Check-in', 'Negative', 'Presumptive', 'Positive']"
                label="Visitor message types"
                @change="onGetRoomWarnings"
                outlined
              ></v-select
            ></v-col>
            <v-col cols="1">
              <v-text-field
                v-model="messageCount"
                label="Count"
                readonly
                outlined
              ></v-text-field>
            </v-col>
            <template>
              <v-col cols="6">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                  outlined
                ></v-text-field
              ></v-col>
              <v-spacer></v-spacer>
              <v-col cols="auto"
                ><v-icon large @click="onGetRoomWarnings"
                  >mdi-email-sync</v-icon
                ></v-col
              >
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
                  <template v-slot:item.sender="{ item }">
                    {{ item.sender }}
                  </template>
                  <template v-slot:item.text="{ item }">
                    {{ item.text }}
                  </template>
                  <template v-slot:item.type="{ item }">
                    {{ item.type }}
                  </template>
                </v-data-table>
              </v-col>
            </template>
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
          <v-col
            ><v-btn
              :disabled="!messageSet.length"
              color="primary"
              @click="alertVisitors"
              >Alert Visitors</v-btn
            ></v-col
          >
        </v-row>
      </v-card>
    </div>
    <div v-if="sla > 0">
      <v-row v-if="showDetail">
        <v-col cols="6">
          <v-card-subtitle
            >You can scan this QR code to make a connection with the Room in
            your digital wallet. You would do this is you want to exchange
            credentials with the Room.</v-card-subtitle
          >
        </v-col>
        <v-col cols="6">
          <v-img
            id="qrRoom"
            class="white--text align-end"
            :src="qrSourceRoom"
            height="200"
            width="200"
          >
          </v-img>
        </v-col>

        <v-col cols="12">
          <v-card-title class="pa-0"
            >Stipulate Room's risk tolerance:</v-card-title
          >
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
            ></v-select
          ></v-card-text>
        </v-col>
        <v-col cols="6">
          <v-card-subtitle>Room risk (max): {{ select.score }}</v-card-subtitle>
        </v-col>
        <v-col cols="12">
          <v-card-subtitle class="pa-0"
            >Visitors can enter based on the Room's riskiness.
          </v-card-subtitle>
        </v-col>
      </v-row>
      <v-row v-if="!isRoomRiskManager" align="center" no-gutters>
        <v-col cols="12">
          <v-text-field dense label="Phone ID:" :loading="loading1"
            >{{ connectionId }}
          </v-text-field>
        </v-col>
        <div v-if="showDetail">
          <v-col cols="6">
            <v-card-subtitle
              >Connection Invitation for {{ connectionId }}</v-card-subtitle
            >
            <v-img
              id="qrRoom"
              class="white--text align-end"
              :src="qrSourceRoom"
              height="200"
              width="200"
            >
            </v-img>
          </v-col>
          <v-col cols="6">
            <v-card-subtitle
              >Rooms can scan this QR code to make a connection (as secure
              communication channel) with your digital wallet. You would do this
              is you want to exchange credentials with the
              Room.</v-card-subtitle
            >
          </v-col>
        </div>
      </v-row>
    </div>
    <v-system-bar
      color="secondary"
      :height="height"
      :lights-out="lightsOut"
      :window="window"
    >
      <span>Room: {{ roomName }}</span>
      <v-spacer></v-spacer>
      <span
        >Selected:
        {{ selectedConnection }}
      </span>
      <v-spacer></v-spacer>
      <span>Visitor: {{ connectionId }} </span>
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
      return this.isVisitor
        ? 'Join Local Contact Tracing'
        : 'Make your Room a safer space';
    },

    newRoleLabel() {
      return this.isVisitor ? "Your phone's name" : 'Room name';
    },

    newRoleHint() {
      return this.isVisitor
        ? 'You can use the name of your phone'
        : 'Any name unique to other Rooms';
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

    isVisitor() {
      return this.role == 'Visitor';
    },

    newName: {
      get() {
        return '';
      },
      set(newVal) {
        if (this.role == 'Visitor') {
          State.changeConnectionId(newVal).then(state => {
            // ORM returns an array of State objects
            this.state = state[0];
          });
        } else {
          State.changeRoomId(newVal).then(state => {
            // ORM returns an array of State objects
            this.state = state[0];
          });
        }
      }
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
    }
  },
  watch: {
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
    alertVisitors() {
      this.messageSet.forEach(visitor => {
        console.info(`${this.roomId} alerting ${visitor}`);
        let text = JSON.stringify({
          sentTime: new Date(),
          sender: this.roomId,
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
            console.log(`Alerted: ${this.roomId}`);
            DataRepository.connect({
              connectionId: this.roomId,
              type: 'alert'
            });
            Connection.$fetch();
          })
          .catch(e => console.error(e));
      });
    },

    onGetCovidAlerts() {
      console.log(this.connectionId);
      axios(`/messages/connection/?connectionId=${this.connectionId}`).then(
        s => {
          this.alerts = s.data
            .map(v => this.tryParse(v.text))
            .filter(v => {
              if (v.sender) return v;
            });
          // get the text property as JSON
          // let m = s.data
          //   .map(v => {
          //     let t = v.sentTime;

          //     let x = this.tryParse(v.text);
          //     if (x) {
          //       x.sentTime = t;
          //     }
          //     return x;
          //   })
          // .filter(v => this.filterDate(v.sentTime))
          //   .filter(v => v.type?.toLowerCase() == 'alert');
          // console.dir('m:', m, { depth: 3 });
          // this.alerts = m;
          // console.log();
        }
      );
    },

    test() {
      alert('test');
    },

    async onJoinRole() {
      this.sheet = !this.sheet;

      if (this.isVisitor) {
        this.onGetNewVisitorQr();
      } else {
        this.onGetNewRoomQr();
      }
    },

    onGetNewRoomQr() {
      console.log(`getting QR code for room ${this.roomId}`);

      axios('/invitations/?id=' + this.roomId).then(s => {
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
      axios(`/messages/connection/?connectionId=${this.roomName}`).then(s => {
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
      });
    },

    // Visitor sends a login message to Room when they enter.
    // They select a room from Rooms with Local Contact Tracing and presses the mdi-account icon.
    // Because the connectionId is a guid (because its On their phone, we cache the roomName and message type
    onRoomSignIn() {
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
      this.roomId = s.roomId;
      this.incubationPeriod = s.incubationPeriod;
      this.connectionId = s.connectionId;
      this.select = { score: s.roomRiskThreshold, desc: '' };
      this.$emit('changed-is-room-risk-manager', s.isRoomRiskManager);
    }
  },

  async created() {
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
  }
};
</script>

<style lang="scss" scoped></style>
