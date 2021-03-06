import express from "express"
import objection from "objection"
const { ValidationError } = objection

import { Order } from "../../../models/index.js"
import cleanUserInput from "../../../services/cleanUserInput.js"
import insertDonutOrder from "../../../services/insertDonutOrder.js"
import OrderSerializer from "../../../serializers/OrderSerializer.js"

const ordersRouter = new express.Router()

ordersRouter.get("/", async (req, res) => {
  try {
    // retrieve the order records and order by createdAt
    const orders = await Order.query().orderBy("createdAt")
    
    // for every order record, ensure that only the info we want is in the orders we return in the response
    const serializedOrders = orders.map(order => OrderSerializer.getSummary(order))

    return res.status(200).json({ orders: serializedOrders })
  } catch (error) {
    return res.status(500).json({ errors: error })
  }
})




ordersRouter.get("/:id", async (req, res) => {
  const { id } = req.params
  try {
    const order = await Order.query().findById(id)
    const serializedOrder = await OrderSerializer.getOrderSummaryWithDonuts(order)

    return res.status(200).json({ order: serializedOrder })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ errors: error })
  }
})





ordersRouter.post("/", async (req, res) => {
  const cleanedFormInput = cleanUserInput(req.body)
  const { name, donuts } = cleanedFormInput
  try {
    if (donuts) {
      // first persist the order
      const newOrder = await Order.query().insertAndFetch({ name })
      // then persist the related orders
      for (const donut of donuts) {
        await newOrder.$relatedQuery("orderDetails").insert({ donutId: donut.donutId, quantity: donut.quantity })
      }
      // we could serialize this object if we wanted to!
      return res.status(201).json({ order: newOrder })
    } else {
      const donutError = {
        donuts: [{
          message: "should be selected"
        }]
      }
      return res.status(422).json({ errors: donutError })
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data })
    }
    return res.status(500).json({ errors: error })
  }
})

// Refactored with insertGraph

ordersRouter.post("/", async (req, res) => {
  const cleanedFormInput = cleanUserInput(req.body)
  const { name, donuts } = cleanedFormInput
  try {
    if (donuts) {
      const newOrder = await Order.query().insertAndFetch({ name })
      await newOrder.$relatedQuery("orderDetails").insertGraph(donuts)
    
      return res.status(201).json({ order: newOrder })
    } else {
      const donutError = {
        donuts: [{
          message: "should be selected"
        }]
      }
      return res.status(422).json({ errors: donutError })
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data })
    }
    return res.status(500).json({ errors: error })
  }
})

// Refactored with helper function + insertgraph

ordersRouter.post("/", async (req, res) => {
  const cleanedFormInput = cleanUserInput(req.body)
  try {
    const result = await insertDonutOrder(cleanedFormInput) // this is new
    if (result.order) {
      return res.status(201).json({ order: result.order })
    } else if (result.errors) {
      return res.status(422).json({ errors: result.errors })
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data })
    }
    return res.status(500).json({ errors: error })
  }
})

export default ordersRouter
