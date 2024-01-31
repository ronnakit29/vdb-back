/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable('invite_register', (table) => {
        table.increments('id');
        table.string('code').notNullable();
        table.string('name').notNullable();
        table.string('role').defaultTo('user');
        table.string('token').notNullable();
        table.boolean('is_used').defaultTo(false);
        table.timestamps("created_at", true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
