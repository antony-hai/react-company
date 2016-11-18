import { takeLatest, takeEvery } from 'redux-saga';
import { take, call, put, fork, cancel } from 'redux-saga/effects';
import { getList } from '../services/resources';
import { toBase64 } from '../services/common';

function* getResource(action) {
  const { payload: { resName, filter, page, sort } } = action;
  // make url decide by resName
  const baseURL = `/v1/${resName}`;
  const filterString = toBase64(filter);
  const sortString = toBase64(sort);
  const encodeUrl = encodeURIComponent(`f=${filterString}&s=${sortString}&page=${page}`);
  const url = `${baseURL}?f=${filterString}&s=${sortString}&page=${page}`;
  try {
    const { jsonResult } = yield call(getList, url);
    yield put({
      type: 'res/get/success',
      payload: jsonResult.data,
      resName,
    })
  } catch (err) {
    console.warn('request error:', err);
    yield put({
      type: 'res/get/fail',
      payload: err,
      resName,
    })
  }
}

function* watchGetResource() {
  yield takeEvery('res/get', getResource);
}

export default function* () {
  yield fork(watchGetResource);
}
