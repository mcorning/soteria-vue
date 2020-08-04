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
    <RoomCard />
  </v-container>
</template>

<script>
import RoomCard from '@/components/RoomCard.vue';
import lctVer from '@/lct.ver.json';

export default {
  components: {
    RoomCard
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
