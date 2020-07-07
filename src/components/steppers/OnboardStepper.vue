<template>
  <v-stepper v-model="e6" vertical>
    <v-stepper-step :complete="e6 > 1" step="1">
      <p>Stop the spread with two simple steps</p>
      <p>
        <small
          ><ol>
            <li>Every time you enter a room, get the room's connectionId.</li>
            <li>
              If you get sick, send a message to all the rooms you have occupied
              in the last five days.
            </li>
          </ol></small
        >
      </p>
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-card class="mb-12">
        <ContactTracing />
      </v-card>
      <v-btn :color="btnColor" @click="e6 = 2">Continue</v-btn>
      <v-btn text>Cancel</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
import ContactTracing from '@/components/ContactTracing';
export default {
  components: {
    ContactTracing
  },
  data() {
    return {
      e6: 1,
      btnColor: 'red lighten-1'
    };
  }
};
</script>
