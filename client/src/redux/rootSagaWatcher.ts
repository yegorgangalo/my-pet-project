import { all } from "redux-saga/effects"
import { userWatcher } from "./user/userSaga"

export function* rootSagaWatcher() {
  yield all([userWatcher()])
}
