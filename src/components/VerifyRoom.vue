<template>
  <div>
    <v-card>
      <v-card-title>
        Verify Room
      </v-card-title>
      <v-card-text>
        If the visitor is safe for the room, the second step enables the visitor
        to assess the risk of the room.
      </v-card-text>
      <v-card-text>
        If the visitor enters the room, we can add the visitor to the list for
        local contact tracing.
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          block
          @click="loader = 'loading1'"
          :loading="loading1"
          :disabled="loading1"
          >Checkout the room
          <template v-slot:loader>
            <span>Verifying Room...</span>
          </template></v-btn
        >
      </v-card-actions>
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
                content: 'See if it is safe to enter the room.',
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
          @click="startTest"
          :loading="loading2"
          :disabled="!verificationId"
          >Assess room's credentials
          <template v-slot:loader>
            <span>Assessing room...</span>
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
        <v-card-subtitle dense>
          <a
            href="https://projects.oregonlive.com/coronavirus/cases-by-zip"
            target="_blank"
            >Need to check their zip code?</a
          ></v-card-subtitle
        >
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import config from '@/config.json';
import axios from 'axios';
axios.defaults.baseURL = config.BASEURL_AZURE;
console.log('Using: ', config.BASEURL_AZURE);

export default {
  watch: {
    loader() {
      const l = this.loader;
      console.log('loader', l);
      this[l] = !this[l];
      if (l == 'loading1') {
        this.verify('verify/room').then(() => {
          this[l] = false;
          this.loader = null;
        });
      } else if (l == 'loading2') {
        console.time('getting proof results');
        this.assess('verify/room/assess').then(() => {
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
    dialog: false,

    loader: null,
    loading: false,
    loading1: false,
    loading2: false,

    verificationId: '',
    verificationResult: '',
    verificationRequestUrl: '',
    verificationData: '',

    threshold: '5'
  }),
  methods: {
    startTest() {
      this.loader = 'loading2';
    },

    hide() {
      this.dialog = !this.dialog;
    },

    redirect() {
      window.open(this.verificationRequestUrl, '_blank');
    },
    restart() {
      this.step1 = true;
      this.verificationResult = '';
    },

    openInWallet() {
      console.log('Deep link content:', this.verificationData);
      window.location.href = `id.streetcred://launch?c_i=${this.verificationData}`;
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
        this.verificationResult =
          verification.value <= this.threshold
            ? 'Room is safe enough to enter.'
            : 'Perhaps we will come back another time.';
      }
    }
  },
  mounted() {}
};
</script>

<style></style>
