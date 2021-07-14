import OrderDetailsSerializer from "./OrderDetailsSerializer.js"

class OrderSerializer {
  static getSummary(order) {
    const allowedAttributes = ["id", "name", "createdAt"]
    let serializedOrder = {}
    for (const attribute of allowedAttributes) {
      serializedOrder[attribute] = order[attribute]
    }
    return serializedOrder
  }

  static async getOrderSummaryWithDonuts(order){
    // serialize the one order
    const allowedAttributes = ["id", "name", "createdAt"]

    let serializedOrder = {}
    for (const attribute of allowedAttributes) {
      serializedOrder[attribute] = order[attribute]
    }
   
    // retrieve and serialize the order details (as well as the order flavors)
    const orderDetails = await order.$relatedQuery("orderDetails")
    const serializedOrderDetails = await Promise.all(
      orderDetails.map(async (orderDetail) => await OrderDetailsSerializer.getSummary(orderDetail))
    )

    serializedOrder.details = serializedOrderDetails


    let total = serializedOrderDetails.reduce((prev, curr) => { return prev + curr.quantity }, 0)

    serializedOrder.total = total
    return serializedOrder
  }

  totalDonutsForOrder(orderDetails){
    // reduce logic 
  }
}

export default OrderSerializer