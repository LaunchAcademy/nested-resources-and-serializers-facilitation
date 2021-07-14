import { Order } from "../models/index.js"

const insertDonutOrder = async (cleanedFormInput) => {
  if (cleanedFormInput.donuts) {
    const newOrder = await Order.query().insertAndFetch({ name: cleanedFormInput.name })
    await newOrder.$relatedQuery("orderDetails").insertGraph(cleanedFormInput.donuts)
    return { order: newOrder }
  } else {
    const donutError = {
      donuts: [{
        message: "should be selected"
      }]
    }
    return { errors: donutError }
  }
}

export default insertDonutOrder