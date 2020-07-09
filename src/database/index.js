import { Database } from '@vuex-orm/core';
import Member from '@/models/Member';
import Preference from '@/models/Preference';
import Connection from '@/models/Connection';
import Credential from '@/models/Credential';
import Value from '@/models/Value';
import State from '@/models/State';

const database = new Database();

database.register(Member);
database.register(Credential);
database.register(Value);
database.register(Preference);
database.register(Connection);
database.register(State);

export default database;
