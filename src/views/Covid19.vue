<template>
  <v-container class="purple lighten-5 pa-2">
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
    <v-card v-else>
      <v-card-title>Local Contact Tracing</v-card-title>
      <v-row no-gutters>
        <v-col dense>
          <VerifyVisitor v-if="visitor" />

          <VerifyRoom v-if="room" />

          <ContactTracing v-if="occupant" />
        </v-col>
      </v-row>
    </v-card>
    <v-row dense>
      <v-col>Need a digital wallet?</v-col>
    </v-row>
    <v-row dense justify="center">
      <v-col md="4">
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
      <v-col md="4">
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
</template>

<script>
import ContactTracing from '@/components/ContactTracing.vue';
import VerifyVisitor from '@/components/VerifyVisitor.vue';
import VerifyRoom from '@/components/VerifyRoom.vue';
import Member from '@/models/Member';
// import Credential from '@/models/Credential';
import Preference from '@/models/Preference';
import DataRepository from '@/store/repository.js';

export default {
  components: {
    ContactTracing,
    VerifyVisitor,
    VerifyRoom
  },
  computed: {
    member() {
      let m = Member.query()
        .with('preferences')
        .first();

      console.log('returning member', m);
      return m;
    },
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
    role() {
      return this.isRoomRiskManager ? 'room' : 'visitor';
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
      firstTime: false
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
