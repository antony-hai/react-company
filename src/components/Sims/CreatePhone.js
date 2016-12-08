
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Row, Col, Form, Input, Button, message, Cascader, Select } from 'antd';
import { regExp, toBase64 } from '../../services/common';
import xFetch, { getTokenOfCSRF } from '../../services/xFetch';
import { createPhoneUrl, booksUrl } from '../../urlAddress'
import styles from './sim.less'
import * as Actions from '../../actions'


const FormItem = Form.Item;
const createForm = Form.create;
const Option = Select.Option;
let singleId = '';

const RES_NAME = 'simCards';

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
  componentWillMount() {
    const payload = { field: '/improve' }
    this.props.dispatch(Actions.Book.getBooksAction(payload))
  }
  //确认提交
  handleSubmit(e) {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((errors, values) => {
      if (!!errors) { return; }
      const state = this.state;
      const { mobile, books, pages, boxes } = values;
      const data = { ...values, _id: singleId, _token: getTokenOfCSRF() }
      this.props.dispatch(Actions.Res.putAction(
        RES_NAME, data, this.handleSuccess.bind(this)
      ))
    });
  }
  handleSuccess(data) {
    //用于后面提示成功文本显示
    this.props.dispatch({
      type: Actions.Book.GET_BOX_SUCCESS,
      payload: data,
    })
    this.context.router.push('/manage/card/success');
  }
  // 获得页数
  handleBooks(book) {
    const singBook = { book: parseFloat(book) }
    const payload = { singBook, field: '/improve' }
    this.props.dispatch(Actions.Book.getPagesAction(payload, this.pagesSuccess.bind(this)))
  }
  pagesSuccess(data) {
    this.setState({ remandMsg: '' })
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
    const payload = { singPage, field: '/improve' }
    dispatch(Actions.Book.getBoxesAction(payload, this.boxesSuccess.bind(this)))
  }
  boxesSuccess(data) {
    this.setState({ remandMsg: '' })
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
    dispatch(Actions.Book.getBoxAction(singBox, this.boxSuccess.bind(this)))
  }
  boxSuccess(data) {
    const { mobile, _id } = data;
    singleId = _id
    if (mobile && mobile !== '') {
      this.setState({ remandMsg: '此位已经录入电话号码' })
    } else {
      this.setState({ remandMsg: '' })
    }
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
