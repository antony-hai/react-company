import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Button, Icon, Table, Spin } from 'antd'
import styles from './report.less'
import { Res as Actions } from '../../actions'

const RES_NAME = 'statistics'

class ComsReport extends Component {
  componentWillMount() {
    this.loadResource()
  }
  loadResource(pagination = { current: 1 }) {
    const { dispatch } = this.props;
    const { current: page = 1 } = pagination;
    dispatch(Actions.getListAction({ resName: RES_NAME, page }));
  }
  handleChange(pagination) {
    this.loadResource(pagination)
  }
  handleColumns() {
    return [
      {
        title: '序号',
        key: 'listNum',
        dataIndex: 'listNum',
        footer: '总计',
      },
      {
        title: '企业名称',
        key: 'name',
        render(recode) {
          if (!recode.name) { return <span>-</span> }
          return <span>{recode.name}</span>
        },
      },
      {
        title: '开始时间',
        key: 'startDate',
        render(recode) {
          if (!recode.startDate) { return <span>-</span> }
          const { startDate = '' } = recode;
          if (!startDate) { return (<span>永久使用</span>) }
          const startTime = startDate.substring(0, 10)
          return (<span>{startTime}</span>)
        },
      },
      {
        title: '结束时间',
        key: 'endDate',
        render(recode) {
          if (!recode.endDate) { return <span>-</span> }
          const { endDate = '' } = recode;
          if (!endDate) { return (<span> - </span>) }
          const endTime = endDate.substring(0, 10)
          return (<span>{endTime}</span>)
        },
      },
      {
        title: '状态',
        key: 'channelStatus',
        render(record) {
          //过滤最后总计一栏
          if (record.channelStatus) { return <span>-</span> }
          const nowTime = new Date().getTime();
          const { startDate = '', endDate = '' } = record;
          const startTime = new Date(startDate).getTime();
          const endTiem = new Date(endDate).getTime();
          const [color1, color2, color3] = ['#54E240', '#2DB7F5', 'red'];
          if (record.deleted_at) {
            return (<span style={{ color: color3 }}>禁用</span>)
          }
          if (!startDate || !endDate) {
            return <sapn style={{ color: color1 }}>正常使用</sapn>
          }
          if (startTime > nowTime) {
            return (<span style={{ color: color2 }}>未开始</span>)
          } else if (endTiem < nowTime) {
            return (<span style={{ color: color3 }}>已到期</span>)
          }
          return (<sapn style={{ color: color1 }}>正常使用</sapn>)
        },
      },
      {
        title: '账号数量',
        key: 'accountCount',
        dataIndex: 'accountCount',
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
        title: '未用微信',
        key: 'unusedCount',
        dataIndex: 'unusedCount',
      },
      {
        title: '好友数量',
        key: 'contactNum',
        dataIndex: 'contactNum',
      },
      {
        title: '对话客户数',
        key: 'dialogueNum',
        dataIndex: 'dialogueNum',
      },
      {
        title: '发送消息',
        key: 'sendMsgCount',
        dataIndex: 'sendMsgCount',
      },
      {
        title: '好友消息',
        key: 'getMsgCount',
        dataIndex: 'getMsgCount',
      },
      {
        title: '标签数量',
        key: 'tagCount',
        dataIndex: 'tagCount',
      },
    ]
  }
  render() {
    const { resources = {} } = this.props
    const { loading, list = [], pagination } = resources;
    const listWithNo = list.map((item, index) => {
      return { ...item, listNum: index + 1 }
    })
    let accountCount = 0
    let wxClientCount = 0
    let projectCount = 0
    let unusedCount = 0
    let contactNum = 0
    let dialogueNum = 0
    let sendMsgCount = 0
    let getMsgCount = 0
    let tagCount = 0
    list.forEach((item, index) => {
      accountCount += item.accountCount
      wxClientCount += item.wxClientCount
      projectCount += item.projectCount
      unusedCount += item.unusedCount
      contactNum += item.contactNum
      dialogueNum += item.dialogueNum
      sendMsgCount += item.sendMsgCount
      getMsgCount += item.getMsgCount
      tagCount += item.tagCount
    })
    const tableFooter = {
      channelStatus: 'filter',
      listNum: <span className={styles.tableFooter}>总计 :</span>,
      accountCount: <span className={styles.tableFooter}>{accountCount}</span>,
      wxClientCount: <span className={styles.tableFooter}>{wxClientCount}</span>,
      projectCount: <span className={styles.tableFooter}>{projectCount}</span>,
      unusedCount: <span className={styles.tableFooter}>{unusedCount}</span>,
      contactNum: <span className={styles.tableFooter}>{contactNum}</span>,
      dialogueNum: <span className={styles.tableFooter}>{dialogueNum}</span>,
      sendMsgCount: <span className={styles.tableFooter}>{sendMsgCount}</span>,
      getMsgCount: <span className={styles.tableFooter}>{getMsgCount}</span>,
      tagCount: <span className={styles.tableFooter}>{tagCount}</span>,
    }
    //推入最后总计行
    listWithNo.push(tableFooter)
    if (loading) { return <Spin /> }
    return (
      <section>
        <div className={styles.downloadBtnBox}>
          <a href="/v1/statistics/export">
            <Button type="primary"><Icon type="download" /> 导出XLS </Button>
          </a>
        </div>
        <Table
          columns={this.handleColumns()}
          dataSource={listWithNo}
          pagination={false}
        />
      </section>

    )
  }
}

ComsReport.PropTypes = {}

const mapStateToProps = ({ resources = {} }) => {
  return {
    resources: Object.assign({}, { list: [], pagination: {} }, resources[RES_NAME]),
  }
}

export default connect(mapStateToProps)(ComsReport)
