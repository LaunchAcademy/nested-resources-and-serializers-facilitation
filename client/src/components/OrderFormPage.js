import React, { useState, useEffect } from "react"
import { Link, Redirect } from "react-router-dom"

import DonutOption from "./DonutOption"
import ErrorList from "./ErrorList"
import translateServerErrors from "../services/translateServerErrors"

const OrderFormPage = (props) => {
  // error and redirect handling
  const [errors, setErrors] = useState({})
  const [shouldRedirect, setShouldRedirect] = useState({
    status: false,
    id: null
  })

  // managing updates to the order name
  const [orderName, setOrderName] = useState("")

  const handleNameInput = (event) => {
    setOrderName(event.currentTarget.value)
  }

  const [donuts, setDonuts] = useState([{}])

  const getDonutFlavors = async () => {
    try {
      const response = await fetch("/api/v1/donuts")
      if (!response.ok) {
        const errorMessage = `${response.status} (${response.statusText})`
        const error = new Error(errorMessage)
        throw (error)
      }
      const parsedResponse = await response.json()
      setDonuts(parsedResponse.donuts)
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`)
    }
  }

  useEffect(() => {
    getDonutFlavors()
  }, [])

  const [orderDonuts, setOrderDonuts] = useState([])

  const handleDonutQuantity = (event) => {
    // update the quantity of donuts if we've already added the donut flavor to the order
    const checkIfDonutIsInOrder = orderDonuts.find((donut) => donut.donutId == event.currentTarget.id)

    if (checkIfDonutIsInOrder) {
      const newSetOfDonuts = [...orderDonuts]
      const donutToUpdateIndex = updateExistingDonut.findIndex((donut) => donut.donutId == event.currentTarget.id)

      if (event.currentTarget.value > 0) {
        newSetOfDonuts[donutToUpdateIndex] = {
          ...newSetOfDonuts[donutToUpdateIndex],
          quantity: event.currentTarget.value
        }
        setOrderDonuts(newSetOfDonuts)
      } else {
        // remove the donut from the order if quantity of 0 is selected
        const updatedDonuts = orderDonuts.filter((donut) => donut.donutId !== event.currentTarget.id)
        setOrderDonuts(updatedDonuts)
      }
    } else {
      // add the donut to the order otherwise
      const newDonut = {
        donutId: event.currentTarget.id,
        donutFlavor: event.currentTarget.name,
        quantity: event.currentTarget.value
      }
      setOrderDonuts([
        ...orderDonuts,
        newDonut
      ])
    }
  }

  const donutOptions = donuts.map((option) => {
    let optionQuantity = "" 
    const newOrderDonut = orderDonuts.find((donut) => donut.donutId === option.id)
    if (newOrderDonut) {
      optionQuantity = newOrderDonut.quantity
    }

    return (
      <DonutOption
        key={option.id}
        optionQuantity={optionQuantity}
        handleDonutQuantity={handleDonutQuantity} 
        {...option}
      />
    )
  })

  // order summary logic and elements
  let orderFor
  if (orderName) {
    orderFor = (
      <h4 className="text-center">for <em>{orderName}</em></h4>
    )
  }

  const donutSummary = orderDonuts.map((donut) => { 
    return (
      <li key={donut.donutId}>
        <b><em>{donut.donutFlavor}</em></b>, quantity: <b><em>{donut.quantity}</em></b>
      </li>
    )    
  })

  // form submission callback and POST request
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await fetch("/api/v1/orders", {
        method: "POST",
        headers: new Headers({
          "Accept": "application/json",
          "Content-Type": "application/json"
        }),
        body: JSON.stringify({ name: orderName, donuts: orderDonuts })
      })
      if (!response.ok) {
        if (response.status === 422) {
          const body = await response.json()
          console.log(body)
          const newErrors = translateServerErrors(body.errors)
          return setErrors(newErrors)
        } else {
          const errorMessage = `${response.status} (${response.statusText})`
          const error = new Error(errorMessage)
          throw error
        }
      } else {
        const body = await response.json()
        setShouldRedirect({
          status: true,
          id: body.order.id
        })
      }
    } catch (error) {
      console.error(`Error in fetch: ${error.message}`)
    }
  }

  const handleClear = () => {
    setErrors({})
    setOrderDonuts([])
    setOrderName("")
  }

  // redirect after form submission
  if (shouldRedirect.status) {
    return <Redirect to={`/orders/${shouldRedirect.id}`} />
  }

  // returned JSX
  return (
    <div className="grid-container">
      <h3><Link to="/orders">Back to All Orders</Link></h3>
      <div className="grid-x grid-margin-x callout primary">
        <div className="cell small-6">
          <div className="callout">
            <h2 className="text-center">Build Your Donut Order</h2>
            <h6 className="text-center"><em>Pick as many flavors as you like!</em></h6>
            <h6 className="text-center"><em>Our donuts are so delicious, we limit 3 donuts per flavor per order</em></h6>
          </div>
          <div className="callout">
            <form onSubmit={handleSubmit}>
              <ErrorList errors={errors} />

              <div className="grid-x text-center align-justify align-middle">
                <label htmlFor="name" className="cell small-3 h6">
                  <b><em>Order Name:</em></b>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={orderName}
                  onChange={handleNameInput}
                  className="cell auto align-middle"
                />
              </div>

              <div className="grid-x grid-margin-x callout secondary">
                {donutOptions}
              </div>

              <div className="button-group grid-x grid-margin-x align-spaced">
                <input className="button cell small-4" type="submit" value="Submit" />
                <button className="button cell small-4" type="button" onClick={handleClear}>Clear</button>
              </div>
            </form>
          </div>
        </div>

        <div className="cell small-6 callout">
          <h2 className="text-center">Donut Order Summary</h2>
          {orderFor}
          <ul>{donutSummary}</ul>
        </div>
      </div>
    </div>
  )
}

export default OrderFormPage
