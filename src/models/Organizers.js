// // models/Organizer.js

// models/Organizer.js
import knex from '../db/db.js';

class Organizer {
  static async create(data) {
    return knex('organizers').insert(data).returning('*');
  }

  static async findById(organizer_id) {
    return knex('organizers').where({ organizer_id }).first();
  }

  static async findByUserId(user_id) {
    return knex('organizers').where({ user_id }).first();
  }

  static async update(organizer_id, data) {
    return knex('organizers').where({ organizer_id }).update(data).returning('*');
  }

  static async delete(organizer_id) {
    return knex('organizers').where({ organizer_id }).del();
  }

  static async findByUserIdAndOrgId(userId, organizationId) {
    return await knex('organizers')
      .where({ user_id: userId, organization_id: organizationId })
      .first();
  }
}

export default Organizer;















// import knex from '../db/db.js';

// class Organizer {
//   static async create(data) {
//     return knex('organizers').insert(data).returning('*');
//   }

//   static async findById(organizer_id) {
//     return knex('organizers').where({ organizer_id }).first();
//   }

//   static async update(organizer_id, data) {
//     return knex('organizers').where({ organizer_id }).update(data).returning('*');
//   }

//   static async delete(organizer_id) {
//     return knex('organizers').where({ organizer_id }).del();
//   }

//   static async findAll() {
//     return knex('organizers').select('*');
//   }
// }

// export default Organizer;
