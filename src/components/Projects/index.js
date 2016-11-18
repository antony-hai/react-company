import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Spin, message, Row, Col, Button } from 'antd'
import xFetch, { getTokenOfCSRF } from '../../services/xFetch'
import { getListAction } from '../../services/resources'
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

  onChange(pagination) {
    this.loadResource(pagination);
  }

  onSubmitFilter(filters) {
    const { dispatch } = this.props;
    when(() => {
      dispatch(
        handleSubmitFilter(filters)
      );
    }).then(() => {
      this.loadResource();
    });
  }
  handleReset() {
    const { dispatch } = this.props;
    dispatch(
      handleSubmitFilter(thisFilter)
    );
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
      //alert('nima')
    }
  }

  loadResource(pagination = { current: 1 }) {
    const { filter, dispatch } = this.props;
    const { current: page = 1 } = pagination;
    dispatch(getListAction({
      resName: RES_NAME,
      filter,
      page,
    }));
  }

  getProjects() {
    const { dispatch } = this.props;
    const filter = {};
    const page = 0;
    dispatch(getListAction({
      resName: RES_PROJECT,
      filter,
      page,
    }));
  }

  //清除uin
  handleUIN(wxid) {
    const { dispatch } = this.props;
    const url = `${projectUrl}/${wxid}`;
    const method = 'PATCH';
    xFetch(url, {
      method: method,
      data: {
        user_id: wxid,
        uin: 0,
        _token: getTokenOfCSRF(),
      },
    }).then(res => {
      const data = res.jsonResult.data;
      dispatch({
        type: 'api/clearUIN',
        resName: RES_NAME,
        payload: wxid,
        data,
      });
      message.success('清uin成功');
    }, error => {
      message.error(error);
    });
  }
  //更新   todo 接口暂时没好
  handleUpdate(wxid) {
    const { dispatch } = this.props;
    const url = `${projectUrl}/${wxid}`;
    xFetch(url).then(res => {
      const data = res.jsonResult.data;
      dispatch({
        type: 'api/wx/update',
        resName: RES_NAME,
        payload: wxid,
        data,
      });
      message.success('更新成功');
    }, error => {
      message.error(error);
    });
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
