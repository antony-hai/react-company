import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Table, Spin } from 'antd';
import styles from '../app.less';
import { connect } from 'react-redux';
import { indexCache } from '../../services/common'


export default class Lists extends Component {
  handleColumns() {
    const { handleDisabled } = this.props;
    return [
      {
        title: '手机号',
        key: 'mobile',
        dataIndex: 'mobile',
      },
      {
        title: '卡号存放位',
        key: 'indexCache',
        render(record) {
          const { index } = record;
          if (index) {
            return (<span>{indexCache(index)}</span>)
          } else {
            return '-'
          }  
        }
      },
      {
        title: '所属渠道',
        key: 'companyName',
        dataIndex: 'companyName',
      },
    ];
  }
  render() {
    return (
      <Table
        rowKey="id"
        columns={this.handleColumns()}
        {...this.props}
      />
    )
  }
}
