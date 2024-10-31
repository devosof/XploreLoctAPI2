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

  static async findAll() {
    return knex('events').select('*');
  }

  static async findByUserId(user_id) {
    return knex('events').where({ user_id });
  }
}

export default Event;
