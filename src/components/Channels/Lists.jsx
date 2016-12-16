import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Table, Spin } from 'antd';
import styles from '../app.less';
import { connect } from 'react-redux';

export default class Lists extends Component {
  handleColumns() {
    const { handleDisabled, handleAddWx } = this.props;

    return [
      {
        title: '公司',
        key: 'name',
        dataIndex: 'name',
      },
      {
        title: '联系人',
        key: 'contact',
        dataIndex: 'contact',
      },
      {
        title: '联系人手机',
        key: 'contactTel',
        dataIndex: 'contactTel',
      },
      {
        title: '使用时间',
        key: 'serviceTime',
        render(record) {
          const { startDate = '', endDate = '' } = record;
          if (!startDate || !endDate) {
            return (<sapn>永久使用</sapn>)
          }
          const startServer = startDate.substring(0, 10);
          const endServer = endDate.substring(0, 10);
          return (<span>{`${startServer} 至 ${endServer}`}</span>)
        },
      },
      {
        title: '数据插件',
        key: 'plugins',
        render(record) {
          const { options = {} } = record
          const { plugins } = options;
          if (plugins) {
            return <span>{plugins}</span>
          }
          return '-'
        },
      },
      {
        title: '状态',
        key: 'channelStatus',
        render(record) {
          const nowTime = new Date().getTime();
          const { startDate, endDate } = record;  
          const startTime = new Date(startDate).getTime();
          const endTiem = new Date(endDate).getTime();
          const [color1, color2, color3] = ['#54E240', '#2DB7F5', 'red'];
          if (record.deleted_at) {
            return (<span style={{ color: color3 }}>禁用</span>)
          } else {
            if (startDate === null || endDate === null) {
              return <sapn style={{ color: color1 }}>正常使用</sapn>
            } else {
              if (startTime > nowTime) {
                return (<span style={{ color: color2 }}>未开始</span>)
              } else if (endTiem < nowTime) {
                return (<span style={{ color: color3 }}>已到期</span>)
              } else {
                return (<sapn style={{ color: color1 }}>正常使用</sapn>)
              }
            }
          }
        }
      },
      {
        title: '微信总数',
        key: 'wxClientCount',
        dataIndex: 'wxClientCount',
      },
      {
        title: '已用微信',
        key: 'projectCount',
        dataIndex: 'projectCount',
      },
      {
        title: '操作',
        key: 'operation',
        render(record) {
          const nowTime = new Date().getTime();
          const { _id, startDate, endDate } = record;
          let ctrlText;
          if (!endDate) {
            if (record.deleted_at) {
              ctrlText = '启用';
            } else {
              ctrlText = '禁用';
            }
            return (
              <div>
                <Link
                  style={{ marginRight: 6 }}
                  to={`/manage/channel/create/${_id}`}
                >编辑</Link>
                <a onClick={() => handleDisabled(_id, record)}>{ctrlText}</a>
                <a onClick={() => handleAddWx(_id)} style={{ marginLeft: 5 }}>配置微信</a>
              </div>
            )
          } else {
            if (new Date(endDate).getTime() < nowTime) {
              return (
                <div>
                  <Link to={`/manage/channel/create/${_id}`}>编辑</Link>
                  <a onClick={() => handleAddWx(_id)} style={{ marginLeft: 5 }}>配置微信</a>
                </div>
              )
            } else {
              if (record.deleted_at) {
                ctrlText = '启用';
              } else {
                ctrlText = '禁用';
              }
              return (
                <div>
                  <Link
                    style={{ marginRight: 6 }}
                    to={`/manage/channel/create/${_id}`}
                  >编辑</Link>
                  <a onClick={() => handleDisabled(_id, record)}>{ctrlText}</a>
                  <a onClick={() => handleAddWx(_id)} style={{ marginLeft: 5 }}>配置微信</a>
                </div>
              )
            }
          }
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
