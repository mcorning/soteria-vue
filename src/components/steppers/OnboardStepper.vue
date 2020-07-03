<template>
  <v-stepper v-model="e6" vertical>
    <v-stepper-step :complete="e6 > 1" step="1">
      Maintain your personal information
      <small
        >Your Zipcode and age are useful data for measuring the risk you carry
        the virus.</small
      >
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-card class="mb-12">
        <ProfileCard />
      </v-card>
      <v-btn :color="btnColor" @click="e6 = 2">Continue</v-btn>
      <v-btn text>Cancel</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 2" step="2"
      >Monitor your symptoms
      <small
        >We use public data to convert your symptoms into evidence you carry the
        virus (or not).</small
      >
    </v-stepper-step>

    <v-stepper-content step="2">
      <v-card class="mb-12"><SymptomsCard /></v-card>
      <v-btn :color="btnColor" @click="e6 = 3">Continue</v-btn>
      <v-btn text>Cancel</v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="e6 > 3" step="3"
      >Issue yourself credentials
      <small
        >Convert your Covid test results into a verifiable credential.</small
      >
    </v-stepper-step>

    <v-stepper-content step="3">
      <v-card class="mb-12"><CovidTestResultsCardV /></v-card>
      <v-btn :color="btnColor" @click="e6 = 4">Continue</v-btn>
      <v-btn text>Cancel</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
import ProfileCard from '@/components/ProfileCard';
import SymptomsCard from '@/components/SymptomsCard';
import CovidTestResultsCardV from '@/components/CovidTestResultsCardV';
export default {
  components: {
    ProfileCard,
    SymptomsCard,
    CovidTestResultsCardV
  },
  data() {
    return {
      e6: 1,
      btnColor: 'red lighten-1'
    };
  }
};
</script>
