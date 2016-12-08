import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Spin, message, Row, Col, Button, Modal } from 'antd'
import xFetch, { getTokenOfCSRF } from '../../services/xFetch'
import { Res as Actions } from '../../actions'
import { when } from '../../services/common';
import Editor, { EDITOR_OPEN, EDITOR_CANCEL } from '../EditorModal';
import FilterBox, { handleCreateFilter, handleSubmitFilter } from '../FilterBox'
import FilterForm from './FilterForm'
import Lists from './Lists'
import styles from '../app.less'
import Login from './Login'
import { projectUrl } from '../../urlAddress'

const RES_NAME = 'wxclients';
const RES_PROJECT = 'projects';

const thisFilter = {
  baseInfo: undefined,
  project_id: undefined,
  loginStatus: undefined,
  status: undefined,
};

class Projects extends Component {
  constructor() {
    super();
    this.eventSource = null
    this.state = {
      modalVisible: false,
      uin_id: '',
      list: [],
      loginData: { // 当前微信帐号的信息
        qrcode: '', // 二维码图片地址
        status: 100, // 二维码获取中：100，获取成功: 101, 扫码成功: 102, 登录成功: 103
      },
    };
  }
  componentWillMount() {
    const { dispatch, resources: { pagination } } = this.props;
    when(() => {
      dispatch({
        type: 'filter/clear',
      });
    }).then(() => {
      this.loadResource(pagination);
      this.getProjects()
    });
  }
  //分页函数
  onChange(pagination) {
    this.loadResource(pagination);
  }
  //筛选函数
  onSubmitFilter(filters) {
    const { dispatch } = this.props;
    when(() => {
      dispatch(handleSubmitFilter(filters));
    }).then(() => {
      this.loadResource();
    });
  }
  //重置函数
  handleReset() {
    const { dispatch } = this.props;
    dispatch(handleSubmitFilter(thisFilter));
  }
  // 二维码获取成功
  getQrcodeSuccess(uuid) {
    const { resources: { loginData } } = this.props;
    this.setState({
      loginData: {
        ...loginData,
        qrcode: `/v1/api/loginQrcode/${uuid}`, // 二维码图片地址
        status: 101, // 二维码获取中：100，获取成功: 101, 扫码成功: 102, 登录成功: 103
      },
    });
  }
// 扫码成功
  scanQrcodeSuccess() {
    const { resources: { loginData } } = this.props;
    this.setState({
      loginData: {
        status: 102,
      },
    });
  }
  // 登录成功
  loginSuccess(status) {
    const { resources: { loginData }, dispatch } = this.props;
    const { id } = loginData;
    dispatch({
      type: 'api/wxclient/login/success',
      resName: RES_NAME,
      payload: id,
    });
    this.setState({
      loginData: {
        ...loginData,
        status,
      },
    });
  }
  // 打开二维码登陆窗口
  loginModal(loginData = {}) {
    const { dispatch } = this.props;
    const { _id } = loginData;
    dispatch({
      type: EDITOR_OPEN,
      payload: '登录微信服务号',
    });
    dispatch({
      type: 'api/wxclient/login',
      resName: RES_NAME,
      payload: loginData,
    });
    this.setState({
      loginData: {
        ...loginData,
        status: 100,
      },
    });
  }

  handleOpenEss() {
    try {
      if (this.eventSource === null) {
        this.eventSource = new EventSource(
          `/v1/mapp/loginClient/${this.state.loginData._id}`,
          { withCredentials: true })
        this.eventSource.onmessage = (e) => {
          const { data, lastEventId } = e
          const status = +lastEventId
          switch (status) {
            case 100:
              break;
            case 101:
              this.getQrcodeSuccess(data.trim());
              break;
            case 102:
              this.scanQrcodeSuccess();
              break;
            case 103:
            default:
              if (status > 10000) {
                this.eventSource.close()
                this.loginSuccess(status);
              }
              break;
          }
        }
      }
    } catch (err) {

    }
  }

  handleCloseEss() {
    if (this.eventSource !== null) {
      this.eventSource.close()
      this.eventSource = null
    }
  }
  //整个列表资源
  loadResource(pagination = { current: 1 }) {
    const { filter, dispatch } = this.props;
    const { current: page = 1 } = pagination;
    dispatch(Actions.getListAction({ resName: RES_NAME, filter, page }));
  }
  getProjects() {
    const { dispatch } = this.props;
    const filter = {};
    const page = 0;
    dispatch(Actions.getListAction({ resName: RES_PROJECT, filter, page }));
  }

  //清除uin
  handleUIN(wxid) {
    this.setState({ modalVisible: true, uin_id: wxid })
  }
  UINSuccess() {
    message.success('清uin成功', 2)
  }
  modalOk() {
    this.setState({ modalVisible: false })
    const { dispatch } = this.props;
    const { uin_id } = this.state;
    const payload = { _id: uin_id, field: '/clearUin', uin: 0, _token: getTokenOfCSRF() }
    dispatch(Actions.putAction(RES_NAME, payload, this.UINSuccess))
  }
  modalCancel() {
    this.setState({ modalVisible: false })
  }
  //更新
  handleUpdate(wxid) {
    const { dispatch } = this.props;
    const operate = { id: wxid, field: '/loginStatus' }
    dispatch(Actions.getInfoAction(RES_NAME, operate, this.updateSuccess))
  }
  updateSuccess(data) {
    message.success('更新成功', 2)
  }
  //清除   todo 接口暂时没弄好
  handleClear(wxid) {
    const url = `${projectUrl}/${wxid}/clear`;
    xFetch(url).then(res => {
      message.success('清除成功');
    },
    error => {
      message.error(error);
    })
  }

  render() {
    const { projects = {}, resources = {}, filter = {} } = this.props
    const { loading, list, pagination } = resources;
    if (loading) {
      return <Spin />;
    }
    return (
      <section>
        <FilterBox
          createFilter={handleCreateFilter.bind(this, thisFilter)}
        >
          <FilterForm
            filter={filter}
            handleFilter={this.onSubmitFilter.bind(this)}
            dataSource={projects.list}
            handleReset={this.handleReset.bind(this)}
          />
        </FilterBox>
        <Row className={styles.anyBox}>
          <Col span={1}>
            <Link to="/manage/project/create">
              <Button type="primary">新建</Button>
            </Link>
          </Col>
        </Row>
        <Lists
          dataSource={list}
          pagination={pagination}
          onChange={this.onChange.bind(this)}
          loginModal={this.loginModal.bind(this)}
          handleUIN={this.handleUIN.bind(this)}
          handleClear={this.handleClear.bind(this)}
          handleUpdate={this.handleUpdate.bind(this)}
        />
        <Editor width={270} handleClose={this.handleCloseEss.bind(this)}>
          <Login
            loginData={this.state.loginData}
            handleOpenEss={this.handleOpenEss.bind(this)}
            handleCloseEss={this.handleCloseEss.bind(this)}
          />
        </Editor>
        <Modal
          visible={this.state.modalVisible}
          onOk={this.modalOk.bind(this)}
          onCancel={this.modalCancel.bind(this)}
          confirmLoading={this.state.confirmLoading}
          title="提示"
          width={300}
        >
          <p>确定清除uin吗？</p>
        </Modal>
      </section>
    )
  }
}



const mapStateToProps = ({ resources, filter }) => {
  return {
    resources: Object.assign({}, { list: [], pagination: {} }, resources[RES_NAME]),
    projects: Object.assign({}, { list: [], pagination: {} }, resources[RES_PROJECT]),
    filter,
  }
}

export default connect(mapStateToProps)(Projects);
