/**
 * @typedef {import("knex")} Knex
 */

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  return knex.schema.createTable("orderDetails", (table) => {
    table.bigIncrements("id")
    table.integer("quantity").notNullable()
    table.bigInteger("orderId").notNullable().unsigned().index().references("orders.id")
    table.bigInteger("donutId").notNullable().unsigned().index().references("donuts.id")
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now())
    table.timestamp("updatedAt").notNullable().defaultTo(knex.fn.now())
  })
};

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
  return knex.schema.dropTableIfExists("orderDetails")
};
