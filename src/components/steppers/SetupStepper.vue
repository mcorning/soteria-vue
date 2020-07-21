<template>
  <div>
    <v-stepper v-model="e6" vertical>
      <v-stepper-step :complete="e6 > 1" step="1">
        Ensure you have an internet connection
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-card color="grey lighten-1" class="mb-12">
          <v-card-text>
            <ul>
              <li>
                Use the room's internet connection, or
              </li>

              <li>
                If your mobile phone has hotspot enabled, use it, if necessary
              </li>
            </ul>
          </v-card-text>
        </v-card>
        <v-btn :color="btnColor" @click="e6 = 2">Continue</v-btn>
        <v-btn @click="cancel()" text>Skip </v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2"
        >Add this web app to your Home screen</v-stepper-step
      >

      <v-stepper-content step="2">
        <v-card color="grey lighten-1" class="mb-12">
          <v-card-text
            ><v-card-subtitle
              >Share this QR code with a new user of this app so you can connect
              with them.</v-card-subtitle
            >
            <img
              class="pa-5"
              width="200"
              height="200"
              src="https://chart.googleapis.com/chart?cht=qr&chl=https://soteriacovid2.z22.web.core.windows.net/&chs=200x200&chld=L|1"
            />
            <img />
            <p>
              You can add the app to your Home screen.
            </p>
            <v-card-subtitle class="pb-0 pt-0 ">iPhone users</v-card-subtitle>
            If this is the first time you've added an app to your iPhone Home
            screen,
            <ol>
              <li>
                Look for the share icon at the bottom of the phone
                <v-img src="../../assets/iPhoneAddToHomeScreen2.png" />
              </li>
              <li>Scroll down until you see "Add to Home Screen"</li>
              <li>Click</li>
            </ol>
            <v-card-subtitle class="pb-0">Android users</v-card-subtitle>
            If this is the first time you've added an app to your Android Home
            screen,
            <ol>
              <li>
                You should see this at the bottom of the app:
                <v-img src="../../assets/AndroidAddToHomeScreen.png" />
              </li>
              <li>
                Adding the app to your Home Screen is then a two step process on
                Android"
              </li>
            </ol>
          </v-card-text>
        </v-card>
        <v-btn :color="btnColor" @click="e6 = 3">Continue</v-btn>
        <v-btn @click="cancel()" text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 3" step="3"
        >Install a digital wallet (to hold your private keys and personal data).
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-card color="grey lighten-1" class="mb-12">
          <v-card-text>
            You will have a chance to install your digital wallet when you use
            your phone's camera to scan your first connection
            invitation.</v-card-text
          >
          <v-card-text
            >You will see this page show up in your phone's browser:
            <v-img src="../../assets/connection screen .jpg" />
          </v-card-text>
          <v-card-text>Select the wallet for your phone.</v-card-text>

          <!-- <v-card-text
            ><v-card-subtitle>From the Apple AppStore</v-card-subtitle>
            <img
              class="pa-5"
              width="200"
              height="200"
              src="https://chart.googleapis.com/chart?cht=qr&chl=https://apps.apple.com/us/app/streetcred-identity-agent/id1475160728&chs=200x200&chld=L|1"
            />
            <img />
          </v-card-text>
          <v-card-text
            ><v-card-subtitle>From the Google Play Store</v-card-subtitle>
            <img
              class="pa-5"
              width="200"
              height="200"
              src="https://chart.googleapis.com/chart?cht=qr&chl=https://play.google.com/store/apps/details?id=id.streetcred.apps.mobile&chs=200x200&chld=L|1"
            />

            <img />
          </v-card-text> -->
        </v-card>
        <v-btn :color="btnColor" @click="e6 = 4">Continue</v-btn>
        <v-btn @click="cancel()" text>Cancel</v-btn>
      </v-stepper-content>
    </v-stepper>
  </div>
</template>

<script>
export default {
  data() {
    return {
      e6: 1,
      btnColor: 'red lighten-1'
    };
  },
  methods: {
    cancel(e) {
      this.$emit('cancel-hardware-setup', e);
    }
  }
};
</script>
