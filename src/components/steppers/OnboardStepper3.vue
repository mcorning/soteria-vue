<template>
  <div>
    <v-card class="mb-12">
      <v-row align="center" justify="end" no-gutters>
        <v-col cols="5"> <v-card-title>Your Role:</v-card-title> </v-col>
        <v-spacer></v-spacer>
        <v-col>
          <v-chip @click="handleIsRoomRiskManager">
            {{ role }}
            <v-icon right>mdi-pencil</v-icon>
          </v-chip>
        </v-col>
      </v-row>
      <v-row align="center" no-gutters>
        <v-col cols="6">
          <v-card-subtitle
            >Room risk threshold: {{ select.score }}</v-card-subtitle
          >
        </v-col>

        <v-col cols="5">
          <v-select
            :disabled="!isRoomRiskManager"
            v-model="select"
            @change="handleChangeRiskThreshold"
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
    <v-card>
      <v-row no-gutters>
        <v-col dense>
          <VerifyVisitor v-if="isRoomRiskManager" />

          <VerifyRoom v-else />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import State from '@/models/State';
import VerifyVisitor from '@/components/VerifyVisitor';
import VerifyRoom from '@/components/VerifyRoom';

export default {
  components: {
    VerifyVisitor,
    VerifyRoom
  },

  computed: {
    role() {
      return this.state?.isRoomRiskManager ? 'Room' : 'Visitor';
    },

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
    handleIsRoomRiskManager() {
      this.isRoomRiskManager = !this.isRoomRiskManager;
    },
    handleChangeRiskThreshold() {
      this.roomRiskThreshold = this.select.score;
    }
  },

  async created() {
    this.loading = true;
    console.log('Entering created() in OnboardStepper3: getting State');
    await State.$fetch();
    this.state = State.find(0);
    this.select = { score: this.state.roomRiskThreshold, desc: '' }; //;

    console.log('Leaving created() in OnboardStepper3');
    this.loading = false;
    // });
  }
};
</script>
