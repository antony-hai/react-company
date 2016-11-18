import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Form, Row, Col, Upload, Button, 
  Icon, Input, Modal, message, Spin, Select, Cascader } from 'antd';
import xFetch, { getTokenOfCSRF } from '../../services/xFetch';
import { regExp, toBase64 } from '../../services/common';
import { accountStatus } from '../../staticData'
import styles from './project.less'
import { projectUrl, booksUrl } from '../../urlAddress'



const FormItem = Form.Item;
const createForm = Form.create;
const Option = Select.Option;
const InputGroup = Input.Group;
let singleId = '';

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
      loginStatus: true,
      mobileMsg: '',
    }
  }

  componentWillMount() {
    const { params } = this.props;
    if (params.hasOwnProperty('id')) {
      const { id } = params
      this.getWxInfo(id)
    }
  }

  getWxInfo(wxid) {
    xFetch(`${projectUrl}/${wxid}`)
      .then(res => {
        const { data } = res.jsonResult;
        const { index } = data;
        const singBox = { book: index.book, page: index.page, box: index.box }
        const boxString = toBase64(singBox)
        xFetch(`${booksUrl}/box?f=${boxString}`)
        .then(res => {
          singleId = res.jsonResult.data._id;
        }, error => {
          this.context.router.push('/manage/project/create')
        })
        this.setState({
          editId: wxid,
          isEdit: true,
          fileList: [
            {
              uid: Date.now(),
              name: data.qrcode,
              url: `/v1/api/qrcode/${wxid}?${Date.now()}`,
              thumbUrl: `/v1/api/qrcode/${wxid}?${Date.now()}`,
            },
          ],
          mobileMsg: data.mobile,
          ...data,
        }); 
      }, 
      error => {
        this.context.router.push('/manage/project/create')
      })
  }

  handleSubmit(e) {
    e.preventDefault();
    const form = this.props.form;
    form.validateFields((errors, values) => {
      if (!!errors) {
        return;
      }
      const state = this.state;
      let url = projectUrl;
      let method = 'POST';
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
        url += `/${state.editId}`;
        method = 'PUT';
      }
      xFetch(url, {
        method,
        data: {
          ...values,
          status,
          simCardId: singleId,
          _token: getTokenOfCSRF(),
        },
      }).then(res => {
        this.context.router.push('/manage/project/list');
      }, error => {
        message.error(error);
      });
    });
  }
  handleCancelPriview() {
    this.setState({
      priviewVisible: false,
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
        mobileMsg: '',
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
      this.setState({ mobileMsg: '' })
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
    const boxString = toBase64(singBox)
    const url = `${booksUrl}/box?f=${boxString}`;
    xFetch(url).then(res => {
      const { mobile, hasWxClient } = res.jsonResult.data
      if (hasWxClient) {
        this.setState({ mobileMsg: '此号码已创建微信' })
      } else {
        if (mobile !== '' ) {
          this.setState({ mobileMsg: mobile })
          singleId = res.jsonResult.data._id;
        } else {
          this.setState({ mobileMsg: '此位置还未绑定号码' })
        }
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
          // message.error('图片太大或格式错误！', 3);
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
              <Input {...getFieldProps('qrcode', {
                initialValue: state.qrcode,
              })} />
            </FormItem>
            <Row>
              <Col span={20} offset={4}>
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

export default connect(mapStateToProps)(Form.create({})(CreateEditor)) ;
