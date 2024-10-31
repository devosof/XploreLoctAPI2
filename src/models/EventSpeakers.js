// models/EventSpeaker.js
import knex from '../db/db.js';

class EventSpeaker {
  static async assignSpeaker(data) {
    return knex('eventspeakers').insert(data).returning('*');
  }

  static async findByEventId(event_id) {
    return knex('eventspeakers').where({ event_id });
  }

  static async removeSpeaker(event_id, speaker_id) {
    return knex('eventspeakers').where({ event_id, speaker_id }).del();
  }

  static async findAll() {
    return knex('eventspeakers').select('*');
  }
}

export default EventSpeaker;
