<template>
  <div>
    <ul v-for="item in cs" :key="item.id">
      <li>{{ item.id }}</li>
    </ul>
    <v-btn @click="next">Delete Next</v-btn>
    <v-btn @click="deleteAll">Delete All</v-btn>
    <v-btn @click="deleteDB">Delete DB</v-btn>
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
    deleteDB() {
      const dbname = 'MyDatabase';
      var DBDeleteRequest = window.indexedDB.deleteDatabase(dbname);
      DBDeleteRequest.onerror = function(event) {
        console.log('Error deleting database', dbname);
        console.log(event.result); // should be undefined
      };

      DBDeleteRequest.onsuccess = function(event) {
        console.log(dbname, 'Database deleted successfully');

        console.log(event.result); // should be undefined
      };
    },

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
