<template>
  <div>
    <div v-for="(item, i) in timelines" :key="i">
      <p class="container">
        {{ item.activity_id }}: {{ item.state }} at {{ item.updated }}
      </p>
    </div>
    <!-- Timeline does not include SAFE
    <pre>{{ memberData }} </pre> -->
  </div>
</template>

<script>
import Member from '@/models/Member';
import Timeline from '@/models/Timeline';

export default {
  data() {
    return {
      isMounted: false,
      memberData: Member.query()
        .with('activities.timeline', query => {
          query.where(timeline => timeline.state !== 'SAFE');
        })
        .get()
    };
  },
  computed: {
    timelines() {
      return Timeline.all();
    },

    member() {
      // TODO eventually, limit this to the current member
      let x = Member.query()
        .with('activities.timeline')
        .last();
      return x;
    }
  },

  mounted() {
    this.isMounted = true;
  }
};
</script>
