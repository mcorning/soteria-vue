<template>
  <div>
    This is page after the dialog is gone...
  </div>
</template>

<script>
// import QuickStart from '@/components/dialogs/QuickStart.Home.vue';
import moment from 'moment';
// import Member from '@/models/Member';
import Preference from '@/models/Preference';

export default {
  components: {},

  computed: {
    now() {
      return moment().format('hh:mm');
    }
  },

  data() {
    return {
      dialog: true,
      firstTime: false,
      checkFirstTime: !this.firstTime,
      showQuickStart: true,
      memberId: '$uid1',
      prefs: null
    };
  },

  methods: {
    async updateQuickStartPref(showQuickStart) {
      // to get new data to localForage, you must use the $create() method (not create())
      // and you must wrap the updated fields with the  data:{} object
      const prefs = await Preference.$update({
        where: this.prefs.id,
        data: {
          // databaseName: '',
          showQuickStarts: showQuickStart
          // showHelpIcons: '',
        }
      });

      // is prefs an object or an array?
      this.prefs = prefs.showQuickStarts ? prefs : prefs[0];

      console.log(
        this.now,
        this.memberId,
        'set quick starts to',
        this.prefs.showQuickStarts
      );
    }
  },

  async created() {
    console.log(this.now, 'Entering About created()');
  }
};
</script>

<style lang="scss" scoped></style>
