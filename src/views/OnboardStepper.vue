<template>
  <v-container justify="center" class="primary lighten-5 pa-1">
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
              <li>Manage the daily risk of exposure to the virus</li>
              <li>Stop the virus from spreading in our community</li>
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
          <v-card-title>To setup Local Contact Tracing:</v-card-title>
          <OnboardStepper />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SetupStepper from '@/components/steppers/SetupStepper.vue';
import OnboardStepper from '@/components/steppers/OnboardStepper.vue';
export default {
  components: {
    OnboardStepper,
    SetupStepper
  },
  computed: {},
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped></style>
