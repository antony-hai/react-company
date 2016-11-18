export default function (state = {}, action) {
  const { payload } = action
  switch (action.type) {
    case 'books/get':
      return { ...state, books: [], };
    case 'books/get/success':
      const books = [...payload].map(item => {
        if (item < 10) {
          return `000${item}`
        } else if (10 <= item < 100) {
          return `00${item}`
        } else if (100 <= item < 1000) {
          return `0${item}`
        } else {
          return `${item}`
        }
      }) 
      return { ...state, books }
    case 'pages/get':
      const pages = [...payload].map(item => {
        return item < 10 ? `0${item}` : `${item}`
      })
      return { ...state, pages }
    case 'boxes/get':
      const boxes = [...payload].map(item => {
        return item < 10 ? `0${item}` : `${item}`
      })
      return { ...state, boxes }
    case 'box/get' :
      return { ...state, box: payload, }
    default:
      return state; 
  }
}