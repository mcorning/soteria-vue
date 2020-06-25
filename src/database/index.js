import { Database } from '@vuex-orm/core';
import Member from '@/models/Member';
import Preference from '@/models/Preference';

import Credential from '@/models/Credential';
import Value from '@/models/Value';

const database = new Database();

database.register(Member);
database.register(Credential);
database.register(Value);
database.register(Preference);

export default database;
