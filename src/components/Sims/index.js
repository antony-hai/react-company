import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Spin, message, Row, Col, Button, Icon } from 'antd'
import xFetch, { getTokenOfCSRF } from '../../services/xFetch'
import { when, toBase64 } from '../../services/common';
import FilterBox, { handleCreateFilter, handleSubmitFilter } from '../FilterBox'
import FilterForm from './FilterForm'
import Lists from './Lists'
import styles from '../app.less'
import * as Actions from '../../actions'


const RES_NAME = 'simCards';
const ButtonGroup = Button.Group;
const thisFilter = {
  company: undefined,
  mobile: undefined,
  index: undefined,
};

class Sims extends Component {
  constructor() {
    super()
    this.state = {
      pages: [],
      boxes: [],
    }
  }
  componentWillMount() {
    const { dispatch, resources: { pagination } } = this.props;
    dispatch(Actions.Book.getBooksAction({ field: '' }))
    when(() => {
      dispatch({ type: 'filter/clear' });
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
      dispatch(handleSubmitFilter(filters));
    }).then(() => {
      this.loadResource();
    });
  }

  onClearFilter() {
    const { dispatch } = this.props;
    dispatch(handleSubmitFilter(thisFilter));
  }

  //重新加载页面
  loadResource(pagination = { current: 1 }) {
    const { filter, dispatch } = this.props;
    const { current: page = 1 } = pagination;
    dispatch(Actions.Res.getListAction({
      resName: RES_NAME, filter, page,
    }));
  }
  //升序排序
  handleSortUp(pagination = { current: 1 }) {
    const { dispatch, filter } = this.props;
    const { current: page = 1 } = pagination;
    const sort = { indexCache: 1 };
    dispatch(Actions.Res.getListAction({
      resName: RES_NAME, filter, page, sort,
    }));
  }
  //降序排序
  handleSortDown(pagination = { current: 1 }) {
    const { dispatch, filter } = this.props;
    const { current: page = 1 } = pagination;
    const sort = { indexCache: -1 }
    dispatch(Actions.Res.getListAction({
      resName: RES_NAME, filter, page, sort,
    }));
  }


  render() {
    const { pages, boxes } = this.state
    const { loading, list, pagination } = this.props.resources;
    const { books } = this.props;
    if (loading) {
      return <Spin />;
    }
    const createBtnDom = () => {
      return (
        <div className={styles.anyBox2}>
          <div>
            <Link to="/manage/card/position">
              <Button type="primary" style={{ marginRight: 8 }}><Icon type="plus" />创建卡位柜</Button>
            </Link>
            <Link to="/manage/card/phone">
              <Button type="primary" style={{ marginRight: 8 }}><Icon type="edit" />录入手机号</Button>
            </Link>
            <Link to="/manage/card/upload">
              <Button type="primary"><Icon type="upload" />批量导入</Button>
            </Link>
          </div>
          <div className={styles.boxr}>
            <ButtonGroup>
              <Button type="ghost" onClick={this.handleSortUp.bind(this)}>
                <Icon type="arrow-up" />按存放位置排序
              </Button>
              <Button type="ghost" onClick={this.handleSortDown.bind(this)}>
                按存放位置排序<Icon type="arrow-down" />
              </Button>
            </ButtonGroup>
          </div>
        </div>
      )
    };
    return (
      <section>
        <FilterBox
          createFilter={handleCreateFilter.bind(this, thisFilter)}
        >
          <FilterForm
            handleClear={this.onClearFilter.bind(this)}
            handleFilter={this.onSubmitFilter.bind(this)}
            books={books}
          />
        </FilterBox>
        {createBtnDom()}
        <Lists
          dataSource={list}
          pagination={pagination}
          onChange={this.onChange.bind(this)}
        />
      </section>
    )
  }
}

const mapStateToProps = ({ resources, filter, books }) => {
  return {
    resources: Object.assign({}, { list: [], pagination: {} }, resources[RES_NAME]),
    filter,
    books,
  }
}

export default connect(mapStateToProps)(Sims);
