const Model = require("./Model")

class Order extends Model {
  static get tableName() {
    return "orders"
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],
      properties: {
        name: { type: "string", minLength: 1, maxLength: 20 }
      }
    }
  }

  static get relationMappings() {
    const OrderDetail = require("./OrderDetail")
    const Donut = require("./Donut")
    
    return {
      orderDetails: {
        relation: Model.HasManyRelation,
        modelClass: OrderDetail,
        join: {
          from: "orders.id",
          to: "orderDetails.orderId"
        }
      },
      donuts: {
        relation: Model.ManyToManyRelation,
        modelClass: Donut,
        join: {
          from: "orders.id",
          through: {
            from: "orderDetails.orderId",
            to: "orderDetails.donutId"
          },
          to: "donuts.id"
        }
      }
    }
  }
}

module.exports = Order
