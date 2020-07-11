<template>
  <div>
    <v-dialog v-if="dialog" v-model="dialog" persistent max-width="300px">
      <template v-slot:activator="{ on }">
        <v-layout align-center justify-center>
          <v-btn color="primary" block dark v-on="on" class=".subtitle-2"
            >Leave your connection</v-btn
          >
        </v-layout>
      </template>

      <v-card class="card">
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

        <!-- <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="openInWallet"
            v-tooltip="{
              content:
                'Skip the QR code, and open the verification request in your wallet.',
              classes: '.subtitle-2'
            }"
            >Open in Wallet</v-btn
          >
        </v-card-actions> -->

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="hide">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-container>
      <v-card>
        <v-card-title>
          Local Contact Tracing
        </v-card-title>
        <v-card-text>
          If we gather, we assume each of us is safe. But what if we're wrong?
          <p>We can stop a virus in two simple steps:</p>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container>
      <v-card>
        <v-card-title>Step 1: Get ready</v-card-title>

        <v-card-text>
          {{ msg }}
        </v-card-text>
        <v-card-actions class="pt-0">
          <v-btn
            color="primary"
            @click="onMakeConnections"
            block
            dark
            :disabled="false"
            >{{ buttonLabel }}</v-btn
          >
        </v-card-actions>
        <v-text-field
          v-model="newConnectionId"
          :label="newConnectionLabel"
          class="pl-3 pr-3 pt-1"
          :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="show1 = !show1"
        >
        </v-text-field>
        <v-card-text class="pt-1 red--text pt-2">
          Your app deletes connectionIds every five days.
        </v-card-text>
        <div v-if="show1">
          connections<small
            ><pre>{{ connections }}</pre></small
          >
        </div>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import Member from '@/models/Member';
import Connection from '@/models/Connection';
import Preference from '@/models/Preference';

import config from '@/config.json';
import axios from 'axios';
axios.defaults.baseURL = config.BASEURL;

export default {
  computed: {
    buttonLabel() {
      let x = this.isRoomRiskManager ? 'Visitor' : 'Room';
      return `Connect with ${x}`;
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
    member() {
      console.log('Member ready?', this.m);
      if (this.m) {
        let m = Member.query()
          .with('preferences')
          .first();

        console.log('returning member', m);

        return m;
      }
      return null;
    },
    isRoomRiskManager: {
      get() {
        return this.member
          ? this.member.preferences
            ? this.member.preferences.isRoomRiskManager
            : false
          : false;
      },
      set(newVal) {
        Preference.changeisRoomRiskManager(this.perfID, newVal);
      }
    },
    perfID() {
      if (!this.member.preferences) {
        this.fixPrefs();
      }
      return this.member.preferences.id;
    },
    connections() {
      return Connection.all();
    }
  },

  data: () => ({
    show1: false,
    dialog: false,
    confirm: false,
    connectionRequestUrl: '',
    newConnectionId: '',
    m: null
  }),
  methods: {
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

    async onNotify(msg) {
      // let x = Connection.query().first();
      // console.log('warning', x);
      // this.warn(msg, x.connectionId);
      Connection.all().forEach(conn => {
        this.warnOccupants(msg, conn.connectionId);
      });
    },

    async warnOccupants(msg, connectionId) {
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
    }
  },
  async created() {
    this.loading = true;
    this.m = await Member.$fetch();
    await Preference.$fetch();
    await Connection.$fetch();
    console.log('created() Fetched member', this.m);
    console.log('Using:', axios.defaults.baseURL);

    this.loading = false;
  }
};
</script>

<style></style>
