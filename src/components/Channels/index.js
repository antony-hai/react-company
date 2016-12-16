import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Spin, message, Row, Col, Button, Modal, Icon } from 'antd'
import xFetch, { getTokenOfCSRF } from '../../services/xFetch'
import { when } from '../../services/common';
import FilterBox, { handleCreateFilter, handleSubmitFilter } from '../FilterBox'
import FilterForm from './FilterForm'
import Lists from './Lists'
import AddWx from './AddWx'
import styles from '../app.less'
import * as Actions from '../../actions'

const RES_NAME = 'companies';

const thisFilter = {
  name: undefined,
  status: undefined,
};

class Channels extends Component {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
    }
  }
  componentWillMount() {
    const { dispatch, resources: { pagination } } = this.props;
    when(() => {
      dispatch({
        type: 'filter/clear',
      });
    }).then(() => {
      this.loadResource(pagination);
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

  loadResource(pagination = { current: 1 }) {
    const { filter, dispatch } = this.props;
    const { current: page = 1 } = pagination;
    dispatch(Actions.Res.getListAction({ resName: RES_NAME, filter, page }));
  }

  handleDisabled(userId, record) {
    const { dispatch } = this.props;
    const data = { _id: userId, _token: getTokenOfCSRF() }
    if (record.deleted_at) {
      dispatch(Actions.Res.optionsAction(RES_NAME, data, this.optionsSuccess))
    } else {
      dispatch(Actions.Res.deleteAction(RES_NAME, data, this.deleteSuccess))
    }
  }
  optionsSuccess() {
    message.success('启用成功', 2)
  }
  deleteSuccess() {
    message.success('禁用成功', 2)
  }
  handleAddWx(id) {
    this.setState({ modalVisible: true })
    const { dispatch } = this.props;
    const operate = { id, field: '/wxclients' }
    dispatch(Actions.Res.getInfoAction(RES_NAME, operate))
  }
  cancelAddWx() {
    this.setState({ modalVisible: false })
  }
  confirmAddWx() {
    const { singleInfo, wx_ids, dispatch } = this.props;
    const { used_id = '' } = singleInfo;
    const data = { id: used_id, wx_ids, _token: getTokenOfCSRF() }
    when(() => {
      dispatch(Actions.Res.postWxAction(RES_NAME, data))
      this.setState({ confirmLoading: true })
    }, 1500).then(() => {
      this.loadResource();
      this.setState({ modalVisible: false, confirmLoading: false })
    })
  }
  render() {
    const { loading, list, pagination } = this.props.resources;
    if (loading) {
      return <Spin />;
    }
    return (
      <section>
        <FilterBox
          createFilter={handleCreateFilter.bind(this, thisFilter)}
        >
          <FilterForm
            handleFilter={this.onSubmitFilter.bind(this)}
          />
        </FilterBox>
        <Row className={styles.anyBox}>
          <Col span={1}>
            <Link to="/manage/channel/create">
              <Button type="primary"><Icon type="plus" />新建</Button>
            </Link>
          </Col>
        </Row>
        <Lists
          dataSource={list}
          pagination={pagination}
          onChange={this.onChange.bind(this)}
          handleDisabled={this.handleDisabled.bind(this)}
          handleAddWx={this.handleAddWx.bind(this)}
        />
        <Modal
          title="配置微信"
          width={850}
          maskClosable={false}
          confirmLoading={this.state.confirmLoading}
          visible={this.state.modalVisible}
          onCancel={this.cancelAddWx.bind(this)}
          onOk={this.confirmAddWx.bind(this)}
        >
          <AddWx />
        </Modal>
      </section>
    )
  }
}

const mapStateToProps = ({ resources, filter, cardGroup }) => {
  const { info: singleInfo = {}, id_group = [] } = resources;
  return {
    resources: Object.assign({}, { list: [], pagination: {} }, resources[RES_NAME]),
    singleInfo,
    wx_ids: id_group,
    filter,
  }
}

export default connect(mapStateToProps)(Channels);
