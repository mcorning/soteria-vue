<template>
  <div>
    <div v-if="loading">
      <h2>Loading Profile Card</h2>
    </div>
    <v-container v-else>
      <v-row justify="center">
        <v-card>
          <v-card-title>
            My Covid-19 Test Result
          </v-card-title>
          <v-card-text>
            <v-row no-gutters justify="center">
              <v-col>
                <v-row justify="center">
                  <v-col cols="6" sm="6">
                    <v-autocomplete
                      v-model="testType"
                      required
                      :rules="[rules.required]"
                      label="Test Type*"
                      autofocus
                      dense
                      :items="['nasal swab', 'blood test']"
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="6" sm="6">
                    <v-autocomplete
                      style="width:290px"
                      :items="['Home', 'Enter lab name']"
                      label="Test Site*"
                      v-model="testSite"
                      @blur="siteEntered"
                      required
                      dense
                      :rules="[rules.required]"
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="6" sm="6">
                    <v-autocomplete
                      v-model="testResult"
                      required
                      dense
                      :rules="[rules.required]"
                      label="Test Result*"
                      :items="['Positive', 'Negative']"
                    ></v-autocomplete>
                  </v-col>

                  <v-col cols="6" sm="6" md="4">
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on }">
                        <v-text-field
                          v-model="date"
                          label="Test Date*"
                          readonly
                          required
                          :rules="[rules.required]"
                          dense
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="date"
                        @input="menu2 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <small>*indicates required field</small>
          </v-card-text>
        </v-card>
        <v-card>
          <v-card-title>
            Get a Covid-19 Credential
          </v-card-title>
          <v-card-text>
            Scan this QR code to connect to Secours.id Credential Service
          </v-card-text>
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <v-img src="../assets/SecoursQR.jpg" />
              </v-col>
            </v-row>
          </v-card-text>
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
    members() {
      let m = Member.query()
        .with('preferences')
        .get();
      console.log('returning member', m);
      return m;
    },
    member() {
      console.log('member', this.members[0]);
      return this.members[0];
    },
    image() {
      let image = this.isReady ? this.member.image : '';
      return image;
    },
    perfID() {
      if (!this.member.preferences) {
        this.fixPrefs();
      }
      return this.member.preferences.id;
    },
    noMember() {
      return !this.member;
    },

    showQuickStarts: {
      get() {
        return this.member.preferences
          ? this.member.preferences.showQuickStarts
          : false;
      },
      set(newVal) {
        console.log(newVal);
      }
    },
    showHelpIcons: {
      get() {
        return this.member.preferences
          ? this.member.preferences.showHelpIcons
          : false;
      },
      set(newVal) {
        console.log(newVal);
      }
    },
    firstName: {
      get() {
        if (this.member == '') {
          this.getMember();
        }
        let x = this.member.firstName;
        return x;
      },
      set(newName) {
        Member.$update({
          where: this.member.id,
          data: { firstName: newName }
        });
      }
    },
    lastName: {
      get() {
        let x = this.member.lastName;
        return x;
      },
      set(newName) {
        Member.$update({
          where: this.member.id,
          data: { lastName: newName }
        });
      }
    },
    age: {
      get() {
        let x = this.member.age;
        return x;
      },
      set(newVal) {
        Member.$update({
          where: this.member.id,
          data: { age: newVal }
        });
      }
    },
    gender: {
      get() {
        let x = this.member.gender;
        return x;
      },
      set(newVal) {
        Member.$update({
          where: this.member.id,
          data: { gender: newVal }
        });
      }
    },

    // image: {
    //   get() {
    //     let x = this.member.image;
    //     return x;
    //   },
    //   set(newVal) {
    //     Member.$update({
    //       where: this.member.id,
    //       data: { image: newVal }
    //     });
    //   }
    // },

    showImage() {
      console.log('show image?', this.image.length > 0);
      return this.image.length > 0 ? 'block' : 'none';
    },

    getImage() {
      return this.image.length == 0 ? 'block' : 'none';
    }
  },

  data: () => ({
    menu2: false,
    date: new Date().toISOString().substr(0, 10),

    creds: '',
    headers: [
      {
        text: 'Test Date',
        value: 'testDate'
      },
      { text: 'Test Result', value: 'schemaId' }
    ],
    loading: false,
    testType: '',
    testSite: '',
    testDate: '',
    testResult: '',
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
    siteEntered(e) {
      if (e.target.value) {
        this.$emit('entered-testSite', e.target.value);
      }
    },
    async addCredentials() {
      console.log(this.$store.state.credentials);
      let x = await Credential.$create({ data: this.$store.state.credentials });
      console.log(x);
    },

    fixPrefs() {},
    addImage(val) {
      Member.$update({
        where: this.member.id,
        data: { image: val }
      }).then(m => (this.member.image = m.image));
      this.changePhoto = true;
    },

    onRemoved() {
      this.image = '';
    },
    getMember() {
      this.member = Member.query().first();
    }
  },

  async created() {
    this.loading = true;
    let m = await Member.$fetch();
    console.log('created() Fetched member', m);
    // await this.addCredentials();
    this.loading = false;
  }
};
</script>
