
import React from 'react';
import { Row, Col } from 'antd';
import styles from './app.less';

export default ({ children, location }) => {
  const pathname = location.pathname;
  const pathReg = new RegExp(/^\/manage\/channel\/([a-zA-Z\/]+)\/?.*$/);
  const basename = pathReg.exec(pathname)[1];
  let title;
  switch (basename) {
    case 'create':
      title = '新建渠道';
      break;
    case 'create/':
      title = '编辑';
    case 'list':
    default:
      title = '渠道列表';
  }

  return (
    <div className={styles.funcBox}>
      <Row>
        <Col span={24} className={styles.header}>
           渠道管理 > {title}
        </Col>
      </Row>
      <article className={styles.articleBox}>
        {children}
      </article>
    </div>
  )
}
