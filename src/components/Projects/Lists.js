import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Table, Spin } from 'antd';
import styles from '../app.less';
import { connect } from 'react-redux';
import { indexCache } from '../../services/common'

export default class Lists extends Component {
  handleColumns() {
    const { loginModal, handleClear, handleUIN, handleUpdate } = this.props;
    return [
      {
        title: '手机号',
        key: 'mobile',
        dataIndex: 'mobile',
      },
      {
        title: '卡号存放位',
        key: 'index',
        dataIndex: 'index',
        render(index) {
          if (index) {
            return <span>{indexCache(index)}</span>
          }
          return '-'
        },
      },
      {
        title: '微信昵称',
        key: 'nickName',
        dataIndex: 'nickName',
        render(nickName) {
          if (!nickName) {
            return '-';
          }
          return <div dangerouslySetInnerHTML={{ __html: nickName }} />
        },
      },
      {
        title: 'UIN',
        key: 'uin',
        dataIndex: 'uin',
        render(uin) {
          if (!uin) {
            return '-';
          }
          return <div dangerouslySetInnerHTML={{ __html: uin }} />
        },
      },
      {
        title: '所属渠道',
        key: 'companyName',
        dataIndex: 'companyName',
      },
      {
        title: '所属结构/组织',
        key: 'project',
        dataIndex: 'project',
      },
      {
        title: '好友数',
        key: 'contactNum',
        dataIndex: 'contactNum',
      },
      {
        title: '登录状态',
        key: 'loginStatus',
        render(record) {
          const { loginStatus } = record;
          switch(loginStatus) {
            case 0:
              return (<span style={{ color: '#2DB7F5' }}>未登录</span>);
            case 1:
              return (<span style={{ color: '#54E240' }}>已登录</span>);
            case -1:
              return (<span style={{ color: 'red' }}>异常</span>);
          }
        },
      },
      {
        title: '账号状态',
        key: 'status',
        render(record) {
          if (record.hasOwnProperty('status')) {
            switch(parseFloat(record.status)) {
              case 1 :
                return (<span style={{ color: '#54E240' }}>正常</span>)
              case 2 :
                return (<span style={{ color: 'red' }}>被封</span>)
            }
          } else {
            return (<span>瞬间爆炸</span>)
          }
        },
      },
      {
        title: '操作',
        width: 180,
        key: 'operation',
        render(record) {
          const { operation, _id } = record;
          return (
            <div>
              {operation.map((item, index) => {
                if (item.key === 'removeUIN') {
                  return (<a style={{ marginRight: 6 }} onClick={() => handleUIN(_id)} key={index}>清uin</a>)
                } else if (item.key === 'edit') {
                  return (<Link to={`/manage/project/create/${_id}`} style={{ marginRight: 6 }} key={index}>编辑</Link>)
                } else if (item.key === 'qrcode') {
                  return (<a href={`/v1/api/qrcode/${_id}`} target="_blank" style={{ marginRight: 6 }} key={index}>二维码</a>)
                } else if (item.key === 'login') {
                  return (<a style={{ marginRight: 6 }} onClick={() => loginModal(record)} key={index}>登录</a>)
                } else if (item.key === 'update') {
                  return (<a style={{ marginRight: 6 }} onClick={() => handleUpdate(_id)} key={index}>更新</a>)
                } else if (item.key === 'clear') {
                  return (<a style={{ marginRight: 6 }} onClick={() => handleClear(_id)} key={index}>清除</a>)
                }
              })}
            </div>
          )
        },
      },
    ];
  }

  render() {
    return (
      <Table
        rowKey="_id"
        columns={this.handleColumns()}
        {...this.props}
      />
    )
  }
}
