import express from "express"

import { Donut } from "../../../models/index.js"
import DonutSerializer from "../../../serializers/DonutSerializer.js"

const donutsRouter = new express.Router()

donutsRouter.get("/", async (req, res) => {
  try {
    const donuts = await Donut.query()
    const serializedDonuts = donuts.map(donut => DonutSerializer.getSummary(donut))

    return res.status(200).json({ donuts: serializedDonuts })
  } catch (error) {
    return res.status(500).json({ errors: error })
  }
})

export default donutsRouter
