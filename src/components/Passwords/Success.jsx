import React, { Component, PropTypes } from 'react'
import styles from './password.less'
import { Button } from 'antd'
import { Link } from 'react-router'

class Success extends Component {
  render() {
    return (
      <div className={styles.outerBox2}>
        <p>密码修改成功，请用新密码登录</p>
        <Link to="/manage/project/list">
          <Button type="primary">返回微信号管理</Button>
        </Link>
      </div>
    )
  }
}

export default Success
