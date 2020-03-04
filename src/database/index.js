import { Database } from '@vuex-orm/core';
import Member from '@/models/Member';
import Activity from '@/models/Activity';
import Timeline from '@/models/Timeline';

const database = new Database();

database.register(Member);
database.register(Activity);
database.register(Timeline);

export default database;
