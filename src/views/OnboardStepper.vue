<template>
  <v-container justify="center" class="primary darken-5 pa-1">
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
              We can do this two ways:
              <ol>
                <li>Stop the virus from spreading in our community</li>
                <li>Manage the daily risk of exposure to the virus</li>
              </ol>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>To setup your hardware:</v-card-title>
            <SetupStepper />
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>Local Contact Tracing stops the virus:</v-card-title>
            <OnboardStepper />
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>Manage exposure risk with your PHI:</v-card-title>
            <OnboardStepper2 />
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import SetupStepper from '@/components/steppers/SetupStepper.vue';
import OnboardStepper from '@/components/steppers/OnboardStepper.vue';
import OnboardStepper2 from '@/components/steppers/OnboardStepper2.vue';
import DataRepository from '@/store/repository.js';
import Preference from '@/models/Preference';

export default {
  components: {
    OnboardStepper,
    OnboardStepper2,
    SetupStepper
  },
  computed: {},
  data() {
    return {
      loading: false
    };
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
