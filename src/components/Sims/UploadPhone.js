import React, { Component, PropTypes } from 'react'
import { message, Button, Upload, Icon } from 'antd'
import { getTokenOfCSRF } from '../../services/xFetch'
import { Link } from 'react-router'
import styles from './sim.less'

class UploadPhone extends Component {
  constructor() {
    super();
    this.state = {
      fileList: [],
      successAll: false,
      successSome: false,
      msg: [],
    }
  }
  handleBeforeUpload(file) {
    const flag = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    if (!flag) {
      message.error('只能上传xlsx格式的文件', 2)
    }
    return flag
  }
  handleChange(file) {
    //TODO   数据处理还需要修改
    let fileList = [...file.fileList]
    fileList = fileList.slice(-1);
    fileList = fileList.filter(item => {
      const { response } = item;
      if (!!response) {
        const { success, data } = response;
        if (data.length === 0) {
          this.setState({ successAll: true })
        } else {
          this.setState({ successSome: true, msg: data });
        }
        return success;
      }
      return true;
    });
    this.setState({ fileList })
  }
  render() {
    const uploadProps = {
      name: 'excel',
      action: '/v1/simCards/import',
      data: { _token: getTokenOfCSRF() },
      fileList: this.state.fileList,
      onChange: this.handleChange.bind(this),
      beforeUpload: this.handleBeforeUpload.bind(this),
      onRemove: file => {
        this.setState({ fileList: [] })
      },
      onPreview: file => {
        this.setState({ fileList: [] })
      },
    }
    const { successAll, successSome, msg } = this.state
    if (successAll) {
      return (
        <section className={styles.uploadBox}>
          <p style={{ color: 'green' }}>手机号导入成功!</p>
          <Link to="/manage/card/list">
            <Button type="primary" style={{ marginTop: 50 }}>返回卡柜</Button>
          </Link>
        </section>
      )
    }
    if (successSome) {
      return (
        <section className={styles.uploadBox}>
          {msg.map((item, index) => {
            return <p key={`${index}`} style={{ marginTop: 10 }}>{item}</p>
          })}
          <Link to="/manage/card/list">
            <Button type="primary" style={{ marginTop: 50 }}>返回卡柜</Button>
          </Link>
        </section>
      )
    }
    return (
      <div className={styles.uploadBox}>
        <div>
          <Upload {...uploadProps}>
            <Button type="primary"><Icon type="upload" />选择导入文件</Button>
          </Upload>
        </div>
        <div className={styles.downloadE}>
          <a href="/v1/simCards/export">下载导入模板</a>
        </div>
      </div>
    )
  }
}

export default UploadPhone;
