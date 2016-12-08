import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { toBase64 } from '../services/common';
import { message } from 'antd'
import * as Api from '../services/resources'
import * as Actions from '../actions'

//总列表
function* getResource(action) {
  const { payload: { resName, filter, page, sort } } = action;
  // make url decide by resName
  const baseURL = `${resName}`;
  const filterString = toBase64(filter);
  const sortString = toBase64(sort);
  const encodeUrl = encodeURIComponent(`f=${filterString}&s=${sortString}&page=${page}`);
  const url = `${baseURL}?f=${filterString}&s=${sortString}&page=${page}`;
  try {
    const { jsonResult } = yield call(Api.getList, url);
    yield put({
      type: 'res/get/success',
      payload: jsonResult.data,
      resName,
    })
  } catch (err) {
    yield put({
      type: 'res/get/fail',
      payload: err,
      resName,
    })
  }
}
//获取单个
function* getInfo(action) {
  const { resName, payload, callback } = action
  try {
    const { jsonResult = {} } = yield call(Api.getInfo, resName, payload)
    const { data } = jsonResult
    yield put({
      type: Actions.Res.GET_INFO_SUCCESS,
      payload: data,
      resName,
    })
    if (typeof callback === 'function') {
      callback(data)
    }
  } catch (err) {
    message.error(err, 2)
  }
}

// 新建
function* postRes(action) {
  const { resName, payload, callback } = action
  try {
    const { jsonResult = {} } = yield call(Api.postRes, resName, payload)
    const { data } = jsonResult
    yield put({
      type: Actions.Res.POST_SUCCESS,
      payload: data,
      resName,
    })
    if (typeof callback === 'function') {
      callback(data)
    }
  } catch (err) {
    message.error(err, 2)
  }
}
// 修改
function* putRes(action) {
  const { resName, payload, callback } = action
  try {
    const { jsonResult = {} } = yield call(Api.putRes, resName, payload)
    const { data } = jsonResult
    yield put({
      type: Actions.Res.PUT_SUCCESS,
      payload: data,
      resName,
    })
    if (typeof callback === 'function') {
      callback(data)
    }
  } catch (err) {
    message.error(err, 2)
  }
}

// 删除
function* deleteRes(action) {
  const { resName, payload, callback } = action
  try {
    const { jsonResult = {} } = yield call(Api.deleteRes, resName, payload)
    const { data } = jsonResult;
    yield put({
      type: Actions.Res.DELETE_SUCCESS,
      payload: data,
      resName,
    })
    if (typeof callback === 'function') {
      callback(data)
    }
  } catch (err) {
    message.error(err, 2)
  }
}
//启用
function* optionsRes(action) {
  const { resName, payload, callback } = action
  try {
    const { jsonResult = {} } = yield call(Api.optionsRes, resName, payload)
    const { data } = jsonResult
    yield put({
      type: Actions.Res.OPTIONS_SUCCESS,
      payload: data,
      resName,
    })
    if (typeof callback === 'function') {
      callback(data)
    }
  } catch (err) {
    message.error(err, 2)
  }
}


function* watchGetResource() {
  yield takeEvery(Actions.Res.GET, getResource);
}
function* watchGetInfo() {
  yield takeEvery(Actions.Res.GET_INFO, getInfo);
}

function* watchPostRes() {
  yield takeEvery(Actions.Res.POST, postRes)
}
function* watchPutRes() {
  yield takeEvery(Actions.Res.PUT, putRes)
}

function* watchDeleteRes() {
  yield takeEvery(Actions.Res.DELETE, deleteRes)
}
function* watchOptionsRes() {
  yield takeEvery(Actions.Res.OPTIONS, optionsRes)
}

export default function* () {
  yield fork(watchGetResource);
  yield fork(watchGetInfo);
  yield fork(watchPostRes);
  yield fork(watchPutRes);
  yield fork(watchDeleteRes);
  yield fork(watchOptionsRes);
}
