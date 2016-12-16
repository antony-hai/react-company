import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Form, Row, Col, Upload, Button,
  Icon, Input, Modal, message, Spin, Select, Cascader } from 'antd';
import xFetch, { getTokenOfCSRF } from '../../services/xFetch';
import { regExp, toBase64 } from '../../services/common';
import { accountStatus } from '../../staticData'
import styles from './project.less'
import * as Actions from '../../actions'



const FormItem = Form.Item;
const createForm = Form.create;
const Option = Select.Option;
const InputGroup = Input.Group;
let singleId = '';
const RES_NAME = 'wxclients'

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
class CreateEditor extends Component {
  constructor() {
    super();
    this.state = {
      editId: null,
      isEdit: false,
      mobile: '',
      nickName: '',
      password: '',
      qrImg: '',
      qrcode: '',
      status: 1,
      index: [],
      fileList: [],
      priviewVisible: false,
      accountStatus: '1',
      mobileMsg: '',
      loginMobile: undefined,
    }
  }

  componentWillMount() {
    //去拿到所有的册子
    const payload = { wxClient_id: '' }
    this.props.dispatch(Actions.Book.getBooksAction(payload))
    const { params } = this.props;
    if (params.hasOwnProperty('id')) {
      const { id } = params
      const operate = { id, field: '' }
      this.props.dispatch(Actions.Res.getInfoAction(
        RES_NAME, operate, this.infoCallback.bind(this)
      ))
    }
  }
  infoCallback(data) {
    const { index, _id } = data;
    const singBox = { book: index.book, page: index.page, box: index.box }
    this.props.dispatch(Actions.Book.getBoxAction(singBox, this.boxCallBack))
    this.setState({
      editId: _id,
      isEdit: true,
      fileList: [
        {
          uid: Date.now(),
          name: data.qrcode,
          url: `/v1/api/qrcode/${_id}?${Date.now()}`,
          thumbUrl: `/v1/api/qrcode/${_id}?${Date.now()}`,
        },
      ],
      mobileMsg: data.mobile,
      ...data,
    });
  }
  boxCallBack(data) {
    singleId = data._id || undefined
  }
  handleSubmit(e) {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      const state = this.state;
      //显示为汉字，但是传送要变位数字
      let { status } = values;
      if (status === '正常') {
        status = 1;
      } else if (status === '被封') {
        status = 2;
      } else {
        status = parseFloat(status);
      }
      if (state.isEdit) {
        const data = { ...values, status, simCardId: singleId, _id: this.state.editId, _token: getTokenOfCSRF() }
        dispatch(Actions.Res.putAction(RES_NAME, data, this.handleSuccess.bind(this)))
      } else {
        const data = { ...values, status, simCardId: singleId, _token: getTokenOfCSRF() }
        dispatch(Actions.Res.postAction(RES_NAME, data, this.handleSuccess.bind(this)))
      }
    });
  }
  handleSuccess() {
    this.context.router.push('/manage/project/list')
  }
  handleCancelPriview() {
    this.setState({
      priviewVisible: false,
    });
  }
// 获得页数
  handleBooks(book) {
    const singBook = { book: parseFloat(book), wxClient_id: '' }
    this.props.dispatch(Actions.Book.getPagesAction(singBook, this.pagesSuccess.bind(this)))
  }
  pagesSuccess() {
    this.setState({ mobileMsg: '' })
  }
//获得格子数
  handlePages(page) {
    const { form, dispatch } = this.props;
    const values = form.getFieldsValue();
    const { books } = values;
    const singPage = {
      book: parseFloat(books),
      page: parseFloat(page),
      wxClient_id: '',
    }
    dispatch(Actions.Book.getBoxesAction(singPage, this.boxesSuccess.bind(this)))
  }
  boxesSuccess() {
    this.setState({ mobileMsg: '' })
  }
//获取post方法的id值
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
    const { mobile } = data
    this.setState({ mobileMsg: mobile })
  }
render() {
  const state = this.state;
  const { isEdit, editId, index, mobileMsg, status } = state;
  const statusText = (status) => {
    if (status === 1) {
      return '正常'
    } else if (status === 2) {
      return '被封'
    }
  }
  const { form, books, pages, boxes } = this.props;
  const { getFieldProps } = form;
  const uploadProps = {
    name: 'qrcode',
    listType: 'picture-card',
    action: '/v1/api/upload',
    fileList: state.fileList,
    data: {
      _token: getTokenOfCSRF(),
    },
    beforeUpload: file => {
      const isIMG = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isIMG) {
        message.error('只能上传 PNG 或 JPG 文件！');
      }
      return isIMG;
    },
    onChange: info => {
      let fileList = [...info.fileList];
      let qrImg = '';
      // 1. 上传列表数量的限制
      //    只显示最近上传的一个，旧的会被新的顶掉
      fileList = fileList.slice(-1);
      // 2. 读取远程路径并显示链接
      fileList = fileList.map((file) => {
        if (file.response) {
          // 组件会将 file.url 作为链接进行展示
          file.url = file.thumbUrl;
        }
        return file;
      });
      // 3. 按照服务器返回信息筛选成功上传的文件
      fileList = fileList.filter(file => {
        const { response } = file;
        if (!!response) {
          const { success, data } = response;
          if (success) {
            qrImg = data;
          } else {
            message.error(response.message, 3);
          }
          return success;
        }
        return true;
      });
      // 4.更新页面显示的图片
      this.setState({
        fileList: [...state.fileList, ...fileList].slice(-1),
        qrImg,
      });
    },
    onPreview: file => {
      this.setState({
        priviewImage: file.url,
        priviewVisible: true,
      });
    },
    onRemove: file => {
      this.setState({
        fileList: [],
        qrImg: '',
      });
    },
  };
  /** 进入编辑页面时
   *  微信信息未加载完之前，给用户一个loading的状态
   */
  if (editId && !isEdit) {
    return <Spin />;
  }

  return (
    <section>
      <Row>
        <Form>
          <Row>
            <Col span={6}>
              <FormItem
                label="手机卡选择"
                {...selectSpan}
              >
                <Select
                  placeholder="第几册"
                  {...getFieldProps('books', {
                    initialValue: index.book,
                    rules: [
                      { required: true },
                    ],
                  })}
                  onSelect={this.handleBooks.bind(this)}
                >
                  {books.map(item =>
                    <Option key={item} value={`${item}`}>{item}</Option>
                  )}
                </Select>
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                <Select
                  placeholder="第几页"
                  {...getFieldProps('pages', {
                    initialValue: index.page,
                    rules: [
                      { required: true },
                    ],
                  })}
                  onSelect={this.handlePages.bind(this)}
                >
                  {pages.map(item =>
                    <Option key={item} value={`${item}`}>{item}</Option>
                  )}
                </Select>
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem>
                <Select
                  {...getFieldProps('boxes', {
                    initialValue: index.box,
                    rules: [
                      { required: true },
                    ],
                  })}
                  placeholder="第几格"
                  onSelect={this.handleBoxes.bind(this)}
                >
                  {boxes.map(item =>
                    <Option key={item} value={`${item}`}>{item}</Option>
                  )}
                </Select>
              </FormItem>
            </Col>
            <Col span={3} className={styles.ctrlSpan}><span>{mobileMsg}</span></Col>
          </Row>
          <FormItem
            {...gridSpan}
            id="nickName"
            label="微信昵称"
          >
            <Input
              autoComplete="off"
              placeholder="请填写微信昵称"
              {...getFieldProps('nickName', {
                initialValue: state.nickName,
                rules: [
                  { required: true, message: '请填写昵称' },
                ],
              })}
            />
          </FormItem>
          <FormItem
            {...gridSpan}
            id="password"
            label="微信密码"
          >
            <Input
              autoComplete="off"
              placeholder="请填写微信密码"
              {...getFieldProps('password', {
                initialValue: state.password,
                rules: [
                  { required: true, whitespace: true, message: '请填写密码' },
                  { pattern: regExp.password, message: '微信密码的长度应为6～20个字符' },
                ],
              })}
            />
          </FormItem>
          <FormItem {...gridSpan} label="登录手机">
            <Input
              placeholder="请填写登录手机"
              {...getFieldProps('loginMobile', {
                initialValue: state.loginMobile,
              })}
            />
          </FormItem>
          <FormItem
            {...gridSpan}
            label="账号状态"
          >
            <Select
              {...getFieldProps('status', {
                initialValue: statusText(state.status),
              })}
            >
              {accountStatus.map(item =>
                <Option value={item.value} key={item.value}> {item.text}</Option>
              )}
            </Select>
          </FormItem>
          <FormItem
            {...gridSpan}
            wrapperCol={{ span: 16 }}
            label="上传二维码"
          >
            <Upload
              {...uploadProps}
            >
              <Icon
                type="plus"
                style={{ fontSize: 30, color: '#9a9a9a' }}
              />
              <p
                style={{ color: '#9a9a9a' }}
              >上传二维码</p>
            </Upload>
            <Input
              {...getFieldProps('qrImg', {
                initialValue: state.qrImg,
              })}
              type="hidden"
            />
          </FormItem>
          <Modal
            footer={null}
            style={{ textAlign: 'center' }}
            visible={this.state.priviewVisible}
            onCancel={this.handleCancelPriview.bind(this)}
          >
            <img
              alt="图片二维码"
              src={this.state.priviewImage}
              style={{ maxWidth: '80%' }}
            />
          </Modal>
          <FormItem
            {...gridSpan}
            label="或者输入二维码数据"
          >
            <Input
              {...getFieldProps('qrcode', {
                initialValue: state.qrcode,
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
              <Link to="/manage/project/list">
                <Button>取消</Button>
              </Link>
            </Col>
          </Row>
        </Form>
      </Row>
    </section>
  );
}
}

CreateEditor.contextTypes = {
  router: React.PropTypes.object.isRequired,
}
const mapStateToProps = ({ position }) => {
  return Object.assign({}, { books: [], pages: [], boxes: [], box: {} }, position)
}

export default connect(mapStateToProps)(Form.create({})(CreateEditor));
