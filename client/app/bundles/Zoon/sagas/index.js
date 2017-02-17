import { spawn } from 'redux-saga/effects'

import modules from './modules';
import auth from './auth';

export default function* sagas() {
  yield [
    spawn(modules),
    spawn(auth),
  ];
}
