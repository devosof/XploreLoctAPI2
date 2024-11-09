// models/Speaker.js
import knex from '../db/db.js';

class Speaker {
  // Register a new speaker
  static async create(data) {
    return knex('speakers').insert(data).returning('*');
  }

  static async findAll() {
    return knex('speakers').select('*');
  }

  // Find a speaker by user ID
  static async findByUserId(user_id) {
    return knex('speakers').where({ user_id }).first();
  }

  // Update speaker details
  static async update(user_id, data) {
    return knex('speakers').where({ user_id }).update(data).returning('*');
  }
}

export default Speaker;




















// // models/Speaker.js
// import knex from '../db/db.js';

// class Speaker {
//   static async create(data) {
//     return knex('speakers').insert(data).returning('*');
//   }

//   static async findById(speaker_id) {
//     return knex('speakers').where({ speaker_id }).first();
//   }

//   static async update(speaker_id, data) {
//     return knex('speakers').where({ speaker_id }).update(data).returning('*');
//   }

//   static async delete(speaker_id) {
//     return knex('speakers').where({ speaker_id }).del();
//   }

//   static async findAll() {
//     return knex('speakers').select('*');
//   }
// }

// export default Speaker;
