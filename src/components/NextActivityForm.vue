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
// import { mapFields } from 'vuex-map-fields';
import Member from '@/models/Member';
import Activity from '@/models/Activity';

export default {
  computed: {
    member() {
      let x = Member.query().first();
      return x;
    },
    activity() {
      // not general enough...
      let x = Activity.query().first();
      return x;
    },

    arriveAt: {
      get() {
        let x = this.activity ? this.activity.arriveAt : '';
        return x;
      },
      set(newVal) {
        this.update({ arriveAt: newVal });
      }
    },
    departFrom: {
      get() {
        let x = this.activity ? this.activity.departFrom : '';
        return x;
      },
      set(newVal) {
        this.update({ departFrom: newVal });
      }
    },
    description: {
      get() {
        let x = this.activity ? this.activity.description : '';
        return x;
      },
      set(newVal) {
        this.update({ description: newVal });
      }
    }
  },

  data() {
    return {};
  },

  methods: {
    update(payload) {
      if (Activity) {
        Activity.$update({
          where: this.activity.id,
          data: payload
        });
      }
    }
  }
};
</script>
