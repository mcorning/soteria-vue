<template>
  <v-container class="purple lighten-5">
    <div v-if="loading">
      <h2>Loading...</h2>
    </div>
    <div v-else>
      <v-row>
        <v-col> <h2>My next activity</h2> </v-col>
        <v-col cols="3">
          <div class="text-center">
            <v-btn color="primary" fab x-small dark @click="snackbar = true">
              <v-icon>mdi-help</v-icon>
            </v-btn>
            <v-snackbar
              v-model="snackbar"
              top
              color="secondary"
              :timeout="timeoutPref"
              :multi-line="multiLine"
            >
              {{ descriptionHelpText }}
              <v-btn
                text
                dark
                elevation="4"
                color="white"
                @click="snackbar = false"
              >
                Close
              </v-btn>
            </v-snackbar>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <v-text-field
            label="Starting Place*"
            hint="Uses your last location"
            persistent-hint
            required
            clearable
            v-model="origin"
            @blur="originEntered"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="4">
          <v-text-field
            style="width:290px"
            label="Ending Place"
            hint="Leave blank for round trip"
            persistent-hint
            clearable
            v-model="destination"
            @blur="destinationEntered"
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
            @blur="descriptionEntered"
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
    }
  },

  data() {
    return {
      origin: '',
      destination: '',
      description: '',
      loading: false,
      member: {},
      activity: '',
      TIME: 'hh:mm',

      snackbar: false,
      multiLine: true,
      descriptionHelpText: `You need to provide two kinds of data to manage an activity: Description and Duration. For your Description, 
        we require a Starting Place. A blank Ending Place indicates a round trip. Providing an activity can save your life in an emergency.`,
      timeoutPref: 10000,

      rules: {
        required: value => !!value || 'Required.',
        counter: value => value.length <= 20 || 'Max 20 characters',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || 'Invalid e-mail.';
        }
      }
    };
  },

  methods: {
    originEntered(e) {
      if (e.target.value) {
        this.$emit('entered-origin', e.target.value);
      }
    },
    destinationEntered(e) {
      if (e.target.value) {
        this.$emit('entered-destination', e.target.value);
      }
    },
    descriptionEntered(e) {
      if (e.target.value) {
        this.$emit('description-origin', e.target.value);
      }
    }

    // updateActivityWith(payload) {
    //   console.log(
    //     `\tUpdating activity ${
    //       this.member.lastActivity.id
    //     } with ${JSON.stringify(payload)}`
    //   );
    //   Activity.$update({
    //     where: this.member.lastActivity.id,
    //     data: payload
    //   }).then(activity => {
    //     this.activity = activity;
    //     console.log('\tUpdated activity', activity);
    //   });
    // }
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
    this.$store.state.origin = this.origin;
    console.info('\tstore origin:', this.$store.state.origin);

    console.log(this.now, '...Leaving Description.vue created\n');
    console.log('.');
  }
};
</script>
