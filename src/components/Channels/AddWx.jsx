import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Table, Form, Button, Row, Col, Input, message, Spin, Icon } from 'antd'
import { indexCache } from '../../services/common'
import * as Actions from '../../actions'
import styles from './channel.less'

const FormItem = Form.Item;
const RES_NAME = 'companies';
const gridSpan = {
  labelCol: { span: 7 },
  wrapperCol: { span: 17 },
}
class AddWx extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
    }
  }
  handleDelete(id) {
    this.props.dispatch({ type: Actions.Res.DELETE_WX, payload: id })
  }
  handleDeleteAll() {
    this.props.dispatch({ type: Actions.Res.DELETE_ALL_WX })
  }
  handlePageChange(pagination) {
    const { current = 1 } = pagination;
    this.setState({ current })
  }
  handleAdd() {
    const { dispatch, form, companyMsg } = this.props
    const { used_id } = companyMsg;
    const wxcount = form.getFieldValue('wxcount')
    if (!wxcount || isNaN(parseFloat(wxcount))) {
      message.error('请输入正确的数字', 2);
      form.setFieldsValue({ 'wxcount': undefined })
      return;
    }
    const getData = { id: used_id, filter: parseFloat(wxcount) }
    dispatch(Actions.Res.addwxclientAction(RES_NAME, getData))
    form.setFieldsValue({ 'wxcount': undefined })
  }
  handleColumes() {
    return ([
      {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
      },
      {
        title: '卡号存放位',
        dataIndex: 'index',
        key: 'index',
        render(index) {
          if (index) {
            return <span> {indexCache(index)}</span>
          }
        },
      },
      {
        title: '微信昵称',
        dataIndex: 'nickName',
        key: 'nickName',
      },
      {
        title: '操作',
        key: 'operation',
        render: record => {
          const { _id, project_id } = record;
          if (project_id) {
            return '-'
          }
          return <a onClick={this.handleDelete.bind(this, _id)}>删除</a>
        },
      },
    ])
  }
  render() {
    const { getFieldProps } = this.props.form;
    const { companyMsg } = this.props;
    const { infoList = [], loading } = companyMsg;
    const canDeleteAll = infoList.some(item => {
      return !item.project_id;
    })
    const deleteButtonDom = () => {
      if (canDeleteAll) {
        return (
          <div className={styles.deleteButton}>
            <Button
              type="ghost"
              onClick={this.handleDeleteAll.bind(this)}
            >清空已添加微信</Button>
          </div>
       )
      }
      return null;
    }
    const dataList = () => {
      if (loading) {
        return (<Spin />)
      }
      if (infoList.length === 0) {
        return (
          <div className={styles.noData}>
            <div> <Icon type="frown" /> 暂无分配微信号</div>
          </div>
        )
      }
      return (
        <Table
          columns={this.handleColumes()}
          dataSource={infoList}
          pagination={{
            total: infoList.length,
            current: this.state.current,
            pageSize: 10,
          }}
          onChange={this.handlePageChange.bind(this)}
        />
      )
    }
    return (
      <div>
        <div className={styles.modalBox}>
          <div className={styles.addText}>
            <FormItem label="添加微信" {...gridSpan}>
              <Input {...getFieldProps('wxcount')} />
            </FormItem>
          </div>
          <div className={styles.addButton}>
            <Button
              type="primary"
              onClick={this.handleAdd.bind(this)}
            >添加</Button>
          </div>
          {deleteButtonDom()}
        </div>
        <div style={{ clear: 'both' }}>
          {dataList()}
        </div>
      </div>
    )
  }
}
const mapStateToProps = ({ resources }) => {
  const { info = {} } = resources;
  return { companyMsg: { ...info } }
}


export default connect(mapStateToProps)(Form.create({})(AddWx)) ;
