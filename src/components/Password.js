import React from 'react';
import { Row, Col } from 'antd';
import styles from './app.less';


export default ({ children, location }) => {
  const filterPath = (pathname) => {
    const pathReg = new RegExp(/^\/system\/password\/([a-zA-Z\/]+)\/?.*$/);
    const current = pathReg.exec(pathname)[1];
    switch (current) {
      case 'amend':
        return '修改密码';
      case 'success':
        return '修改成功';
      default:
        return '';
    }
  };
  return (
    <div className={styles.funcBox}>
      <Row>
        <Col span={24} className={styles.header}>
          系统管理 > {filterPath(location.pathname)}
        </Col>
      </Row>
      <article className={styles.articleBox}>
        {children}
      </article>
    </div>
  )
}
