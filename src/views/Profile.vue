<template>
  <div>
    <div v-if="loading">
      <h2>Loading Profile Card</h2>
    </div>
    <v-card v-if="firstTime">
      <v-card-title>Introducing Local Contact Tracing</v-card-title>
      <v-card-text class="pb-1"
        >Local contact tracing assumes:
        <ul>
          <li>the virus is local</li>
          <li>risk of exposure is between two people</li>
          <li>privacy is paramount</li>
        </ul>
      </v-card-text>
      <v-card-text class="pb-1">
        Local contact tracing takes three perspectives:
        <ul>
          <li>The Room</li>
          <li>A visitor</li>
          <li>Occupants</li>
        </ul>
      </v-card-text>
      <v-card-text class="pb-1">
        Local contact tracing depends on three tasks:
        <ol>
          <li>Room assesses safety of the visitor</li>
          <li>Visitor assesses safety of the room</li>
          <li>Both exchange connection IDs</li>
        </ol>
      </v-card-text>
      <v-card-text>
        If an occupant tests positive:
        <ol>
          <li>
            The occupent sends an encrypted message to each room they entered
          </li>
          <li>
            Each room alerts each occupant of exposure
          </li>
        </ol>
      </v-card-text>
      <v-btn @click="close">Close</v-btn>
    </v-card>
    <v-container v-else class="purple lighten-5">
      <div class="home">
        <ProfileCard />
      </div>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment';

// @ is an alias to /src
import ProfileCard from '@/components/ProfileCard.vue';
import DataRepository from '@/store/repository.js';

import Member from '@/models/Member';
import Preference from '@/models/Preference';
export default {
  name: 'profile',

  data: () => ({
    firstTime: true,
    TIME: 'hh:mm',
    loading: false
  }),

  components: {
    ProfileCard
  },
  computed: {
    members() {
      let m = Member.query()
        .with('preferences')
        .get();
      console.log('Profile member', m);
      return m;
    },
    member() {
      return this.members[0];
    },
    now() {
      return moment().format(this.TIME);
    }
  },
  methods: {
    close() {
      this.firstTime = false;
    }
  },
  async created() {
    this.loading = true;
    console.log(this.now, 'Entering Profile.vue created()');
    console.log('Fetching Member and Preference models');

    await DataRepository.getMember();

    await Preference.$fetch();
    console.log(this.now, 'Leaving Profile created()');
    this.loading = false;
  }
};
</script>
