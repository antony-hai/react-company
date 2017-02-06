import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import styles from './nav.less';
import logoImg from '../../img/logo.png';
import { connect } from 'react-redux'


class Nav extends React.Component {
  render() {
    const { auth = {}, menus = {} } = this.props;
    const { list = [] } = menus;
    return (
      <nav className={styles.nav}>
        <div className={styles.nav_left}>
          <img src={logoImg} alt="易微链" />
        </div>
        <div className={styles.nav_mid}>
          {list.map(item =>
            <Link key={item.key} to={`/${item.key}`} activeClassName={styles.choose}>
              {item.title}
            </Link>
          )}
        </div>
        <div className={styles.nav_right}>
          <a href="/">{auth.name}</a>
          <span>|</span>
          <a href="/logout">登出</a>
        </div>
      </nav>
    );
  }
}

Nav.propTypes = {
  auth: PropTypes.object,
  menus: PropTypes.object,
}


const mapStateToProps = ({ auth, menus }) => {
  return {
    auth,
    menus,
  }
}
export default connect(mapStateToProps)(Nav) ;
