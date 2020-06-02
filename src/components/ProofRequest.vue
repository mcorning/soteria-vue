<template>
  <div>
    <v-card>
      <v-card-title>
        Proof Requests
      </v-card-title>

      <v-card-text>
        <v-autocomplete
          v-model="credentialName"
          label="Credential Name"
          autofocus
          dense
          item-text="name"
          item-value="policyId"
          :items="[
            {
              name: 'COVID-19 Negative Test Result',
              policyId: 'N4dqaFJG3qu2P5A7xKEKrB:3:CL:89129:default'
            },
            {
              name: 'COVID-19 Positive Test Result',
              policyId: '4a9b8374-86da-409d-2619-08d7de69f4ca'
            },
            {
              name: 'Sisters Country',
              policyId: 'N4dqaFJG3qu2P5A7xKEKrB:3:CL:105011:default'
            }
          ]"
        ></v-autocomplete>
      </v-card-text>
      <v-card-text>
        <v-autocomplete
          v-model="connection"
          label="Connection"
          autofocus
          dense
          :items="['SM-G955U', 'YUKON237', 'Michael\'s iPhone']"
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
      <p>Verification ID: {{ verId }}</p>
      <v-card-actions>
        <v-btn
          color="primary"
          @click="onGetProofResults"
          block
          dark
          :disabled="false"
          >Get Proof Results</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios';
axios.defaults.baseURL =
  'https://secoursfirstazurefunction.azurewebsites.net/api';
export default {
  data: () => ({
    connection: '',
    credentialName: '',
    verId: ''
  }),
  methods: {
    async onSendForProofResults() {
      var data = JSON.stringify({
        verificationId: '81864374-b124-4080-a01f-b7d1cbaa2d83'
      });

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
          console.log(this.responseText);
        }
      });

      xhr.open(
        'GET',
        'https://secoursfirstazurefunction.azurewebsites.net/api/GetProofResults'
      );
      xhr.setRequestHeader(
        'Authorization',
        't2w1B4MJCJjFEWZPcw1Xsmbfca2qAQnzU-cp3_pdgZg'
      );
      xhr.setRequestHeader(
        'X-Streetcred-Subscription-Key',
        'a820c2f69495430cae43c66df163cdd1'
      );
      xhr.setRequestHeader('Content-Type', 'application/json');

      xhr.send(data);
    },

    async onFetchProofResults() {
      var myHeaders = new Headers();
      myHeaders.append(
        'Authorization',
        't2w1B4MJCJjFEWZPcw1Xsmbfca2qAQnzU-cp3_pdgZg'
      );
      myHeaders.append(
        'X-Streetcred-Subscription-Key',
        'a820c2f69495430cae43c66df163cdd1'
      );
      myHeaders.append('Content-Type', 'application/json');

      var raw = JSON.stringify({
        verificationId: '81864374-b124-4080-a01f-b7d1cbaa2d83'
      });

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(
        'https://secoursfirstazurefunction.azurewebsites.net/api/GetProofResults',
        requestOptions
      )
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    },
    async onGetProofResults() {
      console.log('ver id', this.verId);
      let rawPayload = JSON.stringify({
        id: '81864374-b124-4080-a01f-b7d1cbaa2d83'
      });
      console.log(rawPayload);
      let url = `/GetProofResults/?id=${this.verId}`;
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
        console.log('response', axiosResponse.data.credentialIsValid);
        alert(`Is proof valid? ${axiosResponse.data.credentialIsValid}`);
      } else {
        alert('Apologies. We had trouble creating your credential.');
      }
    },

    async onOfferProof() {
      const functionName = '/OfferProof';
      const payload = {
        policyId: '4a9b8374-86da-409d-2619-08d7de69f4ca',
        connectionId: 'cb79ecf0-9f84-459a-b608-073a7ed90bac'
      };
      console.log('payload:\n', payload);

      let axiosResponse = await axios({
        url: functionName,
        method: 'PUT',
        data: payload,
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(e => console.log('Error:', e));

      console.log('Axios Response:', axiosResponse);
      let verification = axiosResponse.data;
      if (verification) {
        console.log(verification);
        this.verId = verification.verificationId;
      } else {
        alert('Apologies. We had trouble creating your credential.');
      }
    }
  }
};
</script>

<style></style>
