/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('user', function (table) {
		table.increments('id');
		table.string('username');
		table.string('password');
		table.string('fullname');
		table.string('email');
		table.string('tel');
		table.string('role').defaultTo('employee');
		table.integer('village_id');
		table.timestamp('created_at').defaultTo(knex.fn.now());
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
