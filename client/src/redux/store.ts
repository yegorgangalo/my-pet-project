import { createStore, applyMiddleware, Store } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import createSagaMiddleware, { Saga } from "redux-saga"
import rootReducer, { RootState } from "./rootReducer"
import { rootSagaWatcher } from "./rootSagaWatcher"

const sagaMiddleware = createSagaMiddleware()

export const store: Store<RootState> = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
)

sagaMiddleware.run(rootSagaWatcher as Saga<Generator[]>)
