import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';

const errorMessages = (res) => `${res.status} ${res.statusText}`;

function check401(res) {
  if (res.status === 401) {
    location.href = '/401';
  }
  return res;
}

function check404(res) {
  if (res.status === 404) {
    return Promise.reject(errorMessages(res));
  }
  return res;
}

function jsonParse(res) {
  return res.json().then(jsonResult => ({ ...res, jsonResult }));
}

function errorMessageParse(res) {
  const { success, message } = res.jsonResult;
  if (!success) {
    if (res.jsonResult.hasOwnProperty('exception')) {
      const { exception: { error_msg: errMsg } } = res.jsonResult
      return Promise.reject(`${message}:${errMsg}}`)
    }
    return Promise.reject(message);
  }
  return res;
}

function getParams(data, type = 'json') {
  let formData;
  switch (type) {
    case 'form':
      formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });
      return formData;
    case 'json':
    default:
      return JSON.stringify(data);
  }
}

export function getTokenOfCSRF() {
  const token = document.querySelector('meta[name=csrf-token]').content
  return token
}

function xFetch(url, options) {
  const opts = { ...options, credentials: 'include' };
  if (opts.hasOwnProperty('data')) {
    const dataType = opts.hasOwnProperty('dataType') ? opts.dataType : 'json';
    if (dataType === 'json') {
      opts.headers = { 'content-type': 'application/json' };
    }
    opts.body = getParams(
      Object.assign(opts.data, { _token: getTokenOfCSRF() })
      , dataType);
  }
  opts.headers = {
    ...opts.headers,
    authorization: cookie.get('authorization') || '',
    'X-CSRF-TOKEN': cookie.get('XSRF-TOKEN') || '',
  };

  return fetch(url, opts)
    .then(check401)
    .then(check404)
    .then(jsonParse)
    .then(errorMessageParse);
}

export default xFetch;
