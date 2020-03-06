<template>
  <div>
    <button class="icon" @click="setDebug">
      Debug
    </button>
    <div
      class="activity"
      :class="{ done: activity.done }"
      :key="activity.id"
      v-for="activity in activities"
    >
      <input
        class="input"
        :value="activity.description"
        placeholder="Enter activity description"
        @input="
          e => {
            update(activity, e.target.value);
          }
        "
      />

      <button class="icon" @click="updateTimeline(activity, 'ACTIVE')">
        Depart
      </button>

      <button class="icon" @click="updateTimeline(activity, 'SAFE')">
        Arrive
      </button>

      <button class="icon" @click="destroy(activity)">
        Delete
      </button>
    </div>
    <TimelineVue />
    <pre v-if="debug">{{ memberAll }} </pre>
  </div>
</template>

<script>
// import * as R from 'ramda';

import Activity from '@/models/Activity';
import Member from '@/models/Member';
import Timeline from '@/models/Timeline';
import TimelineVue from '@/components/Timeline';

export default {
  components: { TimelineVue },

  computed: {
    member() {
      let x = Member.query().first();
      return x;
    },
    memberAll() {
      let x = Member.query()
        .with('activities.timeline')
        .first();
      return x;
    },

    activities() {
      if (this.member) {
        let x = Activity.all();
        if (x.length == 0) {
          Activity.$create({
            data: {
              member_id: this.member.id
            }
          });
        }
      }
      return Activity.all();
    }
  },

  data() {
    return {
      debug: false
    };
  },

  methods: {
    setDebug() {
      this.debug = !this.debug;
    },

    updateTimeline(activity, status) {
      Timeline.$create({
        data: { activity_id: activity.id, state: status, updated: new Date() }
      });
      // when safe, create a new record with the saved record's data
      if (status === 'SAFE') {
        Activity.$create({
          data: {
            member_id: activity.member_id,
            description: activity.description
          }
        });
      }
    },

    update(activity, description) {
      Activity.$update({
        where: activity.id,
        data: { description }
      });
    },

    destroy(activity) {
      Timeline.$delete(timeline => timeline.activity_id == activity.id);
      Activity.$delete(activity.id);
    }
  },

  async mounted() {}
};
</script>

<style scoped>
.activity {
  display: flex;
  align-items: center;
  border-top: 1px solid var(--c-divider);
}

.activity:hover {
  background-color: #fafafa;
}

.activity:hover .svg {
  opacity: 1;
}

.activity.done {
  .input {
    text-decoration: line-through;
    color: var(--c-gray);
  }

  .icon .svg.check {
    fill: #38d2d8;
  }
}

.input {
  flex-grow: 1;
  border: 0;
  margin-left: 15px;
  padding: 6px 6px 6px 4px;
  width: 20em;
  background-color: transparent;
  transition: all 0.3s;
}

.icon {
  display: block;
  padding: 12px 24px;
}

.icon:hover .svg {
  fill: var(--c-black);
}

.icon:hover .svg.check {
  fill: var(--c-black);
}

.svg {
  width: 14px;
  height: 14px;
  opacity: 0;
  transform: translateY(2px);
  transition: all 0.3s;
  fill: var(--c-gray);
}

.svg.check {
  opacity: 1;
  fill: var(--c-gray-light);
}
</style>
