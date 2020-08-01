<template>
  <v-container class="primary lighten-5 px-0 pt-0">
    <v-system-bar
      color="secondary"
      :height="height"
      :lights-out="lightsOut"
      :window="window"
    >
      <span
        ><small
          ><v-icon color="yellow">mdi-alert</v-icon>Alpha code R&D only</small
        ></span
      >
      <v-spacer></v-spacer>
      <span><small>Use hard reload</small></span>
      <v-spacer></v-spacer>
      <span
        ><small>v. {{ VER }} </small></span
      >
    </v-system-bar>
    <div v-if="loading">
      <h2>Loading Profile Card</h2>
    </div>
    <div v-else>
      <v-row justify="center">
        <v-col cols="12">
          <ProfileCard />
        </v-col>
      </v-row>
    </div>
    <div v-if="sla.value > 0">
      <v-row>
        <v-col cols="12">
          <SymptomsCard />
        </v-col>
      </v-row>
    </div>
    <div v-if="sla.value > 1">
      <v-row>
        <v-col>
          <CovidTestResultsCardV />
        </v-col>
      </v-row>
    </div>

    <v-row no-gutters dense justify="center">
      <v-col cols="auto" md="6">
        <span class="pl-2">Service Level Agreements: </span>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="3" md="1">
        <v-select
          class="pa-0 ma-0"
          item-text="text"
          item-value="value"
          return-object
          v-model="sla"
          :items="slas"
          dense
          hide-details
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment';

// @ is an alias to /src
import ProfileCard from '@/components/ProfileCard.vue'; // contains PII
import SymptomsCard from '@/components/SymptomsCard.vue'; // permits user to track the risk of exposing others based on data realted to symptoms presented
import CovidTestResultsCardV from '@/components/CovidTestResultsCardV.vue'; // enables user to convert their covid test results into verifiable credential

import Member from '@/models/Member.js'; // a nested object of personal data. this is a vestige of this app's reliance on the original Secours.io. we should reconsider the name. also, some data used to be tracked by Preference, now is held in State.
import Preference from '@/models/Preference.js'; // nesting in json can be problematic. vues-orm normalizes nested data. Preference stores non-permanent personal data. Preference should not store app state.

import DataRepository from '@/store/repository.js'; // static API for member model
import lctVer from '@/lct.ver.json';

export default {
  name: 'profile',

  data: () => ({
    sla: { text: 'SLA-0', value: 0 },
    slas: [
      { text: 'SLA-0', value: 0 },
      { text: 'SLA-1', value: 1 },
      { text: 'SLA-2', value: 2 }
    ],

    VER: lctVer.VER,

    height: 36,
    lightsOut: false,
    window: false,
    TIME: 'hh:mm',
    loading: false
  }),

  components: {
    ProfileCard,
    SymptomsCard,
    CovidTestResultsCardV
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
