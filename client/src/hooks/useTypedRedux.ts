import { bindActionCreators } from "redux"
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux"
import { RootState } from "redux/rootReducer"
import Actions from "../redux/actions"

export const useDispatchActions = () => {
  const dispatch = useDispatch()
  return bindActionCreators(Actions, dispatch)
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector
