<template>
  <v-container justify="center" class="primary darken-5 pa-1">
    <v-system-bar
      color="secondary"
      :height="height"
      :lights-out="lightsOut"
      :window="window"
    >
      <span><small>Beta testing only</small></span>
      <v-spacer></v-spacer>
      <span><small>Use hard reload</small></span>
      <v-spacer></v-spacer>
      <span
        ><small>v. {{ VER }} </small></span
      >
    </v-system-bar>
    <div v-if="loading">
      <h2>Getting ready...</h2>
    </div>
    <div v-else>
      <v-row
        ><v-col>
          <v-card>
            <v-card-title>Introducing Local Contact Tracing</v-card-title>
            <v-card-subtitle>Safer Together</v-card-subtitle>
            <v-card-text>
              This establishment is piloting a technology that can help our
              community reopen its economy without reopening the Covid pandemic.
            </v-card-text>
            <v-card-text class="pt-1">
              We can beat the virus two ways:
              <ol>
                <li>Stop community spread</li>
                <li>Manage risk with public data daily</li>
              </ol>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="showHardwareSetup">
          <v-card>
            <v-card-title>To setup your hardware:</v-card-title>
            <SetupStepper
              @cancel-hardware-setup="handleCancelHardwareSetup()"
            />
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>Local Contact Tracing = !virus:</v-card-title>
            <OnboardStepper />
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>Track your PHI:</v-card-title>
            <OnboardStepper2 />
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>Manage exposure risk:</v-card-title>
            <OnboardStepper3 />
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import config from '@/config.json';

import SetupStepper from '@/components/steppers/SetupStepper.vue';
import OnboardStepper from '@/components/steppers/OnboardStepper.vue';
import OnboardStepper2 from '@/components/steppers/OnboardStepper2.vue';
import OnboardStepper3 from '@/components/steppers/OnboardStepper3.vue';
import DataRepository from '@/store/repository.js';
import Preference from '@/models/Preference';

export default {
  components: {
    OnboardStepper,
    OnboardStepper2,
    OnboardStepper3,
    SetupStepper
  },
  computed: {},
  data() {
    return {
      VER: config.VER,
      height: 24,
      lightsOut: false,
      window: false,
      loading: false,
      showHardwareSetup: true
    };
  },
  methods: {
    handleCancelHardwareSetup(e) {
      console.log('e', e);
      this.showHardwareSetup = !this.showHardwareSetup;
    }
  },

  async created() {
    this.loading = true;
    console.log(this.now, 'Entering OnboardStepper.vue created()');
    console.log('Fetching Member and Preference models');

    await DataRepository.getMember();

    await Preference.$fetch();
    console.log(this.now, 'Leaving OnboardStepper created()');
    this.loading = false;
  }
};
</script>

<style lang="scss" scoped></style>
