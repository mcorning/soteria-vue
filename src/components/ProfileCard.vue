<template
  ><v-container>
    <v-row justify="center">
      <v-card>
        <v-card-title>
          My Minimal Personal Identifying <br />Information
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row no-gutters>
              <v-col cols="12">
                <v-row justify="center">
                  <v-col cols="6">
                    <div id="imgRendered" display="showImage()">
                      <v-img
                        :src="image"
                        margin="10"
                        width="100"
                        height="100"
                      ></v-img>
                    </div>
                  </v-col>
                  <v-col cols="6">
                    <div display="getImage">
                      <picture-input
                        ef="pictureInput"
                        width="100"
                        height="100"
                        margin="10"
                        label="Attach profile picture"
                        v-model="image"
                        prepend-icon="mdi-camera"
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
                      :items="['Male', 'Female', 'NA']"
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
            <v-row align="end" justify="end" no-gutters>
              <v-card tile>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="onClear"
                  :disabled="noMember"
                  >Delete Member</v-btn
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
import Member from '@/models/Member';

// import * as R from 'ramda';

export default {
  components: {
    PictureInput
  },

  computed: {
    noMember() {
      return !this.member;
    },

    firstName: {
      get() {
        let x = this.member ? this.member.firstName : '';
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
        let x = this.member ? this.member.lastName : '';
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
        let x = this.member ? this.member.age : '';
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
        let x = this.member ? this.member.gender : '';
        return x;
      },
      set(newVal) {
        Member.$update({
          where: this.member.id,
          data: { gender: newVal }
        });
      }
    },
    image: {
      get() {
        let x = this.member ? this.member.image : '';
        return x;
      },
      set(newVal) {
        Member.$update({
          where: this.member.id,
          data: { image: newVal }
        });
      }
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
    member: '',

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

  methods: {
    onClear() {
      console.log('Deleting member with ID:', this.member.id);
      Member.$delete(this.member.id);
    }

    // validateForm() {
    //   this.$refs.signUpForm.validate();
    // }
  },

  async created() {
    this.member = await Member.query().first();
    console.log('ProfileCard.vue.created(): Ready for ', this.member.firstName);
  },
  mounted() {}
};
</script>
