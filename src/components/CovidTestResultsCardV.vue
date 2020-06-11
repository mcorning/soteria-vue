<template>
  <v-card>
    <v-card-title>
      My Covid-19 Test Result
    </v-card-title>
    <form>
      <v-card-text>
        <v-autocomplete
          v-model="testType"
          :error-messages="testTypeErrors"
          label="Test Type"
          :items="['nasal swab', 'blood test']"
          required
          @input="$v.testType.$touch()"
          @blur="$v.testType.$touch()"
        ></v-autocomplete>
        <v-card-text> </v-card-text>
        <v-text-field
          v-model="testSite"
          :error-messages="testSiteErrors"
          label="Test Site"
          required
          @input="$v.testSite.$touch()"
          @blur="$v.testSite.$touch()"
        ></v-text-field>
      </v-card-text>
      <v-card-text>
        <v-select
          v-model="testResult"
          :items="['Positive', 'Negative']"
          :error-messages="testResultErrors"
          label="Test Result"
          required
          @change="$v.testResult.$touch()"
          @blur="$v.testResult.$touch()"
        ></v-select>
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="testDate"
          :error-messages="testDateErrors"
          label="Test Date"
          required
          @input="$v.testDate.$touch()"
          @blur="$v.testDate.$touch()"
        ></v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="primary"
          block
          dark
          @click="onGetCredential"
          :disabled="false"
          >Get COVID Credential</v-btn
        >
      </v-card-actions>
      <v-btn @click="clear">clear</v-btn>
    </form>
  </v-card>
</template>

<script>
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import Member from '@/models/Member';
import Credential from '@/models/Credential';

import axios from 'axios';
axios.defaults.baseURL = 'https://secoursstreetcred.azurewebsites.net/api/';
// axios.defaults.baseURL = 'http://localhost:7071/api/Streetcred/';

export default {
  mixins: [validationMixin],

  validations: {
    testType: { required },
    testSite: { required },
    testResult: { required },
    testDate: { required }
  },

  data: () => ({
    credDefs: new Map(),

    testType: null,
    testSite: '',
    testDate: new Date().toISOString().substr(0, 10),
    testResult: null
  }),

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
    },
    testResultErrors() {
      const errors = [];
      if (!this.$v.testResult.$dirty) return errors;
      !this.$v.testResult.required && errors.push('Test Result is required');
      return errors;
    },
    testTypeErrors() {
      const errors = [];
      if (!this.$v.testType.$dirty) return errors;
      !this.$v.testType.required && errors.push('Test Type is required.');
      return errors;
    },
    testSiteErrors() {
      const errors = [];
      if (!this.$v.testSite.$dirty) return errors;
      !this.$v.testSite.required && errors.push('Test Site is required.');
      return errors;
    },
    testDateErrors() {
      const errors = [];
      if (!this.$v.testDate.$dirty) return errors;
      !this.$v.testDate.required && errors.push('Test Date is required.');
      return errors;
    },
    checkboxErrors() {
      const errors = [];
      if (!this.$v.checkbox.$dirty) return errors;
      !this.$v.checkbox.checked && errors.push('You must agree to continue!');
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push('Must be valid e-mail');
      !this.$v.email.required && errors.push('E-mail is required');
      return errors;
    }
  },

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
        url: '/streetcred',
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
    submit() {
      this.$v.$touch();
    },
    clear() {
      this.$v.$reset();
      this.testType = null;
      this.testSite = '';
      this.testResult = null;
      this.testDate = new Date().toISOString().substr(0, 10);
    }
  },
  async created() {
    this.loading = true;
    let m = await Member.$fetch();

    let c = await Credential.$fetch();
    console.log('created() Fetched ', m, c, 'Credential');
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
    this.loading = false;
  }
};
</script>
