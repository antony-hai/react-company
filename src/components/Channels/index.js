import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Spin, message, Row, Col, Button } from 'antd'
import xFetch, { getTokenOfCSRF } from '../../services/xFetch'
import { getListAction } from '../../services/resources'
import { when } from '../../services/common';
import FilterBox, { handleCreateFilter, handleSubmitFilter } from '../FilterBox'
import FilterForm from './FilterForm'
import Lists from './Lists'
import styles from '../app.less'
import { channelUrl } from '../../urlAddress'

const RES_NAME = 'companies';

const thisFilter = {
  name: undefined,
  status: undefined,
};

class Channels extends Component {
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
    dispatch(getListAction({
      resName: RES_NAME,
      filter,
      page,
    }));
  }

  handleDisabled(userId, record) {
    const { dispatch } = this.props;
    const url = `${channelUrl}/${userId}`
    if (record.deleted_at) {
      xFetch(url, {
        method: 'OPTIONS',
        data: {
          _token: getTokenOfCSRF(),
          _id: userId,
        }
      }).then(res => {
        const data = res.jsonResult.data;
        dispatch({
          type: 'api/user/disabled',
          resName: RES_NAME,
          payload: userId,
          data,
        })
        message.success('启用成功')
      },
        error => {
          message.error(error)
        }
      )
    } else {
      const method = 'DELETE';
      xFetch(url, {
        method,
        data: {
          _id: userId,
          _token: getTokenOfCSRF(),
        },
      }).then(res => {
        const data = res.jsonResult.data;
        dispatch({
          type: 'api/user/disabled',
          resName: RES_NAME,
          payload: userId,
          data,
        });
        message.success('禁用成功');
      }, error => {
        message.error(error);
      });
    }
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
              <Button type="primary">新建</Button>
            </Link>
          </Col>
        </Row>
        <Lists
          dataSource={list}
          pagination={pagination}
          onChange={this.onChange.bind(this)}
          handleDisabled={this.handleDisabled.bind(this)}
        />
      </section>
    )
  }
}

const mapStateToProps = ({ resources, filter, cardGroup }) => {
  return {
    resources: Object.assign({}, { list: [], pagination: {} }, resources[RES_NAME]),
    filter,
  }
}

export default connect(mapStateToProps)(Channels);
