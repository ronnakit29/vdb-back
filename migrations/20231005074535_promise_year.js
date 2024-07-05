/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
	return knex.schema.createTableIfNotExists('promise_year', table => {
		table.increments('id').primary();
		table.string('year').defaultTo('2566')
		table.integer('village_id')
	}).then(() => {
		return knex("village").select("id").then(villages => {
			const villageIds = villages.map(village => village.id)
			const promiseYears = villageIds.map(villageId => {
				return {
					year: "2566",
					village_id: villageId
				}
			})
			return knex("promise_year").insert(promiseYears)
		})
	})
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
