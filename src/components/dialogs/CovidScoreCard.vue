<template>
  <v-dialog v-model="dialog" persistent max-width="300px">
    <template v-slot:activator="{ on }">
      <v-layout align-center justify-center>
        <v-btn
          color="primary"
          block
          dark
          v-on="on"
          class=".subtitle-2"
          v-tooltip="{
            content: 'Hide your symptoms, but present your Covid Score.',
            classes: '.subtitle-2'
          }"
          >Show your Covid Score</v-btn
        >
      </v-layout>
    </template>
    <v-card class="card">
      <v-card-title class="headline">My Covid-19 Score</v-card-title>
      <v-card-text
        class=" covidScore"
        :class="[
          this.covidScore < 4
            ? 'green--text'
            : this.covidScore < 7
            ? 'orange--text'
            : 'red--text'
        ]"
      >
        <strong>{{ covidScore }}</strong>
      </v-card-text>
      <v-card-text>
        {{ advise }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    covidScore: {
      type: Number,
      default: 0
    }
  },
  computed: {
    advise() {
      const msg =
        this.covidScore < 0
          ? this.warnings[0]
          : this.covidScore == 0
          ? this.warnings[1]
          : this.covidScore < 3
          ? this.warnings[2]
          : this.covidScore == 3
          ? this.warnings[3]
          : this.covidScore < 7
          ? this.warnings[4]
          : this.covidScore < 10
          ? this.warnings[5]
          : this.warnings[6];
      return msg;
    }
  },
  data() {
    return {
      dialog: false,
      warnings: [
        'Negative scores mean there is more evidence something other than COVID-19 cause your symptoms.',
        'The odds you carry the virus are 50%. However, you may be an asymptomatic carrier and a danger to others.',
        'Scores of 1 and 2 means your not asymptomatic, and you do not represent a substantial risk to others.',
        'Score of 3 should be an early warning sign of a COVID-19 infection. Watch for other symptoms.',
        'Score of 4 through 6 provide substantial evidence of carrying the virus.',
        'Any score above 6? Stay home. Beware of silent hypoxia: once your spO2 drops below 90%, call your physician.',
        'Any score above 9 means you should probably be in the hospital. You risk stroke or death with an sp02 below 80%.'
      ]
    };
  },
  methods: {
    myFunction: function() {}
  },

  created() {}
};
</script>
<style>
.card {
  margin-bottom: 3em;
}

.covidScore {
  margin-top: 1em;
  margin-bottom: 1em;
  text-align: center;
  font-size: 5em;
}
</style>
