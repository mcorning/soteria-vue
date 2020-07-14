<template>
  <v-card>
    <v-system-bar
      color="secondary"
      :height="height"
      :lights-out="lightsOut"
      :window="window"
    >
      <v-icon small>mdi-transit-connection-variant </v-icon>
      <span
        ><small>{{ serverUrl }}</small></span
      >
      <v-spacer></v-spacer>
      <v-checkbox v-model="isRoomRiskManager" label="RM" small>
        {{ isRoomRiskManager }}</v-checkbox
      >
    </v-system-bar>
    <v-card-title>Your QR Code</v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-skeleton-loader
            :loading="loading"
            :transition="transition"
            width="120"
            height="120"
            type="image"
          >
            <v-img
              @click="onMakeConnection()"
              width="120"
              height="120"
              :src="invitation"
            /> </v-skeleton-loader
        ></v-col>
        <v-col>
          <v-btn :disabled="!url" @click="sendMessage()">Send Message</v-btn>
        </v-col>
        <v-col>
          <v-btn :disabled="!url" @click="warn()">Warn</v-btn>
        </v-col>
      </v-row>
      <v-card-subtitle class="pa-0">ID: {{ id }}</v-card-subtitle>
      <v-card-subtitle class="pa-0">URL: {{ url }}</v-card-subtitle>
      <v-card-subtitle class="pa-0"
        >URL:
        <span :class="getColor()">
          {{ isRoomId ? 'Room Connection' : 'Occupant Connection' }}
        </span></v-card-subtitle
      >
    </v-card-text>
    <v-card-subtitle class="pt-0 pl=2" @click="onMakeConnection()">
      <strong>{{ msg }}</strong></v-card-subtitle
    >
    <v-card-text>
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
          <template v-slot:item.inviteUrl="{ item }">
            {{ getPath(item.inviteUrl) }}
          </template>
          <template v-slot:item.types="{ item }">
            <v-icon :color="item.isRoomId ? 'red' : 'black'">{{
              item.isRoomId ? 'mdi-account-multiple-check' : 'mdi-account-check'
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
  </v-card>
</template>

<script>
import config from '@/config.json';
import axios from 'axios';
axios.defaults.baseURL = config.BASEURL;
import Connection from '@/models/Connection';

export default {
  computed: {
    msg() {
      return this.connections.length
        ? this.selected.length
          ? `Share your selected ${
              this.isRoomRiskManager ? 'a room' : 'an occupant'
            } connection`
          : `Select ${
              this.isRoomRiskManager ? 'a room' : 'an occupant'
            } connection to share`
        : `Create a ${
            this.isRoomRiskManager ? 'a room' : 'an occupant'
          } connection`;
    },
    create() {
      return !this.connections.length;
    },
    connections() {
      return Connection.all();
    },
    inviteUrl: {
      get() {
        return Connection.query()
          .where(user => user.isRoomId)
          .get().inviteUrl;
      },
      set(newVal) {
        Connection.$update({
          where: user => user.isRoomId,
          data: { inviteUrl: newVal }
        });
      }
    },
    invitation() {
      return this.url
        ? `https://chart.googleapis.com/chart?cht=qr&chl=${this.url}&chs=200x200&chld=L|1`
        : '';
    },

    qrSource() {
      return `https://chart.googleapis.com/chart?cht=qr&chl=${this.offerUrl}&chs=200x200&chld=L|1`;
    },
    ids() {
      return this.connections.map(v => v.connectionId.substr(0, 8));
    },
    url() {
      return this.selected.length ? this.selected[0].inviteUrl : '';
    },
    id() {
      return this.selected.length ? this.selected[0].connectionId : '';
    },
    isRoomId() {
      return this.selected.length ? this.selected[0].isRoomId : '';
    }
  },

  data: () => ({
    isRoomRiskManager: false,
    serverUrl: config.BASEURL,
    height: 30,
    lightsOut: false,
    window: false,
    loading: false,
    transition: 'scale-transition',
    singleSelect: true,
    selected: [],
    headers: [
      { text: 'ID', value: 'connectionId' },
      { text: 'Connected', value: 'date' },
      { text: 'https://redir.streetcred.id...', value: 'inviteUrl' },

      { text: 'Type', value: 'types' },
      { text: 'Delete', value: 'actions' }
    ],

    connectionRequestUrl: '',
    newConnectionId: ''
  }),

  methods: {
    getColor() {
      let color = this.isRoomId ? 'red--text' : 'black--text';
      return color;
    },
    getPath(url) {
      return url.slice(-(url.length - url.lastIndexOf('/')));
    },
    deleteConnection(id) {
      console.log('Deleting', id, 'from Vuex and IndexedDb');
      Connection.$delete(id);
    },
    onListConns() {
      axios.get('connections?state=Connected').then(response => {
        console.log(response.data);
      });
    },

    async warn() {
      let url = `/verify/occupant/?connectionId=${this.id}`;
      console.log('path', url);

      await axios({
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
    },

    async sendMessage() {
      let url = `/messages`;
      console.log('path', url);
      let payload = {
        connectionId: this.id,
        text: 'I am in quarantine'
      };
      console.log(payload);
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

    async onMakeConnection() {
      this.loading = true;
      // send connectionless credential to member
      const payload = {
        // we added this wrapper so POST could get any payload
        connection: {
          multiParty: false,
          name: 'somebody you care about'
        }
      };
      console.log('payload', payload);

      // warning: if you forget the await, you will get a pending promise, and the response will be undefined
      try {
        const axiosResponse = await axios({
          url: 'streetcred',
          method: 'POST',
          data: payload,
          responseType: 'json',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log('Axios Response:', axiosResponse.data.response);
        let invitationUrl = axiosResponse.data.response.invitationUrl;
        if (invitationUrl) {
          this.connectionId = axiosResponse.data.response.connectionId;
          console.log('Connection ID:', this.connectionId);
          this.inviteUrl = invitationUrl;

          Connection.$update({
            data: {
              connectionId: this.connectionId,
              date: new Date(),
              isRoomId: this.isRoomRiskManager,
              inviteUrl: invitationUrl
            }
          });
          console.log('Connections', this.connections);
        } else {
          alert('Apologies. We had trouble connecting to Azure function.');
        }
        this.loading = false;
      } catch (error) {
        this.loading = false;
        if (error.message == 'Network Error') {
          alert('Be sure Azure function is running.');
        }
      }
    }
  },

  async created() {
    this.loading = true;
    Connection.$fetch()
      .then(x =>
        console.log(
          'ConnectionCard found',
          x.connections ? x.connections.length : '0',
          'connections'
        )
      )
      .catch(error => console.error(error));
    console.log('ConnectionCard created');
    this.loading = false;
  }
};
</script>

<style></style>
