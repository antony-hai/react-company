import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Row, Col, message } from 'antd'
import xFetch from '../../services/xFetch'
import { passwordUrl } from '../../urlAddress'
import styels from './password.less'

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};
const FormItem = Form.Item;

class Amend extends Component {
  constructor() {
    super()
    this.state = {
      newPassword: '',
    }
  }
  checkPassword(rule, value, callback) {
    const { form } = this.props;
    if(value) {
      if(value === form.getFieldValue('old_pass')) {
        callback('新密码不能和旧密码一致')
      }
      form.validateFields(['password_confirmation'], { force: true })
    }
    callback();
  }
  confirmPassword(rule, value, callback) {
    const { getFieldValue } = this.props.form
    const pas = getFieldValue('password')
    if(value && value !== pas) {
      callback()
    }
    callback();
  }
  handleSubmit(e) {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((err, values) => {
      if(!!err) {
        return
      }
      const { old_pass, password, password_confirmation } = values;
      console.log(123)
      xFetch(passwordUrl, {
        method: 'POST',
        data: {
          old_pass,
          password,
          password_confirmation,
        },
      }).then(res => {
        this.context.router.push('/system/password/success')
      }, err => {
        message.error(err)
      })
    })
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
              {...getFieldProps('password_confirmation', {
                rules: [
                  { required: true, message: '再次输入新密码' },
                  { min: 6, max: 20, message: '两次输入的密码不一致' },
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

export default Form.create({})(Amend)
