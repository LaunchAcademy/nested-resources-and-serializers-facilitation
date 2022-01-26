- an amazing application. Notice not only the implementation, but even the styling
- review the webpage and features
- review the migrations for the ER diagram

## Serializers

Order List 
- endpoint for this page uses a serializer, let's review 
- calls OrderSerializer.getSummary(), which is a basic serializer

OrderShow
- if we ignore the serializer, this is a standard show page
- walk through OrderSerializer.getOrderSummaryWithDonuts()

## Persisting Nested Records
- lets navigate to the new donut order page
- here, we will persist an order with donut flavors. Because donut flavors will belong to multiple recipes, there is a many to many, which vastly complicates our logic
- often you won't need this type of form
- how are our donut flavors populated (`getDonutFlavors`, `donuts` state, `donutOptions`)
- `donutOptions`: we want to display the last quantity selected. Otherwise, we just display a radio button field
- `donutOption`: for each possible quantity (hardcoded), we need to create a radio button field. If we have previously selected a quantity, we set that as the value and ensure the `checked` attribute is set to true
  
`handleDonutQuantity` helps us update our selection
- use the if/else statement to guide your eye. 
- on first selection, we just add the given donut's id, flavor and value to our array of ordered donuts 
- if changing our selection, `checkIfDonutIsInOrder === true`, then we need to find which donut flavor we clicked, and update its properties in our array or ordered donuts 
- also, if we choose zero, we want to remove the donut from the order with filter 


The rest is all standard! It's just a lot of logic to follow.

Given the amount of logic in OrderFormPage, we could move our donutOptions and its logic into its own `useDonutOptionsSelection` hook, and then import that as needed to DRY up our code. 

## Persisting an Order on the Backend
- we need to first persist the order, and then
- for every donut in our order, we need to create an orderDetail join to persist our flavors 

## Bonus 

InsertGraph 

insertGraph

Transactions 


Abstracting Logic with refactors
- OrderSerializer.getOrderSummaryWithDonuts() is a basic 

