/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable("income_expenses", (table) => {
        // withdraw_all
        table.double("withdraw_all", 15, 2).nullable().defaultTo(0).alter();
        table.double("income", 15, 2).nullable().defaultTo(0).alter();
        table.double("expense", 15, 2).nullable().defaultTo(0).alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
