import React from "react"

const DonutOption = ({ id, flavor, optionQuantity, handleDonutQuantity }) => {
  const quantities = [0, 1, 2, 3]
  const quantityOptions = quantities.map((quantity) => {
    return (
      <div key={`${id}-${quantity}`} className="cell small-3">
        <label htmlFor={id}>
          {quantity}
        </label>
        <input
          id={id}
          type="radio"
          name={flavor}
          value={quantity}
          checked={optionQuantity == quantity} 
          onChange={handleDonutQuantity}
        />
      </div>
    )
  })
  
  
  return (
    <div className="cell small-6 callout text-center">
      <p><b><em>{flavor}</em></b></p>
      <div className="grid-x">
        {quantityOptions}
      </div>
    </div>
  )
}

export default DonutOption