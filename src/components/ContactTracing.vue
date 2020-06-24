<template>
  <div>
    <v-dialog v-if="dialog" v-model="dialog" persistent max-width="300px">
      <template v-slot:activator="{ on }">
        <v-layout align-center justify-center>
          <v-btn
            color="primary"
            block
            dark
            v-on="on"
            class=".subtitle-2"
            v-tooltip="{
              content:
                'Leave your connectionId with the room so they can notify you of exposure.',
              classes: '.subtitle-2'
            }"
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
    <v-card>
      <v-card-title>
        Contact Tracing
      </v-card-title>
      <v-card-text>
        As an occupant, the first thing you need to do is leave your
        connectionId with the room. During local contact tracing, the room uses
        this connectionId to notify you of exposure to the virus.
        <p class="red--text">
          This app deletes connectionIds every fourteen days.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          @click="onMakeConnections"
          block
          dark
          :disabled="false"
          >Make connections</v-btn
        >
      </v-card-actions>
      <v-text-field
        v-model="newConnectionId"
        label="New connectionId"
        class="pl-3 pr-3"
      >
      </v-text-field>
      <v-card-text>
        If you show symptoms or receive a positive COVID-19 test, send a warning
        to all the connections you have made in the last five days.
      </v-card-text>
      <v-card-text>
        Otherwise, ping the network periodically to see if anyone else (you
        contacted) has come down with the virus (in the last five days).
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="secondary"
          @click="onGetLastMessage"
          dark
          block
          :disabled="false"
          >Check for exposure alerts</v-btn
        >
      </v-card-actions>
      <v-container>
        <v-row align="center" justify="center" no-gutters
          ><v-col cols="12">
            <v-card class="pa-1 text-center" outlined tile>
              Notify
            </v-card>
          </v-col></v-row
        >
        <v-row no-gutters justify="center" dense
          ><v-col cols="6">
            <v-card-actions>
              <v-btn
                color="primary"
                @click="onNotify('I am in quarantine.')"
                dark
                block
                :disabled="false"
              >
                Rooms</v-btn
              >
            </v-card-actions></v-col
          >
          <v-col cols="6">
            <v-card-actions>
              <v-btn
                color="primary"
                @click="
                  onNotify(
                    'You may have been exposed to Covid-19 within the last five days.'
                  )
                "
                dark
                block
                :disabled="false"
              >
                Occupants</v-btn
              >
            </v-card-actions></v-col
          ></v-row
        ></v-container
      >
    </v-card>
  </div>
</template>

<script>
import config from '@/config.json';
import axios from 'axios';
axios.defaults.baseURL = config.BASEURL_AZURE;

export default {
  computed: {
    qrSource() {
      return `https://chart.googleapis.com/chart?cht=qr&chl=${this.connectionRequestUrl}&chs=200x200&chld=L|1`;
    }
  },

  data: () => ({
    dialog: false,
    confirm: false,
    connectionRequestUrl: '',
    newConnectionId: ''
  }),
  methods: {
    openInWallet() {
      console.log('Deep link content:', this.verificationData);
      window.location.href = `id.streetcred://launch?c_i=${this.verificationData}`;
    },
    hide() {
      this.dialog = !this.dialog;
      this.confirm = true;
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
        // window.open(axiosResponse.data.url, '_blank');
        this.connectionRequestUrl = axiosResponse.data.url;
      } else {
        alert('Apologies. We had trouble creating your credential.');
      }
    },

    async onNotify(msg) {
      let url = '/messages';
      console.log('url', url);
      let payload = {
        connectionId: this.newConnectionId,
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
  }
};
</script>

<style></style>
