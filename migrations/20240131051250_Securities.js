/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.createTable("securities", (table) => {
        table.increments("id").primary();
        table.integer("village_id").nullable();
        table.integer("member_id").nullable();
        table.string("promise_document_group_id").nullable();
        table.integer("manager_citizen_id").nullable();
        // transport
        table.string("transport").nullable()
        table.string("land_number").nullable()
        // Explore page
        table.string("exploer_page").nullable()
        table.string("title_deed_book").nullable()
        table.string("title_deed_page").nullable()
        table.string("title_deed_district").nullable()
        table.string("title_deed_province").nullable()
        // area
        table.string("area_rai").nullable()
        table.string("area_ngan").nullable()
        table.string("area_wa").nullable()

        table.datetime("created_at").defaultTo(knex.fn.now());
        table.timestamp("updated_at").defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.dropTable("securities");
};
