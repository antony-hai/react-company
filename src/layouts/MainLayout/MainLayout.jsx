import React, { Component, PropTypes } from 'react';
import { Row, Col, Switch } from 'antd';
import Menus from '../../components/Menus/Menu';
import styles from './MainLayout.less';

class MainLayout extends Component {
  render() {
    const { children } = this.props;
    return (
      <Row type="flex" justify="space-between" gutter={32}>
        <Col span={4} className={styles.side}>
          <Menus />
        </Col>
        <Col span={20} className={styles.content}>
          {children}
        </Col>
      </Row>
    )
  }
}

MainLayout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default MainLayout;
