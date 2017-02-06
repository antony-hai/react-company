import React, { Component, PropTypes } from 'react';
import { Menu, Spin, Icon } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import styles from './Menu.less';

const GroupItemMenu = Menu.ItemGroup;
const ItemMenu = Menu.Item;

class Menus extends Component {
  render() {
    const { menus: { list = [], loading } } = this.props;
    if (loading) {
      return (<h3><Spin /></h3>);
    }

    const groupItemDOM = group => {
      const { key, title } = group;
      const children = group.list;
      return (
        <GroupItemMenu
          key={key}
          title={title}
        >
        {children.map(item =>
          <ItemMenu key={item.key}>
            <Link
              to={`/${item.model}/${item.group}${item.uri}`}
              activeClassName={styles.menuSelected}
            ><i className={`listicon listicon-${item.key}`}></i>{item.title}</Link>
          </ItemMenu>
        )}
        </GroupItemMenu>
      );
    };

    return (
      <div>
        <Menu
          selectedKeys={[]}
        >
          {list.map((item) =>
            groupItemDOM(item)
          )}
        </Menu>
      </div>
    );
  }
}

Menus.propTypes = {};

//过滤掉不用显示的列表
function filterMenus(menus) {
  return menus.map(group => {
    return { ...group, list: group.list.filter(item => {
      return item.hasOwnProperty('sort')
    }) }
  })
}
//根据location的名字过滤掉最外层的大模块
function filterOuterMenus(menus = []) {
  const pathname = location.pathname
  return menus.reduce((result, item) => {
    const { key, list = [] } = item
    const reg = new RegExp(`^\/?${key}`)
    if (reg.test(pathname)) {
      return result.concat(list)
    }
    return result
  }, [])
}
const mapStateToProps = ({ menus = {} }) => {
  return {
    menus: { ...menus, list: filterMenus(filterOuterMenus(menus.list)) },
  }
};

export default connect(mapStateToProps)(Menus);
