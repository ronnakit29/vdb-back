exports.up = function (knex) {
	return knex.schema.createTable('income_expense', function (table) {
		table.increments('id').primary();
		table.date('date');
		table.string('description');
		table.string('type');
		table.decimal('amount', 10, 2);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('income_expense');
};
