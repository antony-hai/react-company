import { takeLatest } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { getAll } from '../services/menus';
import { message } from 'antd';
import { Menus as Actions } from '../actions'

function* getAllMenus() {
  try {
    const { jsonResult } = yield call(getAll);
    if (jsonResult.data) {
      yield put({
        type: Actions.GET_SUCCESS,
        payload: jsonResult.data,
      });
    }
  } catch (err) {
    message.error(err);
  }
}

function* watchGetMenus() {
  yield takeLatest(Actions.GET, getAllMenus);
}

export default function* () {
  yield fork(watchGetMenus);
  yield put({ type: Actions.GET });
}
