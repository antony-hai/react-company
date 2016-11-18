import { Map } from 'immutable';

/**
 * Promise
 */
export function when(func, timeout = 0) {
  return new Promise((resolve, reject) => {
    if (func) {
      func();
      setTimeout(() => resolve(), timeout);
    } else {
      reject();
    }
  });
}
/**
 * 验证当前登陆的用户是否是管理员级别
 */
const hasAdmin = (auth = {}) => {
  const hasRole = auth.hasOwnProperty('role');
  const hasGroup = auth.hasOwnProperty('groupRole');
  const isSuperRole = hasRole && auth.role === 1;
  const isGroupRole = hasRole && auth.role === 2 && hasGroup && auth.groupRole === 2;
  return {
    super: isSuperRole,
    group: isGroupRole,
  };
}
// 是否是超级管理员
export function hasSuperAdmin(auth = {}) {
  return hasAdmin(auth).super;
}
// 是否是业务管理员
export function hasGroupAdmin(auth = {}) {
  return hasAdmin(auth).group;
}

/**
 * 将数据转换为蚂蚁的TreeSelect组件所需的格式
 */
export function dataToAntdTreeData(data = [], onlySelectedLeaf = false) {
  return [...data].map(item => {
    let childs = [];
    let selectable = true;
    const { id, name, children } = item;
    if (!!children && children.length) {
      if (onlySelectedLeaf) {
        selectable = false;
      }
      childs = dataToAntdTreeData(children, onlySelectedLeaf);
    }
    return {
      key: id,
      value: id,
      label: name,
      children: childs,
      selectable,
    };
  });
}

/**
 * 返回数据的键或值
 * 接收的数据格式: [
 *  { 'id': 'value'},
 *  { 'id': 'value'},
 * ]
 * 返回的数据格式: ['1', '2', '3']
 */
const getKeyOrVal = (data = [], isKey = false) => {
  const getOpts = (item, _isKey) => {
    const key = Object.keys(item)[0];
    if (!_isKey) {
      return item[key];
    }
    return key;
  };

  if (Array.isArray(data)) {
    if (data.length) {
      return data.map(item => getOpts(item, isKey));
    }
    return [];
  } else if (typeof data === 'object' && data !== null) {
    return [getOpts(data, isKey)];
  }
  return [];
}
// 获取所有的键
export function getKeys(data = []) {
  return getKeyOrVal(data, true);
}
// 获取所有的值
export function getValues(data = []) {
  return getKeyOrVal(data);
}

/**
 * 接收的数据格式: { 'a->b->c': 1 }
 * 返回的数据格式: { a: { b: { c: 1 } } }
 */
export function simpleFormData(data, split = '->') {
  let params = new Map({});
  (new Map(data)).forEach((value, key) => {
    const item = (new Map()).setIn(
      key.split(split),
      value,
    );
    params = params.mergeDeep(item);
  });
  return params.toJS();
}

/**
 * string to json
 * 接收的数据格式: 'name:name error,email:error info'
 * 返回的数据格式: { name: 'name error', email: 'email error' }
 */
export function strToJson(str = '') {
  if (str.length < 2) {
    return {};
  } else if (typeof str === 'object') {
    return str;
  }
  const fields = str.split(',');
  const datas = {};
  fields.forEach(item => {
    if (!!item) {
      const temp = item.split(':');
      const key = temp[0].trim();
      const value = temp[1].trim();
      datas[key] = value;
    }
  });
  return datas;
}

/**
 * 判断接收到的数据是否是array，如若不是，返回一个空数组
 * result array
 */
export function dataToArray(data = []) {
  if (Array.isArray(data)) {
    return data;
  }
  return [];
}

/**
 * to base64
 * 接收的数据格式: ['a', 'b'] or { a: 'a', b: 'b' }
 * 返回的数据格式: base64 格式
 */
export function toBase64(data = {}) {
  const buffer = Object.keys(data).length === 0 ? '' : (new Buffer(JSON.stringify(data)));
  const base64String = buffer.toString('base64').replace(/={1,2}$/, '');
  return base64String;
}
//转日期格式
export function changeDate(date = new Date()) {
  const getUserDate = new Date(date);
  const year = getUserDate.getFullYear();
  const month = getUserDate.getMonth() >= 9 ? getUserDate.getMonth() + 1 : `0${getUserDate.getMonth() + 1}`;
  const day = getUserDate.getDate() >= 10 ? getUserDate.getDate() : `0${getUserDate.getDate()}`;
  return `${year}-${month}-${day}`;
}
//转卡位柜格式
export function indexCache(obj = { book: 1, page: 1, box: 1 }) {
  let book;
  if (obj.book <= 9) {
    book = `000${obj.book}`
  } else if (9 < obj.book && obj.book <= 99) {
    book = `00${obj.book}`
  } else if (99 < obj.book && obj.book <= 999) {
    book = `0${obj.book}`
  } else {
    book = `${obj.book}`
  }
  const page = obj.page < 10 ? `0${obj.page}` : obj.page
  const box = obj.box < 10 ? `0${obj.box}` : obj.box
  return `${book} ${page} ${box}`
}
// 常用的正则
export const regExp = {
  // 手机
  mobile: /^(1[3-8][0-9])\d{8}$/i,
  // 邮箱
  email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
  // 密码
  password: /^[\w\d]{6,20}$/i,
  // 身份证
  idcard: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
  /*0以上的自然数*/
  wxcount: /^([1-9]\d*)$/,
  /*99以下，0以上的数字*/
  bookCount: /^([1-9]\d?)$/,

}
