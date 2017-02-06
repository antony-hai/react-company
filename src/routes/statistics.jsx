import React, { propTypes, Component } from 'react'
import { Router, Route, IndexRedirect } from 'react-router'
import CumsReport from '../components/Reports/ComsReport'
import Report from '../components/Report'

const statistics = () => {
  return (
    <Route path="statistics">
      <IndexRedirect to="report" />
      <Route path="report" component={Report}>
        <IndexRedirect to="comsReport" />
        <Route path="comsReport" component={CumsReport} />
      </Route>
    </Route>
  )
}


export default statistics
