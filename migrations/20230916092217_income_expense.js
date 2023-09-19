/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('income_expenses', table => {
		table.increments('id').primary();
		table.string('description').notNullable();
		table.double('income', 15, 2).notNullable();
		table.double('expense', 15, 2).notNullable();
		table.double('withdraw_value', 15, 2).notNullable();
		table.integer('user_id').notNullable();
		table.integer('village_id').notNullable();
		table.datetime('created_at').defaultTo(knex.fn.now());
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
