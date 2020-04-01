<template>
  <div>
    <v-row>
      <v-col>
        Member with preferences
        <pre>{{ member }}</pre></v-col
      >
      <v-col>
        Preference(s)
        <pre :key="pref.id" v-for="pref in prefs">
            {{ pref }}
          </pre
        ></v-col
      >
      <v-col></v-col>
      <v-col></v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- Member(s) -->
        <!-- <pre :key="member.id" v-for="member in members">
            {{ member }}
          </pre
        > -->
      </v-col>
      <v-col> </v-col>
      <v-col></v-col>
      <v-col></v-col>
    </v-row>
    <v-btn @click="changeQuickStartTo">Toggle from {{ showQuickStart }}</v-btn>
    <QuickStart
      v-if="showQuickStart"
      :showQuickStart="showQuickStart"
      @quick-start-pref-change="changeQuickStart"
    >
      <div slot="subheading">
        Your ME page.
      </div>
      <div slot="context">
        This where you start to make the Secours web site your very own.
      </div>
      <div slot="goal">
        This page holds your personal identifying information
      </div>
      <div slot="detail">
        One way Secours protects your privacy is by minimizing personal
        information. These five fields are sufficient to help first responders
        identify you in an emergency.
      </div>
    </QuickStart>
  </div>
</template>

<script>
import Member from '@/models/Member';
import Activity from '@/models/Activity';
import Preference from '@/models/Preference';
import Timeline from '@/models/Timeline';

import QuickStart from '@/components/dialogs/QuickStart.Home.vue';

export default {
  components: { QuickStart },

  computed: {
    prefs() {
      let p = Preference.all();
      console.log(p);
      return p;
    },
    activities() {
      return Activity.all();
    },
    timelines() {
      return Timeline.all();
    },

    members() {
      let m = Member.query()
        .with('preferences')
        .get();
      console.log('returning member', m);
      return m;
    },
    showQuickStart() {
      return this.member.preferences
        ? this.member.preferences.showQuickStarts
        : false;
    },

    member() {
      return this.members[0];
    }
  },

  data() {
    return {};
  },

  methods: {
    changeQuickStartTo() {
      let result = confirm('Toggle showQuickStarts?');
      if (result) {
        this.changeQuickStart(this.member.preferences.id);
      }
    },
    async changeQuickStart(val) {
      let p = await Preference.changeQuickStart(
        this.member.preferences.id,
        val
      );
      console.log('updated perf', p);
    },

    async test() {
      // console.log(this.memberID);
      // let gender = this.member.gender;
      // let x = gender === 'NA' ? 'Male' : gender === 'Male' ? 'Female' : 'NA';
      // await Member.update({ id: '$uid1', gender: x });
      // console.log('new gender', this.member.gender);
      // console.log(this.perfID);
    }
  },

  async created() {
    await Preference.$fetch();
    await Member.$fetch();
  }
};
</script>

<style lang="scss" scoped></style>
