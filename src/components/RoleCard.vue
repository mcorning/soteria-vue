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
      <v-row align="center" no-gutters v-if="isRoomRiskManager">
        <v-col cols="6">
          <v-card-subtitle>Room risk (max): {{ select.score }}</v-card-subtitle>
        </v-col>

        <v-col cols="5">
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
          ></v-select>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import State from '@/models/State';
import DataRepository from '@/store/repository.js';

export default {
  computed: {
    role() {
      return this.state?.isRoomRiskManager ? 'Room' : 'Visitor';
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
