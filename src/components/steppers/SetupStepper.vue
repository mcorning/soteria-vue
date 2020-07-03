<template>
  <v-stepper v-model="e6" vertical>
    <v-stepper-step :complete="e6 > 1" step="1">
      Ensure you have an internet connections
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
      <v-btn text>Cancel</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 2" step="2"
      >Install a digital wallet</v-stepper-step
    >

    <v-stepper-content step="2">
      <v-card color="grey lighten-1" class="mb-12">
        <v-card-text
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
        </v-card-text>
      </v-card>
      <v-btn :color="btnColor" @click="e6 = 3">Continue</v-btn>
      <v-btn text>Cancel</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 3" step="3"
      >Add the Local Contact Tracing app to your Home screen</v-stepper-step
    >

    <v-stepper-content step="3">
      <v-card color="grey lighten-1" class="mb-12">
        <v-card-subtitle>Scan this link with your mobile phone</v-card-subtitle>

        <img
          class="pa-5"
          width="200"
          height="200"
          src="https://chart.googleapis.com/chart?cht=qr&chl=https://apps.apple.com/us/app/streetcred-identity-agent/id1475160728&chs=200x200&chld=L|1"/>
        <img
      /></v-card>
      <v-btn :color="btnColor" @click="e6 = 4">Continue</v-btn>
      <v-btn text>Cancel</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
export default {
  data() {
    return {
      e6: 1,
      btnColor: 'red lighten-1'
    };
  }
};
</script>
