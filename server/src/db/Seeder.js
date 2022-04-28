/* eslint-disable no-console */
import { connection } from "../boot.js"
import configuration from "../config.js"

import Donut from "../models/Donut.js"
import Order from "../models/Order.js"
import OrderDetail from "../models/OrderDetail.js"

class Seeder {
  static async seed() {
    // Delete all current records
    await OrderDetail.query().delete()
    await Order.query().delete()
    await Donut.query().delete()
    
    console.log("preparing donuts...")
    
    // Version 1
    // Bake Donuts
    const bostonCream = await Donut.query().insert({ flavor: "Boston Cream" })
    const chocolateSprinkles = await Donut.query().insert({ flavor: "Chocolate Sprinkles" })
    const glazed = await Donut.query().insert({ flavor: "Glazed" })
    const jelly = await Donut.query().insert({ flavor: "Jelly" })
    const oldFashioned = await Donut.query().insert({ flavor: "Old-Fashioned" })
    
    // Wait for Customers
    const hanson = await Order.query().insert({ name: "Hanson" })
    const yusef = await Order.query().insert({ name: "Yusef" })
    
    // Place Orders
    await hanson.$relatedQuery("orderDetails").insert({ quantity: 3, donutId: bostonCream.id })
    await hanson.$relatedQuery("orderDetails").insert({ quantity: 6, donutId: chocolateSprinkles.id })
    await hanson.$relatedQuery("orderDetails").insert({ quantity: 2, donutId: oldFashioned.id })
    
    await yusef.$relatedQuery("orderDetails").insert({ quantity: 2, donutId: glazed.id })
    await yusef.$relatedQuery("orderDetails").insert({ quantity: 3, donutId: jelly.id })
    


    // NOT FOR SEEDING JUST FOR EXAMPLES OF withGraphFetched
    // View Customer's Order
    const hansonOrder = await hanson.$relatedQuery("orderDetails").withGraphFetched("donut")
    // orderDetails stores the quantity for each selected donut
    console.log(hansonOrder)
    
    // const hansonDonuts = await hanson.$relatedQuery("donuts")
      // ^^ only shows the selected donuts - no quantity

    // const hansonDonuts = await hanson.$relatedQuery("donuts").withGraphFetched("orderDetails")
      // ^^ query the donuts associated with hanson's order and the orderDetails attached to each donut
      // orderDetails is an array holding the associated orderDetail record
      // simpler to reverse the query like above
      // query all orderDetails for an order, and fetch the one associated donut record
 
    const yusefOrder = await yusef.$relatedQuery("orderDetails").withGraphFetched("donut")
    console.log(yusefOrder)
    

    // ----------------------------------------------------
    // Version 2
    // Attach all Order Details to a Customer: the two-step
    const juan = await Order.query().insert({ name: "Juan" })
    await juan.$relatedQuery("orderDetails").insertGraph([{ quantity: 2, donutId: oldFashioned.id }, { quantity: 1, donutId: jelly.id }])
    
    const juanOrder = await juan.$relatedQuery("orderDetails").withGraphFetched("donut")
      // query all orderDetails for order `juan`
      // within that query, also return the `donut` attached to each orderDetail
    console.log(juanOrder)
    
    
    // ----------------------------------------------------
    // Version 3
    // Advanced with insertGraph: the one-liner
    const yvonne = await Order.query().insertGraph({ name: "Yvonne", orderDetails: [{ quantity: 3, donutId: jelly.id }, { quantity: 4, donutId: glazed.id }] })
    const zara = await Order.query().insertGraph({ name: "Zara", orderDetails: [{ quantity: 6, donutId: bostonCream.id }, { quantity: 2, donutId: chocolateSprinkles.id }] })
      // creates all required records
      // returns created Order, its orderDetails, and the Donut id with each orderDetail
      // does not return the Donut objects
    console.log(zara)


    console.log("Done!")
    await connection.destroy()
  }
}

export default Seeder
