import { Database } from '@vuex-orm/core';
import Member from '@/models/Member';
import Preference from '@/models/Preference';
import Connection from '@/models/Connection';
import Credential from '@/models/Credential';
import Value from '@/models/Value';

const database = new Database();

database.register(Member);
database.register(Credential);
database.register(Value);
database.register(Preference);
database.register(Connection);

export default database;
