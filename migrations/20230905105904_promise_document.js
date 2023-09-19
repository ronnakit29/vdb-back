/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTable('promise_document', table => {
		table.increments('id').primary();
		table.string('citizen_id', 13).notNullable();
		table.integer('running_number').notNullable();
		table.integer('promise_year').notNullable();
		table.date('datetime').notNullable();
		table.integer('village_id').notNullable();
		table.string('reason').notNullable();
		table.double('amount', 15, 2).notNullable();
		table.integer('hedge_fund', 15, 2).notNullable();
		// deposit_amount
		table.double('deposit_amount', 15, 2).notNullable();
		// expired_date
		table.date('expired_date').notNullable();
		// interest
		table.double('interest', 15, 2).notNullable();
		table.string('manager_citizen_id', 13).notNullable();
		table.string('employee_citizen_id', 13).notNullable();
		table.string('witness1_citizen_id', 13).notNullable();
		// ผู้ค้ำประกัน1
		table.string('witness2_citizen_id', 13).notNullable();
		// ผู้ค้ำประกัน2
		table.string('witness3_citizen_id', 13).notNullable();
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
