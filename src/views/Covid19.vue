<template>
  <v-container class="purple lighten-5 pa-2">
    <v-card v-if="firstTime">
      <v-card-title>Introducing Local Contact Tracing</v-card-title>
      <v-card-text class="pb-1"
        >Local contact tracing assumes:
        <ul>
          <li>the virus is local</li>
          <li>risk of exposure is between two people</li>
          <li>privacy is paramount</li>
        </ul>
      </v-card-text>
      <v-card-text class="pb-1">
        Local contact tracing takes three perspectives:
        <ul>
          <li>The Room</li>
          <li>A visitor</li>
          <li>Occupants</li>
        </ul>
      </v-card-text>
      <v-card-text class="pb-1">
        Local contact tracing depends on three tasks:
        <ol>
          <li>Room assesses safety of the visitor</li>
          <li>Visitor assesses safety of the room</li>
          <li>Both exchange connection IDs</li>
        </ol>
      </v-card-text>
      <v-card-text>
        If an occupant tests positive:
        <ol>
          <li>
            The occupent sends an encrypted message to each room they entered
          </li>
          <li>
            Each room alerts each occupant of exposure
          </li>
        </ol>
      </v-card-text>
      <v-btn @click="close">Close</v-btn>
    </v-card>
    <v-card v-else>
      <v-card-title>Local Contact Tracing</v-card-title>
      <v-row no-gutters>
        <v-col dense>
          <v-select
            v-model="role"
            :items="items"
            label="Your Role"
            class="pl-3"
          ></v-select>
          <VerifyVisitor v-if="visitor" />

          <VerifyRoom v-if="room" />

          <ContactTracing v-if="occupant" />
        </v-col>
        <v-col v-if="role != 'room'">
          <v-card-title>Your Data</v-card-title>
          <v-card-text
            >Monitor your symptoms or get tested. If you are positive, we will
            alert everybody who needs to know.</v-card-text
          >
          <SymptomsCard />
          <!-- <ProofRequest /> -->
          <CovidTestResultsCardV />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
// import CovidTestResultsCard from '@/components/CovidTestResultsCard.vue';
import CovidTestResultsCardV from '@/components/CovidTestResultsCardV.vue';

import SymptomsCard from '@/components/SymptomsCard.vue';
// import ProofRequest from '@/components/ProofRequest.vue';
import ContactTracing from '@/components/ContactTracing.vue';
import VerifyVisitor from '@/components/VerifyVisitor.vue';
import VerifyRoom from '@/components/VerifyRoom.vue';

export default {
  components: {
    SymptomsCard,
    CovidTestResultsCardV,
    // ProofRequest,
    ContactTracing,
    VerifyVisitor,
    VerifyRoom
  },
  computed: {
    visitor() {
      // visitor roles verify rooms
      return this.role === 'room';
    },
    room() {
      // room roles verify visitors
      return this.role === 'visitor';
    },
    occupant() {
      return this.role === 'occupant';
    }
  },
  data() {
    return {
      role: 'room',
      firstTime: true,
      items: ['visitor', 'room', 'occupant']
    };
  },
  methods: {
    close() {
      this.firstTime = false;
    }
  },

  mounted() {}
};
</script>

<style lang="scss" scoped></style>
