/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('central_accounts', function (table) {
		table.increments('id').primary();
		table.string('name');
		table.tinyint('status').defaultTo(1);
		table.double('balance', 15, 2);
		table.datetime('created_at').defaultTo(knex.fn.now());
		table.datetime('updated_at').defaultTo(knex.fn.now());
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable('central_accounts');
};
