<template>
  <div>
    <v-card>
      <v-card-title>
        My PHI
      </v-card-title>
      <v-card-subtitle>
        My Personal Health Information:<br />

        Symptoms Presented Today
      </v-card-subtitle>
      <v-card-text>
        Based on
        <a
          href="https://www.oregon.gov/oha/PH/DISEASESCONDITIONS/DISEASESAZ/Emerging%20Respitory%20Infections/COVID-19-Weekly-Report-2020-05-19-FINAL.pdf"
          target="_blank"
        >
          symptoms data from Oregon Health Authority</a
        >, there is {{ score }} decibels of evidence you carry the virus.
      </v-card-text>
      <v-card-text class="pt-0">
        <stong>NOTE:</stong> Displaying your score hides your symptoms.
      </v-card-text>
      <v-card-text style="padding:1 ">
        <v-row no-gutters>
          <v-col cols="6">
            <v-checkbox
              dense
              hide-details
              v-model="checkedSymptoms"
              :value="1"
              label="Abdomen Pain"
              class="mx-2"
              @change="onGetRiskScore"
            ></v-checkbox>
          </v-col>
          <v-col cols="6">
            <v-checkbox
              dense
              hide-details
              v-model="checkedSymptoms"
              :value="2"
              label="Bad Chest Xray"
              class="mx-2"
              @change="onGetRiskScore"
            ></v-checkbox>
          </v-col> </v-row
        ><v-row no-gutters>
          <v-col cols="6"
            ><v-checkbox
              dense
              hide-details
              v-model="checkedSymptoms"
              :value="4"
              class="mx-2"
              label="ARDS"
              @change="onGetRiskScore"
            ></v-checkbox>
          </v-col>
          <v-col cols="6">
            <v-checkbox
              dense
              hide-details
              v-model="checkedSymptoms"
              :value="5"
              class="mx-2"
              label="Chills"
              @change="onGetRiskScore"
            ></v-checkbox> </v-col></v-row
        ><v-row no-gutters>
          <v-col cols="6">
            <v-checkbox
              dense
              hide-details
              v-model="checkedSymptoms"
              :value="6"
              class="mx-2"
              label="Cough"
              v-tooltip="
                'Cough has the lowest measure of unknown instances in positive patients.'
              "
              @change="onGetRiskScore"
            ></v-checkbox>
          </v-col>
          <v-col cols="6">
            <v-checkbox
              dense
              hide-details
              v-model="checkedSymptoms"
              :value="7"
              class="mx-2"
              label="Diarrhea"
              @change="onGetRiskScore"
            ></v-checkbox> </v-col></v-row
        ><v-row no-gutters>
          <v-col cols="6">
            <v-checkbox
              dense
              hide-details
              v-model="checkedSymptoms"
              :value="8"
              class="mx-2"
              label="Fever"
              @change="onGetRiskScore"
            ></v-checkbox>
          </v-col>
          <v-col cols="6">
            <v-checkbox
              dense
              hide-details
              v-model="checkedSymptoms"
              :value="9"
              class="mx-2"
              label="Headache"
              @change="onGetRiskScore"
            ></v-checkbox> </v-col></v-row
        ><v-row no-gutters>
          <v-col cols="6">
            <v-checkbox
              dense
              hide-details
              v-model="checkedSymptoms"
              :value="10"
              class="mx-2"
              label="Loss Of Smell"
              @change="onGetRiskScore"
              v-tooltip="
                'Loss of smell has the highest measure of unknown instances in positive patients.'
              "
            ></v-checkbox>
          </v-col>
          <v-col cols="6">
            <v-checkbox
              dense
              hide-details
              v-model="checkedSymptoms"
              :value="11"
              class="mx-2"
              label="Ventilator"
              @change="onGetRiskScore"
            ></v-checkbox> </v-col></v-row
        ><v-row no-gutters>
          <v-col cols="6">
            <v-checkbox
              dense
              hide-details
              v-model="checkedSymptoms"
              :value="12"
              class="mx-2"
              label="Muscle Aches"
              @change="onGetRiskScore"
            ></v-checkbox>
          </v-col>
          <v-col cols="6">
            <v-checkbox
              v-model="checkedSymptoms"
              dense
              hide-details
              :value="13"
              class="mx-2"
              label="Nausea"
              @change="onGetRiskScore"
            ></v-checkbox> </v-col></v-row
        ><v-row no-gutters>
          <v-col cols="6">
            <v-checkbox
              v-model="checkedSymptoms"
              dense
              hide-details
              :value="14"
              class="mx-2"
              label="Pneumonia"
              @change="onGetRiskScore"
            ></v-checkbox>
          </v-col>
          <v-col cols="6">
            <v-checkbox
              v-model="checkedSymptoms"
              :value="15"
              dense
              hide-details
              class="mx-2"
              label="Runny Nose"
              @change="onGetRiskScore"
            >
            </v-checkbox> </v-col></v-row
        ><v-row no-gutters>
          <v-col cols="6">
            <v-checkbox
              v-model="checkedSymptoms"
              dense
              hide-details
              :value="16"
              class="mx-2"
              label="Short Breath"
              @change="onGetRiskScore"
            ></v-checkbox>
          </v-col>
          <v-col cols="6">
            <v-checkbox
              v-model="checkedSymptoms"
              :value="17"
              dense
              hide-details
              class="mx-2"
              label="Sore Throat"
              @change="onGetRiskScore"
            ></v-checkbox>
          </v-col> </v-row
        ><v-row no-gutters>
          <v-col cols="6">
            <v-checkbox
              v-model="checkedSymptoms"
              :value="18"
              dense
              hide-details
              class="mx-2"
              label="Vomiting"
              @change="onGetRiskScore"
            ></v-checkbox>
          </v-col>
          <v-col>
            <v-checkbox
              v-model="spO2"
              :value="19"
              dense
              class="mx-2"
              label="spO2 < 90%"
              v-tooltip="
                'Use the pulse oximeter on your phone to measure your spO2.'
              "
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card v-if="spO2" class="red--text" text--lighten-1
        ><v-card-title>Your oxygen saturation is dangerously low.</v-card-title>
        <v-card-subtitle>
          Consult your physician.
        </v-card-subtitle>
      </v-card>
      <v-card align-center>
        <CovidScoreCard :covidScore="score" />
      </v-card>
    </v-card>
  </div>
</template>

<script>
import Member from '@/models/Member';
import Preference from '@/models/Preference';
import CovidScoreCard from '@/components/dialogs/CovidScoreCard.vue';

export default {
  components: { CovidScoreCard },

  computed: {
    isReady() {
      return Member.all().length > 0;
    },
    member() {
      let m = Member.query()
        .with('preferences')
        .first();
      console.log('returning member', m);
      return m;
    },
    perfID() {
      if (!this.member.preferences) {
        this.fixPrefs();
      }
      return this.member.preferences.id;
    },
    symptomsScore: {
      get() {
        return this.member.preferences
          ? this.member.preferences.symptomsScore
          : false;
      },
      set(newVal) {
        Preference.changeSymptomsScore(this.perfID, newVal);
      }
    }
  },

  data: () => ({
    show: true,
    showWarning: false,
    checkedSymptoms: [],
    score: 0,
    spO2: '',
    symptoms: new Map([
      [1, { label: 'Abdominal pain', e: -1 }],
      [2, { label: 'Abnormal chest xray', e: -4 }],
      [3, { label: 'Any symptoms', e: 10 }],
      [4, { label: 'ARDS', e: -9 }],
      [5, { label: 'Chills', e: 2 }],
      [6, { label: 'Cough', e: 6 }],
      [7, { label: 'Diarrhea', e: 1 }],
      [8, { label: 'Fever', e: 4 }],
      [9, { label: 'Headache', e: 3 }],
      [10, { label: 'Loss of smell', e: 0 }],
      [11, { label: 'Mech Ventilator', e: -8 }],
      [12, { label: 'Muscle aches', e: 3 }],
      [13, { label: 'Nausea', e: 1 }],
      [14, { label: 'Pneumonia', e: -3 }],
      [15, { label: 'Runny nose', e: -1 }],
      [16, { label: 'Short breath', e: 4 }],
      [17, { label: 'Sore throat', e: 2 }],
      [18, { label: 'Vomiting', e: -3 }]
    ]),

    loading: false,
    agreeToTerms: false,
    agreeToTermsRules: [
      value =>
        !!value ||
        'You must agree to the terms and conditions to sign up for an account.'
    ],
    emailRules: [
      value => !!value || 'Email is required.',
      value => value.indexOf('@') !== 0 || 'Email should have a username.',
      value => value.includes('@') || 'Email should include an @ symbol.',
      value =>
        value.indexOf('.') - value.indexOf('@') > 1 ||
        'Email should contain a valid domain.',
      value => value.includes('.') || 'Email should include a period symbol.',
      value =>
        value.indexOf('.') <= value.length - 3 ||
        'Email should contain a valid domain extension.'
    ],
    rules: {
      required: value => !!value || 'Required.',
      counter: value => value.length <= 20 || 'Max 20 characters',
      email: value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || 'Invalid e-mail.';
      }
    }
  }),

  methods: {
    fixPrefs() {
      Preference.isRoomRiskManager(this.member.id);
    },
    showScore() {
      this.show = !this.show;

      return this.show;
    },

    onGetRiskScore() {
      this.score = 0;
      this.checkedSymptoms.forEach(key => {
        let x = this.symptoms.get(key).e;
        this.score += x;
      });
      Preference.changeSymptomsScore(this.perfID, this.score);
      if (this.spO2) {
        this.showWarning = true;
      }
    },

    siteEntered(e) {
      if (e.target.value) {
        this.testSite = e.target.value;
      }
    }
  },

  async created() {
    this.loading = true;
    await Member.$fetch();
    this.loading = false;
  }
};
</script>
<style>
.covidScore {
  text-align: center;
}

.tooltip {
  display: block !important;
  z-index: 10000;
}

.tooltip .tooltip-inner {
  background: purple;
  color: white;
  border-radius: 16px;
  padding: 5px 10px 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.tooltip .tooltip-arrow {
  width: 0;
  height: 0;
  border-style: solid;
  position: absolute;
  margin: 5px;
  border-color: purple;
  z-index: 1;
}

.tooltip[x-placement^='top'] {
  margin-bottom: 5px;
}

.tooltip[x-placement^='top'] .tooltip-arrow {
  border-width: 5px 5px 0 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  bottom: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^='bottom'] {
  margin-top: 5px;
}

.tooltip[x-placement^='bottom'] .tooltip-arrow {
  border-width: 0 5px 5px 5px;
  border-left-color: transparent !important;
  border-right-color: transparent !important;
  border-top-color: transparent !important;
  top: -5px;
  left: calc(50% - 5px);
  margin-top: 0;
  margin-bottom: 0;
}

.tooltip[x-placement^='right'] {
  margin-left: 5px;
}

.tooltip[x-placement^='right'] .tooltip-arrow {
  border-width: 5px 5px 5px 0;
  border-left-color: transparent !important;
  border-top-color: transparent !important;
  border-bottom-color: transparent !important;
  left: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip[x-placement^='left'] {
  margin-right: 5px;
}

.tooltip[x-placement^='left'] .tooltip-arrow {
  border-width: 5px 0 5px 5px;
  border-top-color: transparent !important;
  border-right-color: transparent !important;
  border-bottom-color: transparent !important;
  right: -5px;
  top: calc(50% - 5px);
  margin-left: 0;
  margin-right: 0;
}

.tooltip.popover .popover-inner {
  background: #f9f9f9;
  color: purple;
  padding: 24px;
  border-radius: 5px;
  box-shadow: 0 5px 30px rgba(purple, 0.1);
}

.tooltip.popover .popover-arrow {
  border-color: #f9f9f9;
}

.tooltip[aria-hidden='true'] {
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s, visibility 0.15s;
}

.tooltip[aria-hidden='false'] {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.15s;
}
</style>
