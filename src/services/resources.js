import xFetch from './xFetch';
import { version } from '../actions'


// 获得列表
export async function getList(url) {
  return xFetch(`/${version}/${url}`);
}

//获取单个以及更新
export async function getInfo(resName, operate) {
  const { id, field = '' } = operate
  return xFetch(`/${version}/${resName}/${id}${field}`)
}
//给渠道添加微信或者释放以添加的微信
export async function addWx(resName, id, url) {
  return xFetch(`/${version}/${resName}/${id}/wxclients/create?${url}`)
}
//提交或者取消添加微信
export async function postAddWx(resName, data) {
  const { id, method, field = '', ...postData } = data;
  return xFetch(`/${version}/${resName}/${id}/wxclients${field}`, {
    method,
    data: postData,
  })
}
// 新增
export async function postRes(resName, data) {
  return xFetch(`/${version}/${resName}`, {
    method: 'POST',
    data,
  })
}
//修改以及清除uin
export async function putRes(resName, data) {
  const { _id, field = '', ...putData } = data
  return xFetch(`/${version}/${resName}/${_id}${field}`, {
    method: 'PUT',
    data: putData,
  })
}
//删除
export async function deleteRes(resName, data) {
  const { _id } = data
  return xFetch(`/${version}/${resName}/${_id}`, {
    method: 'DELETE',
    data,
  })
}
//启用
export async function optionsRes(resName, data) {
  const { _id } = data
  return xFetch(`/${version}/${resName}/${_id}`, {
    method: 'OPTIONS',
    data,
  })
}
