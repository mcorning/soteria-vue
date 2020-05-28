a..<template>
  <div>
    <div v-if="loading">
      <h2>Loading Symptoms Card</h2>
    </div>
    <v-container v-else>
      <v-row justify="center">
        <v-card>
          <v-card-title>
            My Symptoms Today
          </v-card-title>
          <v-card-subtitle class="ml-6 mb-0"
            >Evidence you carry the virus is
            <span class="">{{ score }}</span> decibels <br /><a
              href="https://www.oregon.gov/oha/PH/DISEASESCONDITIONS/DISEASESAZ/Emerging%20Respitory%20Infections/COVID-19-Weekly-Report-2020-05-19-FINAL.pdf"
              >Source: Oregon Health Authority</a
            ></v-card-subtitle
          >
          <v-card-text style="padding:0 ">
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
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card v-if="spO2" class="red--text" text--lighten-1
            ><v-card-title
              >Your oxygen saturation is dangerously low.</v-card-title
            >
            <v-card-subtitle>
              Consult your physician.
            </v-card-subtitle>
          </v-card>
          <v-card align-center>
            <CovidScoreCard :covidScore="score" />
          </v-card>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Member from '@/models/Member';
import CovidScoreCard from '@/components/dialogs/CovidScoreCard.vue';

export default {
  components: { CovidScoreCard },

  computed: {
    isReady() {
      return Member.all().length > 0;
    },
    member() {
      let m = Member.query()
        .with('credentials')
        .first();
      console.log('returning member', m);
      return m;
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
