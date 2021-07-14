Building out forms that post multiple associated records can add a new challenge to the way we manage our data in a full-stack applciation. For instance, if we want to put in a new order (first entity) for different types of donuts (second entity) we'll need to send a nested data structure of information to our backend. 

Applications at this scale can be implemented in many ways, and this lesson aims to follow one method. Let's take a look at how to use Objection associations to persist nested resources, as well as what updates we'll need to make to our React application as a result.

**Note:** This is a long reading. Make sure to take your time, review the provided code in the codebase in your text editor often, and take a break!

### Learning Goals

- Render a form with radio buttons for a nested entity
- Learn how to handle state for a nested resource in React
- Use more advanced Objection relation queries such as `insertGraph` to persist data

### Getting Started 

```no-highlight
et get nested-forms-with-express-and-objection
cd nested-forms-with-express-and-objection
createdb nested_forms_with_express_and_objection_development
yarn install

cd server
yarn migrate:latest
yarn db:seed

cd ..
yarn run dev
```

Take a moment to review the provided codebase (migrations, models, React components, etc.); all of the code for this lesson is complete, though there are suggestions for refactoring at the end.

In this application, we are keeping track of donut orders. Navigating to http://localhost:3000/orders should show you the text "Current Donut Orders" and a list of our seeded donut orders. On the show page for an order, http://localhost:3000/orders/1, you should see the details for that Order, including which Donut flavors and their quantity.  

## The App Thus Far

To manage Donut Orders there were some things we took into consideration for setting up the database:

- An Order can have many Donuts
- When placing an Order, user must choose which Donut (by flavor) and quantity of donuts
- A Donut flavor can be associated with many different orders

With this information, our database needs a many-to-many association with three tables. A `Donuts` table allows us to create a variety of flavor options. An `Orders` table keeps track of the customer name. And an `OrderDetails` join table lets us know which donuts are associated with an order. We will also store the quantity of donuts for each donut flavor on the join record, since the quantity will always be different for each order. This may be your first time storing additional data on a join record, so make sure to check it out!  

 Here is what our ER diagram looks like:

![donut-er]

Our migrations and models reflect a many-to-many association. 

### Creating our React Form

Navigating to http://localhost:3000/orders/new should show you two headers, "Build Your Donut Order" and "Donut Order Summary." Under the `OrderFormPage` component, we have our form JSX. Take note of the `handleSubmit` and `clearForm` functions, and an `ErrorList` component for displaying errors. The form needs to accept a name for the Order, display options for Donut flavors, and provide options for selecting quantities. 

Let's start by reviewing the order name, and then we can tackle the donuts.

### Order Name

To designate different orders, a user can place an order based on the name of a customer that will pick up the donuts. `orderName` is where the state for this value will be tracked, and has `handleNameInput` to update the field when it is typed into

### Fetching Donut Flavors

On the new donut order page, a fetch request retrieves all Donut flavors from the database and stores them in state. This allows us to prefill donut options that a user can select.

We've added `donuts` state, as well as a fetch request that fires on the initital render of the component with `useEffect`.

```js
 const [donuts, setDonuts] = useState([])
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

  // ...
  const donutOptions = donuts.map((option) => {
    // ...logic to create radio button options for each flavor
  })
```

For each Donut, we want to display the flavor and a collection of radio buttons for selecting the quantity. Using the array of Donuts stored in the `donuts` state, we've  `map`ed over each Donut to handle this efficiently. We should house this information for each Donut flavor in another component to prevent this form component from becoming too cluttered. The provided `DonutOption` component helps displays the Donut flavors accordingly. We'll dig into the logic in a moment, but for now just know that we create a `DonutOption` component for each donut flavor. 

Finally, in the form we also display each of the donut options:

```js
// client/src/components/OrderFormPage.js

<div className="grid-x grid-margin-x callout secondary">
  {donutOptions}
</div>
```

*To review: our donuts index fetch retrieves donut flavors, and we render these with `DonutOption` tiles.*

### Quantity Radio Buttons

Each `DonutOption` component includes a collection of radio buttons for selecting a quantity, ranging from 0 to 3, for that Donut flavor. We've set the maximum quantity of donuts to 3 to be fair to all customers that want a taste of each flavor. In the `DonutOption` component we've created an array for these quantities that we then `map` over to create the radio button collection. 

```js
// client/src/components/DonutOption.js

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
```
For now, ignore the `checked` prop for this input field, and the `onChange`.

Since we have many Donuts and each has a set of these quantities, we need to make sure the `key` for each quantity option is truly unique. Above, we created a custom `key` using the `id` of the Donut and the current `quantity` value on each iteration! The `input` field's `id` is set to the value of the Donut `id` that will be used when managing the state of the donut for this order. 

This is how the webpage has clickable radio button quantities for each Donut flavor! 

### Radio Button Values

We have more state in the form component for tracking selected Donuts. To make maintaining state a little easier, we've stored the Donuts separately from the Order name state (when it's time to submit our data, we will POST with both pieces of information). The `OrderFormPage` has `orderDonuts` to track this data in an array.

```js
// client/src/components/OrderFormPage.js

const [orderDonuts, setOrderDonuts] = useState([])
```

This state allows us to make the "quantity" radio buttons controlled components, and allows us to track how many of each donut we want for the order. 

Let's ignore `handleDonutQuantity` function for a moment while we explain the logic in our `donutOptions` array. Our radio buttons need state for tracking if the button should appear checked (this is unique to checkboxes and radio buttons). To track that the donut has been selected, we need to verify if the Donut flavor is within the `orderDonuts` state for the Order. If it is, the radio button with that quantity value will be selected. We handle this in the `map` for creating the `donutOptions` in the Order Form where we have all of the state needed for such an operation (_the current state of selected orderDonuts and the group of donutOptions_). 

```js
// client/src/components/OrderFormPage.js

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
```

The initially selected quantity for a flavor's radio buttons should be 0 when no donut is selected. If we `find` the Donut flavor within our `orderDonuts` (which would be after a user has selected a favlor), we'll also want to pass the quantity of that donut down to the `DonutOption` so that it can render with the selected quantity. In the `DonutOption` component, note how we use `optionQuantity` against our `quantity` for the `checked` attribute of the radio button.

```js
// client/src/components/DonutOption.js

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
```

`checked` expects a boolean to determine if the radio button should appear selected. For each quantity option, if the supplied `optionQuantity` prop matches the current quantity in the iteration for this Donut flavor, that quantity button should be selected. That's a lot to follow, but makes for a really cool form!

*To review: we track the state of each donut on our order in `donuts` state array. Once we've selected a donut flavor and quantity, we'll update our `donuts` state to contain that flavor, and then need to re-pass this information down to our `DonutOption` components so that they can render with the user's selection*.

### Radio Button onChange with handleDonutQuantity

Similar to our `handleNameChange` for the Order name input field, we can create a `handleDonutQuantity` function for handling our radio buttons. Our logic is going to get a little more complex because there are some conditions we need to take into consideration:

- When a quantity is initially selected, we want to add that Donut into the state for `orderDonuts`
- When a quantity is selected, and the Donut is already in `orderDonuts`, update its quantity
- When a quantity of 0 is selected, and the Donut is already in `orderDonuts`, remove it from `orderDonuts`

Here is how we can handle these conditions in our `handleDonutQuantity` function:

```js
// client/src/components/OrderFormPage.js

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
      quantity: event.currentTarget.value 
    }
    setOrderDonuts([
      ...orderDonuts, 
      newDonut
    ])
  }
}
```
There is a lot we can unpack here, but it ultimately comes down to logic for adding, removing or updating the a donut and it's quantity for the order. Take your time to sift through this logic; you may wish to come back to it later.

We pass this function to the `DonutOption` components so that each `input` field has this for its `onChange` handler:

```js
// client/src/components/OrderFormPage.js

...
<DonutOption
  key={option.id}
  optionQuantity={optionQuantity}
  handleDonutQuantity={handleDonutQuantity} 
  {...option}
/>
...
```

Finally, in the `DonutOption` component, this function is set to the `onChange` event listener as a callback:

```js
// client/src/components/DonutOption.js

...
<input 
  id={id}
  type="radio"
  name={flavor}
  value={quantity}
  checked={optionQuantity == quantity}
  onChange={handleDonutQuantity} 
/>
...
```

#### Order Summary 

The Order Form also includes code that can be used to help display the order summary i.e. `donutSummary`. We iterate over our recently updated `orderDonuts` state to display a beautiful list of the donuts we wish to order. 

```js
// client/src/components/OrderFormPage.js

// pickup name for order logic 
let orderFor
  if (orderName) {
    orderFor = (
      <h4 className="text-center">for <em>{orderName}</em></h4>
    )
  }

// display donuts that have been selected
 const donutSummary = orderDonuts.map((donut) => { 
    return (
      <li key={donut.donutId}>
        <b><em>{donut.donutFlavor}</em></b>, quantity: <b><em>{donut.quantity}</em></b>
      </li>
    )    
  })
```

```js
// client/src/components/OrderFormPage.js (JSX return)

  <div className="cell small-6 callout">
    <h2 className="text-center">Donut Order Summary</h2>
    {orderFor}
    <ul>{donutSummary}</ul>
  </div>
```

#### POSTing the Donut Order

Any selected Donuts and their quantities will be tracked in `orderDonuts` state, which allows us to POST our order data to the backend to be saved. The `handleSubmit` function is the callback to our form's `onSubmit` event listener. Let's review:

```js
// client/src/components/OrderFormPage.js

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
      handleClear()
      setShouldRedirect({
        status: true,
        id: body.order.id
      })
    }
  } catch (error) {
    console.error(`Error in fetch: ${error.message}`)
  }
}
```

The fetch request is sent to `/api/v1/orders`, which allows us to create the `Order` record and associate the `Donuts` through `OrderDetails` (more on that shortly). Designating the `body` for this POST fetch request, we create a custom object that uses the `orderName` and `orderDonuts` for the information to be packaged together. When a successful response comes back, we redirect to the show page for the new Donut Order.

## The Donut Backend

#### Orders Router

Let's look at the POST route in `ordersRouter` to see how this POST request is being handled:

```js
// server/src/routes/api/v1/ordersRouter.js

ordersRouter.post("/", async (req, res) => {
  const cleanedFormInput = cleanUserInput(req.body)
  const { name, donuts } = cleanedFormInput
  try {
    if (donuts) {
      const newOrder = await Order.query().insertAndFetch({ name })
      for (const donut of donuts) {
        await newOrder.$relatedQuery("orderDetails").insert({ donutId: donut.donutId, quantity: donut.quantity })
      }
      return res.status(201).json({ order: newOrder })
    } else {
      const donutError = {
        donuts: [{
          message: "should be selected"
        }]
      }
      return res.status(422).json({ errors: donutError })
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data })
    }
    return res.status(500).json({ errors: error })
  }
})
```

When the Order router receives the POST request, we pass the `req.body` to a modified version of the `cleanUserInput` function. This `cleanUserInput` checks if the property length of a param is 0. In this way, the function can be used for both the `name` string and `donuts` array. We could start talking about a whole new suit of services for cleaning our user input, but that's a discussion for a different article. 

After the data has been "cleaned" we destructure the order `name` and the array of `donuts` we want to associate to the Order to make it easier to use these variables.

Within the `try` block, we're going to create our new records. If our request params contain a `donuts` attribute, we first create the Order record so that we can associate our Donuts to that Order through the join `orderDetails`. Once we create a new Order successfully, we can iterate over all `donuts`. For each Donut, we create a related `orderDetails` join record. The `orderDetails` requires the `donutId` and `quantity` for that Donut. Finally, we return a a success response that includes the newly created donut order.

If this router does not receive any Donuts, we hit the `else` statement and create a custom error message. The custom `donutError` is required to ensure error messages when an Order doesn't have any associated Donuts. This custom error message matches the same structure as other errors displayed in React by the `ErrorList` component. When there are no Donuts, we send back this custom error message with a 422 status.

Try submitting the form with different variations: when the form is empty, with only a name, with just donuts selected, and with all information supplied.

## Refactoring with Advanced Objection Queries

#### `insertGraph`

Objection provides us with a number of different methods we can use to interact with our database. Right now the `ordersRouter` POST endpoint has logic that iterates over all Donuts with a `for` loop, which then contains `insert` queries that create `orderDetails` join records to associate all of our donuts to a specific order.

```js
// server/src/routes/api/v1/ordersRouter.js

for (const donut of donuts) {
  await newOrder.$relatedQuery("orderDetails").insert({ donutId: donut.donutId, quantity: donut.quantity })
}
```
Rather than inserting each record individually, we can batch insert them all together:

```js
// server/src/routes/api/v1/ordersRouter.js

ordersRouter.post("/", async (req, res) => {
  ...
  const newOrder = await Order.query().insertAndFetch({ name })
  await newOrder.$relatedQuery("orderDetails").insertGraph(donuts) 
  ...
```

The Order is created first. Our new code contains the method [`insertGraph()`][insertGraph], that takes an array of objects as an argument. The keys in each object should correspond with the column names for an `orderDetail` record. Our `donuts`data should already be properly formatted with the required keys for `donutId` and `quantity`, so this should work seemlessly. 

`insertGraph` has the benefit of being DRYer, and being more efficient when adding records to our database. While our original implementation worked fine, `insertGraph` can scale much better with more donuts if working with Postgres.

#### Refactoring to Clean Up Our Router 

Typically our routers should primarily be responsible for receiving incoming requests and processing a response. However, our endpoint is also handling all of the conditional logic for creating Donut Orders. We can refactor the endpoint to make use of a helper function that will process the form payload and create the records for us. In the `services` folder you'll find `insertDonutOrder.js` which is a function we can use to refactor this POST endpoint:

```js
// server/src/routes/api/v1/ordersRouter.js

ordersRouter.post("/", async (req, res) => {
  const cleanedFormInput = cleanUserInput(req.body)
  try {
    const result = await insertDonutOrder(cleanedFormInput) // this is new
    if (result.order) {
      return res.status(201).json({ order: result.order })
    } else if (result.errors) {
      return res.status(422).json({ errors: result.errors })
    }
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(422).json({ errors: error.data })
    }
    return res.status(500).json({ errors: error })
  }
})
```
 The function is responsible for all of the same logic we had before that involves creating the records for Donut Orders. `insertDonutOrder` will return either the new Donut Order or a generated error if there are no Donuts. 

### What's Next?

This application could benefit from even more refactoring if we wished!

We could move `insertDonutOrder` into the `Order` model and define it as a class method there! 

Additionally, the `OrderFormPage` component is very busy. We could refactor all of our Fetch request logic to exist in their own files to start. The Donut Summary logic could be housed in it's own component. The logic regarding designating donut options could also be moved into it's own component or JavaScript class, or even into a custom `useDonutOptions` hook!

For now though, this implementation is fine for our purposes.

### Why This Matters

There is no one way to build a webpage or API endpoint. This walkthrough went over one of many implementations we could have used to create a beautiful Donut shop website. We could have divided up creating orders, selecting donuts, and designating quantities, but the user experience would have been remarkably different. With an extensive form such as the one used in our React code, we're able to receive more data once we POST to our backend, which then allows us to make more advanced queries that improve efficiency when interacting with our database.

### In Summary

With nested forms we can create more in-depth user interfaces for associated records rather than using multiple, independent forms. 

Our POST route in the `donutsRouter` is still able to handle this larger dataset gracefully, especially if with more advanced Objection queries such as [`insertGraph`][insertGraph]. We also explored how we can create helper functions to clean up our router and keep a clear separation of concerns between logic for handling requests (our router files) and logic for interacting with our database (our models and helper functions).

Ultimately, this isn't a "standard" way of building this type of form. If we had other relationships between our entities, or even different form inputs, the way we could have executed on this project would dramatically change!

[insertGraph]: https://vincit.github.io/objection.js/api/query-builder/mutate-methods.html#insertgraph
[donut-er]: https://horizon-production.s3.amazonaws.com/images/donut-order-er-diagram.png