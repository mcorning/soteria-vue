<template>
  <section>
    <div class="container">
      <div class="header">
        <h2 class="title">Member</h2>
        <button class="button" @click="add">ADD</button>
      </div>
      <div class="member" :key="member.id" v-for="member in members">
        <input
          class="input"
          :value="member.firstName"
          placeholder="New member's first name"
          @input="
            e => {
              update('first', member, e.target.value);
            }
          "
        />
        <input
          class="input"
          :value="member.lastName"
          placeholder="New member's last name"
          @input="
            e => {
              update('last', member, e.target.value);
            }
          "
        />
        <button class="icon" @click="destroy(member)">Delete</button>
      </div>
      <div><p class="title">Members:</p></div>
      <pre>{{ members }} </pre>
    </div>
  </section>
</template>

<script>
import Member from '@/models/Member';

export default {
  components: {},

  computed: {
    members() {
      return Member.all();
    },
    member() {
      let x = Member.query().first();
      return x;
    }
  },

  methods: {
    add() {
      Member.$create({
        data: { name: '' }
      });
    },
    update(position, member, name) {
      let data =
        position === 'first' ? { firstName: name } : { lastName: name };
      Member.$update({
        where: member.id,
        data: data
      });
    },

    destroy(member) {
      Member.$delete(member.id);
    }
  }
};
</script>

<style scoped>
.container {
  border-radius: 4px;
  background-color: #fff;
  overflow: hidden;
  box-shadow: var(--shadow-depth-3);
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 16px 64px;
}

.title {
  line-height: 32px;
  font-size: 16px;
  color: var(--c-gray);
}

.button {
  border: 1px solid var(--c-gray-light);
  border-radius: 2px;
  padding: 0.7em 1em;
  line-height: 30px;
  font-size: 12px;
  color: var(--c-gray);
  transition: all 0.3s;
}
</style>
