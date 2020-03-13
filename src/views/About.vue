<template>
  <div>
    <v-container class="purple lighten-5">
      <v-row>
        <!-- New Activity -->
        <v-col cols="12">
          <!-- <NextActivity /> -->
          <v-row>
            <v-container class="purple lighten-5">
              <h2>My next activity</h2>
              <v-row>
                <v-col cols="12" sm="4">
                  <v-text-field
                    label="Starting Place*"
                    hint="Uses your last location"
                    persistent-hint
                    required
                    v-model="departFrom"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="4">
                  <v-text-field
                    style="width:290px"
                    label="Ending Place"
                    hint="Leave blank for round trip"
                    persistent-hint
                    v-model="arriveAt"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="4">
                  <v-autocomplete
                    style="width:290px"
                    :items="[
                      'Backpacking',
                      'Baseball',
                      'Basejump',
                      'Basketball',
                      'Biking',
                      'Boating',
                      'Hiking',
                      'Hockey',
                      'Land sailing',
                      'Mountain Biking',
                      'Road trip',
                      'Running',
                      'Sailing',
                      'Shopping',
                      'Skiing',
                      'Soccer',
                      'Walking',
                      'Unlisted'
                    ]"
                    label="Activity"
                    hint="Choose an activity to help us help you if necessary"
                    persistent-hint
                    v-model="description"
                    @change="updateActivityWith({ description: description })"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-row>

          <!-- DateTime Section -->
          <v-row>
            <!-- Includes the Countdown component -->
            <ActivityTimes :memberProp="member" @set-time="setTime" />
          </v-row>

          <!-- This Activity Timeline -->
          <v-row>
            <TimelineVue
              heading="This time I am:"
              :activity="member.lastActivity"
            />
          </v-row>

          <!-- Last Activity Timeline -->
          <!-- <v-row v-if="lastTimeline"> -->
          <!-- <TimelineVue heading="Last time I was:" /> -->
          <!-- </v-row> -->
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12">
          lastActivity:
          <pre>{{ member.lastActivity }} </pre>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          Member Activities
          <pre>{{ member }} </pre>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import ActivityTimes from '@/components/ActivityTimes';
import TimelineVue from '@/components/Timeline';
import Member from '@/models/Member';
import Activity from '@/models/Activity';
import Timeline from '@/models/Timeline';

export default {
  components: { ActivityTimes, TimelineVue },

  computed: {
    disableDepart() {
      return this.state !== 'UNDEFINED';
    },
    disableArrive() {
      return ['SAFE', 'UNDEFINED'].includes(this.state);
    },

    // these are bound to NextActivity section above
    arriveAt: {
      get() {
        let x = this.activity ? this.activity.arriveAt : '';
        return x;
      },
      set(newVal) {
        // this.update({ arriveAt: newVal });
        this.updateActivityWith({ arriveAt: newVal });
      }
    },

    departFrom: {
      get() {
        let x = this.activity ? this.activity.departFrom : '';
        return x;
      },
      set(newVal) {
        // this.update({ departFrom: newVal });
        this.updateActivityWith({ departFrom: newVal });
      }
    }
  },

  data() {
    return {
      member: '',
      description: '',
      arrival: '',
      departure: '',
      state: ''
    };
  },

  methods: {
    setTime(payload) {
      console.log(
        `Updating time for Activity ${this.member.lastActivity.id}`,
        payload
      );
      this.updateActivityWith(payload);
    },
    //vuexorm state is not reactive out of the box, so queries belong in methods
    refreshMember() {
      this.member = Member.query()
        .with('activities.timeline')
        .first();
      if (this.member.lastActivity) {
        this.description = this.member.lastActivity.description;
        this.state =
          this.member.lastActivity.timeline.length > 0
            ? this.member.lastActivity.timeline[
                this.member.lastActivity.timeline.length - 1
              ].state
            : 'UNDEFINED';
      }
      // add a default activity if the only activity left is also the last activity
      // if (this.member.lastActivity.id === this.member.activities[0].id) {
      //   this.addActivity();
      // }
      console.log('About.refreshMember():', this.description, this.state);
    },

    // // updates should requery state
    // updateTimeline(status) {
    //   this.addTimeline(status);
    //   if (status === 'SAFE') {
    //     this.addActivity();
    //   }
    // },

    addTimeline(status) {
      Timeline.$create({
        data: {
          activity_id: this.member.lastActivity.id,
          state: status,
          updated: new Date()
        }
      });
      this.hasDeparted = false;
      this.refreshMember();
    },

    addActivity() {
      Activity.$create({
        data: {
          member_id: this.member.id,
          description: this.description,
          updated: new Date()
        }
      });
      this.refreshMember();
    },

    updateActivityWith(payload) {
      Activity.$update({
        where: this.member.lastActivity.id,
        data: payload
      });
      this.refreshMember();
    },

    destroy() {
      console.log('|activities|', this.member.hasActivity === 1);
      Timeline.$delete(
        timeline => timeline.activity_id == this.member.lastActivity.id
      );
      Activity.$delete(this.member.lastActivity.id);
      // reset the lastActivity
      this.refreshMember();
      console.log(this.member.lastActivity.id);
      console.log(this.member.lastActivity);
    },

    hasStartedActivity() {
      let timeline = Member.query()
        .has('activities.timeline')
        .get();
      return timeline.length ? true : false;
    }
  },

  created() {
    // get member data
    this.refreshMember();
    console.log(
      'About.created(): Member has',
      this.member.hasActivity,
      'activities'
    );
    if (this.member.hasActivity == 0) {
      console.log('Adding default activity for ', this.member.firstName);
      this.addActivity();
      alert('Be sure to give new activity a name before you depart');
    }
    this.hasDeparted = this.member.hasDeparted;
    this.hasActivity = this.member.hasActivity == 1 ? true : false;
    this.lastActivity = this.member.lastActivity;
  }
};
</script>

<style scoped>
#styled-input {
  height: 40px;
  font-size: 20pt;
}
.styled-input label[for] {
  height: 40px;
  font-size: 20pt;
}
</style>
