<template>
  <v-stepper v-model="e6" vertical>
    <v-stepper-step :complete="e6 > 1" step="1">
      <p>Manage Risk Explicitly</p>
      <p>
        <small>Use public data to better control access to rooms.</small>
      </p>
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-card class="mb-12">
        <v-row no-gutters>
          <v-col dense>
            <VerifyVisitor v-if="visitor" />

            <VerifyRoom v-if="room" />
          </v-col>
        </v-row>
      </v-card>
      <v-btn :color="btnColor" @click="e6 = 2">Continue</v-btn>
      <v-btn text>Cancel</v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
import Member from '@/models/Member';
import Preference from '@/models/Preference';
import DataRepository from '@/store/repository.js';
import VerifyVisitor from '@/components/VerifyVisitor';
import VerifyRoom from '@/components/VerifyRoom';

export default {
  components: {
    VerifyVisitor,
    VerifyRoom
  },
  computed: {
    member() {
      console.log('Member ready?', this.m);
      if (this.m) {
        let m = Member.query()
          .with('preferences')
          .first();

        console.log('returning member', m);

        return m;
      }
      return null;
    },
    isRoomRiskManager: {
      get() {
        return this.member
          ? this.member.preferences
            ? this.member.preferences.isRoomRiskManager
            : false
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
      e6: 1,
      btnColor: 'red lighten-1'
    };
  },
  async created() {
    this.loading = true;
    this.m = await Member.$fetch();
    await Preference.$fetch();
    console.log('created() Fetched member', this.m);
    this.creds = await DataRepository.verify();
    this.loading = false;
  }
};
</script>
