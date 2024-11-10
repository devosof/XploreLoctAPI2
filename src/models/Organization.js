import knex from '../db/db.js';

class Organization {
    // Create a new organization
    static async create(data) {
        return knex('organizations').insert(data).returning('*');
    }

    // Find organization by ID
    static async findById(organization_id) {
        return knex('organizations').where({ organization_id }).first();
    }

    // Update an organization
    static async update(organization_id, data) {
        return knex('organizations').where({ organization_id }).update(data).returning('*');
    }

    // Delete an organization
    static async delete(organization_id) {
        return knex('organizations').where({ organization_id }).del();
    }
}

export default Organization;
