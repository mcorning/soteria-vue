<template>
  <v-container justify="center" class="purple lighten-5">
    <Profile />
  </v-container>
</template>

<script>
import moment from 'moment';

// @ is an alias to /src
import Member from '@/models/Member';

import Profile from '@/views/Profile.vue';

export default {
  name: 'home',
  components: {
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
