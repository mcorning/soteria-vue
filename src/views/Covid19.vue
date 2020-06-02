<template>
  <v-container class="purple lighten-5">
    <v-row>
      <v-col>
        <v-card>
          <SymptomsCard />
        </v-card>
      </v-col>
      <v-col>
        <CovidCard />
      </v-col>
      <v-col>
        <ProofRequest />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CovidCard from '@/components/CovidTestResultsCard.vue';

import SymptomsCard from '@/components/SymptomsCard.vue';
import ProofRequest from '@/components/ProofRequest.vue';

export default {
  components: { SymptomsCard, CovidCard, ProofRequest },
  methods: {}
};
</script>

<style lang="scss" scoped></style>
