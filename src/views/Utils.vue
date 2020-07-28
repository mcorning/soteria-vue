<template>
  <div>
    <ul v-for="item in cs" :key="item.id">
      <li>{{ item.id }}</li>
    </ul>
    <pre>
    Ct: {{ ct }}
    <v-btn @click="next">Delete Next</v-btn>
    ID: {{ id }}</pre>
    <v-btn @click="deleteAll">Delete All</v-btn>
  </div>
</template>

<script>
import Connection from '@/models/Connection';

export default {
  data() {
    return {
      id: '',
      ct: 0,
      cs: []
    };
  },
  methods: {
    async next() {
      if (this.id) {
        await Connection.$delete(this.id);
        this.getConns();
      }
    },

    async deleteAll() {
      if (this.id) {
        await Connection.$delete(this.id);
        if (await this.getConns()) {
          await this.deleteAll();
        }
      }
    },

    async getConns() {
      let cs = await Connection.$fetch();

      this.cs = cs.connections;
      this.ct = this.cs?.length;
      this.id = this.ct ? this.cs[0].$id : '';
      return true;
    }
  },

  async created() {
    await this.getConns();
  }
};
</script>

<style lang="scss" scoped></style>
