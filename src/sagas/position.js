import { takeLatest } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { getAll, getPages, getBoxes, getBox } from '../services/position';
import { message } from 'antd';

function* getAllBooks() {
  try {
    const { jsonResult } = yield call(getAll);
    if (jsonResult.data) {
      yield put({
        type: 'books/get/success',
        payload: jsonResult.data.data,
      });
    }
  } catch (err) {
    message.error(err);
  }
}

function* watchGetBooks() {
  yield takeLatest('books/get', getAllBooks);
}

export default function* () {
  yield fork(watchGetBooks);
  yield put({
    type: 'books/get',
  });
}
