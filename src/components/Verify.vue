<template>
  <div>
    <RoleCard
      @changed-is-room-risk-manager="onChangedIsRoomRiskManager"
      @changed-room-risk-threshold="onChangedRoomRiskThreshold"
    />

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
import RoleCard from '@/components/RoleCard';

export default {
  components: {
    VerifyVisitor,
    VerifyRoom,
    RoleCard
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
    onChangedRoomRiskThreshold(val) {
      this.roomRiskThreshold = val;
    },
    onChangedIsRoomRiskManager(val) {
      this.isRoomRiskManager = val;
    }
    // handleIsRoomRiskManager() {
    //   this.isRoomRiskManager = !this.isRoomRiskManager;
    // },
    // handleChangeRiskThreshold() {
    //   this.roomRiskThreshold = this.select.score;
    // }
  },

  async created() {
    this.loading = true;
    console.log('Entering created() in Verify: getting State');
    await State.$fetch();
    this.state = State.find(0);
    this.select = { score: this.state.roomRiskThreshold, desc: '' }; //;

    console.log('Leaving created() in Verigy');
    this.loading = false;
    // });
  }
};
</script>
