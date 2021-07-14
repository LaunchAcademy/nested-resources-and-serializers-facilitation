import DonutSerializer from "./DonutSerializer.js"

class OrderDetailsSerializer {
  static async getSummary(orderDetail) {
    const allowedAttributes = ["id", "quantity"]
    let serializedOrderDetail = {}
    for (const attribute of allowedAttributes) {
      serializedOrderDetail[attribute] = orderDetail[attribute]
    }

    const relatedDonut = await orderDetail.$relatedQuery("donut")
    const serializedDonut = DonutSerializer.getSummary(relatedDonut)
    serializedOrderDetail.donut = serializedDonut
    
    return serializedOrderDetail
  }
}

export default OrderDetailsSerializer