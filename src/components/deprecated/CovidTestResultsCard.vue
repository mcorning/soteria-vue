<template>
  <v-card class="pa-3">
    <v-card-title>
      My Covid-19 Test Result
    </v-card-title>
    <v-card-text>
      <v-row no-gutters justify="center">
        <v-col>
          <v-row justify="center">
            <v-col cols="6" sm="6">
              <v-autocomplete
                v-model="testType"
                required
                :rules="[rules.required]"
                label="Test Type*"
                dense
                :items="['nasal swab', 'blood test']"
              ></v-autocomplete>
            </v-col>

            <v-col cols="6" sm="6">
              <v-text-field
                style="width:290px"
                label="Test Site*"
                v-model="testSite"
                dense
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>

            <v-col cols="6" sm="6">
              <v-autocomplete
                v-model="testResult"
                required
                dense
                :rules="[rules.required]"
                label="Test Result*"
                :items="['Positive', 'Negative']"
              ></v-autocomplete>
            </v-col>

            <v-col cols="6" sm="6">
              <v-text-field
                v-model="testDate"
                style="width:290px"
                label="Test Date*"
                dense
                required
                :rules="[rules.required]"
              ></v-text-field>
              <!-- <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="testDate"
                          label="Test Date*"
                          readonly
                          required
                          :rules="[rules.required]"
                          dense
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="testDate"
                        @input="menu2 = false"
                      ></v-date-picker>
                    </v-menu> -->
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <small>*indicates required field</small>
    </v-card-text>

    <v-card-actions>
      <v-btn
        color="primary"
        block
        :loading="loading1"
        :disabled="loading1"
        @click="loader = 'loading1'"
        >Get COVID Credential
        <template v-slot:loader>
          <span>Issuing COVID Credential...</span>
        </template></v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
import config from '@/config.json';
import axios from 'axios';
axios.defaults.baseURL = config.BASEURL;

import Member from '@/models/Member';
import Credential from '@/models/Credential';

export default {
  watch: {
    loader() {
      const l = this.loader;
      console.log('loader', l);
      this[l] = !this[l];
      if (l == 'loading1') {
        this.onGetCredential().then(() => {
          this[l] = false;
          this.loader = null;
        });
      }
    }
  },
  components: {},

  computed: {
    isReady() {
      return Member.all().length > 0;
    },
    member() {
      let m = Member.query()
        .with('credentials')
        .first();
      console.log('returning member', m);
      return m;
    },

    credential() {
      console.log('Credential: ');
      return this.member.credentials[0];
    }

    // testType: {
    //   get() {
    //     let x = this.credential ? this.credential.testType : '';
    //     return x;
    //   },
    //   set(newName) {
    //     Credential.$update({
    //       where: this.credential.id,
    //       data: { testType: newName }
    //     });
    //   }
    // },
    // testSite: {
    //   get() {
    //     let x = this.credential ? this.credential.testSite : '';
    //     return x;
    //   },
    //   set(newName) {
    //     Credential.$update({
    //       where: this.credential.id,
    //       data: { testSite: newName }
    //     });
    //   }
    // },
    // testDate: {
    //   get() {
    //     let x = this.credential
    //       ? this.credential.testDate
    //       : new Date().toISOString().substr(0, 10);
    //     return x;
    //   },
    //   set(newVal) {
    //     Credential.$update({
    //       where: this.credential.id,
    //       data: { testDate: newVal }
    //     });
    //   }
    // },
    // testResult: {
    //   get() {
    //     let x = this.credential ? this.credential.testResult : '';
    //     return x;
    //   },
    //   set(newVal) {
    //     Credential.$update({
    //       where: this.credential.id,
    //       data: { testResult: newVal }
    //     });
    //   }
    // }
  },

  data: () => ({
    loader: null,
    loading: false,
    loading1: false,

    credDefs: new Map(),
    dialog: false,
    menu2: false,
    date: new Date().toISOString().substr(0, 10),
    testType: '',
    testSite: '',
    testDate: new Date().toISOString().substr(0, 10),
    testResult: '',

    creds: '',

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
      }
    }
  }),

  methods: {
    async onGetCredential() {
      console.log('Get credential using Axios');
      // send connectionless credential to member
      let payload;
      if (this.testResult == 'Negative') {
        payload = {
          definitionId: this.credDefs.get(this.testResult),
          automaticIssuance: true,
          credentialValues: {
            testType: this.testType,
            testSite: this.testSite,
            testDate: this.testDate,
            negativeResult: 'true'
          }
        };
      } else {
        payload = {
          definitionId: this.credDefs.get(this.testResult),
          automaticIssuance: true,
          credentialValues: {
            testType: this.testType,
            testSite: this.testSite,
            testDate: this.testDate,
            positiveResult: 'true'
          }
        };
      }
      console.log('payload:\n', payload);

      let axiosResponse = await axios({
        url: 'streetcred',
        method: 'POST',
        data: { credential: payload },
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(e => console.log(e));

      console.log('Axios Response:', axiosResponse);
      let offerUrl = axiosResponse.data.response.offerUrl;
      if (offerUrl) {
        window.open(offerUrl), '_blank';
      } else {
        alert('Apologies. We had trouble creating your credential.');
      }
    },

    siteEntered(e) {
      if (e.target.value) {
        this.testSite = e.target.value;
      }
    },
    async addCredentials() {
      console.log(this.$store.state.credentials);
      let x = await Credential.$create({ data: this.$store.state.credentials });
      console.log(x);
    },

    fixPrefs() {},
    addImage(val) {
      Credential.$update({
        where: this.credential.id,
        data: { image: val }
      }).then(m => (this.credential.image = m.image));
      this.changePhoto = true;
    },

    onRemoved() {
      this.image = '';
    },
    getMember() {
      this.credential = Credential.query().first();
    }
  },

  async created() {
    this.loading = true;
    let m = await Member.$fetch();

    let c = await Credential.$fetch();
    console.log('created() Fetched ', m, c, 'Credential');
    console.log(axios.defaults.baseURL);
  },

  async mounted() {
    this.loading = true;
    let url = `Streetcred?name=credDefList`;
    console.log('url:', url);
    let axiosResponse = await axios({
      url: url,
      method: 'GET',
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json'
      }
    }).catch(e => console.log('Error:', e));

    axiosResponse.data.response.filter(c => {
      if (c.name.startsWith('COVID')) {
        console.log(c.name);
        let key = c.name.includes('Negative') ? 'Negative' : 'Positive';
        this.credDefs.set(key, c.definitionId);
      }
    });

    console.log(this.credDefs);
    console.log('Using:', axios.defaults.baseURL);

    this.loading = false;
  }
};
</script>
