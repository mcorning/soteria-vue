<template>
  <v-container>
    <div class="home">
      <ProfileCard />
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src
import ProfileCard from '@/components/ProfileCard.vue';

export default {
  name: 'profile',

  data: () => ({}),

  components: {
    ProfileCard
  },

  methods: {},
  created() {}
};
</script>
