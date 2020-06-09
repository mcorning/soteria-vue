<template>
  <div>
    <v-card>
      <v-card-title>
        Proof Requests
      </v-card-title>

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
      <v-card-actions>
        <v-btn
          color="primary"
          @click="onOfferProof"
          block
          dark
          :disabled="false"
          >Offer Proof</v-btn
        >
      </v-card-actions>
      <v-card-text>
        <v-text-field
          v-model="verificationId"
          label="Verification ID"
          dense
          readonly
          hide-details
        >
        </v-text-field>
      </v-card-text>
      <v-card-text>
        <v-text-field
          v-model="verificationResult"
          label="Verification Result"
          dense
          readonly
          hide-details
        >
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          @click="onGetProofResults"
          block
          dark
          :disabled="!verificationId"
          >Get Proof Results</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = 'https://secoursstreetcred.azurewebsites.net/api/';
export default {
  computed: {
    connectionHint() {
      let msg =
        this.connection && this.connection.name
          ? `${this.connection.name}, ${this.connection.connectionId}`
          : 'Connectionless verifiable exchange is default';
      return msg;
    }
  },
  data: () => ({
    connection: {},
    // be sure you match name and policyId in default, otherwise, policyId will control name
    credential: {
      name: 'From Safe Place',
      policyId: '4543223c-8710-4731-a27b-08d807eddf00'
    },
    verificationId: '',
    verificationResult: ''
  }),
  methods: {
    async onOfferProof() {
      let url = `Streetcred?name=proofOfferNoConn&policyId=${this.credential.policyId}`;
      //         Streetcred?name=proofOfferNoConn&policyId=4543223c-8710-4731-a27b-08d807eddf00
      console.log('url:', url);
      let axiosResponse = await axios({
        url: url,
        method: 'GET',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(e => console.log('Error:', e));

      console.log('Axios Response:', axiosResponse);
      let verification = axiosResponse.data.response;
      // this is for connectionless
      this.verificationId = verification.verificationId;
      let verificationRequestUrl = verification.verificationRequestUrl;
      if (verificationRequestUrl) {
        console.log(verificationRequestUrl);
        window.open(verificationRequestUrl, '_blank');
      } else {
        alert('Apologies. We had trouble creating your credential.');
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
          console.log('Axios Response:', axiosResponse);
          console.log('response', axiosResponse.data.response);
          this.verificationResult = `Credential state: ${
            axiosResponse.data.response.isValid ? 'valid' : 'invalid'
          }`;
          if (!axiosResponse.data.response.isValid) {
            alert(
              'Holder has not responded to proof request, yet. If they declined your offer, you will not know their decision. So, check again in a few minutes...'
            );
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
