a..<template>
  <div>
    <div v-if="loading">
      <h2>Loading Profile Card</h2>
    </div>
    <v-container v-else>
      <v-row justify="center">
        <v-card>
          <v-card-title>
            My Symptoms Today
          </v-card-title>
          <v-card-subtitle ml-3
            >Evidence you carry the virus is
            <span class="">{{ score }}</span> decibels <br /><a
              href="https://www.oregon.gov/oha/PH/DISEASESCONDITIONS/DISEASESAZ/Emerging%20Respitory%20Infections/COVID-19-Weekly-Report-2020-05-19-FINAL.pdf"
              >Source: Oregon Health Authority</a
            ></v-card-subtitle
          >
          <v-card-text style="padding:0">
            <v-row no-gutters>
              <v-col cols="6">
                <v-checkbox
                  dense
                  hide-details
                  v-model="checkedSymptoms"
                  :value="1"
                  label="Abdominal Pain"
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
                  label="Short Of Breath"
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
                  @change="onGetRiskScore"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card tile>
            <v-btn
              color="blue darken-1"
              text
              @click="onGetRiskScore"
              :disabled="false"
              >Display your COVID Exposure Score</v-btn
            >
          </v-card>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Member from '@/models/Member';

export default {
  components: {},

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
    checkedSymptoms: [],
    score: 0,
    spO2: '',
    symptoms: new Map([
      [1, { label: 'Abdominal pain', default: -6 }],
      [2, { label: 'Abnormal chest xray', default: -5 }],
      [3, { label: 'Any symptoms', default: 12 }],
      [4, { label: 'ARDS', default: -12 }],
      [5, { label: 'Chills', default: 2 }],
      [6, { label: 'Cough', default: 6 }],
      [7, { label: 'Diarrhea', default: -3 }],
      [8, { label: 'Fever', default: 1 }],
      [9, { label: 'Headache', default: 2 }],
      [10, { label: 'Loss of smell', default: -1 }],
      [11, { label: 'Mech Ventilator', default: -14 }],
      [12, { label: 'Muscle aches', default: 3 }],
      [13, { label: 'Nausea', default: -3 }],
      [14, { label: 'Pneumonia', default: -6 }],
      [15, { label: 'Runny nose', default: -2 }],
      [16, { label: 'Short of breath', default: 0 }],
      [17, { label: 'Sore throat', default: -1 }],
      [18, { label: 'Vomiting', default: -8 }]
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
    onGetRiskScore() {
      this.score = 0;
      this.checkedSymptoms.forEach(key => {
        let x = this.symptoms.get(key).default;
        this.score += x;
      });

      if (this.spO2) {
        alert(
          'Your oxygen saturation is dangerously low. Consult your physician.'
        );
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
