import { spawn } from 'redux-saga/effects'

import modules from './modules';
import auth from './auth';
import tags from './tags';
import workflows from './workflows';

export default function* sagas() {
  yield [
    spawn(modules),
    spawn(auth),
    spawn(tags),
    spawn(workflows),
  ];
}
