import { takeLatest } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { getAll } from '../services/menus';
import { message } from 'antd';

function* getAllMenus() {
  try {
    const { jsonResult } = yield call(getAll);
    if (jsonResult.data) {
      yield put({
        type: 'menus/get/success',
        //TODO  这里写死了 后面跟新要换过来
        payload: jsonResult.data,
      });
    }
  } catch (err) {
    message.error(err);
  }
}

function* watchGetMenus() {
  yield takeLatest('menus/get', getAllMenus);
}

export default function* () {
  yield fork(watchGetMenus);
  yield put({
    type: 'menus/get',
  });
}
