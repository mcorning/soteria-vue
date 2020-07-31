<template>
  <div>
    <v-card class="mb-3">
      <v-card-text>
        <v-row align="center" justify="end" no-gutters>
          <v-col cols="5"> <v-card-title>Your Role:</v-card-title> </v-col>
          <v-col>
            <!-- Room/Visitor List -->
            <v-list shaped dense>
              <v-list-item-group v-model="roleIndex" color="primary">
                <v-list-item v-for="(role, i) in roles" :key="i">
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="role.name"
                      @click="onGetRoomWarnings()"
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
                          <v-card-title>{{ newRoleCardTitle }}</v-card-title>
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
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Select a Room -->
    <v-card class="mb-3">
      <v-card-title
        >Select a Room to {{ isVisitor ? `Enter` : 'Manage' }}</v-card-title
      >
      <v-card-text>
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
                <v-icon @click="onDeleteRoom" color="red">
                  mdi-delete</v-icon
                ></v-list-item-icon
              >
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card-text>
    </v-card>

    <v-card v-if="isVisitor">
      <v-card-title>Alert Rooms...</v-card-title>
      <v-card-subtitle
        >...you occupied in the last
        {{ incubationPeriod }} days</v-card-subtitle
      >
      {{ connections }}
      <template>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="connections"
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
              item.isRoomId ? 'mdi-account-multiple-check' : 'mdi-account-check'
            }}</v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon @click="deleteConnection(item.id)">
              mdi-delete
            </v-icon>
            <!-- <v-icon @click="onWarnRooms()">
                  mdi-alert
                </v-icon> -->
            <v-bottom-sheet v-model="sheet" persistent>
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
                      :items="['Presumptive', 'Positive']"
                      label="Room notification type"
                      outlined
                    ></v-select
                  ></v-card-text>
                  <v-card-actions>
                    <v-btn class="mt-6" text color="error" @click="onWarnRooms"
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
            <!-- <v-icon @click="onWarnRooms()">
              mdi-alert
            </v-icon> -->
          </template>
        </v-data-table>
      </template>
    </v-card>

    <!-- Messages Query -->
    <v-card v-else>
      <v-card-text>
        <v-row
          v-if="!isVisitor"
          align="baseline"
          justify="start"
          no-gutters
          dense
        >
          <v-col cols="4"> <v-card-title>Message Query:</v-card-title></v-col>
        </v-row>

        <v-row
          v-if="!isVisitor"
          align="baseline"
          justify="space-around"
          no-gutters
          dense
        >
          <v-col cols="3"
            ><v-text-field
              v-model="daysBack"
              label="Look-back days"
              @change="onGetRoomWarnings"
              outlined
            ></v-text-field
          ></v-col>
          <v-col cols="4"
            ><v-text-field
              v-model="lookBackDate"
              readonly
              label="Look-back date"
              outlined
            ></v-text-field
          ></v-col>

          <v-col cols="4">
            <v-select
              v-model="messageType"
              :items="['Check-in', 'Presumptive', 'Positive']"
              label="Visitor message types"
              @change="onGetRoomWarnings"
              outlined
            ></v-select
          ></v-col>
        </v-row>

        <v-row
          v-if="!isVisitor"
          align="baseline"
          justify="space-around"
          no-gutters
          dense
        >
          <template>
            <v-col cols="11">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                outlined
              ></v-text-field
            ></v-col>
            <v-col cols="auto"
              ><v-icon @click="onGetRoomWarnings">mdi-email-sync</v-icon></v-col
            >
            <v-col cols="12">
              <v-data-table
                v-model="selected"
                :headers="messageHeaders"
                :items="messages"
                item-key="id"
                show-select
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

        <!-- <v-row v-if="showDetail">
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
            <v-card-subtitle
              >Room risk (max): {{ select.score }}</v-card-subtitle
            >
          </v-col>
          <v-col cols="12">
            <v-card-subtitle class="pa-0"
              >Visitors can enter based on the Room's riskiness.
            </v-card-subtitle>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-text>
        <v-row v-if="!isRoomRiskManager" align="center" no-gutters>
          <v-col cols="12">
            <v-text-field
              dense
              label="Phone ID:"
              :loading="loading1"
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
                communication channel) with your digital wallet. You would do
                this is you want to exchange credentials with the
                Room.</v-card-subtitle
              >
            </v-col>
          </div>
        </v-row>
      </v-card-text> -->
      </v-card-text>
    </v-card>
    {{ roomName }}
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
      messageType: 'Presumptive',
      messageText: 'Presented symptoms',
      daysBack: 5,
      sheet: false,
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
      messageHeaders: [
        { text: 'Occupant', value: 'sender' },
        { text: 'Message', value: 'text' },
        { text: 'Type', value: 'type' },
        { text: 'Sent', value: 'sentTime' }
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
        { text: 'Delete', value: 'actions' }
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
    notifyVisitors() {},

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
      console.log(t, this.messageType.toLowerCase());
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
      this.sheet = !this.sheet;
      if (!this.roomName) {
        alert('Missing roomName');
        return;
      }
      console.warn(this.connectionId, this.roomName);
      let id = this.connectionId;

      let text = JSON.stringify({
        sender: id,
        text: this.messageText,
        type: this.messageType.toLowerCase(),
        id: Date.now()
      });
      console.warn(text);
      let payload = {
        connectionId: this.roomName,
        text: text
      };

      axios({ url: '/messages', data: payload, method: 'POST' });
    },

    tryParse(str) {
      console.log(str);
      let json = {};
      try {
        json = JSON.parse(str);
      } catch (error) {
        {
          console.error(error);
        }
      }
      console.log(json);
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
    this.loading = false;
  }
};
</script>

<style lang="scss" scoped></style>
