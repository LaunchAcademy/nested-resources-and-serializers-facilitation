import OrderDetailsSerializer from "./OrderDetailsSerializer.js"

class OrderSerializer {
  static getSummary(order) {
    // designate the attributes we want in our json response
    const allowedAttributes = ["id", "name", "createdAt"]
    // create a new object that only has the whitelisted attributes
    let serializedOrder = {}
    for (const attribute of allowedAttributes) {
      serializedOrder[attribute] = order[attribute]
    }
    return serializedOrder
  }




  static async getOrderSummaryWithDonuts(order){
    // designate the attributes we want in our json response
    const allowedAttributes = ["id", "name", "createdAt"]
  // create a new object that only has the whitelisted attributes
    let serializedOrder = {}
    for (const attribute of allowedAttributes) {
      serializedOrder[attribute] = order[attribute]
    }


    // -----------
   
    // retrieve and serialize the order details (as well as the order flavors)
    const orderDetails = await order.$relatedQuery("orderDetails")

    console.log(orderDetails)


    // OrderDetailsSerializer will be called on each orderDetails
    // because OrderDetailsSerializer ALSO makes an Objection query, `getSummary` is async and must be awaited.
    // we are calling OrderDetailsSerializer.getSummary numerous times, which means we have to await multiple promises all resolving before moving on
    // Promise.all allows us to await ALL of the promises resolving before moving on, and will throw an error if any of the async functions break
    const serializedOrderDetails = await Promise.all(
      orderDetails.map(async (orderDetail) => await OrderDetailsSerializer.getSummary(orderDetail))
    )
    // console.log(serializedOrderDetails)

    // assign all of the details as a property on our serialized object
    serializedOrder.details = serializedOrderDetails

    // count the number of donuts in the order
    let total = serializedOrderDetails.reduce((previousValue, currentValue) => { return previousValue + currentValue.quantity }, 0)
    serializedOrder.total = total
    
    return serializedOrder
  }

  // our getOrderSummaryWithDonuts method is starting to get busy. We can start to abstract our logic into helper methods in the future
  static _totalDonutsForOrder(orderDetails){
    // reduce logic 
  }
}

export default OrderSerializer