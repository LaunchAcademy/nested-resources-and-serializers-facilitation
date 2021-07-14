import React from "react"
import { Link } from "react-router-dom"

const OrderTile = ({ id, name, createdAt }) => {
  const created = new Date(createdAt)
  // this can/should be handled on the backend, especially since it's used in multiple places
  
  return (
    <div className="cell small-11 grid-x grid-margin-x callout">
      <h4 className="cell small-6">
        <Link to={`/orders/${id}`}>{name}</Link>
      </h4>
      <p className="cell small-6 text-right">
        Placed: <em>{created.toDateString()}
        <br/>{created.toLocaleString("en-US", { hour: "numeric", minute: "numeric", second: "numeric", hour12: true })}</em>
      </p>
    </div>
  )
}

export default OrderTile
