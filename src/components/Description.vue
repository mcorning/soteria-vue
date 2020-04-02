<template>
  <div>
    <div v-if="loading">
      <h2>Loading...</h2>
    </div>
    <div v-else>
      <v-container class="purple lighten-5" fluid>
        <v-row>
          <v-col> <h2>My Activity</h2> </v-col>
          <v-col cols="2">
            <div class="text-center">
              <v-btn
                v-model="showHelpIcons"
                color="primary"
                fab
                x-small
                dark
                @click="snackbar = true"
              >
                <v-icon>mdi-help</v-icon>
              </v-btn>
              <v-snackbar
                v-model="snackbar"
                top
                color="secondary"
                :timeout="timeoutPref"
                :multi-line="multiLine"
              >
                Let us start with a description of your activity. We require a
                Starting Place. The other two fields are optional.,
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
        </v-row>
        <v-row>
          <v-col cols="4" sm="4">
            <v-text-field
              label="Origin*"
              hint="Uses your last location"
              persistent-hint
              required
              clearable
              v-model="origin"
              @blur="originEntered"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>

          <v-col cols="4" sm="4">
            <v-text-field
              style="width:290px"
              label="Destination"
              hint="Leave blank for round trip"
              persistent-hint
              clearable
              v-model="destination"
              @blur="destinationEntered"
            ></v-text-field>
          </v-col>

          <v-col cols="4" sm="4">
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
              @blur="descriptionEntered"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

import Member from '@/models/Member';
import Activity from '@/models/Activity'; // needed to fetch this in order to get a non-null member.lastActivity reference

export default {
  computed: {
    members() {
      let m = Member.query()
        .with('preferences')
        .with('activities')
        .get();
      console.log('Profile member', m);
      return m;
    },
    member() {
      return this.members[0];
    },
    now() {
      return moment().format(this.TIME);
    },
    showHelpIcons() {
      return this.member.preferences
        ? this.member.preferences.showHelpIcons
        : false;
    },
    lastActivity() {
      return this.member.lastActivity;
    }
  },

  data() {
    return {
      origin: '',
      destination: '',
      description: '',
      loading: false,
      TIME: 'hh:mm',

      snackbar: false,
      multiLine: true,
      descriptionHelpText: '',
      timeoutPref: 30000,

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
        this.$emit('entered-description', e.target.value);
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
    this.loading = true;
    console.log(this.now, '\nEntering Description.vue created...');

    await Activity.$fetch();
    this.origin = this.lastActivity.origin;
    this.destination = this.lastActivity.destination;
    this.description = this.lastActivity.description;
    console.log(this.now, this.origin);
    // await Member.$fetch();
    // let m = Member.query()
    //   .with('activities')
    //   .first();

    console.log(this.now, '...Leaving Description.vue created\n');
    this.loading = false;
  }
};
</script>
