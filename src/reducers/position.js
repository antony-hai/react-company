import { handleActions } from 'redux-actions';
import { Book as ACTIONS } from '../actions';

export default handleActions({
  [ACTIONS.GET](state, action) {
    return { ...state, books: [] }
  },

  [ACTIONS.GET_SUCCESS](state, action) {
    const { payload = [] } = action;
    const books = [...payload].map(item => {
      if (item < 10) {
        return `000${item}`
      } else if (10 <= item && item < 100) {
        return `00${item}`
      } else if (100 <= item && item < 1000) {
        return `0${item}`
      }
      return `${item}`
    })
    return { ...state, books }
  },

  [ACTIONS.GET_PAGES_SUCCESS](state, action) {
    const { payload } = action;
    const pages = [...payload].map(item => {
      return item < 10 ? `0${item}` : `${item}`
    })
    return { ...state, pages }
  },

  [ACTIONS.GET_BOXES_SUCCESS](state, action) {
    const { payload } = action;
    const boxes = [...payload].map(item => {
      return item < 10 ? `0${item}` : `${item}`
    })
    return { ...state, boxes }
  },

  [ACTIONS.GET_BOX_SUCCESS](state, action) {
    const { payload } = action;
    return { ...state, box: payload }
  },
}, {})
