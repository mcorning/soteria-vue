<template>
  <div>
    <v-container class="red lighten-5 ">
      <v-card>
        <v-card-title>My Personal Health Information</v-card-title>
        <v-row>
          <v-col>
            <v-card-text
              >Monitor your symptoms or get tested. If you are positive, we will
              alert everybody who needs to know.</v-card-text
            >
          </v-col>
        </v-row>
      </v-card>
    </v-container>
    <v-container class="red lighten-5 pt-1">
      <SymptomsCard />
    </v-container>
    <v-container class="red lighten-5 pt-1">
      <CovidTestResultsCardV />
    </v-container>
    <v-container class="red lighten-5 ">
      <v-row dense>
        <v-col>Need a digital wallet?</v-col>
      </v-row>
      <v-row dense>
        <v-col>
          <a
            href="https://apps.apple.com/us/app/streetcred-identity-agent/id1475160728"
          >
            <v-img
              src="../assets/AppStore.png"
              max-height="4.5em"
              max-width="4.5em"
            ></v-img>
          </a>
        </v-col>
        <v-col>
          <a
            href="https://play.google.com/store/apps/details?id=id.streetcred.apps.mobile"
          >
            <v-img
              src="../assets/GooglePlay.png"
              max-height="4.5em"
              max-width="4.5em"
            ></v-img>
          </a>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import CovidTestResultsCardV from '@/components/CovidTestResultsCardV.vue';
import SymptomsCard from '@/components/SymptomsCard.vue';
import Member from '@/models/Member';
// import Credential from '@/models/Credential';
import Preference from '@/models/Preference';
import DataRepository from '@/store/repository.js';

export default {
  components: {
    SymptomsCard,
    CovidTestResultsCardV
  },
  computed: {
    isRoomRiskManager: {
      get() {
        return this.member.preferences
          ? this.member.preferences.isRoomRiskManager
          : false;
      },
      set(newVal) {
        Preference.changeisRoomRiskManager(this.perfID, newVal);
      }
    },
    visitor() {
      // visitor roles verify rooms
      return this.role === 'room';
    },
    room() {
      // room roles verify visitors
      return this.role === 'visitor';
    },
    occupant() {
      return this.role === 'occupant';
    }
  },
  data() {
    return {
      role: 'visitor',
      firstTime: true,
      items: ['visitor', 'room', 'occupant']
    };
  },
  methods: {
    close() {
      this.firstTime = false;
    }
  },

  mounted() {},
  async created() {
    this.loading = true;
    let m = await Member.$fetch();
    await Preference.$fetch();
    console.log('created() Fetched member', m);
    // await this.addCredentials();
    this.creds = await DataRepository.verify();
    this.loading = false;
  }
};
</script>

<style lang="scss" scoped></style>
