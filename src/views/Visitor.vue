<template>
  <v-container class="primary lighten-5 px-0 pt-0">
    <v-system-bar
      class="pt-0"
      color="secondary"
      :height="height"
      :lights-out="lightsOut"
      :window="window"
    >
      <span><v-icon color="yellow">mdi-alert</v-icon>R&D only</span>
      <v-spacer></v-spacer>
      <span>Use hard reload</span>
      <v-spacer></v-spacer>
      <span>v. {{ VER }} </span>
    </v-system-bar>
    <VisitorCard />
  </v-container>
</template>

<script>
import VisitorCard from '@/components/VisitorCard.vue';
import lctVer from '@/lct.ver.json';

export default {
  components: {
    VisitorCard
  },
  computed: {},
  data() {
    return { VER: lctVer.VER, height: 24, lightsOut: false, window: false };
  },
  methods: {},

  mounted() {}
};
</script>

<style lang="scss" scoped></style>
