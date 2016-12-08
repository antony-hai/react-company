import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Form, Input, Button, Select, TreeSelect, message,
  DatePicker, Checkbox, RadioModal, Table, Radio, Modal } from 'antd';
import { regExp, changeDate, toBase64, indexCache } from '../../services/common';
import styles from './channel.less';
import xFetch, { getTokenOfCSRF } from '../../services/xFetch';
import { channelUrl } from '../../urlAddress';
import * as Actions from '../../actions';


const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const plainOptions = ['基础信息', '置业信息', '社交信息'];
const liveRepeat = {};// 后面去重用的对象
const RES_NAME = 'companies';
const gridSpan = {
  labelCol: {
    xs: 5,
    sm: 4,
    md: 3,
  },
  wrapperCol: {
    span: 8,
  },
};

class CreateChannel extends Component {
  constructor() {
    super();
    this.state = {
      editId: null,
      isEdit: false,
      current: 1,
      name: '',
      contact: '',
      contactTel: '',
      serverTime: [],
      dataId: [],   // 要传过去的微信列表 id 组
      email: '',
      password: '',
      showConfirm: false,
      showWxlist: false,
      canUsePlugin: false,
      plugin: undefined,
      wxClients: [],    // 总微信列表
      wxCount: '', // 要添加的数量
      wxClientCount: 0,// 总数量
    }
  }
  componentWillMount() {
    const { params, dispatch } = this.props;
    if (params.hasOwnProperty('id')) {
      const { id } = params;
      const operate = { id, field: '' }
      this.props.dispatch(Actions.Res.getInfoAction(
        RES_NAME, operate, this.infoCallback.bind(this)
      ))
    }
  }
  infoCallback(data) {
    const { wx_clients = [], wxClientCount = 0, options, _id } = data;
    const { canUsePlugin = false, plugins } = options;
    let plugin;
    if (Array.isArray(plugins) && plugins.length !== 0) {
      plugin = plugins[0]
    } else {
      plugin = undefined;
    }
    const dataId = [...wx_clients].map(item => {
      return item._id;
    })
    let serverTime = [];
    if (data.startDate && data.endDate) {
      serverTime = [changeDate(data.startDate), changeDate(data.endDate)]
    }
    if (wx_clients.length === 0) {
      this.setState({ showWxlist: false })
    } else {
      this.setState({ showWxlist: true })
    }
    this.setState({
      editId: _id,
      isEdit: true,
      showConfirm: false,
      wxClients: wx_clients,
      ...data,
      dataId,
      wxClientCount: dataId.length,
      serverTime,
      canUsePlugin,
      plugin,
    });
  }


//删除单个  直接操控数组就好
handleDelete(wxid) {
  const { form } = this.props;
  const values = form.getFieldsValue();
  const { wxClients = [] } = this.state;
  const [list, dataId] = [[], []];
  wxClients.forEach(item => {
    if (item._id !== wxid) {
      list.push(item)
      dataId.push(item._id)
    }
  })
  if (list.length === 0) {
    this.setState({
      showWxlist: false,
      wxClientCount: 0,
      wxClients: [],
    })
  } else {
    this.setState({
      wxClients: list,
      wxClientCount: list.length,
      dataId,
    })
  }
}
//添加弹出弹框
showModal() {
  const { form } = this.props;
  const values = form.getFieldsValue();
  const { wxCount } = values;
  if (isNaN(wxCount) || wxCount === '') {
    message.error('请填写正确的微信数量')
  } else {
    this.setState({ wxCount, showConfirm: true })
  }
}
//确认添加微信数量
handleOk() {
  const { form } = this.props;
  const { wxClients = [], dataId = [], isEdit, editId } = this.state;
  const values = form.getFieldsValue();
  const { wxCount } = values;
  const countString = toBase64({ wxClientCount: parseFloat(wxCount) });
  const url = isEdit ? `/v1/companies/${editId}/wxclients/create?f=${countString}` :
    `/v1/companies/0/wxclients/create?f=${countString}`
  xFetch(url).then(res => {
    const { data: { data } } = res.jsonResult;
    data.forEach(item => {
      if (!liveRepeat[item._id]) {
        liveRepeat[item._id] = 1;
        dataId.push(item._id);
        wxClients.unshift(item);
      }
    })
    this.setState({
      showConfirm: false,
      showWxlist: true,
      wxCount: undefined,
      wxClientCount: dataId.length,
      wxClients,
      dataId,
    })
  }, err => {
    this.setState({
      showConfirm: false,
      wxCount: '',
    })
    Modal.error({
      title: '添加失败',
      content: err,
      width: 300,
    })
    form.resetFields(['wxCount'])
  })
}
//取消
handleCancel() {
  const { form } = this.props;
  this.setState({
    showConfirm: false,
    wxCount: '',
  });
  form.resetFields(['wxCount'])
}
//删除全部
clearWxlist() {
  const { form } = this.props
  this.setState({
    showWxlist: false,
    wxClients: [],
    wxCount: '',
    wxClientCount: 0,
    dataId: [],
  })
  form.resetFields(['wxCount'])
}
//表单提交
handleSubmit(e) {
  e.preventDefault();
  const form = this.props.form;
  const state = this.state;
  form.validateFields((errors, values) => {
    if (!!errors) { return; }
    const { plugin, date = [] } = values;
    const plugins = state.canUsePlugin ? [plugin] : [];
    const options = { canUsePlugin: this.state.canUsePlugin, plugins }
    let startDate;
    let endDate;
    if (date[0] && date[1]) {
      startDate = changeDate(date[0]);
      endDate = changeDate(date[1])
    } else {
      startDate = null;
      endDate = null;
    }
    const wxClientCount = parseInt(state.wxClientCount, 10)
    let data = { ...values, startDate, endDate, wxClients: state.dataId,
        wxClientCount, options, _token: getTokenOfCSRF() }
    if (state.isEdit) {
      data = Object.assign({}, data, { _id: state.editId })
      this.props.dispatch(Actions.Res.putAction(
        RES_NAME, data, this.handleSuccess.bind(this)
        ))
    } else {
      this.props.dispatch(Actions.Res.postAction(
        RES_NAME, data, this.handleSuccess.bind(this)
        ))
    }
  });
}
  handleSuccess() {
    this.context.router.push('/manage/channel/list')
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
            return <span> {indexCache(index) }</span>
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
          const { _id, project_id, contactNum = 0 } = record;
          if (project_id || contactNum > 0) {
            return '-'
          }
          return <a onClick={this.handleDelete.bind(this, _id)}>删除</a>
        },
      },
    ])
  }
//分页函数
  handlePageChange(pagination) {
    const { current = 1 } = pagination
    this.setState({ current })
  }
  handlePlugin(e) {
    const { value } = e.target;
    if (value === '1') {
      this.setState({
        canUsePlugin: !this.state.canUsePlugin,
      })
    } else {
      this.setState({
        canUsePlugin: false,
      })
    }
  }
disabledDate(current) {
  // can not select days before today
  return current && current.valueOf() < Date.now();
}
render() {
  const state = this.state;
  const { wxClients = [], showWxlist, editId, isEdit, wxCount,
    wxClientCount, current } = state;
  const { form, share, errors } = this.props;
  const { getFieldProps, getFieldValue, initialValue } = form;
  const remandMsg = () => {
    if (isEdit) {
      return (
        <span style={{ marginLeft: 5 }}>已有微信量：{wxClientCount}</span>
      )
    } else {
      return null;
    }
  }
  // 新建时不可选择今天之前的日期
  const disabledDate = (date) => {
    if (!isEdit) {
      const oDate = new Date(date)
      if (`${oDate}` === 'Invalid Date') {
        return null
      }
      return oDate && date.getTime() < Date.now() - 1000 * 60 * 60 * 24
    } else {
      return false;
    }
  }
  const createWxlist = () => {
    if (showWxlist) {
      return (
        <Row>
          <Col span={20} offset={2}>
            <Row style={{ textAlign: 'right' }}>
              <Button
                type="dashed"
                onClick={this.clearWxlist.bind(this)}
              >清空已添加的微信</Button>
            </Row>
            <Table
              columns={this.handleColumes()}
              dataSource={wxClients}
              pagination={{
                total: wxClients.length,
                current,
                pageSize: 5,
              }}
              onChange={this.handlePageChange.bind(this)}
            />
          </Col>
        </Row>
      )
    }
    return null;
  };
  const pluginDom = () => {
    if (state.canUsePlugin) {
      return (
        <div className={styles.fw}>
          <FormItem>
            <Select
              placeholder="请选择"
              disabled={state.isEdit}
              {...getFieldProps('plugin', {
                initialValue: this.state.plugin,
              })}
            >
              <Option value="实惠">实惠</Option>
            </Select>
          </FormItem>
        </div>
      )
    }
    return null;
  }

  if (editId && !isEdit) {
    return (<Spin />);
  }
  return (
    <section>
      <Row>
        <Form>
          <FormItem
            label="公司名"
            {...gridSpan}
          >
            <Input
              placeholder="请输入公司名"
              autoComplete="off"
              {...getFieldProps('name', {
                initialValue: state.name,
                rules: [
                  { required: true, message: '请填写公司' },
                ],
              })}
            />
          </FormItem>
          <FormItem
            label="联系人"
            {...gridSpan}
            id="contactPerson"
          >
            <Input
              placeholder="请输入联系人"
              autoComplete="off"
              {...getFieldProps('contact', {
                initialValue: state.contact,
                rules: [
                  { required: true, message: '请填写联系人' },
                ],
              })}
            />
          </FormItem>
          <FormItem
            label="联系人手机"
            {...gridSpan}
            id="contactTel"
          >
            <Input
              placeholder="请输入"
              autoComplete="off"
              {...getFieldProps('contactTel', {
                initialValue: state.contactTel,
                rules: [{ required: true, message: '联系人手机必填' },
                  { pattern: regExp.mobile, message: '请输入正确的格式' },
                ],
              })}
            />
          </FormItem>
          <FormItem
            label="邮箱"
            {...gridSpan}
            id="email"
          >
            <Input
              placeholder="请输入"
              autoComplete="off"
              {...getFieldProps('email', {
                initialValue: state.email,
                rules: [{ required: true, message: '请输入邮箱' },
                  { pattern: regExp.email, message: '请输入正确的格式' }],
              })}
            />
          </FormItem>
          <FormItem
            label="使用时间"
            {...gridSpan}
          >
            <RangePicker
              placeholder="请选择"
              disabledDate={disabledDate}
              {...getFieldProps('date', {
                initialValue: state.serverTime,
              })}
            />
          </FormItem>
          <FormItem
            label="会员管理"
            {...gridSpan}
          >
            <Checkbox
              {...getFieldProps('canShareCustomer')}
            >共享</Checkbox>
          </FormItem>
          <FormItem
            label="会员信息"
            {...gridSpan}
          >
            <CheckboxGroup
              options={plainOptions}
              {...getFieldProps('customerFields', {
                initialValue: ['基础信息'],
                rules: [
                  { required: true, type: 'array', message: '至少选择一项' },
                ],
              })}
            />
          </FormItem>
          {/*
              <FormItem label="营销模块" {...gridSpan}>
              <Checkbox
                {...getFieldProps('ecoModule')}
              >不使用</Checkbox>
            </FormItem>
          */}

          <FormItem label="数据插件" {...gridSpan}>
            <div className={styles.fl}>
              <RadioGroup
                disabled={state.isEdit}
                {...getFieldProps('canUsePlugin', {
                  initialValue: this.state.canUsePlugin ? '1' : '0',
                  onChange: this.handlePlugin.bind(this),
                })}
              >
                <Radio value="0">不使用</Radio>
                <Radio value="1">使用</Radio>
              </RadioGroup>
            </div>
            {pluginDom()}
          </FormItem>
          <FormItem label="添加微信" {...gridSpan}>
            <div className={styles.fl}>
              <Input
                placeholder="请输入微信数量"
                {...getFieldProps('wxCount', {
                  initialValue: wxCount,
                  rules: [
                    { pattern: regExp.wxcount, message: '请输入正确的数字' },
                  ],
                })}
              />
            </div>
            <Button
              style={{ marginLeft: 10 }}
              type="primary"
              onClick={this.showModal.bind(this)}
              size="default"
            >添加</Button>
            {remandMsg()}
          </FormItem>
          {/*微信列表 ，要判断是否出来*/}
          {createWxlist()}
          <Row
            style={{
              paddingTop: 15,
              borderTop: '1px dashed grey',
            }}
          >
            <Col span={21} offset={2}>
              <Button
                type="primary"
                style={{ marginRight: 10 }}
                onClick={this.handleSubmit.bind(this)}
              >
                提交
              </Button>
              <Link to="/manage/channel/list">
                <Button>取消</Button>
              </Link>
            </Col>
          </Row>
          {/*弹框模块*/}
          <Modal
            title="信息提示"
            visible={this.state.showConfirm}
            onOk={this.handleOk.bind(this)}
            onCancel={this.handleCancel.bind(this)}
            width={300}
          >
            <p className={styles.confirmBox}>
              {`是否添加 ${this.state.wxCount} 条微信`}
            </p>
          </Modal>
        </Form>
      </Row>

    </section>

  )
}
}


CreateChannel.contextTypes = {
  router: React.PropTypes.object.isRequired,
}
const mapStateToProps = ({ resources }) => {
  const { info = {} } = resources;
  return Object.assign({}, info)
}
export default connect(mapStateToProps)(Form.create({})(CreateChannel));
