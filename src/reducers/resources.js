import { handleActions } from 'redux-actions';

export default handleActions({
  'res/get'(state, action) {
    const { resName } = action.payload;
    return {
      ...state,
      [resName]: {
        loading: true,
      },
    }
  },
  'res/get/success'(state, action) {
    const { payload = {} } = action;
    let total = 0;
    let pageSize = 0;
    let current = 1;
    let data = [];

    if (Array.isArray(payload)) {
      total = payload.length;
      pageSize = total;
      current = 1;
      data = [
        ...payload,
      ];
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
      data = [
        ...datalist,
      ];
    }   
    const resName = action.resName;
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
            return {
              ...item,
              key: item.id,
            };
          }
          return item;
        }),
        pagination,
        loading: false,
      },
    }
  },
  'res/get/fail'(state, action) {
    const resName = action.resName;
    const error = action.payload;

    return {
      ...state,
      [resName]: {
        list: [],
        pagination: {},
        errorMsg: error,
        loading: false,
      },
    };
  },

  'api/user/disabled'(state, action) {
    const { resName, payload, data } = action
    const resource = state[resName]
    const list = [...resource.list].map(item => {
      if (item._id === payload) {
        return {
          ...data,
        }     
      }
      return item;
    })

    return {
      ...state,
      [resName]: {
        ...resource,
        list,
      },
    };
  },

  'api/clearUIN'(state, action) {
    const { resName, payload, data } = action
    const resource = state[resName]
    const list = [...resource.list].map(item => {
      if (item._id === payload) {
        return {
          ...item,
          uin: '0',
        };
      }
      return item;
    })
    return {
      ...state,
      [resName]: {
        ...resource,
        list,
      },
    };
  },
  'api/wx/update'(state, action) {
    const { resName, payload, data } = action;
    const resource = state[resName];
    const list = [...resource.list].map(item => {
      if (item._id === payload) {
        return {
          ...item,
          ...data,
        };
      }
      return item; 
    })
    return {
      ...state,
      [resName]: {
        ...resource,
        list,
      }
    }
  },

  'res/group/success'(state, action) {
    const { resName, payload } = action;
    const { id, name, parent_id, com_key } = payload;
    const resource = state[resName];
    let parentId = parent_id;

    // 当 parent_id 为空或不存在时，使用 com_key 匹配
    if (!parentId) {
      parentId = com_key;
    }

    const hasItem = (list, item) => list.filter(current => item.id === current.id);

    const loop = data => data.map(item => {
      if (item.id === id) {
        return {
          ...item,
          name,
        };
      } else if (item.id === parentId) {
        const filterItem = hasItem(item.children, payload);

        if (filterItem.length) {
          return {
            ...item,
            children: loop(item.children),
          };
        }

        item.children.push({
          ...payload,
          children: [],
        });
        return item;
      } else if (item.hasOwnProperty('children')) {
        return {
          ...item,
          children: loop(item.children),
        };
      }

      return {
        ...payload,
        children: [],
      };
    });
    const list = loop(resource.list);

    return {
      ...state,
      [resName]: {
        ...resource,
        list,
      },
    };
  },
  'api/wxclient/login'(state, action) {
    const { resName, payload } = action;
    const resource = state[resName];
    return {
      ...state,
      [resName]: {
        ...resource,
        loginData: payload,
      },
    };
  },
  'api/wxclient/login/success'(state, action) {
    const { resName, payload } = action;
    const resource = state[resName];
    const list = [...resource.list].map(item => {
      if (item.id === payload) {
        return {
          ...item,
          status: true,
        };
      }
      return item;
    });

    return {
      ...state,
      [resName]: {
        ...resource,
        list,
      },
    };
  },
}, {});
