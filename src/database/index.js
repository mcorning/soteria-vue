import { Database } from '@vuex-orm/core';
import Member from '@/models/Member';
import Preference from '@/models/Preference';

import Credential from '@/models/Credential';
import Value from '@/models/Value';

import Activity from '@/models/Activity';
import Timeline from '@/models/Timeline';
// import Eta from '@/models/Eta';

const database = new Database();

database.register(Member);
database.register(Credential);
database.register(Value);
database.register(Activity);
database.register(Timeline);
database.register(Preference);
// database.register(Eta);

export default database;
