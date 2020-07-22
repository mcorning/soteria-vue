<template>
  <div>
    <v-card class="mb-3">
      <v-row align="center" justify="end" no-gutters>
        <v-col cols="5"> <v-card-title>Your Role:</v-card-title> </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-chip large @click="isRoomRiskManager = !isRoomRiskManager">
            {{ role }}
            <v-icon right>mdi-pencil</v-icon>
          </v-chip>
        </v-col>
      </v-row>
      <v-row v-if="isRoomRiskManager" align="center" no-gutters>
        <v-col cols="12">
          <v-card-text>
            <v-text-field
              dense
              v-model="roomId"
              @change="onGetNewQr"
              label="Room ID:"
              hint="This ID must be unique and have no spaces"
            >
            </v-text-field>
          </v-card-text>
        </v-col>
        <v-col cols="6">
          <v-card-subtitle
            >If room is safe enough for the visitor, they may enter after they
            scan the room's QR code</v-card-subtitle
          >
        </v-col>
        <v-col cols="6">
          <v-img
            id="qrRoom"
            class="white--text align-end"
            :src="qrSourceRoom"
            height="200"
            width="200"
          >
          </v-img>
        </v-col>

        <v-col cols="6">
          <v-card-text>
            <v-select
              :disabled="!isRoomRiskManager"
              v-model="select"
              @change="roomRiskThreshold = select.score"
              :items="risks"
              item-text="desc"
              item-value="score"
              label="Select"
              return-object
              single-line
              dense
            ></v-select
          ></v-card-text>
        </v-col>
        <v-col cols="6">
          <v-card-subtitle>Room risk (max): {{ select.score }}</v-card-subtitle>
        </v-col>
      </v-row>
      <v-row v-else align="center" no-gutters>
        <v-col cols="12">
          <v-card-text>
            <v-text-field
              dense
              v-model="connectionId"
              hint="Get your connectionId from the name in your Phone settings"
              label="Phone ID:"
            >
            </v-text-field
          ></v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import config from '@/config.json';
import axios from 'axios';
axios.defaults.baseURL = config.BASEURL;

import State from '@/models/State';
import DataRepository from '@/store/repository.js';

export default {
  computed: {
    qrSourceRoom() {
      console.log('Room url', this.roomInvitationUrl);

      return `https://chart.googleapis.com/chart?cht=qr&chl=${this.roomInvitationUrl}&chs=200x200&chld=L|1`;
    },
    role() {
      return this.state?.isRoomRiskManager ? 'Room' : 'Visitor';
    },

    roomId: {
      get() {
        return this.state?.roomId;
      },
      set(newVal) {
        State.changeRoomId(newVal).then(state => {
          // ORM returns an array of State objects
          this.state = state[0];
        });
      }
    },
    connectionId: {
      get() {
        return this.state?.connectionId;
      },
      set(newVal) {
        State.changeConnectionId(newVal).then(state => {
          // ORM returns an array of State objects
          this.state = state[0];
        });
      }
    },

    isRoomRiskManager: {
      get() {
        return this.state?.isRoomRiskManager;
      },
      set(newVal) {
        State.changeIsRoomRiskManager(newVal).then(state => {
          // ORM returns an array of State objects
          this.state = state[0];
          this.$emit('changed-is-room-risk-manager', this.isRoomRiskManager);
        });
      }
    },
    roomRiskThreshold: {
      get() {
        return this.state?.roomRiskThreshold;
      },
      set(newVal) {
        State.changeRoomRiskThreshold(newVal).then(state => {
          // ORM returns an array of State objects
          this.state = state[0];
          this.$emit('changed-room-risk-threshold', this.roomRiskThreshold);
        });
      }
    }
  },
  data() {
    return {
      roomInvitationUrl: '',
      state: null,
      select: {},
      risks: [
        { score: 3, desc: 'Acceptable' },
        { score: 5, desc: 'Risky' },
        { score: 7, desc: 'Dangerous' },
        { score: 9, desc: 'Barking mad' }
      ],
      e6: 1,
      btnColor: 'red lighten-2',
      loaded: false
    };
  },

  methods: {
    onGetNewQr() {
      axios('/connections/room/?id=' + this.roomId).then(s => {
        'axios result:', console.log(s);
        this.roomInvitationUrl = s.data.url;
      });
    },
    onChangeRiskThreshold() {
      this.roomRiskThreshold = this.select.score;
      this.$emit('changed-room-risk-threshold', this.roomRiskThreshold);
    },

    async getState() {
      console.log('in RoleCard.getState()');
      let s = await DataRepository.getState();
      // console.log('state:', s);
      this.state = s;
      console.log('in RoleCard this.state:', this.state);
      this.roomInvitationUrl = s.roomInvitationUrl;
      this.roomId = s.roomId;

      this.select = { score: s.roomRiskThreshold, desc: '' };
      this.$emit('changed-is-room-risk-manager', s.isRoomRiskManager);
    }
  },

  async created() {
    this.loading = true;
    console.log('Entering created() in RoleCard: getting State');
    await this.getState();
    console.log('Leaving created() in RoleCard');
    this.loading = false;
  }
};
</script>

<style lang="scss" scoped></style>
