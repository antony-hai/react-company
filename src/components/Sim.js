import React from 'react';
import { Row, Col } from 'antd';
import styles from './app.less';


export default ({ children, location }) => {
  const filterPath = (pathname) => {
    const pathReg = new RegExp(/^\/manage\/card\/([a-zA-Z\/]+)\/?.*$/);
    const current = pathReg.exec(pathname)[1]
    switch (current) {
      case 'list':
        return 'SIM卡卡柜列表';
      case 'phone':
        return '录入电话号码';
      case 'upload':
        return '批量导入手机号';
      case 'position':
        return '创建SIM卡卡柜';
      case 'success':
        return '号码录入成功';
      default:
        return '';
    }
  };
  return (
    <div className={styles.funcBox}>
      <Row>
        <Col span={24} className={styles.header}>
          SIM卡柜 > {filterPath(location.pathname)}
        </Col>
      </Row>
      <article className={styles.articleBox}>
        {children}
      </article>
    </div>
  )
}
