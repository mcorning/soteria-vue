<template>
  <div>
    <div v-if="loading">
      <h2>Loading Profile Card</h2>
    </div>

    <div class=" mt-0" v-else>
      <ConnectionCard />

      <v-row no-gutters>
        <v-col>
          <v-card
            ><v-card-text v-if="help" @click="help = !help"
              >This page is all about you. It contains your relatively static
              personal identifying information. It contains your daily Covid
              symptoms, as well. And at the bottom of the page you will see a
              form that allows you to convert your Covid test results into a
              verifiable credential.
              <p>
                You can use this information to stay safer in the world without
                sacrificing your privacy.
              </p></v-card-text
            >
            <v-card-text v-else @click="help = !help">
              This page is all about you...
            </v-card-text></v-card
          >
        </v-col></v-row
      >
      <v-row justify="center">
        <v-container>
          <v-card>
            <v-card-title>My PII</v-card-title>
            <v-card-subtitle>My Identifying Information</v-card-subtitle>

            <v-card-text>
              <v-row no-gutters justify="center">
                <!-- change photo and helpers-->
                <v-col cols="6">
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
                    <v-col>
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
                    </v-col>
                  </v-row>
                </v-col>
                <!-- Data entry form -->
                <v-col>
                  <v-row justify="center" no-gutters>
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

                    <v-col cols="12">
                      <v-text-field
                        label="Symptoms Score"
                        hint="See My PHI below "
                        persistent-hint
                        dense
                        readonly
                        required
                        :rules="[rules.required]"
                        v-model="symptomsScore"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>

              <!-- Extra state -->
              <v-row>
                <v-col cols="12">
                  <v-checkbox
                    dense
                    class="caption"
                    v-model="isRoomRiskManager"
                    label="I am a room risk manager"
                    hint="I decide who is safe enough to enter my room"
                    persistent-hint
                  ></v-checkbox>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    class="caption"
                    :disabled="!isRoomRiskManager"
                    v-model="roomRiskThreshold"
                    label="Room risk threshold (in dBs of evidence)"
                    hint="I keep the room risk to a maximum value"
                    persistent-hint
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row align="end" justify="center" no-gutters>
                <v-card-text
                  >A verifiable credential lets you share your data without
                  sacrificing your privacy</v-card-text
                >
                <v-card-actions>
                  <v-btn
                    color="primary"
                    block
                    :loading="loading1"
                    :disabled="loading1"
                    @click="loader = 'loading1'"
                  >
                    Get Your Personal Credential
                    <template v-slot:loader>
                      <span>Issuing Personal Credential...</span>
                    </template>
                  </v-btn>
                </v-card-actions>
              </v-row>
            </v-card-text>
          </v-card>
        </v-container>
      </v-row>
    </div>
    <v-dialog v-if="dialog" v-model="dialog" persistent max-width="300px">
      <template v-slot:activator="{ on }">
        <v-layout align-center justify-center>
          <v-btn color="primary" block dark v-on="on" class=".subtitle-2"
            >Get Your Personal Credential</v-btn
          >
        </v-layout>
      </template>

      <v-card class="card">
        <v-card-text
          >We have captured your personal information in this QR code. To get
          the data into a credential, scan the code using your digital
          wallet.</v-card-text
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
          <v-btn color="green darken-1" text @click="hide">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import config from '@/config.json';
import axios from 'axios';
axios.defaults.baseURL = config.BASEURL;

import PictureInput from 'vue-picture-input';
import Member from '@/models/Member';
import Credential from '@/models/Credential';
import Preference from '@/models/Preference';
import DataRepository from '@/store/repository.js';
import Connection from '@/models/Connection';
import ConnectionCard from '@/components/ConnectionCard';

export default {
  watch: {
    loader() {
      const l = this.loader;
      console.log('loader', l);
      this[l] = !this[l];
      if (l == 'loading1') {
        this.onPersonalCredential().then(() => {
          this[l] = false;
          this.loader = null;
        });
      }
    }
  },
  components: {
    ConnectionCard,
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

    symptomsScore: {
      get() {
        return this.member
          ? this.member.preferences
            ? this.member.preferences.symptomsScore
            : 0
          : 0;
      },
      set(newVal) {
        Preference.changeSymptomsScore(this.perfID, newVal);
      }
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
        Preference.changeIsRoomRiskManager(this.perfID, newVal);
      }
    },
    roomRiskThreshold: {
      get() {
        return this.member
          ? this.member.preferences
            ? this.member.preferences.roomRiskThreshold
            : 0
          : 0;
      },
      set(newVal) {
        Preference.changeRoomRiskThreshold(this.perfID, newVal);
      }
    },

    showHelpIcons: {
      get() {
        return this.member.preferences
          ? this.member.preferences.showHelpIcons
          : false;
      },
      set(newVal) {
        Preference.changeHelpIcons(this.perfID, newVal);
      }
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

    showImage() {
      console.log('show image?', this.image.length > 0);
      return this.image.length > 0 ? 'block' : 'none';
    },

    getImage() {
      return this.image.length == 0 ? 'block' : 'none';
    }
  },

  data: () => ({
    connectionId: '',
    help: false,
    onboard: true,
    dialog: false,
    offerUrl: '',
    loader: null,
    loading: false,
    loading1: false,
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
    agreeToTerms: false,
    agreeToTermsRules: [
      value =>
        !!value ||
        'You must agree to the terms and conditions to sign up for an account.'
    ],
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
    hide() {
      this.dialog = !this.dialog;
    },

    async addCredentials() {
      console.log(this.$store.state.credentials);
      let x = await Credential.$create({ data: this.$store.state.credentials });
      console.log(x);
    },

    fixPrefs() {
      Preference.isRoomRiskManager(this.member.id);
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

    async onPersonalCredential() {
      // send connectionless credential to member
      const payload = {
        // we added this wrapper so POST could get any payload
        credential: {
          definitionId: config.PERS_CRED_ID,
          automaticIssuance: true,
          credentialValues: {
            name: `${this.firstName} ${this.lastName}`,
            gender: this.gender,
            age: this.age,
            zipCode: this.zipCode,
            symptomsScore: this.symptomsScore
          }
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

        console.log('Axios Response:', axiosResponse);
        this.offerUrl = axiosResponse.data.response.offerUrl;
        if (this.offerUrl) {
          console.log(this.offerUrl);
          // window.open(offerUrl, '_blank');
          this.dialog = true;
        } else {
          // this path with double response is awkward and belies fuzzy thinking...
          const msg = `Apologies. We had trouble creating your credential
          ${axiosResponse.data.response.response.body}`;
          //...plus we should parse the inner message json
          alert(msg);
        }
      } catch (error) {
        if (error.message == 'Network Error') {
          console.error('Be sure Azure function is running.');
        }
      }
    },

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
          updated: new Date().toISOString(),
          preferences: {
            databaseName: '',
            isRoomRiskManager: true,
            showHelpIcons: true
          }
        }
      });
    }
  },

  async created() {
    this.loading = true;
    let m = await Member.$fetch();
    await Preference.$fetch();
    console.log('created() Fetched member', m);
    // await this.addCredentials();
    this.creds = await DataRepository.verify();
    console.log('Using:', axios.defaults.baseURL);
    this.loading = false;
  }
};
</script>
