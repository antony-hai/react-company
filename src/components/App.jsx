import React, { Component, PropTypes } from 'react';
import MainLayout from '../layouts/MainLayout/MainLayout';
import { connect } from 'react-redux';
import NotFound from './NotFound';
import Nav from '../components/Nav/Nav';
import * as path from 'path';
import { Auth as Actions } from '../actions'
import { notification } from 'antd';
import styles from './app.less';




/**
 * @return {null}
 */
class App extends Component {
  componentWillMount() {
    const dom = document.getElementById('root');
    let newState;
    if (dom !== null && dom !== undefined) {
      const raw = dom.attributes['data-auth'].value
      newState = JSON.parse(raw)
    }
    this.props.dispatch({
      type: Actions.INIT,
      payload: newState,
    })
  }

  render() {
    const { children, ...contextProps } = this.props;
    return (
      <div>
        <Nav {...contextProps} />
        {React.cloneElement(children, {
          key: location.path,
          ...contextProps,
        })}
      </div>

    )
  }
}

App.propTypes = {
  children: PropTypes.element,
};

const mapStateToProps = ({ auth = {}, menus: { list } }) => {
  return { auth, menus: list };
};

export default connect(mapStateToProps)(App);
