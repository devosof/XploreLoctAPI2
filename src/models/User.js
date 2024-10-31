import knex from '../db/db.js';

class User {
  static async create(data) {
    return knex('users').insert(data).returning('*');
  }

  static async findById(id) {
    return knex('users').where({ id }).first();
  }

  static async update(id, data) {
    return knex('users').where({ id }).update(data).returning('*');
  }

  static async delete(id) {
    return knex('users').where({ id }).del();
  }

  static async findAll() {
    return knex('users').select('*');
  }
}

export default User;
