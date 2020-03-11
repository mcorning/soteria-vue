// import uuidv4 from 'uuid/v4';
import { Model } from '@vuex-orm/core';
import Activity from './Activity';

export default class Timeline extends Model {
  static entity = 'timelines';

  static fields() {
    return {
      // id: this.uid(() => uuidv4()),
      id: this.uid(),
      state: this.attr(''),
      updated: this.attr(''), // do not use new Date() here. it will through a runtime error.

      // Timeline is a child of activity, so we need an activity_id here
      activity_id: this.attr(null), // used in relationship below

      // relationships (be sure you import any entity listed below)
      activity: this.belongsTo(Activity, 'activity_id')
    };
  }
}
