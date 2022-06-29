import { all, spawn, call } from "redux-saga/effects"
import { userWatcher } from "./user/userSaga"
// import * as userWatchers from "./user/userSaga"
// const sagaWatchers = Object.values(userWatchers)

// export function* rootSagaWatcher() {
//   yield all([userWatcher()])
// }

// export function* rootSagaWatcher(): Generator {
//   const sagaWatchers = [userWatcher]
//   yield all(sagaWatchers.map((s) => spawn(s)))
// }

/* sagas autorestarter with catch errors */
export function* rootSagaWatcher() {
  const sagaWatchers = [userWatcher]
  const retrySagaWatchers: Generator[] = yield sagaWatchers.map(
    (sagaWatcher) => {
      return spawn(function* () {
        while (true) {
          try {
            yield call(sagaWatcher)
            break
          } catch (err) {
            console.log("Saga watcher error >> ", err)
          }
        }
      })
    }
  )
  yield all(retrySagaWatchers)
}
