import Member from '@/models/Member';

// using the query builder, we can easily get the specific data
// we need in our components
export default class DataRepository {
  static async getMember() {
    Member.$fetch().then(() => {
      const all = Member.all();
      console.log('members?', all);
      if (all.length == 0) {
        console.log('Creating first member...');
        Member.$create({
          data: {
            firstName: '',
            lastName: '',
            age: '',
            gender: '',
            image: '',
            updated: new Date().toISOString(),
            preferences: {},
            activities: []
          }
        }).then(m => {
          console.log(m);
          return m;
        });
      } else {
        return all[0];
      }
    });
  }
}
