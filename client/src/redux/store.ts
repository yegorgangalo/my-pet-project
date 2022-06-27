import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import { composeWithDevTools } from "redux-devtools-extension"
import rootReducer from "./rootReducer"

// import createSagaMiddleware from 'redux-saga'
// import { rootSaga } from './sagas/rootSaga'
// const sagaMiddleware = createSagaMiddleware()
// sagaMiddleware.run(rootSaga)

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
)

export default store
