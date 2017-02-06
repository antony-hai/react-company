//版本号
export const version = 'v1';

export const Auth = {
  INIT: 'auth/init',
}

export const Menus = {
  GET: 'menus/get',
  GET_SUCCESS: 'menus/get/success',
  GET_FAIL: 'menus/get/fail',
}

export const Res = {
  GET: 'res/get',
  GET_SUCCESS: 'res/get/success',
  GET_FAIL: 'res/get/fail',
  GET_INFO: 'res/getInfo',
  GET_INFO_SUCCESS: 'res/getInfo/success',
  ADD_WX: 'add/wx',
  ADD_WX_SUCCESS: 'add/wx/success',
  POST_WX: 'post/wx',
  POST_WX_SUCCESS: 'post/wx/success',
  DELETE_WX: 'delete/wx',
  DELETE_ALL_WX: 'delete/all/wx',
  POST: 'res/post',
  POST_SUCCESS: 'res/post/success',
  PUT: 'res/put',
  PUT_SUCCESS: 'res/put/success',
  DELETE: 'res/delete',
  DELETE_SUCCESS: 'res/delete/success',
  OPTIONS: 'res/options',
  OPTIONS_SUCCESS: 'res/options/success',
  PATCH: 'res/patch',
  PATCH_SUCCESS: 'res/patch/success',
  getListAction(params) {
    const { resName, filter, page = 1, sort } = params;
    return {
      type: this.GET,
      payload: { resName, filter, page, sort },
    }
  },
  getInfoAction(resName, operate, callback) {
    return {
      type: this.GET_INFO,
      payload: operate,
      resName,
      callback,
    }
  },
  postAction(resName, payload = {}, callback) {
    return {
      type: this.POST,
      resName,
      payload,
      callback,
    }
  },
  putAction(resName, payload = {}, callback) {
    return {
      type: this.PUT,
      resName,
      payload,
      callback,
    }
  },
  deleteAction(resName, payload = {}, callback) {
    return {
      type: this.DELETE,
      resName,
      payload,
      callback,
    }
  },
  patchAction(resName, payload = {}, callback) {
    return {
      type: this.PATCH,
      resName,
      payload,
      callback,
    }
  },
  optionsAction(resName, payload = {}, callback) {
    return {
      type: this.OPTIONS,
      resName,
      payload,
      callback,
    }
  },
  addwxclientAction(resName, payload = {}, callback) {
    return {
      type: this.ADD_WX,
      resName,
      payload,
      callback,
    }
  },
  postWxAction(resName, payload = {}, callback) {
    return {
      type: this.POST_WX,
      resName,
      payload,
      callback,
    }
  },
}

export const Book = {
  GET: 'books/get',
  GET_SUCCESS: 'books/get/success',
  GET_PAGES: 'pages/get',
  GET_PAGES_SUCCESS: 'pages/get/success',
  GET_BOXES: 'boxes/get',
  GET_BOXES_SUCCESS: 'boxes/get/success',
  GET_BOX: 'box/get',
  GET_BOX_SUCCESS: 'box/get/success',
  getBooksAction(payload = {}) {
    return {
      type: this.GET,
      payload,
    }
  },
  getPagesAction(payload = {}, callback) {
    return {
      type: this.GET_PAGES,
      payload,
      callback,
    }
  },
  getBoxesAction(payload = {}, callback) {
    return {
      type: this.GET_BOXES,
      payload,
      callback,
    }
  },
  getBoxAction(payload = {}, callback) {
    return {
      type: this.GET_BOX,
      payload,
      callback,
    }
  },
}
