<template>
  <v-container>
    <div class="home">
      <Profile />
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Profile from '@/components/Profile.vue';

export default {
  name: 'profile',

  data: () => ({}),

  components: {
    Profile
  },

  methods: {},
  created() {}
};
</script>
