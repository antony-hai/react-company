import React, { Component, PropTypes } from 'react';
import { Button } from 'antd';
import { Link } from 'react-router';
import styels from './sim.less';
import { connect } from 'react-redux';
import { indexCache } from '../../services/common'

class PhoneSuccess extends Component {

  render() {
    const { mobile = '', index = {} } = this.props.box;
    return (
      <div className={styels.successBox}>
        <p>
          {`号码：${mobile} 已经成功录入 ${indexCache(index)} 存放位`}
        </p>
        <div>
          <Link to="/manage/card/phone">
            <Button type="primary" style={{ marginRight: 15 }}>继续录入</Button>
          </Link>
          <Link to="/manage/card/list">
            <Button type="ghost">返回卡位柜 </Button>
          </Link>
        </div>
      </div>
    )
  }
}

PhoneSuccess.PropTypes = {}
const mapStateToProps = ({ position = {} }) => {
  const { box = {} } = position
  return { box }
}

export default connect(mapStateToProps)(PhoneSuccess);


