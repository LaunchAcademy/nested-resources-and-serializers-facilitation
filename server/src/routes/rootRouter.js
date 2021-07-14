import express from "express"
import clientRouter from "./clientRouter.js"
const rootRouter = new express.Router()

import ordersRouter from "./api/v1/ordersRouter.js"
import donutsRouter from "./api/v1/donutsRouter.js"

rootRouter.use("/api/v1/orders", ordersRouter)
rootRouter.use("/api/v1/donuts", donutsRouter)
rootRouter.use("/", clientRouter)

export default rootRouter
