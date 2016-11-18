import xFetch from './xFetch';
import { menusUrl } from '../urlAddress'


export async function getAll() {
  return xFetch(menusUrl);
}
