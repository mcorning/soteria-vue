<template>
  <div>
    <div v-if="loading">
      <h2>Loading Profile Card</h2>
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
          >Open your digital wallet and scan this QR code:</v-card-text
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
    <v-container class="pa-1 mt-0" v-else>
      <v-row justify="center">
        <v-card>
          <v-card-title>My Identifying Information</v-card-title>

          <v-card-text>
            <v-container>
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
                        hint="See PHI tab"
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
              <v-row no-gutters>
                <v-col cols="12">
                  <v-checkbox
                    dense
                    class="caption"
                    v-model="isRoomRiskManager"
                    label="I am a room risk manager"
                  ></v-checkbox>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    class="caption"
                    :disabled="!isRoomRiskManager"
                    v-model="roomRiskThreshold"
                    hint="(in dBs of evidence)"
                    label="Room risk threshold"
                    dense
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row align="end" justify="center" no-gutters>
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
            </v-container>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import config from '@/config.json';
import axios from 'axios';
axios.defaults.baseURL = config.BASEURL_AZURE;
console.log('Using: ', config.BASEURL_AZURE);

import PictureInput from 'vue-picture-input';
import Member from '@/models/Member';
import Credential from '@/models/Credential';
import Preference from '@/models/Preference';
import DataRepository from '@/store/repository.js';

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
    PictureInput
  },

  computed: {
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
        return this.member.preferences
          ? this.member.preferences.symptomsScore
          : false;
      },
      set(newVal) {
        Preference.changeSymptomsScore(this.perfID, newVal);
      }
    },
    isRoomRiskManager: {
      get() {
        return this.member.preferences
          ? this.member.preferences.isRoomRiskManager
          : false;
      },
      set(newVal) {
        Preference.changeIsRoomRiskManager(this.perfID, newVal);
      }
    },
    roomRiskThreshold: {
      get() {
        return this.member.preferences
          ? this.member.preferences.roomRiskThreshold
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
        let x = this.member.firstName;
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
        let x = this.member.lastName;
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
        let x = this.member.connectionId;
        return x;
      },
      set(newName) {
        Member.$update({
          where: this.member.id,
          data: { connectionId: newName }
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
        let x = this.member.age;
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
        let x = this.member.gender;
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
        let x = this.member.zipCode;
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

    async onMakeConnection() {
      // send connectionless credential to member
      const payload = {
        // we added this wrapper so POST could get any payload
        connection: {
          multiparty: false,
          name: 'Secours.io'
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

        console.log(
          'Axios Response:',
          axiosResponse.data.response.invitationUrl
        );
        let invitationUrl = axiosResponse.data.response.invitationUrl;
        this.deepLink += axiosResponse.data.response.invitation;
        console.log('deepLink', this.deepLink);
        if (invitationUrl) {
          console.log(
            'Connection ID:',
            axiosResponse.data.response.connectionId
          );
          this.connectionId = axiosResponse.data.response.connectionId;
          console.log(invitationUrl);
          window.open(invitationUrl, '_blank');
        } else {
          alert('Apologies. We had trouble connecting to Secours.');
        }
      } catch (error) {
        if (error.message == 'Network Error') {
          console.error('Be sure Azure function is running.');
        }
      }
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
    this.loading = false;
  }
};
</script>
