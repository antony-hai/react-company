import xFetch from './xFetch';

export async function getList(url) {
  return xFetch(url);
}

export function getListAction(params) {
  const { resName, filter, page = 1, sort } = params
  return {
    type: 'res/get',
    payload: {
      resName,
      filter,
      page,
      sort,
    },
  }
}
