import knex from '../db/db.js';

class Comment {
  static async create(data) {
    return knex('comments').insert(data).returning('*');
  }

  static async findById(id) {
    return knex('comments').where({ id }).first();
  }

  static async update(id, data) {
    return knex('comments').where({ id }).update(data).returning('*');
  }

  static async delete(id) {
    return knex('comments').where({ id }).del();
  }

  static async findAll() {
    return knex('comments').select('*');
  }
}

export default Comment;
