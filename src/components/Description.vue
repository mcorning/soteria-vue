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
import moment from 'moment';

import Member from '@/models/Member';
import Activity from '@/models/Activity'; // needed to fetch this in order to get a non-null member.lastActivity reference

export default {
  computed: {
    now() {
      return moment().format(this.TIME);
    },
    departFrom: {
      get() {
        let x = this.member.lastActivity.departFrom;
        return x;
      },
      set(newVal) {
        this.$store.state.departFrom = newVal;
        this.updateActivityWith({ departFrom: newVal });
      }
    },

    arriveAt: {
      get() {
        let x = this.member.lastActivity.arriveAt;
        return x;
      },
      set(newVal) {
        this.updateActivityWith({ arriveAt: newVal });
      }
    },

    description: {
      get() {
        let x = this.member.lastActivity.description;
        return x;
      },
      set(newVal) {
        this.updateActivityWith({ description: newVal });
      }
    }
  },

  data() {
    return { member: {}, loading: false, activity: '' };
  },

  methods: {
    updateActivityWith(payload) {
      console.log(
        `\tUpdating activity ${
          this.member.lastActivity.id
        } with ${JSON.stringify(payload)}`
      );
      Activity.$update({
        where: this.member.lastActivity.id,
        data: payload
      }).then(activity => {
        this.activity = activity;
        console.log('\tUpdated activity', activity);
      });
    }
  },

  async created() {
    console.log(this.now, '\nEntering Description.vue created...');

    this.loading = true;
    await Activity.$fetch();
    await Member.$fetch();
    let m = Member.query()
      .with('activities')
      .first();
    this.loading = false;

    console.info('\tActivityData.vue.activities:', m);
    this.member = m;
    this.$store.state.departFrom = this.departFrom;
    console.info('\tstore departFrom:', this.$store.state.departFrom);

    console.log(this.now, '...Leaving Description.vue created\n');
    console.log('.');
  }
};
</script>
