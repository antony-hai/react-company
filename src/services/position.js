import xFetch from './xFetch';
import { version } from '../actions'

const resName = 'simCards/indexes';

export async function getBooks(url) {
  return xFetch(`/${version}/${resName}/books?f=${url}`);
}

export async function getPages(url, field) {
  return xFetch(`/${version}/${resName}/pages?f=${url}`)
}

export async function getBoxes(url, field) {
  return xFetch(`/${version}/${resName}/boxes?f=${url}`)
}

export async function getBox(url) {
  return xFetch(`/${version}/${resName}/box?f=${url}`)
}

