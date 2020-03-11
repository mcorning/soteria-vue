<template>
  <div>
    <div class="container">
      <div>
        <!-- <pre>{{ test }} </pre> -->
      </div>
      <div class="activities"><ActivitiesSection /></div>
      <div class="activities"><TimelinesSection /></div>
    </div>
  </div>
</template>

<script>
import store from '@/store';
import Activity from '@/models/Activity';
import Member from '@/models/Member';
import Timeline from '@/models/Timeline';
import ActivitiesSection from '@/components/ActivitiesSection';
import TimelinesSection from '@/components/TimelinesSection';

export default {
  store,

  components: {
    ActivitiesSection,
    TimelinesSection
  },
  computed: {},

  data() {
    return {};
  },

  async mounted() {
    // Fetch data from indexeddb
    Member.$fetch();
    Timeline.$fetch();
    Activity.$fetch();
  }
};
</script>

<style>
.App {
  padding: 1em;
}

.container {
  display: flex;
  margin: 1em auto;
}

.members {
  padding: 1em;
}

.activities {
  padding: 1em;
}
</style>
