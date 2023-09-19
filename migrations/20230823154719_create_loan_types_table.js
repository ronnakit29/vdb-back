/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('loan_types', function (table) {
		table.increments('id').primary();
		table.string('name');
		table.double('interest', 15, 2).defaultTo(0);
		table.integer('period').defaultTo(0);
		table.tinyint('status').defaultTo(1);
		table.tinyint('is_deduct').defaultTo(0);
		table.integer('central_account_id');
		table.double('deduct_percent', 15, 2);
		table.datetime('created_at').defaultTo(knex.fn.now());
		table.datetime('updated_at').defaultTo(knex.fn.now());
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable('loan_types');
};
