import React, { Component, PropTypes } from 'react';
import { Row, Col, Spin, Button, message } from 'antd';
import { connect } from 'react-redux';
import { indexCache } from '../../services/common'

class Login extends Component {
  handleClose() {
    const { dispatch, handleCloseEss } = this.props;
    handleCloseEss()
    dispatch({
      type: 'EDITOR_CANCEL',
    });
  }

  render() {
    const { loginData } = this.props;
    const { mobile, password, qrcode, status, index } = loginData;
    const position = indexCache(index)
    // 微信二维码
    const qrcodeDOM = () => {
      const qrcodeStyle = {
        marginBottom: '15px',
        width: '238px',
        height: '238px',
        textAlign: 'center',
        border: '1px solid #E4E4E4',
      };
      if (status === 100) {
        this.props.handleOpenEss()
      }
      if (status === 101 || status === 102) { // 二维码获取成功 或者 扫码成功
        return (
          <div style={qrcodeStyle}>
            <img src={qrcode} alt={qrcode} />
          </div>
        );
      } else if (status === 103 || status > 10000) { // 登录成功
        return null;
      }

      return (
        <div style={qrcodeStyle}>
          <Spin style={{ paddingTop: '100px' }} />
          <br />
          <Spin
            tip="正在获取登录二维码 请耐心等待..."
            style={{ paddingTop: '90px' }}
          />
        </div>
      );
    };
    // 微信帐号信息
    const wechatInfo = () => {
      const rowStyle = {
        margin: '2px 0',
        padding: '8px 10px',
        background: '#F2F2F2',
      };

      if (status === 102) { // 扫码成功
        return (
          <div
            style={{
              padding: '40px 0 50px',
              textAlign: 'center',
            }}
          >
            <h4
              style={{
                paddingBottom: 20,
                fontSize: 18,
                fontWeight: 500,
              }}
            >扫描成功</h4>
            <p>请在手机上点击确认以登录</p>
          </div>
        );
      } else if (status === 103 || status > 10000) { // 登录成功
        return (
          <div
            style={{
              padding: '50px 0',
              textAlign: 'center',
            }}
          >
            <h4
              style={{
                paddingBottom: 20,
                fontSize: 18,
                fontWeight: 500,
              }}
            >登录成功</h4>
            <Button onClick={() => this.handleClose()}>关闭</Button>
          </div>
        );
      }

      return (
        <div>
          <Row style={rowStyle}>
            <Col span={6}>登录名：</Col>
            <Col span={18}>{mobile}</Col>
          </Row>
          <Row style={rowStyle}>
            <Col span={6}>密  码：</Col>
            <Col span={18}>{password}</Col>
          </Row>
          <Row style={rowStyle}>
            <Col span={6}>存放位：</Col>
            <Col span={8}>{position}</Col>
          </Row>
        </div>
      );
    };

    return (
      <section>
        {qrcodeDOM()}
        {wechatInfo()}
      </section>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    editor: Object.assign({}, {
      title: '登录微信服务号',
      visible: false,
    }, state.editor),
  };
};

export default connect(mapStateToProps)(Login);
