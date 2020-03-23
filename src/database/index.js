import { Database } from '@vuex-orm/core';
import Member from '@/models/Member';
import Activity from '@/models/Activity';
import Timeline from '@/models/Timeline';
// import Eta from '@/models/Eta';

const database = new Database();

database.register(Member);
database.register(Activity);
database.register(Timeline);
// database.register(Eta);

export default database;
