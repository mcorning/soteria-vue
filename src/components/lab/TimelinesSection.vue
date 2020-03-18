<template>
  <section>
    <div class="container">
      <div class="header">
        <h2 class="title">Timelines</h2>
        <v-btn @click="pause">Pause</v-btn>
      </div>

      <TimelineList />
    </div>
  </section>
</template>

<script>
import Activity from '@/models/Activity';
import TimelineList from './TimelineList';

export default {
  components: {
    TimelineList
  },

  computed: {
    activity() {
      return Activity.query().last();
    }
  },
  methods: {
    pause() {
      console.log(
        'last member activity',
        this.member.lastActivity,
        this.member.lastActivity.id,
        this.member.lastActivity.description,
        this.member.lastActivity.departure
      );
    }
  }
};
</script>
