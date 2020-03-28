<template>
  <v-container justify="center">
    <div class="home">

      <Active />
    </div>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Active from '@/views/Active.vue';


export default {
  name: 'home',
  components: {
    Active
  },
  data: () => ({
    loading: false,
    error: null,
    member: null,

  }),

  methods: {

  },

   created() {
    console.log(this.now, 'Entering Home.vue created');
    console.log(this.now, 'Leaving Home created()');
  },
  mounted() {}
};
</script>
