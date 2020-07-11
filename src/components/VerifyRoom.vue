<template>
  <div>
    <!--Room Assessment dialog -->
    <v-dialog v-if="ask" v-model="ask" persistent max-width="300px">
      <template v-slot:activator="{ on }">
        <v-layout align-center justify-center>
          <v-btn color="primary" block dark v-on="on" class=".subtitle-2"
            >Room Assessment</v-btn
          >
        </v-layout>
      </template>
      <v-card class="card">
        <v-card-text>
          The data tells us that the risk of exposure within the room is
          {{ risk }}.
        </v-card-text>
        <v-card-text>What do you want to do?</v-card-text>

        <v-card-actions>
          <v-btn color="green darken-1" text @click="proceed()">Enter</v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-btn color="green darken-1" text @click="ask = false"
            >Come back later</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Visitor Assessment dialog -->
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

    <v-card v-if="connect">
      <!-- <ContactTracing1 />
      <ContactTracing2 /> -->
      <ContactTracing />
    </v-card>
    <v-card v-else>
      <v-stepper v-model="e6" vertical>
        <v-stepper-step :complete="e6 > 1" step="1">
          <p>Checkout the room</p>
          <p>
            <small>Room Risk Managers set risk policy for their rooms.</small>
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
            >Get Room policy
            <template v-slot:loader>
              <span>Getting Room policy...</span>
            </template></v-btn
          >
        </v-stepper-content>

        <v-stepper-step :complete="e6 > 2" step="2">
          <p>Assess Room Risk</p>
          <p>
            <small>Check whether the room is safe enough for you.</small>
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
            >Assess room's credentials
            <template v-slot:loader>
              <span>Assessing room...</span>
            </template></v-btn
          >
        </v-stepper-content>

        <v-card-text class="pt-0">
          <v-text-field
            v-model="verificationId"
            @click="redirect"
            hint="click to go to QR code"
            persistent-hint
            readonly
            label="Verification ID"
          >
          </v-text-field>
        </v-card-text>

        <v-card-text class="pt-0">
          <v-text-field
            v-model="verificationResult"
            label="Verification Result"
            readonly
          >
          </v-text-field>
          <v-card-subtitle dense>
            <v-row align="center" justify="center">
              <v-col cols="12">
                <a
                  href="https://projects.oregonlive.com/coronavirus/cases-by-zip"
                  target="_blank"
                  >Need to check this zip code?</a
                >
              </v-col>
            </v-row>
          </v-card-subtitle>
        </v-card-text>
      </v-stepper>
    </v-card>
  </div>
</template>

<script>
// import ContactTracing1 from '@/components/ContactTracing1';
// import ContactTracing2 from '@/components/ContactTracing2';
import ContactTracing from '@/components/ContactTracing';
import config from '@/config.json';
import axios from 'axios';
axios.defaults.baseURL = config.BASEURL;

export default {
  components: {
    // ContactTracing1,
    // ContactTracing2
    ContactTracing
  },
  watch: {
    loader() {
      const l = this.loader;
      console.log('loader', l);
      this[l] = !this[l];
      if (l == 'loading1') {
        this.e6 = 2;

        this.verify('verify/room').then(() => {
          this[l] = false;
          this.loader = null;
        });
      } else if (l == 'loading2') {
        console.time('getting proof results');
        this.assess('verify/room/assess').then(() => {
          this.e6 = 3;

          this[l] = false;
          this.loader = null;
          console.timeEnd('getting proof results');
          this.ask = true;
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
    dialog: false,
    ask: false,
    connect: false,
    risk: 'low',
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
      if (this.verificationRequestUrl) {
        window.open(this.verificationRequestUrl, '_blank');
      }
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
        let threshold = verification.value;
        this.risk = threshold > 6 ? 'high' : threshold > 4 ? 'moderate' : 'low';
        console.log('verification', verification);
        this.verificationResult =
          threshold <= this.threshold
            ? 'Room is safe enough to enter.'
            : 'Perhaps we will come back another time.';
      }
    },
    proceed() {
      this.ask = false;
      this.connect = true;
    }
  },
  mounted() {
    console.log('VerifyRoom-mounted() using:', axios.defaults.baseURL);
  }
};
</script>

<style></style>
