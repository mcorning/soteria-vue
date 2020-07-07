<template>
  <v-card>
    <v-card-title>Your QR Code</v-card-title>
    <v-card-text>
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
        />
      </v-skeleton-loader>
      <v-card-subtitle class="pa-0">ID: {{ id }}</v-card-subtitle>
      <v-card-subtitle class="pa-0">URL: {{ url }}</v-card-subtitle>
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
          ? 'Share your selected connection'
          : 'Select a connection to share'
        : 'Create a connection';
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
        // this.selected = newVal;
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
    }
  },

  data: () => ({
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
    getPath(url) {
      return url.slice(-(url.length - url.lastIndexOf('/')));
    },
    deleteConnection(id) {
      console.log('Deleting', id, 'from Vuex and IndexedDb');
      Connection.$delete(id);
    },
    onListConns() {
      // curl -X GET "https://api.streetcred.id/agency/v1/connections?state=Connected" -H "accept: application/json" -H "Authorization: t2w1B4MJCJjFEWZPcw1Xsmbfca2qAQnzU-cp3_pdgZg" -H "X-Streetcred-Subscription-Key: a820c2f69495430cae43c66df163cdd1"

      axios.get('connections?state=Connected').then(response => {
        console.log(response.data);
      });
    },
    async onMakeConnection() {
      this.loading = true;
      // send connectionless credential to member
      const payload = {
        // we added this wrapper so POST could get any payload
        connection: {
          multiParty: true,
          name: 'somebody you care about'
        }
      };
      console.log('payload', payload);

      // warning: if youy forget the await, you will get a pending promise, and the response will be undefined
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
              isRoomId: !this.isRoomRiskManager,
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
          console.error('Be sure Azure function is running.');
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
