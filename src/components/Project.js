import React from 'react';
import { Row, Col } from 'antd';
import styles from './app.less';

export default ({ children, location }) => {
  const filterPath = (pathname) => {
    const pathReg = new RegExp(/^\/manage\/project\/([a-zA-Z\/]+)\/?.*$/);
    const current = pathReg.exec(pathname)[1];
    switch (current) {
      case 'create':
        return '创建微信';
      case 'create/':
        return '编辑';
      case 'list':
      default:
        return '微信库';
    }
  };

  return (
    <div className={styles.funcBox}>
      <Row>
        <Col span={24} className={styles.header}>
           微信号管理 > {filterPath(location.pathname)}
        </Col>
      </Row>
      <article className={styles.articleBox}>
        {children}
      </article>
    </div>
  )
}
