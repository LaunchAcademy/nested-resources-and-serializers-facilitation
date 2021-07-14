import express from "express"

import { Donut } from "../../../models/index.js"

const donutsRouter = new express.Router()

donutsRouter.get("/", async (req, res) => {
  try {
    const donuts = await Donut.query()
    return res.status(200).json({ donuts: donuts })
  } catch (error) {
    return res.status(500).json({ errors: error })
  }
})

export default donutsRouter
