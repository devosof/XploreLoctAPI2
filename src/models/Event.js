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

  static async findAll({ country, city, location, offset = 0, limit = 10 }) {
    const query = knex('events').select('*');
    if (country) query.where('country', country);
    if (city) query.where('city', city);
    if (location) query.where('location', location);
    return query.offset(offset).limit(limit);
  }


  static async search(filters) {
    const query = knex('events');
    if (filters.country) query.where({ country: filters.country });
    if (filters.city) query.where({ city: filters.city });
    if (filters.location) query.where({ location: filters.location });
    return query;
  }

  // static async findSimilar({ name, event_date, place, city, country }) {
  //   return knex('events')
  //     .where({ name, place, city, country })
  //     .first();
  // }

  static async findSimilar({ name, event_date, place, city, country }) {
    return knex('events')
      .join('eventdetails', 'events.event_id', '=', 'eventdetails.event_id') // Join with eventdetails table
      .where({
        'events.name': name,
        'events.place': place,
        'events.city': city,
        'events.country': country,
        'eventdetails.event_date': event_date, // Search using event_date from eventdetails table
      })
      .first(); // Return the first matching event
}

  static async addReview(event_id, user_id, review) {
    return knex('reviews').insert({ event_id, user_id, ...review }).returning('*');
  }

  static async getReviews(event_id) {
    return knex('reviews').where({ event_id });
  }

  // static async getTrendingEvents(limit) {
  //   return knex('events')
  //       .leftJoin('users', knex.raw('events.event_id = ANY(users.interested_in)'))
  //       .select('events.*')
  //       .count('users.id AS interest_count')
  //       .groupBy('events.event_id')
  //       .orderBy('interest_count', 'desc')
  //       .limit(limit);
  // }

  static async getTrendingEvents(limit) {
    return knex('events')
        .leftJoin('users', knex.raw('events.event_id = ANY(users.interested_in)'))
        .leftJoin('eventdetails', 'events.event_id', 'eventdetails.event_id')
        .select(
            'events.*',
            knex.raw('COALESCE(eventdetails.event_date::text, \'Date not updated yet\') AS event_date'),
            knex.raw('COUNT(users.id) AS interest_count')
        )
        .groupBy('events.event_id', 'eventdetails.event_date')
        .orderBy('interest_count', 'desc')
        .limit(limit);
}


//   static async getRandomEvents(limit) {
//       return knex('events')
//           .select('*')
//           .orderByRaw('RANDOM()')
//           .limit(limit);
// }

static async getRandomEvents(limit) {
  return knex('events')
      .leftJoin('eventdetails', 'events.event_id', 'eventdetails.event_id')
      .select(
          'events.*',
          knex.raw('COALESCE(eventdetails.event_date::text, \'Date not updated yet\') AS event_date')
      )
      .orderByRaw('RANDOM()')
      .limit(limit);
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
