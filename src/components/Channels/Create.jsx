import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Form, Input, Button, Select, TreeSelect, message,
  DatePicker, Checkbox, RadioModal, Table, Radio, Modal } from 'antd';
import { regExp, changeDate, toBase64, indexCache } from '../../services/common';
import styles from './channel.less';
import xFetch, { getTokenOfCSRF } from '../../services/xFetch';
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
      name: '',
      contact: '',
      contactTel: '',
      serverTime: [],
      email: '',
      password: '',
      alias: undefined,
      canUsePlugin: false,
      plugin: undefined,
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
    const { options, _id } = data;
    const { canUsePlugin = false, plugins } = options;
    let plugin;
    if (Array.isArray(plugins) && plugins.length !== 0) {
      plugin = plugins[0]
    } else {
      plugin = undefined;
    }
    let serverTime = [];
    if (data.startDate && data.endDate) {
      serverTime = [changeDate(data.startDate), changeDate(data.endDate)]
    }
    this.setState({
      editId: _id,
      isEdit: true,
      ...data,
      serverTime,
      canUsePlugin,
      plugin,
    });
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
      let data = { ...values, startDate, endDate, options, _token: getTokenOfCSRF() }
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
    const { editId, isEdit } = state;
    const { form, share, errors } = this.props;
    const { getFieldProps, getFieldValue, initialValue } = form;

  // 新建时不可选择今天之前的日期
    const disabledDate = (date) => {
      if (!isEdit) {
        const oDate = new Date(date)
        if (`${oDate}` === 'Invalid Date') {
          return null
        }
        return oDate && date.getTime() < Date.now() - 1000 * 60 * 60 * 24
      }
      return false;
    }
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
          <FormItem label="别名" {...gridSpan}>
            <Input
              placeholder="请输入"
              {...getFieldProps('alias', {
                initialValue: state.alias,
                rules: [{ required: true, message: '请输入别名' },
                  { pattern: regExp.alias, message: '请输入以字母开头的数字字母组合' },
                ],
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
