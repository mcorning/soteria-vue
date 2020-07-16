<template>
  <v-container class="primary lighten-5 pa-2">
    <RoleCard
      @changed-is-room-risk-manager="onChangedIsRoomRiskManager"
      @changed-room-risk-threshold="onChangedRoomRiskThreshold"
    />
    <v-card>
      <v-row no-gutters>
        <v-col dense>
          <VerifyVisitor v-if="visitor" />

          <VerifyRoom v-if="room" />
          <div v-if="occupant">
            <ContactTracing />
          </div>
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
import ContactTracing from '@/components/ContactTracing.vue'; // makes connections
import VerifyVisitor from '@/components/VerifyVisitor.vue'; // sends the appropriate exposure alert to Visitors
import VerifyRoom from '@/components/VerifyRoom.vue'; // sends the appropriate exposure message to Rooms
import RoleCard from '@/components/RoleCard.vue'; // used in any component that controls the role of the user at any time

import State from '@/models/State.js'; // Object definition for application State
import DataRepository from '@/store/repository.js';

export default {
  components: {
    ContactTracing,
    VerifyVisitor,
    VerifyRoom,
    RoleCard
  },
  computed: {
    isRoomRiskManager: {
      get() {
        return this.state?.isRoomRiskManager;
      },
      set(newVal) {
        console.log(
          'this.state.isRoomRiskManager: before:',
          this.state.isRoomRiskManager
        );
        State.changeIsRoomRiskManager(newVal).then(state => {
          // ORM returns an array of State objects
          this.state = state[0];
          console.log(
            'this.state.isRoomRiskManager: after:',
            this.state.isRoomRiskManager
          );
        });
      }
    },
    roomRiskThreshold: {
      get() {
        return this.state?.roomRiskThreshold;
      },
      //
      set(newVal) {
        console.log(
          'this.state.roomRiskThreshold: before:',
          this.state.roomRiskThreshold
        );
        State.changeRoomRiskThreshold(newVal).then(state => {
          // ORM returns an array of State objects
          this.state = state[0];
          console.log(
            'this.state.roomRiskThreshold: after:',
            this.state.roomRiskThreshold
          );
        });
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
      state: null,
      select: {},
      risks: [
        { score: 3, desc: 'Acceptable' },
        { score: 5, desc: 'Risky' },
        { score: 7, desc: 'Dangerous' },
        { score: 9, desc: 'Barking mad' }
      ]
    };
  },
  methods: {
    onChangedRoomRiskThreshold(val) {
      this.roomRiskThreshold = val;
    },
    onChangedIsRoomRiskManager(val) {
      this.isRoomRiskManager = val;
    },

    close() {
      this.firstTime = false;
    },

    async getState() {
      console.log('in Risk.getState()');
      let s = await DataRepository.getState();
      // console.log('state:', s);
      this.state = s;
      console.log('in Risk this.state:', this.state);
    }
  },

  mounted() {},

  async created() {
    this.loading = true;

    console.log('Entering created() in Risk: getting State');
    await this.getState();
    console.log('Leaving created() in Risk');

    this.loading = false;
  }
};
</script>

<style lang="scss" scoped></style>
