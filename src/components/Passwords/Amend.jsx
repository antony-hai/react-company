import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Row, Col, message } from 'antd'
import xFetch, { getTokenOfCSRF } from '../../services/xFetch'
import { passwordUrl } from '../../urlAddress'
import styels from './password.less'
import * as Actions from '../../actions'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const FormItem = Form.Item;
const RES_NAME = 'auth/password/modify';


class Amend extends Component {
  checkPassword(rule, value, callback) {
    const { form } = this.props;
    if (value) {
      if (value === form.getFieldValue('old_pass')) {
        callback('新密码不能和旧密码一致')
      }
      form.validateFields(['password_confirmation'], { force: true })
    }
    callback();
  }
  confirmPassword(rule, value, callback) {
    const { getFieldValue } = this.props.form
    const password = getFieldValue('password')
    if (value && value !== password) {
      callback('两次输入的密码不一致')
    } else {
      callback();
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((err, values) => {
      if (!!err) { return }
      const data = { ...values, _token: getTokenOfCSRF() }
      this.props.dispatch(Actions.Res.postAction(
        RES_NAME, data, this.handleSuccess.bind(this)
        ))
    })
  }
  handleSuccess() {
    this.context.router.push('/system/password/success')
  }
  handelReset() {
    this.props.form.resetFields();
  }
  handle
  render() {
    const { getFieldProps, getFieldValue } = this.props.form
    return (
      <section className={styels.outerBox}>
        <Form>
          <FormItem
            {...formItemLayout}
            label="原密码"
          >
            <Input
              placeholder="请输入原密码"
              type="password"
              {...getFieldProps('old_pass', {
                rules: [
                  { required: true, message: '请输入原密码' },
                  { min: 6, max: 20, message: '密码应为6～20个字符' },
                ],
              })}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="新密码"
          >
            <Input
              placeholder="请输入新密码"
              type="password"
              {...getFieldProps('password', {
                rules: [
                  { required: true, message: '请输入新密码' },
                  { min: 6, max: 20, message: '密码应为6～20个字符' },
                  { validator: this.checkPassword.bind(this) },
                ],
              })}
            />
          </FormItem>
          <FormItem
            {...formItemLayout}
            label="确认密码"
          >
            <Input
              placeholder="再次输入新密码"
              type="password"
              {...getFieldProps('password_confirmation', {
                rules: [
                  { required: true, message: '再次输入新密码' },
                  { validator: this.confirmPassword.bind(this) },
                ],
              })}
            />
          </FormItem>
          <Row >
            <Col span={12} offset={6}>
              <Button
                type="primary"
                style={{ marginRight: 10 }}
                onClick={this.handleSubmit.bind(this)}
              >确认</Button>
              <Button type="ghost" onClick={this.handelReset.bind(this)}>重置</Button>
            </Col>
          </Row>
        </Form>
      </section>
    )
  }
}


Amend.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

export default connect()(Form.create({})(Amend))
