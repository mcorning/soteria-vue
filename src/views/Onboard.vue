<template>
  <v-container justify="center" class="primary darken-5 pa-1">
    <v-system-bar
      color="secondary"
      :height="height"
      :lights-out="lightsOut"
      :window="window"
    >
      <span
        ><small><v-icon>mdi-alert</v-icon>Alpha code R&D only</small></span
      >
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
                <li>Manage risk daily using public data</li>
              </ol>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="showHardwareSetup">
          <v-card>
            <v-card-title>Once: Setup your hardware...</v-card-title>
            <v-card-subtitle>In three steps:</v-card-subtitle>
            <SetupStepper @cancel-hardware-setup="onCancelHardwareSetup()" />
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>First: Local Contact Tracing...</v-card-title>
            <v-card-subtitle>In two steps:</v-card-subtitle>
            <ContactTracing />
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>Also: Track your PHI:</v-card-title>
            <v-card-subtitle>In three steps:</v-card-subtitle>
            <PhiStepper />
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>Last: Check exposure risk:</v-card-title>
            <Verify />
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import config from '@/config.json';

import SetupStepper from '@/components/steppers/SetupStepper.vue';
import PhiStepper from '@/components/steppers/PhiStepper.vue';

import ContactTracing from '@/components/ContactTracing.vue';
import Verify from '@/components/Verify.vue';

import State from '@/models/State.js';
import DataRepository from '@/store/repository.js';

export default {
  components: {
    SetupStepper,
    PhiStepper,
    ContactTracing,
    Verify
  },
  computed: {
    showHardwareSetup() {
      return this.state?.showHardwareSetup;
    }
  },
  data() {
    return {
      state: null,
      VER: config.VER,
      height: 24,
      lightsOut: false,
      window: false,
      loading: false,
      now: new Date()
    };
  },
  methods: {
    onCancelHardwareSetup() {
      State.toggleShowHardwareSetup(!this.showHardwareSetup);
    },

    async getState() {
      console.log('in Onboard.getState()');
      let s = await DataRepository.getState();
      // console.log('state:', s);
      this.state = s;
      console.log('in Onboard this.state:', this.state);
    }
  },

  async created() {
    this.loading = true;
    console.log(`[${this.now}] Entering Onboard.vue created()`);

    await this.getState();

    console.log('showHardwareSetup', this.state?.showHardwareSetup);

    console.log(this.now, 'Leaving Onboard created()');
    this.loading = false;
  }
};
</script>

<style lang="scss" scoped></style>
