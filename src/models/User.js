// models/User.js
import knex from '../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class User {
  // Create a new user with hashed password
  static async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;
    return knex('users').insert(data).returning('*');

  }

  // Find a user by ID
  static async findById(id) {
    return knex('users').where({ id }).first();
  }

  static async findforOrganizer(id) {
    return knex('users')
        .where({ id })
        .select('username', 'email', 'phone as contact') // Select only the required fields
        .first(); // Return the first matching record
  }

  // Find a user by email
  static async findByEmail(email) {
    // return knex('users').where({ email }).first();
    return knex('users').where({ email: String(email) }).first();

  }

  // Update user profile
  static async update(id, data) {
    return knex('users').where({ id }).update(data).returning('*');
  }

  // Delete a user
  static async delete(id) {
    return knex('users').where({ id }).del();
  }

  // Get all users
  static async findAll(){
    return knex('users').select('*');
  }

  // Add an event to the user's "interested_in" list
  static async addInterest(userId, eventId) {
    return knex('users')
      .where({ id: userId })
      .update({ interested_in: knex.raw('array_append(interested_in, ?)', [eventId]) });
  }

  // Password validation
  static async isPasswordCorrect(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Generate Access Token
  static generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        username: user.username
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  }

  // Generate Refresh Token
  static generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  }

  // Save the refresh token
  static async saveRefreshToken(userId, refreshToken) {
    return knex('users').where({ id: userId }).update({ refreshToken }).returning('*');
  }

  // models/User.js
  static async findDuplicateUser(details) {
    const { username, email, phone } = details;
    return knex('users')
        .where({ username, email, phone })
        .first();
  }


  // models/User.js



  static async findByPhone(phone) {
    return knex('users').where({ phone }).first();
  }

  static async findByUsername(username) {
    return knex('users').where({ username }).first();
  }




}



export default User;










// import knex from '../db/db.js';

// class User {
//   static async create(data) {
//     return knex('users').insert(data).returning('*');
//   }

//   static async findById(id) {
//     return knex('users').where({ id }).first();
//   }

//   static async update(id, data) {
//     return knex('users').where({ id }).update(data).returning('*');
//   }

//   static async delete(id) {
//     return knex('users').where({ id }).del();
//   }

//   static async findAll() {
//     return knex('users').select('*');
//   }
// }

// export default User;
