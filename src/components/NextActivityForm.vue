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
          v-model="departFrom"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="4">
        <v-text-field
          style="width:290px"
          label="Ending Place"
          hint="Leave blank for round trip"
          persistent-hint
          v-model="arriveAt"
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
        ></v-autocomplete>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Member from '@/models/Member';

export default {
  computed: {
    departFrom: {
      get() {
        let x = this.member.lastActivity.departFrom;
        return x;
      },
      set(newVal) {
        this.$emit('departFrom-set', { departFrom: newVal });
      }
    },
    arriveAt: {
      get() {
        let x = this.member.lastActivity.arriveAt;
        return x;
      },
      set(newVal) {
        this.$emit('arrivedAt-set', { arriveAt: newVal });
      }
    },
    description: {
      get() {
        let x = this.member.lastActivity.description;
        return x;
      },
      set(newVal) {
        this.$emit('description-set', { description: newVal });
      }
    }
  },

  data() {
    return { member: {} };
  },

  methods: {},

  created() {
    let m = Member.query()
      .with('activities')
      .first();
    console.info('NextActivityForm.vue.activities:', m);
    this.member = m;
  }
};
</script>
