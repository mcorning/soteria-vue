<template>
  <div>
    <div v-if="loading">
      <h2>Loading Profile Card</h2>
    </div>

    <v-container class="purple lighten-5">
      <div class="home">
        <ProfileCard />
      </div>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment';

// @ is an alias to /src
import ProfileCard from '@/components/ProfileCard.vue';
import DataRepository from '@/store/repository.js';
import Member from '@/models/Member';
import Preference from '@/models/Preference';
export default {
  name: 'profile',

  data: () => ({
    TIME: 'hh:mm',
    loading: false
  }),

  components: {
    ProfileCard
  },
  computed: {
    members() {
      let m = Member.query()
        .with('preferences')
        .get();
      console.log('Profile member', m);
      return m;
    },
    member() {
      return this.members[0];
    },
    now() {
      return moment().format(this.TIME);
    }
  },
  methods: {
    close() {
      this.firstTime = false;
    }
  },
  async created() {
    this.loading = true;
    console.log(this.now, 'Entering Profile.vue created()');
    console.log('Fetching Member and Preference models');

    await DataRepository.getMember();

    await Preference.$fetch();
    console.log(this.now, 'Leaving Profile created()');
    this.loading = false;
  }
};
</script>
