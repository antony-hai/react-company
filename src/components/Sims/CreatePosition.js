
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Form, Input, Button, message } from 'antd';
import xFetch, { getTokenOfCSRF } from '../../services/xFetch';
import { createPositionUrl } from '../../urlAddress'
import { regExp } from '../../services/common'
import styles from './sim.less'
import * as Actions from '../../actions'

const FormItem = Form.Item;
const createForm = Form.create;

const RES_NAME = 'simCards'

const gridSpan = {
  labelCol: { span: 3 },
  wrapperCol: { span: 6 },
};
const remandSpan = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
class CreatePosition extends Component {
  constructor() {
    super();
  }
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(Actions.Book.getBooksAction({ field: '' }))
  }
  //数据提交到服务器
  handleSubmit(e) {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      const data = { ...values, _token: getTokenOfCSRF() }
      dispatch(Actions.Res.postAction(RES_NAME, data, this.handleSuccess.bind(this)))
    });
  }
  handleSuccess(data) {
    message.success('创建成功', 1.5)
    this.context.router.push('/manage/card/list');
  }

  render() {
    const state = this.state;
    const { books } = this.props;
    const { form } = this.props;
    const { getFieldProps } = form;

    return (
        <section>
          <Form>
            <Row>
              <Col span={9}>
                <FormItem label="起始数" {...remandSpan}>
                  <Input
                    placeholder="请输入"
                    {...getFieldProps('startNum', {
                      rules: [
                        { required: true, message: '不能为空' },
                        { pattern: regExp.wxcount, message: '请输入非零自然数' },
                      ],
                    })}
                  />
                </FormItem>
              </Col>
              <Col span={12}>
                <span className={styles.suggess}>
                  {`已经存在${books.length}本,建议从${books.length + 1}本开始`}
                </span>
              </Col>
            </Row>
            <FormItem label="建几本" {...gridSpan}>
              <Input
                placeholder="请输入"
                {...getFieldProps('books', {
                  rules: [
                    { required: true, message: '不能为空' },
                    { pattern: regExp.wxcount, message: '请输入非零自然数' },
                  ],
                })}
              />
            </FormItem>
            <FormItem label="每册几页" {...gridSpan}>
              <Input
                placeholder="请输入"
                {...getFieldProps('pages', {
                  rules: [
                    { required: true, message: '不能为空' },
                    { pattern: regExp.bookCount, message: '请输入1-99之间的整数' },
                  ],
                })}
              />
            </FormItem>
            <FormItem label="每页几格" {...gridSpan}>
              <Input
                placeholder="请输入"
                {...getFieldProps('boxes', {
                  rules: [
                    { required: true, message: '不能为空' },
                    { pattern: regExp.bookCount, message: '请输入1-99之间的整数' },
                  ],
                })}
              />
            </FormItem>
            <Row>
              <Col span={20} offset={3}>
                <Button
                  type="primary"
                  style={{ marginRight: 10 }}
                  onClick={this.handleSubmit.bind(this)}
                >保存</Button>
                <Link to="/manage/card/list">
                  <Button>取消</Button>
                </Link>
              </Col>
            </Row>
          </Form>
        </section>
    )
  }
}

CreatePosition.contextTypes = {
  router: React.PropTypes.object.isRequired,
}
const mapStateToProps = ({ position }) => {
 return Object.assign({}, { books: [], pages: [], boxes: [] }, position)
}


export default connect(mapStateToProps)(Form.create({})(CreatePosition));
