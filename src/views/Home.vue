<template>
  <v-container justify="center">
    <div class="home">
      <div v-if="member">
        <Active />
      </div>
      <div v-else><Profile /></div>
    </div>
  </v-container>
</template>

<script>
import moment from 'moment';

// @ is an alias to /src
import Member from '@/models/Member';

import Active from '@/views/Active.vue';
import Profile from '@/views/Profile.vue';

export default {
  name: 'home',
  components: {
    Active,
    Profile
  },
  computed: {
    now() {
      return moment().format(this.TIME);
    }
  },
  data: () => ({
    loading: false,
    error: null,
    member: null
  }),

  methods: {
    async setup() {
      let m = await Member.$fetch();

      if (m && Object.keys(m).length > 0) {
        this.member = m[0];
      }
    }
  },

  async created() {
    console.log(this.now, 'Entering Home.vue created');
    await this.setup();
    console.log(this.now, 'Leaving Home created()');
  },
  mounted() {}
};
</script>
