import { notification } from 'antd';


export function openNotification(account) {
  notification.warning({
    message: '信息提示',
    description: `账号 ${account} 出现异常，请立即处理!`,
    duration: null,
    onClose: () => {
      alert(account)
    },
  })
}
//设置cookie
export function setCookie(name, value, expires) {
  const expdate = new Date();
  expdate.setTime(expdate.getTime() + expires);
  document.cookie = `${name}=${escape(value)}; 
    expires=${expires.toGMTString()}; 
    path=/`
}
//根据cookie名，获得cookie值
export function getCookie(name) {
  const search = `${name}=`;
  let offset = document.cookie.indexOf(search);
  if (offset !== -1) {
    offset += search.length;
    let end = document.cookie.indexOf(';', offset);
    if (end === -1) { end = document.cookie.length }
    return (document.cookie.substring(offset, end));
  } else { return '' }
}


//删除某一段cookie
export function deleteCookie(name) {
  const expdate = new Date();
  expdate.setTime(expdate.getTime() - (3600 * 24 * 1000 * 1));
  setCookie(name, '', expdate);
}


//检查是否存在此 cookie
export function checkCookie(cookieName, cookieValue) {
  if (getCookie(cookieName) === cookieValue) {
    return true;
  } else {
    return false;
  }
}
