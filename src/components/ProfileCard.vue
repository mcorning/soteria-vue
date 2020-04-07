<template>
  <div>
    <div v-if="loading">
      <h2>Loading Profile Card</h2>
    </div>
    <v-container v-else>
      <v-row justify="center">
        <v-card>
          <v-card-title>
            My Identifying Information
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row no-gutters justify="center">
                <v-col cols="6">
                  <v-row justify="space-between">
                    <v-col v-if="changePhoto" cols="6">
                      <picture-input
                        :prefill="image"
                        :prefillOptions="{ mediaType: 'image/png' }"
                        @change="addImage"
                        accept="image/jpeg, image/png, image/gif"
                      >
                      </picture-input>
                      <!-- all this raises subtle runtime errors
                        <picture-input
                        :prefill="image"
                        :prefillOptions="{ mediaType: 'image/png' }"
                        ref="pictureInput"
                        @change="addImage"
                        @remove="onRemoved"
                        :removable="true"
                        buttonClass="primary lighten-2 pl-2 pr-2 text-center white--text xs12"
                        removeButtonClass="secondary pl-2 pr-2 text-center white--text xs12"
                        accept="image/jpeg, image/png, image/gif"
                      >
                      </picture-input> -->
                    </v-col>
                  </v-row>
                  <v-row
                    ><v-checkbox
                      class="caption"
                      v-model="showQuickStarts"
                      label="Show QuickStarts?"
                    ></v-checkbox>
                  </v-row>
                  <v-row
                    ><v-checkbox
                      class="caption"
                      v-model="showHelpIcons"
                      label="Show Help Icons?"
                    ></v-checkbox>
                  </v-row>
                </v-col>
                <v-col>
                  <v-row justify="center">
                    <v-col cols="12">
                      <v-text-field
                        label="First name*"
                        required
                        :rules="[rules.required]"
                        v-model="firstName"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12">
                      <v-text-field
                        label="Last name*"
                        persistent-hint
                        required
                        :rules="[rules.required]"
                        dense
                        v-model="lastName"
                      ></v-text-field>
                    </v-col>

                    <v-col>
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
                    >Delete Me</v-btn
                  >
                </v-card>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import PictureInput from 'vue-picture-input';
import Member from '@/models/Member';
import Activity from '@/models/Activity';
import Timeline from '@/models/Timeline';
import Preference from '@/models/Preference';

export default {
  components: {
    PictureInput
  },

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
        Preference.changeQuickStart(this.perfID, newVal);
      }
    },
    showHelpIcons: {
      get() {
        return this.member.preferences
          ? this.member.preferences.showHelpIcons
          : false;
      },
      set(newVal) {
        Preference.changeHelpIcons(this.perfID, newVal);
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
    loading: false,
    showPictureInput: false,
    changePhoto: true,
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
      Preference.fixQuickStart(this.member.id);
    },
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
    },
    onClear() {
      console.log('Deleting all entities');
      Member.deleteAll();
      Activity.deleteAll();
      Timeline.deleteAll();
      console.log('creating default Member and Activity');
      Member.$create({
        data: {
          firstName: '',
          lastName: '',
          age: '',
          gender: '',
          image: '',
          updated: new Date().toISOString(),
          preferences: {
            databaseName: '',
            showQuickStarts: true,
            showHelpIcons: true
          },
          activities: [
            {
              departFrom: '',
              arriveAt: '',
              description: '',
              eta: '',
              member_id: ''
            }
          ]
        }
      }).then(m => {
        let aid = Activity.query().first().id;
        console.log('update member/activity', m.id, aid);
        Activity.$update({
          where: aid,
          data: { member_id: m.id }
        });
      });
    }
  },

  async created() {
    this.loading = true;
    await Activity.$fetch();
    let m = await Member.$fetch();
    await Preference.$fetch();
    console.log('created() Fetched member', m);
    this.loading = false;
  }
};
</script>
