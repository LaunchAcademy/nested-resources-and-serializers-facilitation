import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"
// import getOrder from "./../apiClient/getOrder.js"
import ApiClient from "../apiClient/apiClient"

import OrderDetailTile from "./OrderDetailTile"

const OrderShowPage = (props) => {
  
  const [order, setOrder] = useState({ details: [] })

  const orderId = props.match.params.id

  useEffect(() => {

    ApiClient.getOrder(orderId).then((orderData) => {
      setOrder(orderData.order)
    })

  }, [])

  const detailTileComponents = order.details.map((detailObject) => {
    return (
      <OrderDetailTile
        key={detailObject.id}
        {...detailObject}
      />)
  })

  // this can/should be handled on the backend, especially since it's used in multiple places
  const created = new Date(order.createdAt)

  return (
    <div className="grid-container">
      <h3><Link to="/orders">Back to All Orders</Link></h3>
      <div className="grid-x grid-margin-x callout primary">
        <div className="cell small-6 callout text-right">
          <h2>Order for <em>{order.name}</em></h2>
          <h5 className="cell small-2">
            Placed: <em><b> 
              {created.toDateString()} {created.toLocaleString("en-US", { hour: "numeric", minute: "numeric", second: "numeric", hour12: true })}
            </b></em>
          </h5>
          <h5>Total Donuts: <em><b>{order.total}</b></em></h5>
        </div>
        <div className="cell small-6 callout secondary">
          {detailTileComponents}
        </div>
      </div>
    </div>
  )
}

export default OrderShowPage
