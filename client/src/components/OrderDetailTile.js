import React from "react"

const OrderDetailTile = ({ donut, quantity }) => {
  return (
    <div className="callout">
      <h4><em>{donut.flavor}</em></h4>
      <p>Quantity: <b>{quantity}</b></p>
    </div>
  )
}

export default OrderDetailTile
