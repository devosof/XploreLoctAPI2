// models/EventAttendee.js
import knex from '../db/db.js';

class EventAttendee {
  static async addAttendee(data) {
    return knex('eventattendees').insert(data).returning('*');
  }

  static async findByEventId(event_id) {
    return knex('eventattendees').where({ event_id });
  }

  static async removeAttendee(event_id, user_id) {
    return knex('eventattendees').where({ event_id, user_id }).del();
  }

  static async findAll() {
    return knex('eventattendees').select('*');
  }
}

export default EventAttendee;
