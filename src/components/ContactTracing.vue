<template>
  <v-row>
    <v-col cols="12">
      <RoleCard
        @changed-is-room-risk-manager="onChangedIsRoomRiskManager"
        @changed-room-risk-threshold="onChangedRoomRiskThreshold"
    /></v-col>

    <v-col cols="12">
      <v-card>
        <v-stepper v-model="e1" vertical>
          <v-stepper-step :complete="e1 > 1" step="1">
            <p>Get connected</p>
            <p>
              <small>Visitor and Room exchange connection IDs.</small>
            </p>
          </v-stepper-step>
          <v-stepper-content step="1">
            <!-- Don't use dark prop if you want to use the loader template -->
            <v-btn
              color="primary"
              block
              @click="loader = 'loading1'"
              :loading="loading1"
              :disabled="loading1"
              >{{ buttonLabel }}
              <template v-slot:loader>
                <span>Making connections...</span>
              </template></v-btn
            >
            <v-text-field v-model="newConnectionId" :label="newConnectionLabel">
            </v-text-field>
            <v-btn @click="notify('I am sick', newConnectionLabel)"
              >Send Message</v-btn
            >
          </v-stepper-content>
        </v-stepper>
      </v-card></v-col
    >

    <v-col cols="12">
      <v-card>
        <v-stepper v-model="e2" vertical>
          <v-stepper-step :complete="e2 > 2" step="2">
            <p>Communicate</p>
            <p>
              <small
                >Anybody who gets sick notifies all rooms occupied in the last
                {{ incubationPeriod }} days.</small
              >
            </p>
          </v-stepper-step>

          <v-stepper-content step="2">
            <!-- Don't use dark prop if you want to use the loader template -->
            <v-btn
              color="primary"
              block
              @click="loader = 'loading2'"
              :loading="loading2"
              >Alert {{ buttonLabelAlert }}s
              <template v-slot:loader>
                <span>Alerting {{ buttonLabelAlert }}s...</span>
              </template></v-btn
            >
            <v-card-text>
              <v-row no-gutters justify="end">
                <v-col cols="6">
                  Key: Room
                  <v-icon color="red">{{
                    'mdi-account-multiple-check'
                  }}</v-icon></v-col
                >
                <v-col cols="6">
                  Visitor
                  <v-icon color="black">{{ 'mdi-account-check' }}</v-icon>
                </v-col>
              </v-row>
              <template>
                <v-data-table
                  v-model="selected"
                  :headers="headers"
                  :items="connections"
                  :items-per-page="1"
                  item-key="connectionId"
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
                    {{ item.connectionId.substr(0, 8) }}...
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
                  <template v-slot:item.actions="{ item }">
                    <v-icon @click="deleteConnection(item.connectionId)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </template>
            </v-card-text>
            <!-- <ConnectionCard /> -->
            <!-- <v-text-field
              v-model="newConnectionId"
              :label="newConnectionLabel"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append="show1 = !show1"
            >
            </v-text-field> -->
            <v-card-text class=" red--text pt-0">
              Connections active for {{ incubationPeriod }} days.
            </v-card-text>
            <div v-if="show1">
              connections<small
                ><pre>{{ connections }}</pre></small
              >
            </div>
          </v-stepper-content>
        </v-stepper>
      </v-card></v-col
    >
    <v-dialog v-if="dialog" v-model="dialog" persistent max-width="300px">
      <template v-slot:activator="{ on }">
        <v-layout align-center justify-center>
          <v-btn color="primary" block dark v-on="on" class=".subtitle-2"
            >Leave your connection</v-btn
          >
        </v-layout>
      </template>

      <v-card class="card">
        <v-card-text
          >Switch to your digital wallet, press the Scan Code button, and point
          your camera to this QR code.</v-card-text
        >
        <v-img
          id="qr"
          class="white--text align-end"
          :src="qrSource"
          lazy-src="https://picsum.photos/id/11/100/60"
          height="200"
          width="200"
          alt="QR code appears here"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="openInWallet()"
            v-tooltip="{
              content:
                'Skip the QR code, and open the verification request in your wallet.',
              classes: '.subtitle-2'
            }"
            >Open in Wallet</v-btn
          >
        </v-card-actions>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="hide()">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import config from '@/config.json';
import axios from 'axios';
axios.defaults.baseURL = config.BASEURL;

import Connection from '@/models/Connection';
import RoleCard from '@/components/RoleCard';
// import ConnectionCard from '@/components/ConnectionCard';

import DataRepository from '@/store/repository.js';

export default {
  components: {
    RoleCard
    // ConnectionCard
  },
  watch: {
    loader() {
      const l = this.loader;
      console.log('loader', l);
      this[l] = !this[l];
      if (l == 'loading1') {
        this.onMakeConnections().then(() => {
          this[l] = false;
          this.loader = null;
        });
      } else if (l == 'loading2') {
        console.time('notifying...');
        this.onNotify("I'm in quarantine.").then(() => {
          this[l] = false;
          this.loader = null;
          console.timeEnd('notifying...');
        });
      }
    }
  },
  computed: {
    role() {
      let x = this.isRoomRiskManager ? 'Room' : 'Visitor';
      return x;
    },

    buttonLabel() {
      let x = this.isRoomRiskManager ? 'Visitor' : 'Room';
      return `Get ${x}'s Connection ID`;
    },
    buttonLabelAlert() {
      let x = this.isRoomRiskManager ? 'Visitor' : 'Room';
      return x;
    },

    msg() {
      let x = this.isRoomRiskManager ? 'your Visitor' : 'the Room';
      return `Make a connection with ${x}. Then you can exchange warnings if anybody ends up exposed to the virus.`;
    },
    newConnectionLabel() {
      let x = this.isRoomRiskManager ? "Visitor's" : "Room's";
      return x + ' connections ID:';
    },
    qrSource() {
      return `https://chart.googleapis.com/chart?cht=qr&chl=${this.connectionRequestUrl}&chs=200x200&chld=L|1`;
    },

    connections() {
      return Connection.all();
    }
  },

  data: () => ({
    transition: 'scale-transition',
    singleSelect: true,
    selected: [],
    headers: [
      { text: 'ID', value: 'connectionId' },
      { text: 'Connected', value: 'date' },
      { text: 'Type', value: 'types' },
      { text: 'Delete', value: 'actions' }
    ],
    incubationPeriod: 14,
    roomRiskThreshold: null,
    isRoomRiskManager: false,
    e1: 1,
    e2: 2,
    loader: null,
    loading: false,
    loading1: false,
    loading2: false,
    show1: false,
    dialog: false,
    confirm: false,
    connectionRequestUrl: '',
    newConnectionId: '',
    m: null
  }),
  methods: {
    onChangedRoomRiskThreshold(val) {
      this.roomRiskThreshold = val;
    },
    onChangedIsRoomRiskManager(val) {
      this.isRoomRiskManager = val;
    },

    async onMakeConnections() {
      this.dialog = true;
      let url = '/connections';
      console.log('url', url);
      let axiosResponse = await axios({
        url: url,
        method: 'GET',
        responseType: 'json',
        headers: {
          'Content-Type': 'text/html'
        }
      }).catch(e => {
        console.log('Catch Axios - ', e);
        return;
      });

      if (axiosResponse) {
        console.log('Axios Response:', axiosResponse);
        console.log('New connectionId', axiosResponse.data.connectionId);
        this.newConnectionId = axiosResponse.data.connectionId;
        this.connectionRequestUrl = axiosResponse.data.url;
      } else {
        alert('Apologies. We had trouble creating your credential.');
      }
    },

    openInWallet() {
      console.log('Deep link content:', this.verificationData);
      window.location.href = `id.streetcred://launch?c_i=${this.verificationData}`;
    },
    hide() {
      this.dialog = !this.dialog;
      this.confirm = true;
      this.checkConnection();
    },

    async checkConnection() {
      // confirm invitation's Connected state
      let url = `/connection/?connectionId=${this.newConnectionId}`;
      console.log('url', url);
      let axiosResponse = await axios({
        url: url,
        method: 'GET',
        responseType: 'json',
        headers: {
          'Content-Type': 'text/html'
        }
      }).catch(e => {
        console.log('Catch Axios - ', e);
        return;
      });

      if (axiosResponse) {
        console.log('Axios Response:', axiosResponse);
        console.log('State of invitation', axiosResponse.data.state);
        if (axiosResponse.data.state == 'Connected') {
          // note: if the offeror is a room then the accepting connection cannot be a room
          // so we set the isRoomId to false
          Connection.$update({
            data: {
              connectionId: this.newConnectionId,
              date: new Date(),
              isRoomId: !this.isRoomRiskManager
            }
          });
        }
      } else {
        alert('Apologies. We had trouble creating your credential.');
      }
    },

    async onNotify(msg) {
      Connection.all().forEach(conn => {
        this.warn(msg, conn.connectionId);
      });
    },

    async warn(msg, connectionId) {
      let url = `/verify/occupant/?connectionId=${connectionId}`;
      console.log('path', url);

      let payload = {
        connectionId: connectionId
      };
      console.log('msg:', msg);
      console.log('payload:', payload);
      await axios({
        url: url,
        method: 'GET',
        // data: payload,
        responseType: 'json',
        headers: {
          'Content-Type': 'text/html'
        }
      }).catch(e => {
        console.log('Catch Axios - ', e);
        return;
      });
    },

    async notify(msg, connectionId) {
      let url = '/messages';
      console.log('url', url);

      let payload = {
        connectionId: connectionId,
        text: msg
      };
      console.log('payload:', payload);
      await axios({
        url: url,
        method: 'POST',
        data: payload,
        responseType: 'json',
        headers: {
          'Content-Type': 'text/html'
        }
      }).catch(e => {
        console.log('Catch Axios - ', e);
        return;
      });
    },

    async onGetLastMessage() {
      let url = `/messages/connection/?connectionId=${this.newConnectionId}`;
      console.log('url:', url);

      let results = await axios({
        url: url,
        method: 'GET',
        responseType: 'json',
        headers: {
          'Content-Type': 'text/html'
        }
      }).catch(e => {
        console.log('Catch Axios - ', e);
        return;
      });
      let msgs = results.data;
      console.log(msgs);
      let msg = msgs[msgs.length - 1];
      alert(msg.sentTime + '\n' + msg.text);
    },

    async getState() {
      console.log('in RoleCard.getState()');
      let s = await DataRepository.getState();
      this.state = s;
      console.log('in RoleCard this.state:', this.state);
      this.incubationPeriod = s.incubationPeriod;
      this.$emit('changed-is-room-risk-manager', s.isRoomRiskManager);
    }
  },
  async created() {
    this.loading = true;

    await Connection.$fetch();
    console.log('ContactTracing using:', axios.defaults.baseURL);
    await this.getState();

    this.loading = false;
  }
};
</script>

<style></style>
