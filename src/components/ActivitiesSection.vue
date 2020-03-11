<template>
  <section>
    <div class="container">
      <div class="header">
        <h2>Actvities</h2>
        <v-btn @click="pause">Pause</v-btn>
      </div>
      <ActivityList />
    </div>
  </section>
</template>

<script>
import Member from '@/models/Member';
import Activity from '@/models/Activity';

import ActivityList from './ActivityList';

export default {
  components: {
    ActivityList
  },
  computed: {
    member() {
      return Member.query()
        .with('activities.timeline')
        .last();
    }
  },
  methods: {
    pause() {
      console.table({
        id: this.member.lastActivity.id,
        description: this.member.lastActivity.description,
        departure: this.member.lastActivity.departure
      });
      console.log(this.member.lastActivity.timeline);
    }
  },
  created() {
    if (this.member.activities.length == 0) {
      alert('Welcome to Secours. We created a default activity for you.');
      Activity.$create({
        data: {
          member_id: this.member.id,
          description: 'my first activity. rename me.',
          updated: new Date()
        }
      });
    }
  }
};
</script>
