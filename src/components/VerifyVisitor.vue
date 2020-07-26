<template>
  <div>
    <v-dialog v-if="dialog" v-model="dialog" persistent max-width="300px">
      <template v-slot:activator="{ on }">
        <v-layout align-center justify-center>
          <v-btn
            color="primary"
            block
            dark
            v-on="on"
            class=".subtitle-2"
            v-tooltip="{
              content: 'See if visitor is safe to enter the room.',
              classes: '.subtitle-2'
            }"
            >Visitor Assessment</v-btn
          >
        </v-layout>
      </template>

      <v-card class="card">
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
        </v-card-actions>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="hide">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-stepper v-model="e6" vertical>
      <v-stepper-step :complete="e6 > 1" step="1">
        <p>Verify Visitor</p>
        <p>
          <small
            >Room risk managers assess the risk a visitor presents to the
            room.</small
          >
        </p>
      </v-stepper-step>
      <v-stepper-content step="1">
        <!-- Don't use dark prop if you want to use the loader template -->
        <v-btn
          color="primary"
          block
          @click="loader = 'loading1'"
          :loading="loading1"
          :disabled="loading1"
          >Check your visitor
          <template v-slot:loader>
            <span>Verifying visitor...</span>
          </template></v-btn
        >
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2">
        <p>Verify Visitor</p>
        <p>
          <small
            >Room risk managers assess the risk a visitor presents to the
            room.</small
          >
        </p>
      </v-stepper-step>

      <v-stepper-content step="2">
        <!-- Don't use dark prop if you want to use the loader template -->
        <v-btn
          color="primary"
          block
          @click="startTest"
          :loading="loading2"
          :disabled="!verificationId"
          >Assess visitor's credentials
          <template v-slot:loader>
            <span>Assessing visitor...</span>
          </template></v-btn
        >
      </v-stepper-content>
    </v-stepper>
  </div>
</template>

<script>
import config from '@/config.json';

import axios from 'axios';
axios.defaults.baseURL = config.DEBUG
  ? config.BASEURL_LOCAL
  : config.BASEURL_AZURE;

export default {
  component: {},

  watch: {
    loader() {
      const l = this.loader;
      console.log('loader', l);
      this[l] = !this[l];
      if (l == 'loading1') {
        this.e6 = 2;
        this.verify('verify/visitor').then(() => {
          this[l] = false;
          this.loader = null;
        });
      } else if (l == 'loading2') {
        this.e6 = 3;
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
    qrSource() {
      return `https://chart.googleapis.com/chart?cht=qr&chl=${this.verificationRequestUrl}&chs=200x200&chld=L|1`;
    }
  },

  data: () => ({
    e6: 1,

    domAttrs: null,
    isMobile: false,
    qrCode: null,
    orig: null,
    d_m: null,

    dialog: false,

    loader: null,
    loading: false,
    loading1: false,
    loading2: false,

    verificationId: '',
    verificationResult: '',
    verificationRequestUrl: '',
    verificationData: ''
  }),
  methods: {
    openInWallet() {
      console.log('Deep link content:', this.verificationData);
      window.location.href = `id.streetcred://launch?c_i=${this.verificationData}`;
    },

    hide() {
      this.dialog = !this.dialog;
    },
    startTest() {
      this.loader = 'loading2';
    },

    redirect() {
      console.log('redirecting to:', this.verificationRequestUrl);
      window.open(this.verificationRequestUrl, '_blank');
    },
    restart() {
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
        this.verificationData = verification.data;

        console.log(this.verificationData);
        this.dialog = true;
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

  mounted() {
    console.log('VerifyVisitor-mounted() using:', axios.defaults.baseURL);
  }
};
</script>

<style></style>
