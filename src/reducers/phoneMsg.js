export default function (state = {}, action) {
    switch (action.type) {
      case 'createPhone/success':
        return { ...state, msg: { ...action.data } }
      default:
        return state;
    }
}
