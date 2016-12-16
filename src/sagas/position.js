import { takeLatest } from 'redux-saga';
import { toBase64 } from '../services/common';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { getBooks, getPages, getBoxes, getBox } from '../services/position';
import * as Actions from '../actions'
import { message } from 'antd';

//获得册子
function* getAllBooks(action) {
  const { payload, callback } = action;
  const url = toBase64(payload)
  try {
    const { jsonResult } = yield call(getBooks, url);
    if (jsonResult.data) {
      yield put({
        type: Actions.Book.GET_SUCCESS,
        payload: jsonResult.data.data,
      });
    }
  } catch (err) {
    message.error(err, 2);
  }
}
//获得页数
function* getAllPages(action) {
  const { payload, callback } = action;
  const url = toBase64(payload)
  try {
    const { jsonResult } = yield call(getPages, url);
    yield put({
      type: Actions.Book.GET_PAGES_SUCCESS,
      payload: jsonResult.data.data,
    })
    if (typeof callback === 'function') {
      callback();
    }
  } catch (err) {
    message.error(err, 2)
  }
}
//获得格子数
function* getAllBoxes(action) {
  const { payload, callback } = action;
  const url = toBase64(payload)
  try {
    const { jsonResult } = yield call(getBoxes, url);
    yield put({
      type: Actions.Book.GET_BOXES_SUCCESS,
      payload: jsonResult.data.data,
    })
    if (typeof callback === 'function') {
      callback();
    }
  } catch (err) {
    message.error(err, 2)
  }
}
//获得单个格子
function* getOnlyBox(action) {
  const { payload, callback } = action;
  const url = toBase64(payload)
  try {
    const { jsonResult } = yield call(getBox, url);
    const { data } = jsonResult;
    yield put({
      type: Actions.Book.GET_BOX_SUCCESS,
      payload: jsonResult.data,
    })
    if (typeof callback === 'function') {
      callback(data);
    }
  } catch (err) {
    message.error(err, 2)
  }
}


function* watchGetBooks() {
  yield takeLatest(Actions.Book.GET, getAllBooks);
}
function* watchGetPages() {
  yield takeLatest(Actions.Book.GET_PAGES, getAllPages);
}
function* watchGetBoxes() {
  yield takeLatest(Actions.Book.GET_BOXES, getAllBoxes);
}
function* watchGetBox() {
  yield takeLatest(Actions.Book.GET_BOX, getOnlyBox);
}


export default function* () {
  yield fork(watchGetBooks);
  yield fork(watchGetPages);
  yield fork(watchGetBoxes);
  yield fork(watchGetBox);
}
