import { handleActions } from 'redux-actions';
import { Res as ACTIONS } from '../actions'

export default handleActions({
  [ACTIONS.GET](state, action) {
    const { resName } = action.payload;
    return { ...state, [resName]: { loading: true } }
  },
  [ACTIONS.GET_SUCCESS](state, action) {
    const { payload = {}, resName } = action;
    let total = 0;
    let pageSize = 0;
    let current = 1;
    let data = [];
    if (Array.isArray(payload)) {
      total = payload.length;
      pageSize = total;
      current = 1;
      data = [...payload];
    } else {
      const {
        total: sum = 1,
        per_page: perPage = 20,
        current_page: currentPage = 1,
        data: datalist = [],
      } = payload;
      total = sum * 1;
      pageSize = perPage * 1;
      current = currentPage * 1;
      data = [...datalist];
    }
    const pagination = {
      total,
      current,
      pageSize,
      showQuickJumper: true,
    };

    return {
      ...state,
      [resName]: {
        list: [...data].map((item) => {
          if (item.hasOwnProperty('id')) {
            return { ...item, key: item.id };
          }
          return item;
        }),
        pagination,
        loading: false,
      },
    }
  },
  [ACTIONS.GET_FAIL](state, action) {
    const resName = action.resName;
    const error = action.payload;
    return {
      ...state,
      [resName]: { list: [], pagination: {}, errorMsg: error, loading: false },
    };
  },

  [ACTIONS.DELETE_SUCCESS](state, action) {
    const { resName, payload } = action;
    const { [resName]: resource = {} } = state
    const { list = [] } = resource
    const newList = list.map(item => {
      if (item._id === payload._id) {
        return { ...item, ...payload }
      }
      return item;
    })
    return {
      ...state,
      [resName]: { ...resource, list: newList, loading: false },
    };
  },
  [ACTIONS.OPTIONS_SUCCESS](state, action) {
    const { resName, payload } = action
    const { [resName]: resource = {} } = state
    const { list = [] } = resource
    const newList = list.map(item => {
      if (item._id === payload._id) {
        return { ...item, ...payload }
      }
      return item;
    })

    return {
      ...state,
      [resName]: { ...resource, list: newList, loading: false },
    };
  },
  [ACTIONS.PUT_SUCCESS](state, action) {
    const { resName, payload } = action
    const { [resName]: resource = {} } = state
    const { list = [] } = resource
    const newList = list.map(item => {
      if (item._id === payload._id) {
        return { ...item, ...payload, uin: 0 };
      }
      return item;
    })
    return {
      ...state,
      [resName]: { ...resource, list: newList, loading: false },
    };
  },
  [ACTIONS.GET_INFO_SUCCESS](state, action) {
    const { resName, payload } = action;
    const { [resName]: resource = {} } = state
    const { list = [] } = resource
    const newList = list.map(item => {
      if (item._id === payload._id) {
        return { ...item, ...payload };
      }
      return item;
    })
    return {
      ...state,
      [resName]: { ...resource, list: newList, loading: false },
      info: payload,
    }
  },
  'api/wxclient/login'(state, action) {
    const { resName, payload } = action;
    const resource = state[resName];
    return {
      ...state,
      [resName]: { ...resource, loginData: payload },
    };
  },
  'api/wxclient/login/success'(state, action) {
    const { resName, payload } = action;
    const resource = state[resName];
    const list = [...resource.list].map(item => {
      if (item.id === payload) {
        return { ...item, status: true };
      }
      return item;
    });
    return {
      ...state,
      [resName]: { ...resource, list },
    };
  },
}, {});
