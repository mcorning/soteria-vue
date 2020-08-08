<template>
  <div>
    <div v-if="loading">
      <h2>Loading Profile Card</h2>
    </div>

    <div class=" mt-0 ml-0" v-else>
      <v-card color="black" dark flat tile>
        <v-card-title>My PII</v-card-title>
        <v-card-subtitle>My Personal Identifying Information</v-card-subtitle>

        <v-card-text>
          <v-row no-gutters justify="center">
            <!-- change photo and helpers-->
            <v-col cols="5">
              <v-row justify="space-between">
                <v-col v-if="changePhoto" cols="6">
                  <picture-input
                    :prefill="image"
                    :prefillOptions="{ mediaType: 'image/png' }"
                    @change="addImage"
                    accept="image/jpeg, image/png, image/gif"
                  ></picture-input>
                </v-col>

                <!-- ConnectionID QR -->
                <!-- <v-col>
                      <v-card-subtitle @click="onDeleteAllConnections()">
                        To participate in local contact tracing you need a
                        Connection ID.</v-card-subtitle
                      >
                      <v-btn
                        v-if="!inviteUrl"
                        @click="onMakeConnection()"
                        color="primary"
                      >
                        Get a QR code
                      </v-btn>
                      <v-img
                        v-if="inviteUrl"
                        @click="onMakeConnection()"
                        width="120"
                        height="120"
                        :src="invitation"
                      />
                      <small
                        ><pre>{{ connections }}</pre></small
                      >
                    </v-col> -->
              </v-row>
            </v-col>
            <!-- Data entry form -->
            <v-col>
              <v-row no-gutters>
                <v-subheader class="py-5">Fields for LCT</v-subheader>

                <v-col cols="12">
                  <v-text-field
                    label="Phone name*"
                    required
                    :rules="[rules.required]"
                    dense
                    v-model="connectionId"
                    @blur="onGetNewQr"
                  ></v-text-field>
                </v-col>
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
              </v-row>
              <v-spacer></v-spacer>
              <v-subheader class="pt-7">Fields for Credentials</v-subheader>
              <v-row justify="center" dense>
                <v-col cols="12">
                  <v-text-field
                    label="First name*"
                    required
                    dense
                    :rules="[rules.required]"
                    v-model="firstName"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    label="Last name*"
                    required
                    :rules="[rules.required]"
                    dense
                    v-model="lastName"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="ZipCode*"
                    required
                    :rules="[rules.required, rules.zipCode]"
                    dense
                    v-model="zipCode"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    :items="['0-17', '18-29', '30-54', '54+']"
                    label="Age*"
                    required
                    dense
                    v-model="age"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-autocomplete
                    v-model="gender"
                    label="Gender"
                    :items="['Male', 'Female', 'NA']"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import config from '@/config.json';
import axios from 'axios';
axios.defaults.baseURL = config.DEBUG
  ? config.BASEURL_LOCAL
  : config.BASEURL_AZURE;

import PictureInput from 'vue-picture-input';

import Member from '@/models/Member';
import State from '@/models/State';
import Connection from '@/models/Connection';
import DataRepository from '@/store/repository.js';

export default {
  watch: {
    search(val) {
      val && val !== this.organization && this.querySelections(val);
    }
  },

  components: {
    PictureInput
  },

  computed: {
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
      return this.connectionId != '';
    },
    isReady() {
      return Member.all().length > 0;
    },
    member() {
      let m = Member.query()
        .with('preferences')
        .first();

      console.log('returning member', m);
      return m;
    },
    state() {
      let s = State.query().first();

      console.log('returning state', s);
      return s;
    },

    image() {
      let image = this.isReady ? this.member.image : '';
      return image;
    },
    perfID() {
      if (!this.member.preferences) {
        this.fixPrefs();
      }
      return this.member.preferences.id;
    },
    noMember() {
      return !this.member;
    },

    firstName: {
      get() {
        if (this.member == '') {
          this.getMember();
        }
        let x = this.member ? this.member.firstName : '';
        return x;
      },
      set(newName) {
        Member.$update({
          where: this.member.id,
          data: { firstName: newName }
        });
      }
    },
    lastName: {
      get() {
        let x = this.member ? this.member.lastName : '';
        return x;
      },
      set(newName) {
        Member.$update({
          where: this.member.id,
          data: { lastName: newName }
        });
      }
    },
    connectionId: {
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
    email: {
      get() {
        let x = this.member.email;
        return x;
      },
      set(newName) {
        Member.$update({
          where: this.member.id,
          data: { email: newName }
        });
      }
    },
    age: {
      get() {
        let x = this.member ? this.member.age : '';
        return x;
      },
      set(newVal) {
        Member.$update({
          where: this.member.id,
          data: { age: newVal }
        });
      }
    },
    gender: {
      get() {
        let x = this.member ? this.member.gender : '';
        return x;
      },
      set(newVal) {
        Member.$update({
          where: this.member.id,
          data: { gender: newVal }
        });
      }
    },
    zipCode: {
      get() {
        let x = this.member ? this.member.zipCode : '';
        return x;
      },
      set(newVal) {
        Member.$update({
          where: this.member.id,
          data: { zipCode: newVal }
        });
      }
    },

    showImage() {
      console.log('show image?', this.image.length > 0);
      return this.image.length > 0 ? 'block' : 'none';
    },

    getImage() {
      return this.image.length == 0 ? 'block' : 'none';
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
      console.log(`getting QR code for ${this.connectionId}`);
      axios('/connections/?name=' + this.connectionId).then(s => {
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

    addImage(val) {
      Member.$update({
        where: this.member.id,
        data: { image: val }
      }).then(m => (this.member.image = m.image));
      this.changePhoto = true;
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
    },

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

    onClear() {
      console.log('Deleting all entities');
      Member.deleteAll();
      console.log('creating default Member and Activity');
      Member.$create({
        data: {
          firstName: '',
          lastName: '',
          age: '',
          gender: '',
          image: '',
          connectionId: '',
          updated: new Date().toISOString()
        }
      });
    }
  },

  async created() {
    this.loading = true;
    let m = await Member.$fetch();
    let s = await DataRepository.getState();
    console.log('created() Fetched member', m);
    console.log('created() Fetched state', s);
    console.log('ProfileCard-created() using:', axios.defaults.baseURL);
    this.loading = false;
  }
};
</script>
