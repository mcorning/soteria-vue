<template>
  <v-card max-width="344" class="mx-auto">
    <v-list-item>
      <v-list-item-avatar color="purple"></v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline">Secours </v-list-item-title>
        <v-list-item-subtitle
          >Trust and Safety as a Service (v0.4.20)</v-list-item-subtitle
        >
      </v-list-item-content>
    </v-list-item>

    <v-img
      src="https://cdn.vuetifyjs.com/images/cards/mountain.jpg"
      height="194"
    ></v-img>

    <v-card-text>
      Secours brings expertise in law enforcement, data science, and
      decentralized identity to bring its members a new level of safety while
      protecting privacy.
    </v-card-text>

    <v-card-text>
      Reach out to us if you have any questions, suggestions, or concerns.
    </v-card-text>
    <v-card-text>
      When you're ready, start sharing this personal power with friends, family,
      co-workers, and anybody else who can help make us all safer together.
    </v-card-text>
    <v-card-actions>
      <v-btn text color="deep-purple accent-4">
        <a href="mailto://support@secours.io">Email</a>
      </v-btn>
      <v-btn text color="deep-purple accent-4">
        Call
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
