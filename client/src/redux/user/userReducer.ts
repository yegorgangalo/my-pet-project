import { IUser } from "interfaces/IUser"
import { Reducer } from "redux"
import { UserState, UserAction, UserActionTypes } from "redux/types/user"

const initialState: UserState = {
  user: {} as IUser,
  isAuth: false,
  isLoadedBE: false,
  isLoading: false,
  error: null,
}

export const userReducer: Reducer<UserState, UserAction> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case UserActionTypes.SET_IS_LOADED_BE:
      return { ...state, isLoadedBE: true }

    case UserActionTypes.CHECK_AUTH_SUCCESS:
      return {
        ...state,
        isLoadedBE: true,
        isAuth: true,
        isLoading: false,
        user: action.payload,
      }
    case UserActionTypes.CHECK_AUTH_ERROR:
      return {
        ...state,
        isLoadedBE: true,
        isLoading: false,
        error: action.payload,
      }

    case UserActionTypes.GOOGLE_AUTH_START:
      return { ...state, isLoading: true, error: null }
    case UserActionTypes.GOOGLE_AUTH_SUCCESS:
      return { ...state, isAuth: true, isLoading: false, user: action.payload }
    case UserActionTypes.GOOGLE_AUTH_ERROR:
      return { ...state, isLoading: false, error: action.payload }

    case UserActionTypes.REGISTRATION_USER_START:
      return { ...state, isLoading: true, error: null }
    case UserActionTypes.REGISTRATION_USER_SUCCESS:
      return { ...state, isAuth: true, isLoading: false, user: action.payload }
    case UserActionTypes.REGISTRATION_USER_ERROR:
      return { ...state, isLoading: false, error: action.payload }

    case UserActionTypes.LOGIN_USER_START:
      return { ...state, isLoading: true, error: null }
    case UserActionTypes.LOGIN_USER_SUCCESS:
      return { ...state, isAuth: true, isLoading: false, user: action.payload }
    case UserActionTypes.LOGIN_USER_ERROR:
      return { ...state, isLoading: false, error: action.payload }

    case UserActionTypes.LOGOUT_USER_START:
      return { ...state, isLoading: true, error: null }
    case UserActionTypes.LOGOUT_USER_SUCCESS:
      return { ...state, isAuth: false, isLoading: false, user: {} as IUser }
    case UserActionTypes.LOGOUT_USER_ERROR:
      return { ...state, isLoading: false, error: action.payload }

    case UserActionTypes.UPDATE_USER_AVATAR_START:
      return { ...state, isLoading: true, error: null }
    case UserActionTypes.UPDATE_USER_AVATAR_SUCCESS:
      return {
        ...state,
        isLoading: false,
        user: { ...state.user, avatar: action.payload },
      }
    case UserActionTypes.UPDATE_USER_AVATAR_ERROR:
      return { ...state, isLoading: false, error: action.payload }

    default:
      return state
  }
}
