<template>
  <div>
    <v-card>
      <v-card-title>
        Contact Tracing
      </v-card-title>

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
axios.defaults.baseURL = config.BASEURL;

export default {
  data: () => ({ newConnectionId: '' }),
  methods: {
    async onMakeConnections() {
      let url = '/connections';
      console.log('url', url);
      let axiosResponse = await axios({
        // don't forget the bloody slash, otherwise the log will be empty, but the streaming log will
        url: url,
        method: 'GET',
        // data: rawPayload,
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
        window.open(axiosResponse.data.url, '_blank');
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
