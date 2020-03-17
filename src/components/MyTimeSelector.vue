<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-row>
          Hours
        </v-row>
        <v-row>
          <v-select :items="hrs" v-model="hr"></v-select>
        </v-row>
      </v-col>
      <v-col>
        <v-row>
          Minutes
        </v-row>
        <v-row>
          <v-select :items="mins" v-model="min"></v-select>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      arrivingAt: moment()
        .add(30, 'minutes')
        .format('hh:mm'),
      hrs: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
      mins: ['00', '15', '30', '45']
    };
  },
  computed: {
    hr: {
      get() {
        return this.arrivingAt.split(':')[0];
      },
      set(newVal) {
        console.log('Updating hr with ', newVal);
      }
    },
    min: {
      get() {
        let mins = Number(this.arrivingAt.split(':')[1]);
        console.log('Minutes:', mins);
        let min =
          mins <= 15 ? '15' : mins <= 30 ? '30' : mins <= 45 ? '45' : '00';
        return min;
      },
      set(newVal) {
        console.log('Updating min with ', newVal);
      }
    }
  }
};
</script>

<style lang="scss" scoped></style>
