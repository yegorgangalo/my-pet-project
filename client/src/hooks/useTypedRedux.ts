import { bindActionCreators } from "redux"
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux"
import { RootState } from "redux/rootReducer"
import Operations from "../redux/operations"

export const useOperations = () => {
  const dispatch = useDispatch()
  return bindActionCreators(Operations, dispatch)
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
