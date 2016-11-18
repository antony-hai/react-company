import React, { Component, PropTypes } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router';
import styels from './sim.less';
import { connect } from 'react-redux';

class PhoneSuccess extends Component {
  constructor() {
    super()
  }

  render() {
    const { mobile, boxes, pages, books } = this.props.phoneMsg;
    return (
      <div className={styels.successBox}>
        <p>
          {`号码：${mobile} 已经成功录入 ${books} ${pages} ${boxes} 存放位`}
        </p>
        <div>
          <Button type="primary" style={{ marginRight: 15 }}>
            <Link to="/manage/card/phone">继续录入</Link>
          </Button>
          <Button type="ghost">
            <Link to="/manage/card/list">返回卡位柜</Link>
          </Button>
        </div>
      </div>
    )
  }
}


const mapStateToProps = ({ phoneMsg = {} }) => {
  return {
    phoneMsg: Object.assign({}, { books: '', pages: '', boxes: '', mobile: '' }, { ...phoneMsg.msg }),
  }
}

export default connect(mapStateToProps)(PhoneSuccess);

