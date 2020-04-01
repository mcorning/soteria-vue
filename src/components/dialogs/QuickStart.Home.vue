<template>
  <div>
    <v-dialog :value="dialog" max-width="300">
      <v-card>
        <v-card-title class="headline">Secours Quick Start</v-card-title>

        <v-card-text class="p-2 ">
          <slot name="context"></slot>
        </v-card-text>
        <v-card-text>
          <slot name="goal"></slot>
        </v-card-text>
        <v-card-text>
          <slot name="detail"></slot>
        </v-card-text>
        <v-card-actions>
          <v-checkbox
            v-model="showMeQuickStarts"
            label="Keep showing"
          ></v-checkbox>
          <v-spacer></v-spacer>

          <v-btn color="green darken-1" text @click="close">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    showQuickStart: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialog: true,
      showMeQuickStarts: this.showQuickStart
    };
  },
  watch: {
    showMeQuickStarts() {
      this.$emit('quick-start-pref-change', this.showMeQuickStarts);
    }
  },
  methods: {
    close() {
      this.dialog = false;
    }
  }
};
</script>

<style lang="scss" scoped></style>
