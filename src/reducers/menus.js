import { combineReducer } from 'redux';

export default function (state = { list: [], loading: false }, action) {
  switch (action.type) {
    case 'menus/get':
      return { ...state, loading: true };
    case 'menus/get/success':
      return { ...state, list: action.payload, loading: false };
    default:
      return state;
  }
}

