<template>
  <div>
    <v-card>
      <v-card-title>
        Proof Requests
      </v-card-title>
      <v-card-subtitle dense>
        <a
          href="https://projects.oregonlive.com/coronavirus/cases-by-zip"
          target="_blank"
          >COVID by Zipcode Map</a
        ></v-card-subtitle
      >
      <v-card-subtitle>Choose a credential to prove:</v-card-subtitle>
      <v-card-text>
        <!-- use this to fetch the credential data: https://api.streetcred.id/agency/v1/verificationPolicies -->
        <v-autocomplete
          v-model="credential"
          label="Credential Name"
          dense
          item-text="name"
          item-value="policyId"
          :items="[
            {
              name: 'From Safe Place',
              policyId: '4543223c-8710-4731-a27b-08d807eddf00'
            },
            {
              name: 'COVID-19 Negative Test Result',
              policyId: '5d401288-4d61-4190-261a-08d7de69f4ca'
            },
            {
              name: 'COVID-19 Positive Test Result',
              policyId: '4a9b8374-86da-409d-2619-08d7de69f4ca'
            }
          ]"
          :hint="`${credential.name}, ${credential.policyId}`"
          persistent-hint
          return-object
          single-line
        ></v-autocomplete>
      </v-card-text>

      <v-card-text>
        <v-autocomplete
          v-model="connection"
          label="Connection"
          clearable
          dense
          item-text="name"
          item-value="connectionId"
          :items="[
            {
              name: 'SM-G955U',
              connectionId: 'cb79ecf0-9f84-459a-b608-073a7ed90bac'
            },
            {
              name: 'YUKON237',
              connectionId: '86f4ec53-3d79-4785-83f0-5602539d2288'
            },
            {
              name: 'Michael\'s iPhone',
              connectionId: '1852de98-80cd-4730-8de3-c5432b60b923'
            }
          ]"
          :hint="connectionHint"
          persistent-hint
          return-object
          single-line
        ></v-autocomplete>
      </v-card-text>
      <v-card-actions v-if="step1">
        <v-btn
          v-model="custom"
          color="primary"
          @click="onOfferProof"
          block
          dark
          :disabled="false"
          >1) Offer Proof</v-btn
        >
      </v-card-actions>
      <v-card-actions v-else>
        <v-btn
          v-if="verificationId"
          color="primary"
          @click="onGetProofResults"
          block
          dark
          :disabled="!verificationId"
          >2) Get Proof Results</v-btn
        >
      </v-card-actions>
      <!-- custom: {{ custom }}<br />
      <v-card-text v-if="verificationRequestUrl">
        <v-text-field label="Verification ID" dense readonly loading>
          <template v-slot:progress>
            <v-progress-linear
              v-if="custom"
              :value="progress"
              :color="color"
              absolute
              height="7"
            ></v-progress-linear>
          </template>
        </v-text-field>
        <a :href="verificationRequestUrl" target="_blank">{{
          verificationId
        }}</a>
      </v-card-text>
-->
      <v-card-text>
        <v-text-field
          v-if="gettingReady"
          v-model="verificationId"
          label="Verification ID"
          dense
          readonly
          placeholder="Getting ready..."
          hint="click to go to QR code"
          loading
        >
          <template v-slot:progress>
            <v-progress-linear
              v-if="custom"
              :value="progress"
              :color="color"
              absolute
              height="7"
            ></v-progress-linear>
          </template>
        </v-text-field>
        <v-text-field
          v-if="showMe"
          v-model="verificationId"
          @click="redirect"
          label="Verification ID"
        >
        </v-text-field>

        <v-text-field
          v-if="showMe"
          v-model="verificationResult"
          @click="restart"
          label="Verification Result"
          dense
          readonly
          hide-details
        >
        </v-text-field>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = 'https://secoursstreetcred.azurewebsites.net/api/';
export default {
  computed: {
    showMe() {
      return this.verificationResult && !this.gettingReady;
    },
    progress() {
      return Math.min(100, 1 * 10);
    },
    color() {
      return 'success'; //['error', 'warning', 'success'][Math.floor(this.progress / 40)];
    },
    connectionHint() {
      let msg =
        this.connection && this.connection.name
          ? `${this.connection.name}, ${this.connection.connectionId}`
          : 'Connectionless verifiable exchange is default';
      return msg;
    },
    step2() {
      return !this.step1;
    }
  },
  data: () => ({
    gettingReady: false,
    step1: true,
    custom: true,
    connection: {},
    // be sure you match name and policyId in default, otherwise, policyId will control name
    credential: {
      name: 'From Safe Place',
      policyId: '4543223c-8710-4731-a27b-08d807eddf00'
    },
    verificationId: '',
    verificationResult: '',
    verificationRequestUrl: ''
  }),
  methods: {
    redirect() {
      window.open(this.verificationRequestUrl, '_blank');
    },
    restart() {
      this.step1 = true;
      this.verificationResult = '';
    },
    async onOfferProof() {
      this.gettingReady = true;
      this.step1 = false;
      this.custom = false;
      // this.verificationRequestUrl = 'Getting a proof request ready...';
      let url = `Streetcred?name=proofOfferNoConn&policyId=${this.credential.policyId}`;
      console.log('url:', url);
      let axiosResponse = await axios({
        url: url,
        method: 'GET',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(e => console.log('Error:', e));
      this.gettingReady = false;

      console.log('Axios Response for proofOfferNoConn:', axiosResponse);
      let verification = axiosResponse.data.response;
      // this is for connectionless
      this.verificationId = verification.verificationId;
      this.verificationRequestUrl = verification.verificationRequestUrl;

      if (this.verificationRequestUrl) {
        console.log(this.verificationRequestUrl);
        window.open(this.verificationRequestUrl, '_blank');
      } else {
        this.verificationResult =
          'Apologies. We had trouble proving the credential.';
      }

      // this for connections
      // let verification = axiosResponse.data.response;
      // if (verification) {
      //   console.log('Proof Request:', verification);
      //   this.verificationId = verification.verificationId;
      //   alert(
      //     `Verification ID: ${this.verificationId}. You can now get proof results.`
      //   );
      // } else {
      //   alert('Apologies. We had trouble creating your credential.');
      // }
    },

    async onGetProofResults() {
      console.log('ver id', this.verificationId);
      if (this.verificationId) {
        var rawPayload = JSON.stringify({
          verificationId: this.verificationId
        });
        console.log(rawPayload);
        let url = `Streetcred/?name=ver&connectionId=${this.connection.connectionId}&verificationId=${this.verificationId}`;
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
          console.log('Axios Response to ver:', axiosResponse);
          console.log('response', axiosResponse.data.response);
          this.verificationResult = `Credential state: ${
            axiosResponse.data.response.isValid ? 'valid' : 'invalid'
          }`;
          this.step1 = true;
          // this.verificationId = '';
          if (!axiosResponse.data.response.isValid) {
            this.verificationResult = 'No response, yet. Try again.';
            this.step1 = false;
          }
        } else {
          alert('Apologies. We had trouble creating your credential.');
        }
      } else {
        alert(
          'You need a verification ID. Offer a connection a proof request, first.'
        );
      }
    },

    async onCheckContactTracing() {
      var rawPayload = JSON.stringify({
        connectionId: this.connection.connectionId
      });
      console.log(rawPayload);
      let url = `/GetMessages/?connectionId=${this.connection.connectionId}`;
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
        console.log('response', axiosResponse.data.messages);
        alert(`Is proof valid? ${axiosResponse.data.messages}`);
      } else {
        alert('Apologies. We had trouble creating your credential.');
      }
    }
  }
};
</script>

<style></style>
