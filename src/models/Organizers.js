// models/Organizer.js
import knex from '../db/db.js';

class Organizer {
  static async create(data) {
    return knex('organizers').insert(data).returning('*');
  }

  static async findById(organizer_id) {
    return knex('organizers').where({ organizer_id }).first();
  }

  static async update(organizer_id, data) {
    return knex('organizers').where({ organizer_id }).update(data).returning('*');
  }

  static async delete(organizer_id) {
    return knex('organizers').where({ organizer_id }).del();
  }

  static async findAll() {
    return knex('organizers').select('*');
  }
}

export default Organizer;
