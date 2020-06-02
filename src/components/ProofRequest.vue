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
        <v-btn color="primary" @click="onGetProof" block dark :disabled="false"
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
    credentialName: ''
  }),
  methods: {
    async onGetProof() {
      const functionName = '/OfferProof';
      console.log('credentialName', this.credentialName.value);
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
      let offerUrl = axiosResponse.data;
      if (offerUrl) {
        console.log(offerUrl);
      } else {
        alert('Apologies. We had trouble creating your credential.');
      }
    }
  }
};
</script>

<style></style>
