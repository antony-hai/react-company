
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Form, Input, Button, Select,
  TreeSelect, message, DatePicker, Checkbox, Radio, Modal } from 'antd';
import xFetch, { getTokenOfCSRF } from '../../services/xFetch';
import { createPositionUrl } from '../../urlAddress'
import { regExp } from '../../services/common'
import styles from './sim.less'

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const createForm = Form.create;
const Option = Select.Option;
const gridSpan = {
  labelCol: {
    xs: 5,
    sm: 4,
    md: 3,
  },
  wrapperCol: { span: 6 },
};

class CreatePosition extends Component {
  constructor() {
    super();
    this.state = {
      editId: null,
      isEdit: false,
      startNum: '',
      books: '',
      pages: '',
      boxes: '',
      storeAt: null,
      loginStatus: true,
    }
  }
  //数据提交到服务器
  handleSubmit(e) {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      const state = this.state;
      let url = createPositionUrl;
      let method = 'POST';
      xFetch(url, {
        method,
        data: {
          ...values,
          _token: getTokenOfCSRF(),
        },
      }).then(res => {
        dispatch({
          type: 'books/get',
        });
        message.success('创建成功');
        this.context.router.push('/manage/card/list');
      }, error => {
        message.error(error);
      });
    });
  }

  render() {
    const state = this.state;
    const { books } = this.props;
    const { form } = this.props;
    const { getFieldProps } = form;

    return (
        <section>
          <Form>
            <FormItem
              label="起始数"
              {...gridSpan}
            >
              <Input
                placeholder="请输入"
                {...getFieldProps('startNum', {
                  rules: [
                    { required: true, message: '不能为空' },
                    { pattern: regExp.wxcount, message: '请输入非零自然数' },
                  ],
                })}
              />
              <span className={styles.suggess}>{`已经存在${books.length}本,建议从${books.length+1}本开始`}</span>
            </FormItem>
            <FormItem
              label="建几本"
              {...gridSpan}
            >
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
            <FormItem
              label="每册几页"
              {...gridSpan}
            >
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
            <FormItem
              label="每页几格"
              {...gridSpan}
            >
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
 return Object.assign({}, { books: [], pages: [], boxes: [], }, position)
}


export default connect(mapStateToProps)(Form.create({})(CreatePosition));
