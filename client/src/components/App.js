import React from "react"
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"
import { hot } from "react-hot-loader/root"

import "../assets/scss/main.scss"

import OrdersListPage from "./OrdersListPage"
import OrderFormPage from "./OrderFormPage"
import OrderShowPage from "./OrderShowPage"

const App = (props) => {

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/orders" />
        </Route>

        <Route exact path="/orders" component={OrdersListPage} />
        <Route exact path="/orders/new" component={OrderFormPage} />
        <Route exact path="/orders/:id" component={OrderShowPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default hot(App)
