<template>
  <v-container justify="center" class="purple lighten-5">
    <v-card>
      <v-card-title class="pb-1">Steps in Local Contact Tracing</v-card-title>
      <HowTo class="pt-0"
    /></v-card>
    <v-card>
      <v-card-title>Local Contact Tracing Rationale</v-card-title>
      <v-card-text class="pb-1"
        >Local contact tracing assumes:
        <ul>
          <li>the virus is local</li>
          <li>risk of exposure is between two people</li>
          <li>privacy is paramount</li>
        </ul>
      </v-card-text>
      <v-card-text class="pb-1">
        Local contact tracing takes three perspectives:
        <ul>
          <li>The Room</li>
          <li>A visitor</li>
          <li>Occupants</li>
        </ul>
      </v-card-text>
      <v-card-text class="pb-1">
        Local contact tracing depends on three tasks:
        <ol>
          <li>Room assesses safety of the visitor</li>
          <li>Visitor assesses safety of the room</li>
          <li>Both exchange connection IDs</li>
        </ol>
      </v-card-text>
      <v-card-text>
        If an occupant tests positive:
        <ol>
          <li>
            The occupent sends an encrypted message to each room they entered
          </li>
          <li>
            Each room alerts each occupant of exposure
          </li>
        </ol>
      </v-card-text>
    </v-card>
    <a href="https://sway.office.com/2gPCu04Gpv9Qws2H" target="_blank"
      >Additional info</a
    >
  </v-container>
</template>

<script>
import moment from 'moment';

// @ is an alias to /src
import Member from '@/models/Member';
import HowTo from '@/components/dialogs/HowTo.vue';

export default {
  name: 'home',
  components: {
    HowTo
  },
  computed: {
    now() {
      return moment().format(this.TIME);
    }
  },
  data: () => ({
    loading: false,
    error: null,
    member: null
  }),

  methods: {
    async setup() {
      let m = await Member.$fetch();

      if (m && Object.keys(m).length > 0) {
        this.member = m[0];
      }
    }
  },

  async created() {
    console.log(this.now, 'Entering Home.vue created');
    await this.setup();
    console.log(this.now, 'Leaving Home created()');
  },
  mounted() {}
};
</script>
