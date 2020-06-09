<template>
  <div>
    <v-card>
      <v-card-title>
        Contact Tracing
      </v-card-title>

      <v-card-text>
        If you show symptoms or receive a positive COVID-19 test, send a warning
        to all the connections you have made in the last five days.
      </v-card-text>
      <v-card-text>
        Otherwise, ping Secours periodically to see if anyone else (you
        contacted) has come down with the virus (in the last five days).
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="primary"
          @click="onCheckContactTracing"
          block
          dark
          :disabled="false"
          >Check for warnings</v-btn
        >
      </v-card-actions>
      <v-card-actions>
        <v-btn
          color="primary"
          @click="onCheckContactTracing"
          block
          dark
          :disabled="false"
          >Warn others</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL = 'https://secoursstreetcred.azurewebsites.net/api/';
export default {
  data: () => ({
    connection: {
      name: 'SM-G955U',
      connectionId: 'cb79ecf0-9f84-459a-b608-073a7ed90bac'
    },
    // be sure you match name and policyId in default, otherwise, policyId will control name
    credential: {
      name: 'COVID-19 Negative Test Result',
      policyId: '5d401288-4d61-4190-261a-08d7de69f4ca'
    },
    verificationId: ''
  }),
  methods: {
    async onOfferProof() {
      let url = `Streetcred/?name=proof&connectionId=${this.connection.connectionId}&policyId=${this.credential.policyId}`;

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
      if (verification) {
        console.log('Proof Request:', verification);
        this.verificationId = verification.verificationId;
        alert(
          `Verification ID: ${this.verificationId}. You can now get proof results.`
        );
      } else {
        alert('Apologies. We had trouble creating your credential.');
      }
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
          if (axiosResponse.data.response.isValid) {
            alert(
              `Proof results: ${axiosResponse.data.response.test} on ${axiosResponse.data.response.testDate} was ${axiosResponse.data.response.isValid}.`
            );
          } else {
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
