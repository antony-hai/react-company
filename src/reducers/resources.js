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
  [ACTIONS.GET_INFO](state, action) {
    const { payload } = action
    const id = payload.id;
    return {
      ...state,
      info: { loading: true, used_id: id },
    }
  },
  [ACTIONS.GET_INFO_SUCCESS](state, action) {
    const { resName, payload } = action;
    const { [resName]: resource = {}, info: singleInfo = {} } = state
    const { list = [] } = resource
    const newList = list.map(item => {
      if (item._id === payload._id) {
        return { ...item, ...payload };
      }
      return item;
    })
    let infoList = [];
    let id_group = [];
    if (payload.hasOwnProperty('data')) {
      infoList = payload.data;
      id_group = payload.data.map(item => {
        return item._id;
      })
    } else {
      infoList = payload
    }
    return {
      ...state,
      [resName]: { ...resource, list: newList, loading: false },
      info: { ...singleInfo, infoList, loading: false },
      id_group,
    }
  },
  [ACTIONS.ADD_WX_SUCCESS](state, action) {
    const { payload } = action;
    const { info: singleInfo = {} } = state;
    const { infoList = [] } = singleInfo;
    const newList = payload.concat(infoList)
    const id_group = newList.map(item => {
      return item._id;
    })
    return {
      ...state,
      info: { ...singleInfo, infoList: newList, loading: false },
      id_group,
    }
  },
  [ACTIONS.DELETE_WX](state, action) {
    const { payload } = action
    const { info: singleInfo = [], id_group = [] } = state;
    const { infoList } = singleInfo;
    const newList = [];
    const newIdGroup = [];
    infoList.forEach(item => {
      if (item._id !== payload) {
        newList.push(item);
        newIdGroup.push(item._id)
      }
    })
    return {
      ...state,
      info: { ...singleInfo, infoList: newList, loading: false },
      id_group: newIdGroup,
    }
  },
  [ACTIONS.DELETE_ALL_WX](state, action) {
    const { info: singleInfo = [], id_group = [] } = state;
    const { infoList } = singleInfo;
    const newList = [];
    const newIdGroup = [];
    infoList.forEach(item => {
      if (item.project_id) {
        newList.push(item);
        newIdGroup.push(item._id);
      }
    })
    return {
      ...state,
      info: { ...singleInfo, infoList: newList, loading: false },
      id_group: newIdGroup,
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
