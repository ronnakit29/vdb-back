/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.alterTable('promise_document', function (table) {
		table.string("witness1_citizen_id", 13).nullable().alter()
		table.string("witness2_citizen_id", 13).nullable().alter()
		table.string("witness3_citizen_id", 13).nullable().alter()
		table.string("manager_citizen_id", 13).nullable().alter()
		table.string("employee_citizen_id", 13).nullable().alter()
	})
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
