
import React, { PropTypes } from 'react';
import { Router, Route, IndexRedirect, Link } from 'react-router';
import manage from './manage'
import system from './system'
import NotFound from '../components/NotFound'
import App from '../components/App'
import MainLayout from '../layouts/MainLayout/MainLayout'

const Routes = ({ history }) =>
  <Router history={history}>
    <Route path="/" component={App}>
      <IndexRedirect to="manage" />
      <Route component={MainLayout}>
        {manage()}
        {system()}
      </Route>
    </Route>
    <Route path="*" component={NotFound} />
  </Router>;

Routes.propTypes = {
  history: PropTypes.any,
};

export default Routes;
