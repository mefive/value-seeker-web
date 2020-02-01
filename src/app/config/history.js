import { createBrowserHistory } from 'history';

let history = null;

export function createHistory(basename) {
  history = createBrowserHistory({ basename });
  return history;
}

export function getHistory() {
  return history;
}
