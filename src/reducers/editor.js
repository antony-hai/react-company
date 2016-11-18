import { EDITOR_CANCEL, EDITOR_OPEN, EDITOR_SWITCH } from '../components/EditorModal';

export default function (state = {}, action) {
  switch (action.type) {
    case EDITOR_SWITCH:
      return { ...state, refuse: !state.refuse };
    case EDITOR_CANCEL:
      return { ...state, visible: false, refuse: false };
    case EDITOR_OPEN:
      return { ...state, visible: true, title: action.payload };
    case 'editor/init-form':
      return { ...state, form: action.payload };
    default:
      return state;
  }
}
