// models/Event.js
import knex from '../db/db.js';

class Event {
  static async create(data) {
    return knex('events').insert(data).returning('*');
  }

  static async findById(event_id) {
    return knex('events').where({ event_id }).first();
  }

  static async update(event_id, data) {
    return knex('events').where({ event_id }).update(data).returning('*');
  }

  static async delete(event_id) {
    return knex('events').where({ event_id }).del();
  }

  // static async findAll() {
  //   return knex('events').select('*');
  // }

  static async findAll({ country, city, startDate, endDate, offset = 0, limit = 10 }) {
    const query = knex('events').select('*');
    if (country) query.where('country', country);
    if (city) query.where('city', city);
    if (startDate && endDate) query.whereBetween('date', [startDate, endDate]);
    return query.offset(offset).limit(limit);
  }


  static async search(filters) {
    const query = knex('events');
    if (filters.country) query.where({ country: filters.country });
    if (filters.city) query.where({ city: filters.city });
    if (filters.location) query.where({ location: filters.location });
    return query;
  }

  static async findSimilar({ name, date, place, city, country }) {
    return knex('events')
      .where({ name, date, place, city, country })
      .first();
  }

  static async addReview(event_id, user_id, review) {
    return knex('reviews').insert({ event_id, user_id, ...review }).returning('*');
  }

  static async getReviews(event_id) {
    return knex('reviews').where({ event_id });
  }
}

export default Event;















// import knex from '../db/db.js';

// class Event {
//   static async create(data) {
//     return knex('events').insert(data).returning('*');
//   }

//   static async findById(event_id) {
//     return knex('events').where({ event_id }).first();
//   }

//   static async update(event_id, data) {
//     return knex('events').where({ event_id }).update(data).returning('*');
//   }

//   static async delete(event_id) {
//     return knex('events').where({ event_id }).del();
//   }

//   static async findAll() {
//     return knex('events').select('*');
//   }

//   static async findByUserId(user_id) {
//     return knex('events').where({ user_id });
//   }
// }

// export default Event;
