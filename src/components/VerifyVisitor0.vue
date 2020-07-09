<template>
  <div>
    <v-card>
      <v-card-title>
        Verify Visitor
      </v-card-title>
      <v-card-text class="pt-1">
        As a room risk manager, the first step in local contact tracing is for
        the room to assess the risk of a visitor.
      </v-card-text>
      <v-card-text class="pt-1">
        If the visitor is safe for the room, the second step enables the visitor
        to assess the risk of the room.
      </v-card-text>
      <v-card-text class="pt-1">
        The room and the visitor exchange connections only after they have a
        meeting of minds and only if the visitor wants contact tracing.
      </v-card-text>
      <v-card-actions>
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
          >Assess visitor's credentials
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
axios.defaults.baseURL = config.BASEURL;

export default {
  component: {},

  watch: {
    loader() {
      const l = this.loader;
      console.log('loader', l);
      this[l] = !this[l];
      if (l == 'loading1') {
        this.verify('verify/visitor').then(() => {
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
    qrSource() {
      return `https://chart.googleapis.com/chart?cht=qr&chl=${this.verificationRequestUrl}&chs=200x200&chld=L|1`;
    }
  },

  data: () => ({
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
    },

    invitationSetup() {
      let isMobile = true; //window.document.width() < 576;
      let urlParams = new URLSearchParams(window.location.search);
      let d_m;
      let orig = 'https://link.streetcred.id/';
      console.log(orig);

      /****************************************************************************
    Check Parameters
  ****************************************************************************/
      if (urlParams.has('d_m')) {
        d_m = urlParams.get('d_m');
      } else if (urlParams.has('c_i')) {
        d_m = urlParams.get('c_i');
      } else {
        console.error('Missing d_m/c_i parameter');
        this.invitationError();
        return;
      }
      if (urlParams.has('orig')) {
        this.orig = urlParams.get('orig');
      } else {
        console.error('Missing orig parameter');
        this.invitationError();
        return;
      }

      /****************************************************************************
    Parse the DID Document
  ****************************************************************************/
      let didDoc = JSON.parse(atob(d_m));
      console.log(didDoc);
      let type = didDoc['@type'];

      /****************************************************************************
    If type is Connection Invitation
  ****************************************************************************/
      if (type.includes('invitation')) {
        //   document.getElementById('root').innerHTML = `
        //   <div class="container p-md-5 p-3 shadow-sm bg-white rounded">
        //     <div class="row justify-content-center">
        //       <div class="col-md-10 col-12">
        //         <h4>You're invited to connect.</h4>
        //         <p class="d-none d-md-block">Scan the QR code with your Trinsic wallet to connect with this organization.</p>
        //         <h6>Organization: ${didDoc.label}</h6>
        //       </div>
        //       <div class="col-md-2 col-6 text-centered">
        //         <img src=${didDoc.imageUrl} class="rounded" width="60%">
        //       </div>
        //     </div>
        //     <div class="row justify-content-center">
        //       <div class="col-7 text-centered w-50">
        //         <img id="qrcode" class="p-3">
        //       </div>
        //     </div>
        //     <div class="row justify-content-center">
        //       <div class="col text-centered">
        //         <button id="wallet" type="button" class="btn btn-streetcred mt-3 mb-3">Open in Wallet</button>
        //       </div>
        //     </div>
        //   </div>
        // `;
      } else if (type.includes('request-presentation')) {
        /****************************************************************************
    If type is Connectionless Verification
  ****************************************************************************/
        let data = JSON.parse(
          atob(didDoc['request_presentations~attach'][0].data.base64)
        );
        let requestedAttrs = data.requested_attributes;
        let attrs = Object.keys(requestedAttrs);

        attrs.forEach(attr => {
          this.domAttrs += `<div class="normal-text attr">${attr}</div>`;
        });

        //   document.getElementById('root').innerHTML = `
        //   <div class="container">
        //     <h4>You've received a proof request from Trinsic.</h4>
        //     <p class="d-none d-md-block">Scan the QR code with your Trinsic wallet to complete it.</p>
        //   </div>
        //   <div class="container p-md-5 p-3 shadow-sm bg-white rounded">
        //     <div class="row justify-content-center">

        //       <div class="col-md-7 order-md-1 col-7 order-12">

        //         <div class="row justify-content-center">
        //           <div class="col text-centered">
        //             <img id="qrcode" class="p-3">
        //           </div>
        //         </div>

        //         <div class="row justify-content-center">
        //           <div class="col text-centered">
        //             <button id="wallet" type="button" class="btn btn-streetcred mt-3 mb-3">Open in Wallet</button>
        //           </div>
        //         </div>

        //       </div>

        //       <div class="col-md-5 order-md-12 col-12 order-1">
        //       <a class="attr-dropdown ${
        //         isMobile ? '' : 'no-pointer'
        //       }" data-toggle="${
        //     isMobile ? 'collapse' : ''
        //   }" href="#attrs" role="button" aria-expanded="false" aria-controls="proof attributes">
        //         <h6>
        //           <span>
        //             <img id="chevron-down" src="./images/chevron-down.svg" style="display: none" >
        //             <img id="chevron-right" src="./images/chevron-right.svg" style="display: ${
        //               isMobile ? 'inline' : 'none'
        //             }" >
        //             Attributes to Prove
        //           </span>
        //         </h6>
        //       </a>
        //         <div class="collapse ${isMobile ? '' : 'show'}" id="attrs">
        //           ${domAttrs}
        //         </div>
        //       </div>

        //     </div>
        //   </div>
        // `;
        // $('#attrs').on('hide.bs.collapse', function() {
        //   let chevronDown = document.getElementById('chevron-down');
        //   let chevronRight = document.getElementById('chevron-right');

        //   chevronDown.style.display = 'none';
        //   chevronRight.style.display = 'inline';
        // });
        // $('#attrs').on('show.bs.collapse', function() {
        //   let chevronDown = document.getElementById('chevron-down');
        //   let chevronRight = document.getElementById('chevron-right');

        //   chevronDown.style.display = 'inline';
        //   chevronRight.style.display = 'none';
        // });
      } else if (type.includes('offer-credential')) {
        /****************************************************************************
    If type is Connectionless Credential Offer
  ****************************************************************************/
        let data = JSON.parse(atob(didDoc['offers~attach'][0].data.base64));
        let schemaId = data.schema_id;
        let credentialTitle = schemaId.substring(schemaId.indexOf(':') + 1);
        credentialTitle = credentialTitle.substring(
          credentialTitle.indexOf(':') + 1
        );
        credentialTitle = credentialTitle.substring(
          0,
          credentialTitle.indexOf(':')
        );
        console.log(credentialTitle);
        let previewAttrs = didDoc['credential_preview'].attributes;
        // let domAttrs = '';
        previewAttrs.forEach(attr => {
          this.domAttrs += `
          <div class="row normal-text">
            <div class="col left">
              <div class="attr">${attr.name}</div>
            </div>
            <div class="col right">
              <div class="attrv">${attr.value}</div>
            </div>
          </div>
        `;
        });

        //   document.getElementById('root').innerHTML = `
        //   <div class="container">
        //     <h4>You've received a credential offer.</h4>
        //     <p class="d-none d-md-block">Scan the QR code with your Trinsic wallet to accept it.</p>
        //   </div>
        //   <div class="container p-md-5 p-3 shadow-sm bg-white rounded">

        //     <div class="row justify-content-center no-gutters">
        //       <div class="col-md-6 order-md-1 mr-md-auto col-7 order-12">

        //         <div class="row justify-content-center">
        //           <div class="col text-centered">
        //             <img id="qrcode" class="p-3">
        //           </div>
        //         </div>

        //         <div class="row justify-content-center">
        //           <div class="col text-centered">
        //             <button id="wallet" type="button" class="btn btn-streetcred mt-3 mb-3">Open in Wallet</button>
        //           </div>
        //         </div>

        //       </div>

        //       <div class="col-md-5 order-md-12 mr-md-5 pr-md-5 col-12 order-1">

        //           <div class="card credential-card d-none d-md-block mr-auto ml-auto">
        //             <div class="credential-banner"></div>
        //             <div class="card-body">
        //               <div class="row align-items-center">
        //                 <div class="col-4">
        //                   <div class="credential-logo">${credentialTitle.charAt(
        //                     0
        //                   )}</div>
        //                 </div>

        //                 <div class="col">
        //                   <h6>${credentialTitle}</h6>
        //                 </div>
        //               </div>
        //             </div>
        //           </div>

        //           <div class="d-block d-md-none">
        //             <h6>${credentialTitle}</h6>
        //           </div>

        //           <a class="attr-dropdown ${
        //             isMobile ? '' : 'no-pointer'
        //           }" data-toggle="${
        //     isMobile ? 'collapse' : ''
        //   }" href="#attrs" role="button" aria-expanded="false" aria-controls="proof attributes">
        //             <h6>
        //               <span>
        //                 <img id="chevron-down" src="./images/chevron-down.svg" style="display: none" >
        //                 <img id="chevron-right" src="./images/chevron-right.svg" style="display: ${
        //                   isMobile ? 'inline' : 'none'
        //                 }" >
        //                 Attributes
        //               </span>
        //             </h6>
        //           </a>
        //           <div class="collapse ${isMobile ? '' : 'show'}" id="attrs">
        //             ${domAttrs}
        //           </div>

        //       </div>

        //     </div>
        //   </div>
        // `;
        // $('#attrs').on('hide.bs.collapse', function() {
        //   let chevronDown = document.getElementById('chevron-down');
        //   let chevronRight = document.getElementById('chevron-right');

        //   chevronDown.style.display = 'none';
        //   chevronRight.style.display = 'inline';
        // });
        // $('#attrs').on('show.bs.collapse', function() {
        //   let chevronDown = document.getElementById('chevron-down');
        //   let chevronRight = document.getElementById('chevron-right');

        //   chevronDown.style.display = 'inline';
        //   chevronRight.style.display = 'none';
        // });
      }

      /****************************************************************************
    QR Code and Wallet Link
  ****************************************************************************/
      if (isMobile === false) {
        // var qr = new QRious({
        // new QRious({
        //   element: document.getElementById('qrcode'),
        //   value: orig,
        //   size: 300,
        //   background: 'white',
        //   foreground: 'black'
        // });
      }

      // document.getElementById('wallet').addEventListener('click', function() {
      //   window.location.href = `id.streetcred://launch?c_i=${d_m}`;
      // });
    },
    invitationError() {
      alert('Uh Oh! There seems to be a problem with the invitation link...');
    }
  },

  mounted() {
    console.log('Using:', axios.defaults.baseURL);
  }
};
</script>

<style></style>
