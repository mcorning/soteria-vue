<template>
  <v-container fluid>
    <div v-if="loading">
      <h2>Loading Profile Card</h2>
    </div>

    <v-card v-else class=" mt-0 ml-0" color="black" dark flat tile>
      <v-card-title>My Profile</v-card-title>
      <v-card-text>
        <v-row no-gutters justify="center">
          <!-- Data entry form -->
          <v-col cols="12">
            <v-autocomplete
              v-model="organization"
              :loading="loading"
              :items="organizations"
              :search-input.sync="search"
              cache-items
              flat
              hint="This community organization brought you Local Contact Tracing"
              persistent-hint
              label="What community organization are you part of?"
              solo-inverted
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Room Name"
              v-model="managedRoom"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="My ID*"
              required
              :rules="[rules.required]"
              v-model="myId"
              @blur="onGetNewQr"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field label="ZipCode" v-model="zipCode"></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import config from '@/config.json';
import axios from 'axios';
axios.defaults.baseURL = config.DEBUG
  ? config.BASEURL_LOCAL
  : config.BASEURL_AZURE;

import Member from '@/models/Member';
import State from '@/models/State0';
import Connection from '@/models/Connection';
import DataRepository from '@/store/repository.js';

export default {
  watch: {
    search(val) {
      val && val !== this.organization && this.querySelections(val);
    }
  },

  computed: {
    managedRoom: {
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
    state: {
      get() {
        let s = State.query().first();

        console.log('returning state', s);
        return s;
      },
      set(newVal) {
        console.log(newVal);
      }
    },
    invitation() {
      return this.inviteUrl
        ? `https://chart.googleapis.com/chart?cht=qr&chl=${this.inviteUrl}&chs=200x200&chld=L|1`
        : '';
    },
    connections() {
      return Connection.all();
    },
    qrSource() {
      return `https://chart.googleapis.com/chart?cht=qr&chl=${this.offerUrl}&chs=200x200&chld=L|1`;
    },

    isConnected() {
      return this.myId != '';
    },

    myId: {
      get() {
        let x = this.state ? this.state.connectionId : '';
        return x;
      },
      set(newName) {
        State.changeConnectionId(newName);
      }
    },
    organization: {
      get() {
        let x = this.state ? this.state.organization : '';
        return x;
      },
      set(newName) {
        State.updateOrg(newName);
      }
    },
    zipCode: {
      get() {
        let x = this.state ? this.state.zipCode : '';
        return x;
      },
      set(newVal) {
        State.changeZipCode(newVal);
      }
    }
  },

  data: () => ({
    orgs: [],
    search: null,
    select: null,
    orgIndex: 0,
    organizations: ['ACCESSTOK_SOTERIA_LAB', 'ENDURING_NET'],
    onboard: true,
    dialog: false,
    offerUrl: '',
    loading: false,
    deepLink: `id.streetcred://launch?c_i=`,
    creds: '',
    headers: [
      {
        text: 'Test Date',
        value: 'testDate'
      },
      { text: 'Test Result', value: 'schemaId' }
    ],
    showPictureInput: false,
    changePhoto: true,

    emailRules: [
      value => !!value || 'Email is required.',
      value => value.indexOf('@') !== 0 || 'Email should have a username.',
      value => value.includes('@') || 'Email should include an @ symbol.',
      value =>
        value.indexOf('.') - value.indexOf('@') > 1 ||
        'Email should contain a valid domain.',
      value => value.includes('.') || 'Email should include a period symbol.',
      value =>
        value.indexOf('.') <= value.length - 3 ||
        'Email should contain a valid domain extension.'
    ],
    rules: {
      required: value => !!value || 'Required.',
      counter: value => value.length <= 20 || 'Max 20 characters',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
      },
      zipCode: value => {
        const pattern = /^\d{5}(?:[-\s]\d{4})?$/;
        return pattern.test(value) || 'Invalid zipcode.';
      }
    }
  }),

  methods: {
    querySelections(v) {
      this.loading = true;
      // Simulated ajax query
      // setTimeout(() => {
      this.orgs = this.organizations.filter(e => {
        return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1;
      });
      this.loading = false;
      // }, 500);
    },

    async onGetNewQr() {
      console.log(`getting QR code for ${this.myId}`);
      axios('/connections/?name=' + this.myId).then(s => {
        console.log('New Visitor QR:', s);
        this.roomInvitationUrl = s.data.url;
        // this.invitationSetup(s.data.invite);
      });
      console.log('Visitor connection invitation url', this.roomInvitationUrl);
    },

    hide() {
      this.dialog = !this.dialog;
    },

    async addCredentials() {
      console.log(this.$store.state.credentials);
      let x = await Credential.$create({ data: this.$store.state.credentials });
      console.log(x);
    },

    onRemoved() {
      this.image = '';
    },
    getMember() {
      this.member = Member.query().first();
    },

    onListConns() {
      // curl -X GET "https://api.streetcred.id/agency/v1/connections?state=Connected" -H "accept: application/json" -H "Authorization: t2w1B4MJCJjFEWZPcw1Xsmbfca2qAQnzU-cp3_pdgZg" -H "X-Streetcred-Subscription-Key: a820c2f69495430cae43c66df163cdd1"

      axios.get('connections?state=Connected').then(response => {
        console.log(response.data);
      });
    }

    // ** Move this function to component that handles Level 2 capabilities
    // async onPersonalCredential() {
    //   // send connectionless credential to member
    //   const payload = {
    //     // we added this wrapper so POST could get any payload
    //     credential: {
    //       definitionId: config.PERS_CRED_ID,
    //       automaticIssuance: true,
    //       credentialValues: {
    //         name: `${this.firstName} ${this.lastName}`,
    //         gender: this.gender,
    //         age: this.age,
    //         zipCode: this.zipCode,
    //         symptomsScore: this.symptomsScore
    //       }
    //     }
    //   };
    //   console.log('payload', payload);

    //   // warning: if youy forget the await, you will get a pending promise, and the response will be undefined
    //   try {
    //     const axiosResponse = await axios({
    //       url: 'streetcred',
    //       method: 'POST',
    //       data: payload,
    //       responseType: 'json',
    //       headers: {
    //         'Content-Type': 'application/json'
    //       }
    //     });

    //     console.log('Axios Response:', axiosResponse);
    //     this.offerUrl = axiosResponse.data.response.offerUrl;
    //     if (this.offerUrl) {
    //       console.log(this.offerUrl);
    //       // window.open(offerUrl, '_blank');
    //       this.dialog = true;
    //     } else {
    //       // this path with double response is awkward and belies fuzzy thinking...
    //       const msg = `Apologies. We had trouble creating your credential
    //       ${axiosResponse.data.response.response.body}`;
    //       //...plus we should parse the inner message json
    //       alert(msg);
    //     }
    //   } catch (error) {
    //     if (error.message == 'Network Error') {
    //       console.error('Be sure Azure function is running.');
    //     }
    //   }
    // },
  },

  async created() {
    this.loading = true;
    // let m = await Member.$fetch();
    let s = await DataRepository.getState();
    // console.log('created() Fetched member', m);
    console.log('created() Fetched state', s);
    console.log('ProfileCard0-created() using:', axios.defaults.baseURL);
    this.loading = false;
  }
};
</script>
