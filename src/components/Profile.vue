<template
  ><v-container>
    <v-row justify="center">
      <v-card>
        <v-card-title>
          My Minimal Personal Identifying <br />Information
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-row justify="center">
                  <v-col cols="6">
                    <div id="imgRendered" display="showImage()">
                      <v-img
                        :src="image"
                        margin="10"
                        width="200"
                        height="200"
                      ></v-img>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div display="getImage">
                      <picture-input
                        ef="pictureInput"
                        width="200"
                        height="200"
                        margin="10"
                        label="Attach profile picture"
                        v-model="image"
                        prepend-icon="mdi-camera"
                        @change="test"
                      ></picture-input></div
                  ></v-col>
                </v-row>
              </v-col>
              <v-col>
                <v-row>
                  <v-col cols="8">
                    <v-text-field
                      label="Legal first name*"
                      required
                      v-model="firstName"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="8">
                    <v-text-field
                      label="Legal last name*"
                      hint="this version needs a last name"
                      persistent-hint
                      required
                      dense
                      v-model="lastName"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="5" sm="6">
                    <v-autocomplete
                      v-model="gender"
                      label="Gender"
                      :items="genders"
                    ></v-autocomplete>

                    <v-select
                      :items="['0-17', '18-29', '30-54', '54+']"
                      label="Age*"
                      required
                      v-model="age"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row align="end" justify="end">
              <v-card tile>
                <v-btn color="blue darken-1" text @click="onClear"
                  >Clear Database</v-btn
                >
              </v-card>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import PictureInput from 'vue-picture-input';
// import { mapActions } from 'vuex';
// import { mapFields } from 'vuex-map-fields';

export default {
  components: {
    PictureInput
  },

  props: {
    showProfile: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    // ...mapFields([
    //   'member.firstName',
    //   'member.lastName',
    //   'member.age',
    //   'member.image',
    //   'member.gender'
    // ]),

    firstName() {
      return 'Katy';
    },
    lastName() {
      return 'Corning';
    },
    age() {
      return 70;
    },
    image() {
      return '';
    },
    gender() {
      return 'Female';
    },
    showImage() {
      console.log('show image?', this.image.length > 0);
      return this.image.length > 0 ? 'block' : 'none';
    },

    getImage() {
      return this.image.length == 0 ? 'block' : 'none';
    }
  },

  data: () => ({
    files: [],
    dialog: false,

    genders: ['Male', 'Female', 'NA'],

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
    formValidity: false
  }),

  // watch: {
  //   // call the method again if the route changes
  //   $route: 'getMember'
  // },

  methods: {
    // ...mapActions(['clearStorage', 'addImage']),
    changeImage() {
      this.image = '';
    },

    test(val) {
      console.time('image added in');
      this.addImage(val);
      console.timeEnd('image added in');
    },

    onClear() {
      // this.clearStorage().then(state => {
      //   console.log('Cleared State:');
      //   console.log(state);
      // });
    }

    // validateForm() {
    //   this.$refs.signUpForm.validate();
    // }
  },
  mounted() {}
};
</script>
