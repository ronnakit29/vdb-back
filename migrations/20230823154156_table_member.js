/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('member', function (table) {
		table.increments('member_id').primary();
		table.string('title_name');
		table.string('first_name');
		table.string('last_name');
		table.string('citizen_id');
		table.string('phone_number');
		table.double('saving_balance', 15, 2);
		table.string('address', 500);
		table.dateTime('created_at').defaultTo(knex.fn.now());
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
	return knex.schema.dropTable('member');
};
