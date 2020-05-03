<template>
  <div>
    <tooltip />
    <div v-if="loading">
      <h2>Loading...</h2>
    </div>
    <div v-else>
      <v-container class=" pt-0 pb-0">
        <v-card>
          <v-card-title>
            <v-row>
              <v-col cols="9"> My Activity</v-col>
            </v-row>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Origin*"
                  placeholder="From"
                  outlined
                  dense
                  hint="Last location "
                  persistent-hint
                  append-icon="mdi-map-marker"
                  @click:append="locateMe"
                  required
                  clearable
                  v-model="origin"
                  @blur="originEntered"
                  :rules="[rules.required]"
                  v-popover:tooltip="'Your activity will BEGIN here'"
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  append-icon="mdi-map-marker"
                  @click:append="locateDestination"
                  label="Destination"
                  placeholder="To"
                  outlined
                  dense
                  hint="Blank for round trip"
                  persistent-hint
                  clearable
                  v-model="destination"
                  @blur="destinationEntered"
                  v-popover:tooltip="'Your activity will END here'"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-autocomplete
                  dense
                  outlined
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
                  hint="What are you doing?"
                  persistent-hint
                  v-model="description"
                  @blur="descriptionEntered"
                  v-popover:tooltip="
                    'You can overwrite activity type, if necessary'
                  "
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </div>

    <!-- Snackbar 1-->
    <div class="text-center">
      <v-snackbar
        v-model="snackbar"
        top
        color="secondary"
        :timeout="timeoutPref"
        :multi-line="multiLine"
      >
        We require the ORIGIN, the intended DESTINATION, and the ACTIVITY you
        are going to do.
        <v-btn text dark elevation="4" color="white" @click="snackbar = false">
          Close
        </v-btn>
      </v-snackbar>
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
      location: null,
      gettingLocation: false,
      errorStr: null,
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
    async getLocation() {
      return new Promise((resolve, reject) => {
        if (!('geolocation' in navigator)) {
          reject(new Error('Geolocation is not available.'));
        }

        navigator.geolocation.getCurrentPosition(
          pos => {
            resolve(pos);
          },
          err => {
            reject(err);
          }
        );
      });
    },
    async locateMe() {
      this.gettingLocation = true;
      try {
        this.gettingLocation = false;
        this.location = await this.getLocation();
        this.origin = `${this.location.coords.latitude} by ${this.location.coords.longitude}`;
      } catch (e) {
        this.gettingLocation = false;
        this.errorStr = e.message;
      }
    },
    async locateDestination() {
      this.gettingLocation = true;
      try {
        this.gettingLocation = false;
        this.location = await this.getLocation();
        this.destination = `${this.location.coords.latitude} by ${this.location.coords.longitude}`;
      } catch (e) {
        this.gettingLocation = false;
        this.errorStr = e.message;
      }
    },

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
    console.log(this.now, '\nEntering Description.vue created()...');

    await Activity.$fetch();

    console.log(this.now, '...Leaving Description.vue created()\n');
  },

  mounted() {
    console.log(this.now, '\nEntering Description.vue mounted...');
    this.loading = false;
    if (this.lastActivity) {
      this.origin = this.lastActivity.origin;
      this.destination = this.lastActivity.destination;
      this.description = this.lastActivity.description;
      console.log(this.now, this.origin);
    }
    console.log(this.now, '...Leaving Description.vue mounted()\n');
  }
};
</script>
