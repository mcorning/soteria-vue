<template>
  <div class="text-center">
    <!-- <v-btn dark color="red darken-2" @click="snackbar = true">
      Open Snackbar
    </v-btn> -->
    <v-btn color="secondary" fab x-small dark @click="toggle">
      <v-icon>mdi-pencil</v-icon>
    </v-btn>

    <v-snackbar v-model="snackbar" :multi-line="multiLine">
      {{ text }}
      <v-btn text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  data: () => ({
    multiLine: true,
    snackbar: true,
    text:
      'Use the slider(s) to set the minutes and hours you expect to be busy. Hit the Depart button when you leave. Hit the Arrive button when you return.'
  }),
  methods: {
    toggle() {
      this.snackBar = true;
    }
  }
};
</script>
