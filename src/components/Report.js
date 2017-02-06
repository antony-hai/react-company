import React from 'react';
import { Row, Col } from 'antd';
import styles from './app.less';


export default ({ children, location }) => {
  const filterPath = (pathname) => {
    const pathReg = new RegExp(/^\/statistics\/report\/([a-zA-Z\/]+)\/?.*$/);
    const current = pathReg.exec(pathname)[1];
    switch (current) {
      case 'comsReport':
        return '渠道报表';
      default:
        return '';
    }
  };
  return (
    <div className={styles.funcBox}>
      <Row>
        <Col span={24} className={styles.header}>
          统计报表 > {filterPath(location.pathname)}
        </Col>
      </Row>
      <article className={styles.articleBox}>
        {children}
      </article>
    </div>
  )
}
