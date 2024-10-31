// models/Review.js
import knex from '../db/db.js';

class Review {
  static async create(data) {
    return knex('reviews').insert(data).returning('*');
  }

  static async findById(review_id) {
    return knex('reviews').where({ review_id }).first();
  }

  static async update(review_id, data) {
    return knex('reviews').where({ review_id }).update(data).returning('*');
  }

  static async delete(review_id) {
    return knex('reviews').where({ review_id }).del();
  }

  static async findAll() {
    return knex('reviews').select('*');
  }
}

export default Review;
