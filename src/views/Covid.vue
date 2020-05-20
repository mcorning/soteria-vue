<template>
  <div>
    <div v-if="loading">
      <h2>Loading COVID Card</h2>
    </div>
    <v-container v-else class="purple lighten-5">
      <div class="home">
        <SymptomsCard />
      </div>
      <div class="home" v-show="testAvailable">
        <CovidCard />
      </div>
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
    testAvailable: false,
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
  methods: {},
  async created() {
    this.loading = true;

    this.loading = false;
  }
};
</script>
