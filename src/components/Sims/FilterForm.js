import React, { Component, PropTypes } from 'react';
import { Form, Input, Button, Row, Col, Select, Cascaderm, message } from 'antd';
import styles from '../app.less';
import { connect } from 'react-redux';
import { toBase64 } from '../../services/common.js'
import { booksUrl } from '../../urlAddress'
import xFetch, { getTokenOfCSRF } from '../../services/xFetch'

const Option = Select.Option;
const selectSpan = {
  wrapperCol: { span: 16 },
  labelCol: { span: 8 },
  className: styles.formItemBox,
}
const selectSpan2 = {
  wrapperCol: { span: 24 },
  labelCol: { span: 0 },
  className: styles.formItemBox,
}
const gridSpan = {
  wrapperCol: { span: 14 },
  labelCol: { span: 4 },
  className: styles.formItemBox,
};
const ColSpan = 10;

const FormItem = Form.Item;

class FilterForm extends Component {
  constructor(props) {
    super()
    this.state = {
      pages1: [],
      boxes1: [],
      pages2: [],
      boxes2: [],
    }
  }
  getFromBook(num) {
    if (!num) {
      return undefined
    }
    const start = Math.floor(num / 10000)
    if (start < 10) {
      return `000${start}`
    } else if (10 <= start < 100) {
      return `00${start}`
    } else if (100 <= start < 1000) {
      return `0${start}`
    } else {
      return `${start}`
    }
  }
  getFromPage(num) {
    if (!num) {
      return undefined
    }
    const start = Math.floor(num % 10000 / 100)
    return start > 9 ? `${start}` : `0${start}`
  }
  getFromBox(num) {
    if (!num) {
      return undefined
    }
    const start = num % 100;
    return start > 9 ? `${start}` : `0${start}`
  }
   //获得页数
  handleBooks1(book) {
    const singBook = { book: parseFloat(book) }
    const bookString = toBase64(singBook)
    const { dispatch } = this.props;
    const url = `${booksUrl}/pages?f=${bookString}`;
    xFetch(url).then(res => {
      const pages = res.jsonResult.data.data
      const list = pages.map(item => {
        return item < 10 ? `0${item}` : item
      })
      this.setState({
        pages1: list,
      })
    },
    error => {
      message.error(error)
    })
  }
  handleBooks2(book) {
    const singBook = { book: parseFloat(book) }
    const bookString = toBase64(singBook)
    const { dispatch } = this.props;
    const url = `${booksUrl}/pages?f=${bookString}`;
    xFetch(url).then(res => {
      const pages = res.jsonResult.data.data
      const list = pages.map(item => {
        return item < 10 ? `0${item}` : item
      })
      this.setState({
        pages2: list,
      })
    },
      error => {
        message.error(error)
      })
  }
  //获得格子数
  handlePages1(page) {
    const { form, dispatch } = this.props;
    const values = form.getFieldsValue();
    const { fromBooks } = values;
    const singPage = {
      book: parseFloat(fromBooks),
      page: parseFloat(page),
    }
    const pageString = toBase64(singPage)
    const url = `${booksUrl}/boxes?f=${pageString}`;
    xFetch(url)
      .then(res => {
        const boxes = res.jsonResult.data.data;
        const list = boxes.map(item => {
          return item < 10 ? `0${item}` : item
        })
        this.setState({
          boxes1: list,
        })
      },
      error => {
        message.error(error);
      }
      )
  }
  handlePages2(page) {
    const { form, dispatch } = this.props;
    const values = form.getFieldsValue();
    const { toBooks } = values;
    const singPage = {
      book: parseFloat(toBooks),
      page: parseFloat(page),
    }
    const pageString = toBase64(singPage)
    const url = `${booksUrl}/boxes?f=${pageString}`;
    xFetch(url)
      .then(res => {
        const boxes = res.jsonResult.data.data;
        const list = boxes.map(item => {
          return item < 10 ? `0${item}` : item
        })
        this.setState({
          boxes2: list,
        })
      },
      error => {
        message.error(error);
      }
      )
  }
  render() {
    const { form, handleFilter, handleClear, filter = {}, position = {}, resources: { list } } = this.props
    const { books } = position
    const { pages1, pages2, boxes1, boxes2 } = this.state
    const { getFieldProps, resetFields, validateFields, setFieldsValue } = form;
    const { index = [] } = filter;
    const [fromBook, toBook] = [this.getFromBook(index[0]), this.getFromBook(index[1])];
    const [fromPage, toPage] = [this.getFromPage(index[0]), this.getFromPage(index[1])];
    const [fromBox, toBox] = [this.getFromBox(index[0]), this.getFromBox(index[1])];
    const companyName = [];
    const companyObj = {};
    list.forEach(item => {
      if (item.companyName !== '') {
        if (!companyObj[item.companyName]) {
          companyObj[item.companyName] = 1
          companyName.push(item.companyName)
        }
      }
    })
    const onCancel = () => {
      handleClear();
      resetFields();
    }
    const onSubmit = () => {
      validateFields((errors, values) => {
        const { fromBooks, toBooks, fromPages, toPages,
           fromBoxes, toBoxes, company, mobile } = values;
        let index;
        if (fromBooks === undefined || toBooks === undefined || fromPages === undefined
          || toPages === undefined || fromBooks === undefined || toBooks === undefined
        ) {
          index = undefined;
        } else {
          index = [parseFloat(`${parseFloat(fromBooks)}${fromPages}${fromBoxes}`),
          parseFloat(`${parseFloat(toBooks)}${toPages}${toBoxes}`)]
        }
        const makting = { company, mobile, index }
        handleFilter(makting);
      });
    };
    return (
      <Form inline>
        <Row type="flex">
          <Col span={ColSpan}>
            <FormItem
              label="手机号"
              {...gridSpan}
            >
              <Input
                placeholder="请输入"
                {...getFieldProps('mobile')}
              />
            </FormItem>
          </Col>
          <Col span={ColSpan}>
            <FormItem
              id="channelFrom"
              label="所属渠道"
              {...gridSpan}
            >
              <Select
                placeholder="请选择"
                combobox
                {...getFieldProps('company')}
              >
               {companyName.map((item) => {
                 return <Option key={item} >{item}</Option>
               })}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={5}>
            <FormItem
              label="卡位柜"
              {...selectSpan}
            >
              <Select
                placeholder="第几册"
                {...getFieldProps('fromBooks', {
                  initialValue: fromBook,
                })}
                onSelect={this.handleBooks1.bind(this)}
              >
                {books.map(value =>
                  <Option value={`${value}`} key={value}>{value}</Option>
                )}
              </Select>
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem
              {...selectSpan2}
            >
              <Select
                placeholder="第几页"
                {...getFieldProps('fromPages', {
                  initialValue: fromPage,
                })}
                onSelect={this.handlePages1.bind(this)}
              >
                {pages1.map(value =>
                  <Option value={`${value}`} key={value}>{value}</Option>
                )}
              </Select>
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem
              {...selectSpan2}
            >
              <Select
                placeholder="第几格"
                {...getFieldProps('fromBoxes', {
                  initialValue: fromBox,
                })}
              >
                {boxes1.map(value =>
                  <Option value={`${value}`} key={value}>{value}</Option>
                )}
              </Select>
            </FormItem>
          </Col>
          <Col span={5}>
            <FormItem
              label="至"
              {...selectSpan}
            >
              <Select
                placeholder="第几册"
                {...getFieldProps('toBooks', {
                  initialValue: toBook,
                })}
                onSelect={this.handleBooks2.bind(this)}
              >
                {books.map(value =>
                  <Option value={`${value}`} key={value}>{value}</Option>
                )}
              </Select>
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem
              {...selectSpan2}
            >
              <Select
                placeholder="第几页"
                {...getFieldProps('toPages', {
                  initialValue: toPage,
                })}
                onSelect={this.handlePages2.bind(this)}
              >
                {pages2.map(value =>
                  <Option value={`${value}`} key={value}>{value}</Option>
                )}
              </Select>
            </FormItem>
          </Col>
          <Col span={3}>
            <FormItem
              {...selectSpan2}
            >
              <Select
                placeholder="第几格"
                {...getFieldProps('toBoxes', {
                  initialValue: toBox,
                })}
              >
                {boxes2.map(value =>
                  <Option value={`${value}`} key={value}>{value}</Option>
                )}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <br />
        <Row
          style={{ textAlign: 'right' }}
        >
          <Col span={24}>
            <Button
              type="primary"
              icon="search"
              style={{ marginRight: 10 }}
              onClick={() => onSubmit()}
            >搜索</Button>
            <Button
              onClick={() => onCancel()}
            >清除条件</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}

const mapStateToProps = ({ filter, position, resources }) => {
  return {
    filter: Object.assign({}, { index: [] }, filter),
    position: Object.assign({}, { books: [], pages: [], boxes: [] }, position),
    resources: Object.assign({}, { list: [], pagination: {} }, resources.simCards),
  }
}

FilterForm.propTypese = {};

export default connect(mapStateToProps)(FilterForm);
