// models/EventOrganizer.js
import knex from '../db/db.js';

class EventOrganizer {
  static async assignOrganizer(data) {
    return knex('eventorganizers').insert(data).returning('*');
  }

  static async findByEventId(event_id) {
    return knex('eventorganizers').where({ event_id });
  }

  static async removeOrganizer(event_id, organizer_id) {
    return knex('eventorganizers').where({ event_id, organizer_id }).del();
  }

  static async findAll() {
    return knex('eventorganizers').select('*');
  }
}

export default EventOrganizer;
