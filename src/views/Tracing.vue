<template>
  <v-container class="primary lighten-5 px-0 pt-0">
    <v-system-bar
      class="pt-0"
      color="secondary"
      :height="height"
      :lights-out="lightsOut"
      :window="window"
    >
      <span
        ><small><v-icon>mdi-alert</v-icon>Alpha code R&D only</small></span
      >
      <v-spacer></v-spacer>
      <span><small>Use hard reload</small></span>
      <v-spacer></v-spacer>
      <span
        ><small>v. {{ VER }} </small></span
      >
    </v-system-bar>
    <RoleCard />
  </v-container>
</template>

<script>
import RoleCard from '@/components/RoleCard.vue';
import lctVer from '@/lct.ver.json';

export default {
  components: {
    RoleCard
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
