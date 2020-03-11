<template>
  <v-container justify="center">
    <div class="home">
      <Active />
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src
// import Active from '@/views/About.vue';
import Active from '@/views/Active.vue';
// import L from '@/logger';

export default {
  name: 'home',
  data: () => ({
    loading: false,
    error: null,
    member: null
  }),
  components: {
    Active
  },

  // watch: {
  //   // call the method again if the route changes
  //   $route: 'getMember'
  // },

  methods: {},
  created() {
    console.log('Home.vue created');
  },
  mounted() {}
};
</script>
