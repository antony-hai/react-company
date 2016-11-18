import { handleActions } from 'redux-actions';

export default handleActions({
  'auth/init'(state, action) {
    return action.payload;
  },
}, {});
