import React, { propTypes, Component } from 'react'
import { Router, Route, IndexRedirect } from 'react-router'
import Password from '../components/Password';
import Amend from '../components/Passwords/Amend'
import Success from '../components/Passwords/Success'

const system = () => {
  return (
    <Route path="system">
      <IndexRedirect to="password" />
      <Route path="password" component={Password}>
        <IndexRedirect to="amend" />
        <Route path="amend" component={Amend} />
        <Route path="success" component={Success} />
      </Route>
    </Route>
  )
}


export default system
