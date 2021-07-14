import React, { useState, useEffect} from "react"

const useDonutOptions = () => {

  const [orderDonuts, setOrderDonuts] = useState([])

  const handleDonutQuantity = (event) => {
    // update the quantity of donuts if we've already added the donut flavor to the order
    const checkIfDonutIsInOrder = orderDonuts.find((donut) => donut.donutId == event.currentTarget.id)

    if (checkIfDonutIsInOrder) {
      const newSetOfDonuts = [...orderDonuts]
      const donutToUpdateIndex = orderDonuts.findIndex((donut) => donut.donutId == event.currentTarget.id)
      // update the existing quantity if the user has already selected a donut
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

  return { orderDonuts: orderDonuts, donutOptions: donutOptions}
}   

export default useDonutOptions