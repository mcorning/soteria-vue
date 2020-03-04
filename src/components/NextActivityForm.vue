<template>
  <v-container class="purple lighten-5">
    <h2>My next activity</h2>
    <v-row>
      <v-col cols="12" sm="4">
        <v-text-field
          label="Starting Place*"
          hint="Uses your last location"
          persistent-hint
          required
          v-model="departedFrom"
          @change="checkUpdate"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="4">
        <v-text-field
          style="width:290px"
          label="Ending Place"
          hint="Leave blank for round trip"
          persistent-hint
          v-model="arrivedAt"
          @change="checkUpdate"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="4">
        <v-autocomplete
          style="width:290px"
          :items="[
            'Backpacking',
            'Baseball',
            'Basejump',
            'Basketball',
            'Biking',
            'Boating',
            'Hiking',
            'Hockey',
            'Land sailing',
            'Mountain Biking',
            'Road trip',
            'Running',
            'Sailing',
            'Shopping',
            'Skiing',
            'Soccer',
            'Walking',
            'Unlisted'
          ]"
          label="Activity"
          hint="Choose an activity to help us help you if necessary"
          persistent-hint
          v-model="description"
          @change="checkUpdate"
        ></v-autocomplete>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import { mapFields } from 'vuex-map-fields';

export default {
  props: {
    activity: {
      type: Object
    }
  },
  computed: {
    // ...mapFields([
    //   'activity.arrivedAt',
    //   'activity.departedFrom',
    //   'activity.description'
    // ])
    arrivedAt() {
      return '';
    },
    departedFrom() {
      return '';
    },
    description() {
      return '';
    }
  },

  data() {
    return {};
  },
  methods: {
    checkUpdate() {
      // console.log('activity', this.activity.departedFrom);
      // console.log('activity', this.activity.arrivedAt);
      // console.log('activity', this.activity.description);
    }
  }
};
</script>
