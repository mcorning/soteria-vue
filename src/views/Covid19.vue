<template>
  <v-container class="purple lighten-5">
    <v-row>
      <v-col>
        <v-card>
          <VerifyVisitor />
        </v-card>
      </v-col>
      <v-col>
        <v-card>
          <VerifyRoom />
        </v-card>
      </v-col>
      <v-col>
        <ContactTracing />
      </v-col>
      <v-col>
        <v-card>
          <SymptomsCard />
        </v-card>
      </v-col>
      <v-col>
        <ProofRequest />
      </v-col>
      <v-col>
        <CovidTestResultsCardV />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import CovidTestResultsCard from '@/components/CovidTestResultsCard.vue';
import CovidTestResultsCardV from '@/components/CovidTestResultsCardV.vue';

import SymptomsCard from '@/components/SymptomsCard.vue';
import ProofRequest from '@/components/ProofRequest.vue';
import ContactTracing from '@/components/ContactTracing.vue';
import VerifyVisitor from '@/components/VerifyVisitor.vue';
import VerifyRoom from '@/components/VerifyRoom.vue';

export default {
  components: {
    SymptomsCard,
    // CovidTestResultsCard,
    CovidTestResultsCardV,
    ProofRequest,
    ContactTracing,
    VerifyVisitor,
    VerifyRoom
  },
  methods: {},
  mounted() {}
};
</script>

<style lang="scss" scoped></style>
