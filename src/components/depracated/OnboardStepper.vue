<template>
  <div>
    <v-stepper v-model="e6" vertical>
      <v-stepper-step :complete="e6 > 1" step="1">
        <p>Exchange connections</p>
        <p>
          <small>Exchange your connectionId with rooms you enter. </small>
        </p>
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-card class="mb-12">
          <ContactTracing1 />
        </v-card>
        <v-btn :color="btnColor" @click="e6 = 2">Continue</v-btn>
        <!-- <v-btn text>Cancel</v-btn> -->
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2">
        <p>Send Messages</p>
        <p>
          <small
            >If you get sick, notify rooms you occupied in the last five days.
          </small>
        </p>
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-card class="mb-12">
          <ContactTracing2 />
        </v-card>
        <v-btn :color="btnColor" @click="e6 = 3">Continue</v-btn>
        <!-- <v-btn text>Cancel</v-btn> -->
      </v-stepper-content>
    </v-stepper>
  </div>
</template>

<script>
import ContactTracing1 from '@/components/ContactTracing1';
import ContactTracing2 from '@/components/ContactTracing2';
export default {
  components: {
    ContactTracing1,
    ContactTracing2
  },
  data() {
    return {
      e6: 1,
      btnColor: 'red lighten-1'
    };
  }
};
</script>
