
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Form, Input, Button, message, Cascader, Select } from 'antd';
import { regExp, toBase64 } from '../../services/common';
import xFetch, { getTokenOfCSRF } from '../../services/xFetch';
import { createPhoneUrl, booksUrl } from '../../urlAddress'
import styles from './sim.less'


const FormItem = Form.Item;
const createForm = Form.create;
const Option = Select.Option;
let singleId = ''; //用来接后面返回的id

const gridSpan = {
  labelCol: {
    xs: 6,
    sm: 5,
    md: 3,
  },
  wrapperCol: { span: 6 },
};
const selectSpan = {
  labelCol: { span: 12 },
  wrapperCol: { span: 12 },
}
class CreatePhone extends Component {
  constructor() {
    super()
    this.state = {
      pages: [],
      boxes: [],
      remandMsg: '',
    }
  }
  //确认提交
  handleSubmit(e) {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      const state = this.state;
      const { mobile, books, pages, boxes } = values;
      let url = `${createPhoneUrl}/${singleId}`;
      let method = 'PUT';

      xFetch(url, {
        method,
        data: {
          ...values,
          _token: getTokenOfCSRF(),
        },
      }).then(res => {
        this.props.dispatch({
          type: 'createPhone/success',
          data: { books, pages, boxes, mobile },
        })
        this.context.router.push('/manage/card/success');
      }, error => {
        message.error(error);
      });
    });
  }
    // 获得页数
  handleBooks(book) {
    const singBook = { book: parseFloat(book) }
    const bookString = toBase64(singBook)
    const { dispatch } = this.props;
    const url = `${booksUrl}/pages?f=${bookString}`;
    xFetch(url).then(res => {
      const pages = res.jsonResult.data.data
      this.setState({
        remandMsg: '',
      })
      dispatch({
        type: 'pages/get',
        payload: pages,
      })
    },
    error => {
      message.error(error)
    })
  }
  //获得格子数
  handlePages(page) {
    const { form, dispatch } = this.props;
    const values = form.getFieldsValue();
    const { books } = values;
    const singPage = {
      book: parseFloat(books),
      page: parseFloat(page),
    }
    const pageString = toBase64(singPage)
    const url = `${booksUrl}/boxes?f=${pageString}`;
    xFetch(url)
      .then(res => {
        const boxes = res.jsonResult.data.data;
        this.setState({ remandMsg: '' })
        dispatch({
          type: 'boxes/get',
          payload: boxes,
        })
      },
      error => {
        message.error(error);
      }
      )
  }
  //获取PUT方法的id值
  handleBoxes(box) {
    const { form, dispatch } = this.props;
    const values = form.getFieldsValue();
    const { books, pages } = values;
    const singBox = {
      book: parseFloat(books),
      page: parseFloat(pages),
      box: parseFloat(box),
    }
    const boxString = toBase64(singBox)
    const url = `${booksUrl}/box?f=${boxString}`;
    xFetch(url).then(res => {
      singleId = res.jsonResult.data._id;
      const { mobile } = res.jsonResult.data
      if (mobile && mobile !== '') {
        this.setState({ remandMsg: '此位已经录入电话号码' })
      } else {
        this.setState({ remandMsg: '' })
      }
      dispatch({
        type: 'box/get',
        payload: res.jsonResult.data,
      })
    },
      error => {
        message.error(error)
      }
    )
  }
  render() {
    const { form, share, errors, books, pages, boxes } = this.props;
    const { getFieldProps, getFieldValue } = form;
    const { remandMsg } = this.state;
    return (
      <section>
        <Row>
          <Form>
            <FormItem
              label="电话号码"
              {...gridSpan}
            >
              <Input
                placeholder="请输入"
                {...getFieldProps('mobile', {
                  rules: [
                    { required: true, message: '请输入手机号' },
                    { pattern: regExp.mobile, message: '手机格式错误'}
                  ],
                })}
              />
            </FormItem>
             <Row>
              <Col span={6}>
                <FormItem
                  label="sim卡存放位"
                  {...selectSpan}
                >
                  <Select
                    placeholder="第几册"
                    {...getFieldProps('books', {
                      rules: [
                        { required: true },
                      ],
                    })}
                    onSelect={this.handleBooks.bind(this)}
                  >
                  {books.map(value => {
                    return (
                      <Option value={`${value}`} key={value}>{value}</Option>
                    )
                  })}
                  </Select>
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  <Select
                    placeholder="第几页"
                    {...getFieldProps('pages', {
                      rules: [
                        { required: true },
                      ],
                    })}
                    onSelect={this.handlePages.bind(this)}
                  >
                  {pages.map(value => {
                    return (
                      <Option value={`${value}`} key={value}>{value}</Option>
                    )
                  })}
                  </Select>
                </FormItem>
              </Col>
              <Col span={3}>
                <FormItem>
                  <Select
                    {...getFieldProps('boxes', {
                      rules: [
                        { required: true },
                      ],
                    })}
                    placeholder="第几格"
                    onSelect={this.handleBoxes.bind(this)}
                  >
                  {boxes.map(value => {
                    return (
                      <Option value={`${value}`} key={value}>{value}</Option>
                    )
                  })}
                  </Select>
                </FormItem>
              </Col>
              <Col span={3} className={styles.ctrlSpan}><span>{remandMsg}</span></Col>
            </Row>
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
        </Row>
      </section>
    )
  }
}

CreatePhone.contextTypes = {
  router: React.PropTypes.object.isRequired,
}

const mapStateToProps = ({ position }) => {
 return Object.assign({}, { books: [], pages: [], boxes: [], box: {} }, position)
}

export default connect(mapStateToProps)(Form.create({})(CreatePhone)) ;
