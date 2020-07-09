<template>
  <v-container class="primary lighten-5">
    <ContactTracing />
    <!-- <ContactTracing1 />
    <ContactTracing2 /> -->
  </v-container>
</template>

<script>
// import ContactTracing1 from '@/components/ContactTracing1.vue';
// import ContactTracing2 from '@/components/ContactTracing2.vue';
import ContactTracing from '@/components/ContactTracing.vue';

export default {
  components: {
    // ContactTracing1,
    // ContactTracing2
    ContactTracing
  },
  computed: {},
  data() {
    return {};
  },
  methods: {},

  mounted() {}
};
</script>

<style lang="scss" scoped></style>
