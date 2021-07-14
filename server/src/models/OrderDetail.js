const Model = require("./Model")

class OrderDetail extends Model {
  static get tableName() {
    return "orderDetails"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["quantity"],
      properties: {
        quantity: { type: ["integer", "string"] }
      }
    }
  }

  static get relationMappings() {
    const Order = require("./Order")
    const Donut = require("./Donut")

    return {
      order: {
        relation: Model.BelongsToOneRelation,
        modelClass: Order,
        join: {
          from: "orderDetails.orderId",
          to: "orders.id"
        }
      },
      donut: {
        relation: Model.BelongsToOneRelation,
        modelClass: Donut,
        join: {
          from: "orderDetails.donutId",
          to: "donuts.id"
        }
      }
    }
  }
}

module.exports = OrderDetail