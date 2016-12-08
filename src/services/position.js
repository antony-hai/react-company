import xFetch from './xFetch';
import { version } from '../actions'

const resName = 'simCards/indexes';

export async function getBooks(field) {
  return xFetch(`/${version}/${resName}/books${field}`);
}

export async function getPages(url, field) {
  return xFetch(`/${version}/${resName}/pages${field}?f=${url}`)
}

export async function getBoxes(url, field) {
  return xFetch(`/${version}/${resName}/boxes${field}?f=${url}`)
}

export async function getBox(url) {
  return xFetch(`/${version}/${resName}/box?f=${url}`)
}

