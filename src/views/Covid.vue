<template>
  <div>
    <div v-if="loading">
      <h2>Loading COVID Card</h2>
    </div>
    <v-container v-else class="purple lighten-5">
      <v-row>
        <v-col cols="8">
          <div class="home">
            <SymptomsCard />
          </div>
        </v-col>
        <v-col cols="8">
          <div class="home" v-show="testAvailable">
            <CovidCard />
          </div>
        </v-col>
        <v-col cols="8">
          <div>
            <v-card>
              <v-card-title>
                Request a Test Result Proof
              </v-card-title>
              <v-card-text>
                <v-autocomplete
                  v-model="testType"
                  label="Connection"
                  autofocus
                  dense
                  :items="['SM-G955U', 'YUKON237', 'Michael\'s iPhone']"
                ></v-autocomplete>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="onGetProof"
                  :disabled="false"
                  >Get Proof Results</v-btn
                >
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false"
                  >Close</v-btn
                >
              </v-card-actions>
            </v-card>
          </div></v-col
        >
      </v-row>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment';

// @ is an alias to /src
import CovidCard from '@/components/CovidCard.vue';
import SymptomsCard from '@/components/SymptomsCard.vue';

import Member from '@/models/Member';
export default {
  name: 'profile',

  data: () => ({
    testAvailable: true,
    TIME: 'hh:mm',
    loading: false
  }),

  components: {
    CovidCard,
    SymptomsCard
  },
  computed: {
    members() {
      let m = Member.query()
        .with('preferences')
        .get();
      console.log('Profile member', m);
      return m;
    },
    member() {
      return this.members[0];
    },
    now() {
      return moment().format(this.TIME);
    }
  },
  methods: {
    async onGetProof() {}
  },

  async created() {
    this.loading = true;

    this.loading = false;
  }
};
</script>
