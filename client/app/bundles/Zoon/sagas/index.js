import { spawn } from 'redux-saga/effects'

import modules from './modules';

export default function* sagas() {
  yield [
    spawn(modules),
  ];
}
