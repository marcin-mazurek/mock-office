import { take } from 'redux-saga/effects';

/* eslint-disable no-constant-condition */
export default function* () {
  while (true) {
    yield take('APP_INIT');
  }
}
