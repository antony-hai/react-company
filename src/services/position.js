import xFetch from './xFetch';
import { booksUrl } from '../urlAddress'
import { toBase64 } from './common'
import { message } from 'antd'


export async function getAll() {
  return xFetch(`${booksUrl}/books`);
}
