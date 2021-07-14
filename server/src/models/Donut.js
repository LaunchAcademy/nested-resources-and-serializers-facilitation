const Model = require("./Model")

class Donut extends Model {
  static get tableName() {
    return "donuts"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["flavor"],
      properties: {
        flavor: { type: "string", minLength: 1, maxLength: 255 }
      }
    }
  }

  static get relationMappings() {
    const OrderDetail = require("./OrderDetail")
    const Order = require("./Order")
    
    return {
      orderDetails: {
        relation: Model.HasManyRelation,
        modelClass: OrderDetail,
        join: {
          from: "donuts.id",
          to: "orderDetails.donutId"
        }
      },
      orders: {
        relation: Model.ManyToManyRelation,
        modelClass: Order,
        join: {
          from: "donuts.id",
          through: {
            from: "orderDetails.donutId",
            to: "orderDetails.orderId"
          },
          to: "orders.id"
        }
      }
    }
  }
}

module.exports = Donut
