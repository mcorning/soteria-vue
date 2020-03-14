<template>
  <v-container class="purple lighten-5">
    <div v-if="loading">
      <h2>Loading...</h2>
    </div>
    <div v-else>
      <h2>My next activity</h2>
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field
            label="Starting Place*"
            hint="Uses your last location"
            persistent-hint
            required
            clearable
            v-model="departFrom"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="4">
          <v-text-field
            style="width:290px"
            label="Ending Place"
            hint="Leave blank for round trip"
            persistent-hint
            clearable
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
            clearable
            v-model="description"
          ></v-autocomplete>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import Member from '@/models/Member';
import Activity from '@/models/Activity'; // needed to fetch this in order to get a non-null member.lastActivity reference

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
    return { member: {}, loading: false };
  },

  methods: {},

  async created() {
    this.loading = true;
    await Activity.$fetch();
    await Member.$fetch();
    let m = Member.query()
      .with('activities')
      .first();
    this.loading = false;

    console.info('NextActivityForm.vue.activities:', m);
    this.member = m;
  }
};
</script>
