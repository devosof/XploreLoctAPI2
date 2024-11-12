// models/EventDetail.js
import knex from '../db/db.js';

class EventDetail {

  static async create(data) {
    return knex('eventdetails').insert(data).returning('*');
  }



  static async findByEventId(event_id) {
    return knex('eventdetails').where({ event_id }).first();
  }
  // static async findByEventId(event_id) {
  //   return knex('eventdetails').where({ event_id });
  // }

  // static async findByEventAndOrganizer(event_id, organizer_id) {
  //   return knex('eventdetails').where({ event_id, organizer_id }).first();
  // }

    // In the EventDetails model
  static async findByEventAndOrganizer(event_id, organizer_id) {
    return knex('eventdetails').where({ event_id, organizer_id }).first();
  }


  // static async updateDetail(event_id, organizer_id, speaker_id, data) {
  //   return knex('eventdetails')
  //     .where({ event_id, organizer_id, speaker_id })
  //     .update(data)
  //     .returning('*');
  // }

  static async update(event_id, organizer_id, data) {
    return knex('eventdetails')
      .where({ event_id, organizer_id })
      .update(data)
      .returning('*');
  }

  static async deleteDetail(event_id, organizer_id, speaker_id) {
    return knex('eventdetails').where({ event_id, organizer_id, speaker_id }).del();
  }
}

export default EventDetail;
