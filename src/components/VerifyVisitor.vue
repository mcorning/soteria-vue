<template>
  <div>
    <v-card>
      <v-card-title>
        Verify Visitor
      </v-card-title>
      <v-card-subtitle dense>
        <a
          href="https://projects.oregonlive.com/coronavirus/cases-by-zip"
          target="_blank"
          >COVID by Zipcode Map</a
        ></v-card-subtitle
      >

      <v-card-text>
        The first step in local contact tracing is for the room to assess the
        risk of a visitor.
      </v-card-text>
      <v-card-text>
        If the visitor is safe for the room, the second step enables the visitor
        to assess the risk of the room.
      </v-card-text>
      <v-card-text>
        Only when the room and the visitor have a meeting of minds do each side
        exchange connections.
      </v-card-text>
      <v-card-actions>
        <!-- Don't use dark prop if you want to use the loader template -->
        <v-btn
          color="primary"
          block
          @click="loader = 'loading1'"
          :loading="loading1"
          :disabled="loading1"
          >First: Verify Visitor
          <template v-slot:loader>
            <span>Verifying visitor...</span>
          </template></v-btn
        >
      </v-card-actions>
      <v-card-text>
        <v-text-field
          v-model="verificationId"
          @click="redirect"
          hint="click to go to QR code"
          persistent-hint
          label="Verification ID"
        >
        </v-text-field>
      </v-card-text>

      <v-card-actions>
        <v-btn
          color="primary"
          block
          @click="test"
          :loading="loading2"
          :disabled="!verificationId"
          >Now: Assess visitor
          <template v-slot:loader>
            <span>Assessing visitor...</span>
          </template></v-btn
        >
      </v-card-actions>

      <v-card-text>
        <v-text-field
          v-model="verificationResult"
          @click="restart"
          label="Verification Result"
          readonly
          hint="click to abandon proof"
          persistent-hint
        >
        </v-text-field>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import config from '@/config.json';
import axios from 'axios';
axios.defaults.baseURL = config.BASEURL;
console.log('Using: ', config.BASEURL);

export default {
  watch: {
    loader() {
      const l = this.loader;
      console.log('loader', l);
      this[l] = !this[l];
      if (l == 'loading1') {
        this.verify('verify/visitor').then(() => {
          this.showMeId = true;
          this[l] = false;
          this.loader = null;
        });
      } else if (l == 'loading2') {
        console.time('getting proof results');
        this.assess('verify/visitor/assess').then(() => {
          this[l] = false;
          this.loader = null;
          console.timeEnd('getting proof results');
        });
      }
    }
  },
  computed: {
    showMe() {
      return this.verificationResult && !this.gettingReady;
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
    loader: null,
    loading: false,
    loading1: false,
    loading2: false,
    showMeId: false,
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
    test() {
      this.loader = 'loading2';
    },

    redirect() {
      window.open(this.verificationRequestUrl, '_blank');
    },
    restart() {
      this.step1 = true;
      this.verificationResult = '';
    },

    async verify(url) {
      let axiosResponse = await axios({
        url: url,
        method: 'GET',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(e => console.log('Error:', e));

      console.log('verify() Response:', axiosResponse);
      let verification = axiosResponse.data;
      if (verification) {
        console.log('Proof Request:', verification);
        this.verificationId = verification.id;
        this.verificationRequestUrl = verification.url;
        window.open(this.verificationRequestUrl, '_blank');
      } else {
        alert('Apologies. We had trouble creating your credential.');
      }
    },

    async assess(url) {
      url += '/?id=' + this.verificationId;
      console.time('assess in');
      console.log('url:', url);
      let axiosResponse = await axios({
        url: url,
        method: 'GET',
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch(e => console.log('Error:', e));
      console.timeEnd('assess in');

      console.log('assess() Response:', axiosResponse);
      let verification = axiosResponse.data;
      if (verification) {
        console.log('verification', verification);
        this.verificationResult = verification.isSafe
          ? 'Visitor is safe to enter.'
          : 'Perhaps they can come back another time.';
      }
    }
  },
  mounted() {}
};
</script>

<style></style>
