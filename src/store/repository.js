import Member from '@/models/Member';
import State from '@/models/State';
import Credential from '@/models/Credential';
import Connection from '@/models/Connection';

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
            phoneName: '',
            age: '',
            gender: '',
            image: '',
            updated: new Date().toISOString(),
            preferences: {}
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

  static async getState() {
    let fetched = await State.$fetch();
    if (fetched.state?.length) {
      return fetched.state[0];
    } else {
      console.log('Creating state object...');
      let states = await State.$create({
        data: {
          id: 0,
          connectionId: '',
          isRoomRiskManager: false,
          roomRiskThreshold: 0
        }
      });

      return states[0];
    }
  }

  static async verify() {
    await Credential.$fetch();
    let x = Credential.query()
      .with('values')
      .where('schemaId', 'N4dqaFJG3qu2P5A7xKEKrB:2:COVID-19 Negative Test:1.0')
      .orWhere(
        'schemaId',
        'N4dqaFJG3qu2P5A7xKEKrB:2:Positive COVID-19 Test:1.0'
      )
      .get();
    console.log('Credentials', x);
    return x;
  }

  static async getConnections() {
    Connection.$fetch();
    return Connection.all();
  }

  static async connect(connection) {
    const { connectionId, type } = connection;
    console.log('Repository has new', connectionId);
    Connection.$create({
      data: {
        connectionId: connectionId,
        type: type,
        date: new Date()
      }
    });
  }
}
