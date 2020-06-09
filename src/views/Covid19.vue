<template>
  <v-container class="purple lighten-5">
    <v-row>
      <v-col>
        <v-card>
          <SymptomsCard />
        </v-card>
      </v-col>
      <v-col>
        <CovidTestResultsCard />
      </v-col>
      <v-col>
        <ProofRequest />
      </v-col>
      <v-col>
        <ContactTracing />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CovidTestResultsCard from '@/components/CovidTestResultsCard.vue';

import SymptomsCard from '@/components/SymptomsCard.vue';
import ProofRequest from '@/components/ProofRequest.vue';
import ContactTracing from '@/components/ContactTracing.vue';

export default {
  components: {
    SymptomsCard,
    CovidTestResultsCard,
    ProofRequest,
    ContactTracing
  },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
