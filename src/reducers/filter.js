import { handleActions } from 'redux-actions';

function comparObjectByKeys(objectA, objectB) {
  const keysA = Object.keys(objectA)
  const keysB = Object.keys(objectB)
  if (keysA.length === keysB.length) {
    return keysA.reduce((pre, current) => {
      if (typeof pre === 'string') {
        return keysB.includes(pre) && keysB.includes(current)
      }
      return pre && keysB.includes(current)
    });
  }
  return false
}

export default handleActions({
  'filter/clear'(state) {
    const newState = {};
    Object.keys(state).forEach(key => {
      newState[key] = undefined;
    });
    return newState;
  },
  'filter/create'(state, action) {
    const newFilter = action.payload
    // 比较过滤器结构是不是有变更
    if (comparObjectByKeys(newFilter, state)) {
      return state
    }
    return newFilter
  },
  'filter/change'(state, action) {
    const changeField = action.payload;
    let newField = {};
    Object.keys(changeField).forEach(key => {
      if (state.hasOwnProperty(key)) {
        let value = changeField[key].value;
        if (value !== undefined) {
          value = value.trim() === '' ? undefined : value;
        }
        newField = { ...newField, [key]: value };
      }
    })
    return { ...state, ...newField };
  },
  'filter/update'(state, action) {
    const { payload = {} } = action
    return { ...state, ...payload }
  },
  'filter/submit'(state, action) {
    const { payload } = action;
    return {
      ...state,
      ...payload,
    };
  },
}, {});
