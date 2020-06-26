<template>
  <v-card max-width="344" class="mx-auto">
    <v-list-item>
      <v-list-item-avatar color="red"></v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline">Soteria </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-img src="https://picsum.photos/500/300?image=50" height="194"></v-img>

    <v-card-text>
      <a href="https://sway.office.com/2gPCu04Gpv9Qws2H" target="_blank"
        >Soteria.id</a
      >
      is a nonprofit organization focused on reopening the economy without
      reopening the pandemic.
    </v-card-text>

    <v-card-text>
      Donations are always welcome.
    </v-card-text>
    <v-card-text>
      Reach out to us if you have any questions, suggestions, or concerns.
    </v-card-text>
    <v-card-actions>
      <v-btn text color="deep-purple accent-4">
        <a href="mailto://support@soteria.id">Email</a>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  components: {},

  computed: {},

  data() {
    return {};
  },

  methods: {},

  async created() {}
};
</script>

<style lang="scss" scoped></style>
