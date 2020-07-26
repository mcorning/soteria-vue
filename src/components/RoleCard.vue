<template>
  <div>
    <v-card class="mb-3">
      <v-card-text>
        <v-row align="center" justify="end" no-gutters>
          <v-col cols="5"> <v-card-title>Your Role:</v-card-title> </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-chip large @click="isRoomRiskManager = !isRoomRiskManager">
              {{ role }}
              <v-icon right>mdi-pencil</v-icon>
            </v-chip>
          </v-col>
        </v-row>
        <v-row v-if="isRoomRiskManager" align="center" no-gutters>
          <v-col cols="12">
            <v-card-text>
              <v-text-field
                dense
                v-model="roomId"
                @change="onGetNewRoomQr"
                label="Room ID:"
                hint="This ID must be unique"
                clearable
              >
                <template v-slot:loader>
                  <span>Getting QR code...</span>
                </template>
              </v-text-field>
            </v-card-text>
          </v-col>
        </v-row>
        <v-row v-if="isRoomRiskManager" align="center" no-gutters>
          <v-col cols="12">
            <v-card-text>
              <v-btn @click="onGetRoomWarnings">
                Check for exposure warnings
              </v-btn>
            </v-card-text>
          </v-col>
        </v-row>

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
              v-model="connectionId"
              @change="onGetNewVisitorQr"
              hint="Get your connectionId from the name in your Phone settings"
              label="Phone ID:"
              :loading="loading1"
            >
              <template v-slot:loader>
                <span>Getting QR code...</span>
              </template>
            </v-text-field>
          </v-col>
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
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Available Rooms -->
    <v-card>
      <v-row>
        <v-card-title>Available Rooms</v-card-title>
        <v-card-text>
          <v-list shaped>
            <v-list-item-group v-model="room" color="primary">
              <v-list-item v-for="(room, i) in rooms" :key="i">
                <v-list-item-content>
                  <v-list-item-title v-text="room"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon @click="onDeleteRoom" color="red">
                    mdi-delete</v-icon
                  ></v-list-item-icon
                >
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>
      </v-row>
    </v-card>
    <v-card>
      <v-container
        justify="center"
        class="primary lighten-5"
        v-if="role == 'Visitor'"
      >
        <v-btn color="primary" block @click="onRoomSignIn"
          >Sign the Visitor Book for {{ rooms[room] }}
        </v-btn>
        <v-card-subtitle
          >These are the rooms you occupied in the last
          {{ incubationPeriod }} days</v-card-subtitle
        >
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
                item.isRoomId
                  ? 'mdi-account-multiple-check'
                  : 'mdi-account-check'
              }}</v-icon>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon @click="deleteConnection(item.id)">
                mdi-delete
              </v-icon>
              <v-icon @click="onWarnRooms(item.connectionId)">
                mdi-alert
              </v-icon>
            </template>
          </v-data-table>
        </template>
      </v-container>
    </v-card>
  </div>
</template>

<script>
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
    connections() {
      return Connection.all();
    },
    roomName() {
      return this.rooms[this.room];
    },

    qrSourceRoom() {
      console.log('Room url', this.roomInvitationUrl);

      return `https://chart.googleapis.com/chart?cht=qr&chl=${this.roomInvitationUrl}&chs=200x200&chld=L|1`;
    },
    role() {
      return this.state?.isRoomRiskManager ? 'Room' : 'Visitor';
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
    onWarnRooms(connectionId) {
      let text = JSON.stringify({
        sender: this.connectionID,
        text: 'exposure alert',
        type: 'presumptive'
      });
      let payload = {
        connectionId: connectionId,
        text: text
      };

      axios({ url: '/messages', data: payload, method: 'POST' });
    },
    onGetRoomWarnings() {
      axios(`/messages/connection/?connectionId=${this.roomName}`).then(s => {
        console.log('Messages:', s);
        console.dir(JSON.parse(s.data[s.data.length - 1].text).type);
      });
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

    deleteConnection(id) {
      if (this.selected.length) {
        if (confirm(`Deleting ${this.selected.length} occupancies`)) {
          this.selected.forEach(key => {
            console.log(key.id, 'deleted');
            Connection.$delete(key.id);
          });
        }
      } else {
        if (confirm('Deleting ' + id)) {
          Connection.$delete(id);
        }
      }
      Connection.$fetch();
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

    onRoomSignIn() {
      let payload = {
        connectionId: this.roomName,
        text: `${this.connectionId} signed into ${this.roomName}.`
      };
      console.log('Signing in with payload:', payload);
      axios({ url: '/messages', data: payload, method: 'POST' })
        .then(() => {
          console.log(`Signed into: ${this.roomName}`);
          DataRepository.connect(this.roomName);
          Connection.$fetch();
        })
        .catch(e => console.error(e));
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
      this.connectionId = s.connectionId;
      this.incubationPeriod = s.incubationPeriod;

      this.select = { score: s.roomRiskThreshold, desc: '' };
      this.$emit('changed-is-room-risk-manager', s.isRoomRiskManager);
    },

    invitationSetup(d_m) {
      let isMobile = true; //window.document.width() < 576;
      // let urlParams = new URLSearchParams(window.location.search);
      // let d_m;
      // let orig = 'https://link.streetcred.id/';
      console.log(d_m.length);
      console.log(d_m.length % 4);

      /****************************************************************************
    Check Parameters
  ****************************************************************************/
      // if (urlParams.has('d_m')) {
      //   d_m = urlParams.get('d_m');
      // } else if (urlParams.has('c_i')) {
      //   d_m = urlParams.get('c_i');
      // } else {
      //   console.error('Missing d_m/c_i parameter');
      //   this.invitationError();
      //   return;
      // }
      // if (urlParams.has('orig')) {
      //   this.orig = urlParams.get('orig');
      // } else {
      //   console.error('Missing orig parameter');
      //   this.invitationError();
      //   return;
      // }

      /****************************************************************************
      Parse the DID Document
      ****************************************************************************/
      let didDoc = JSON.parse(atob(d_m));
      console.log(didDoc);
      let type = didDoc['@type'];

      /****************************************************************************
      If type is Connection Invitation
      ****************************************************************************/
      if (type.includes('invitation')) {
        //   document.getElementById('root').innerHTML = `
        //   <div class="container p-md-5 p-3 shadow-sm bg-white rounded">
        //     <div class="row justify-content-center">
        //       <div class="col-md-10 col-12">
        //         <h4>You're invited to connect.</h4>
        //         <p class="d-none d-md-block">Scan the QR code with your Trinsic wallet to connect with this organization.</p>
        //         <h6>Organization: ${didDoc.label}</h6>
        //       </div>
        //       <div class="col-md-2 col-6 text-centered">
        //         <img src=${didDoc.imageUrl} class="rounded" width="60%">
        //       </div>
        //     </div>
        //     <div class="row justify-content-center">
        //       <div class="col-7 text-centered w-50">
        //         <img id="qrcode" class="p-3">
        //       </div>
        //     </div>
        //     <div class="row justify-content-center">
        //       <div class="col text-centered">
        //         <button id="wallet" type="button" class="btn btn-streetcred mt-3 mb-3">Open in Wallet</button>
        //       </div>
        //     </div>
        //   </div>
        // `;
      } else if (type.includes('request-presentation')) {
        /****************************************************************************
        If type is Connectionless Verification
        ****************************************************************************/
        let data = JSON.parse(
          atob(didDoc['request_presentations~attach'][0].data.base64)
        );
        let requestedAttrs = data.requested_attributes;
        let attrs = Object.keys(requestedAttrs);

        attrs.forEach(attr => {
          this.domAttrs += `<div class="normal-text attr">${attr}</div>`;
        });

        //   document.getElementById('root').innerHTML = `
        //   <div class="container">
        //     <h4>You've received a proof request from Trinsic.</h4>
        //     <p class="d-none d-md-block">Scan the QR code with your Trinsic wallet to complete it.</p>
        //   </div>
        //   <div class="container p-md-5 p-3 shadow-sm bg-white rounded">
        //     <div class="row justify-content-center">

        //       <div class="col-md-7 order-md-1 col-7 order-12">

        //         <div class="row justify-content-center">
        //           <div class="col text-centered">
        //             <img id="qrcode" class="p-3">
        //           </div>
        //         </div>

        //         <div class="row justify-content-center">
        //           <div class="col text-centered">
        //             <button id="wallet" type="button" class="btn btn-streetcred mt-3 mb-3">Open in Wallet</button>
        //           </div>
        //         </div>

        //       </div>

        //       <div class="col-md-5 order-md-12 col-12 order-1">
        //       <a class="attr-dropdown ${
        //         isMobile ? '' : 'no-pointer'
        //       }" data-toggle="${
        //     isMobile ? 'collapse' : ''
        //   }" href="#attrs" role="button" aria-expanded="false" aria-controls="proof attributes">
        //         <h6>
        //           <span>
        //             <img id="chevron-down" src="./images/chevron-down.svg" style="display: none" >
        //             <img id="chevron-right" src="./images/chevron-right.svg" style="display: ${
        //               isMobile ? 'inline' : 'none'
        //             }" >
        //             Attributes to Prove
        //           </span>
        //         </h6>
        //       </a>
        //         <div class="collapse ${isMobile ? '' : 'show'}" id="attrs">
        //           ${domAttrs}
        //         </div>
        //       </div>

        //     </div>
        //   </div>
        // `;
        // $('#attrs').on('hide.bs.collapse', function() {
        //   let chevronDown = document.getElementById('chevron-down');
        //   let chevronRight = document.getElementById('chevron-right');

        //   chevronDown.style.display = 'none';
        //   chevronRight.style.display = 'inline';
        // });
        // $('#attrs').on('show.bs.collapse', function() {
        //   let chevronDown = document.getElementById('chevron-down');
        //   let chevronRight = document.getElementById('chevron-right');

        //   chevronDown.style.display = 'inline';
        //   chevronRight.style.display = 'none';
        // });
      } else if (type.includes('offer-credential')) {
        /****************************************************************************
        If type is Connectionless Credential Offer
        ****************************************************************************/
        let data = JSON.parse(atob(didDoc['offers~attach'][0].data.base64));
        let schemaId = data.schema_id;
        let credentialTitle = schemaId.substring(schemaId.indexOf(':') + 1);
        credentialTitle = credentialTitle.substring(
          credentialTitle.indexOf(':') + 1
        );
        credentialTitle = credentialTitle.substring(
          0,
          credentialTitle.indexOf(':')
        );
        console.log(credentialTitle);
        let previewAttrs = didDoc['credential_preview'].attributes;
        // let domAttrs = '';
        previewAttrs.forEach(attr => {
          this.domAttrs += `
          <div class="row normal-text">
            <div class="col left">
              <div class="attr">${attr.name}</div>
            </div>
            <div class="col right">
              <div class="attrv">${attr.value}</div>
            </div>
          </div>
        `;
        });

        //   document.getElementById('root').innerHTML = `
        //   <div class="container">
        //     <h4>You've received a credential offer.</h4>
        //     <p class="d-none d-md-block">Scan the QR code with your Trinsic wallet to accept it.</p>
        //   </div>
        //   <div class="container p-md-5 p-3 shadow-sm bg-white rounded">

        //     <div class="row justify-content-center no-gutters">
        //       <div class="col-md-6 order-md-1 mr-md-auto col-7 order-12">

        //         <div class="row justify-content-center">
        //           <div class="col text-centered">
        //             <img id="qrcode" class="p-3">
        //           </div>
        //         </div>

        //         <div class="row justify-content-center">
        //           <div class="col text-centered">
        //             <button id="wallet" type="button" class="btn btn-streetcred mt-3 mb-3">Open in Wallet</button>
        //           </div>
        //         </div>

        //       </div>

        //       <div class="col-md-5 order-md-12 mr-md-5 pr-md-5 col-12 order-1">

        //           <div class="card credential-card d-none d-md-block mr-auto ml-auto">
        //             <div class="credential-banner"></div>
        //             <div class="card-body">
        //               <div class="row align-items-center">
        //                 <div class="col-4">
        //                   <div class="credential-logo">${credentialTitle.charAt(
        //                     0
        //                   )}</div>
        //                 </div>

        //                 <div class="col">
        //                   <h6>${credentialTitle}</h6>
        //                 </div>
        //               </div>
        //             </div>
        //           </div>

        //           <div class="d-block d-md-none">
        //             <h6>${credentialTitle}</h6>
        //           </div>

        //           <a class="attr-dropdown ${
        //             isMobile ? '' : 'no-pointer'
        //           }" data-toggle="${
        //     isMobile ? 'collapse' : ''
        //   }" href="#attrs" role="button" aria-expanded="false" aria-controls="proof attributes">
        //             <h6>
        //               <span>
        //                 <img id="chevron-down" src="./images/chevron-down.svg" style="display: none" >
        //                 <img id="chevron-right" src="./images/chevron-right.svg" style="display: ${
        //                   isMobile ? 'inline' : 'none'
        //                 }" >
        //                 Attributes
        //               </span>
        //             </h6>
        //           </a>
        //           <div class="collapse ${isMobile ? '' : 'show'}" id="attrs">
        //             ${domAttrs}
        //           </div>

        //       </div>

        //     </div>
        //   </div>
        // `;
        // $('#attrs').on('hide.bs.collapse', function() {
        //   let chevronDown = document.getElementById('chevron-down');
        //   let chevronRight = document.getElementById('chevron-right');

        //   chevronDown.style.display = 'none';
        //   chevronRight.style.display = 'inline';
        // });
        // $('#attrs').on('show.bs.collapse', function() {
        //   let chevronDown = document.getElementById('chevron-down');
        //   let chevronRight = document.getElementById('chevron-right');

        //   chevronDown.style.display = 'inline';
        //   chevronRight.style.display = 'none';
        // });
      }

      /****************************************************************************
      QR Code and Wallet Link
      ****************************************************************************/
      if (isMobile === false) {
        // var qr = new QRious({
        // new QRious({
        //   element: document.getElementById('qrcode'),
        //   value: orig,
        //   size: 300,
        //   background: 'white',
        //   foreground: 'black'
        // });
      }

      // document.getElementById('wallet').addEventListener('click', function() {
      //   window.location.href = `id.streetcred://launch?c_i=${d_m}`;
      // });
    },
    invitationError() {
      alert('Uh Oh! There seems to be a problem with the invitation link...');
    }
  },

  async created() {
    this.loading = true;
    await Connection.$fetch();

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
