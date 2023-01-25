import DonutSerializer from "./DonutSerializer.js"

class OrderDetailsSerializer {

  // because an OrderDetail is a join, if we want to know what donut was actually ordered, we have to make another query
  static async getSummary(orderDetail) {
    const allowedAttributes = ["id", "quantity"]
    let serializedOrderDetail = {}
    for (const attribute of allowedAttributes) {
      serializedOrderDetail[attribute] = orderDetail[attribute]
    }
    // because we make a relatedQuery right here, we need to make this function async
    const relatedDonut = await orderDetail.$relatedQuery("donut")

    // this DonutSerializer doesn't need to be awaited, because it doesn't make an objection query!
    const serializedDonut = DonutSerializer.getSummary(relatedDonut)
    serializedOrderDetail.donut = serializedDonut
    
    return serializedOrderDetail
  }
}

export default OrderDetailsSerializer