import { LS, ENV } from "@mandruy/common/const"
import { UserAction, UserActionTypes } from "redux/types/user"
import { Dispatch } from "redux"
import axios, { AxiosError } from "axios"
import { IAuthResponse } from "interfaces/IAuthResponse"
import AuthService from "services/AuthService"
import GoogleService from "services/GoogleService"
import UserService from "services/UserService"

export const setIsLoadedBE = () => ({ type: UserActionTypes.SET_IS_LOADED_BE })

export const refreshToken = async () => {
  const { data } = await axios.get<IAuthResponse>(
    `${process.env[`REACT_APP_${ENV.SERVER_URL}`]}/auth/refresh`,
    { withCredentials: true }
  )
  localStorage.setItem(LS.ACCESS_TOKEN, data.accessToken)
  return data.user
}

export const checkAuth = () => async (dispatch: Dispatch<UserAction>) => {
  try {
    const user = await refreshToken()
    dispatch({
      type: UserActionTypes.CHECK_AUTH_SUCCESS,
      payload: user,
    })
  } catch (err) {
    dispatch({
      type: UserActionTypes.CHECK_AUTH_ERROR,
      payload:
        (err as AxiosError)?.response?.data?.message || "checkAuth error",
    })
  }
}

export const googleAuth =
  (token: string) => async (dispatch: Dispatch<UserAction>) => {
    dispatch({ type: UserActionTypes.GOOGLE_AUTH_START })
    try {
      const { data } = await GoogleService.login(token)
      localStorage.setItem(LS.ACCESS_TOKEN, data.accessToken)
      dispatch({
        type: UserActionTypes.GOOGLE_AUTH_SUCCESS,
        payload: data.user,
      })
    } catch (err) {
      dispatch({
        type: UserActionTypes.GOOGLE_AUTH_ERROR,
        payload:
          (err as AxiosError)?.response?.data?.message || "checkAuth error",
      })
    }
  }

export const registration =
  (name: string, email: string, password: string) =>
  async (dispatch: Dispatch<UserAction>) => {
    dispatch({ type: UserActionTypes.REGISTRATION_USER_START })
    try {
      const { data } = await AuthService.registration(name, email, password)
      localStorage.setItem(LS.ACCESS_TOKEN, data.accessToken)
      dispatch({
        type: UserActionTypes.REGISTRATION_USER_SUCCESS,
        payload: data.user,
      })
    } catch (err) {
      dispatch({
        type: UserActionTypes.REGISTRATION_USER_ERROR,
        payload:
          (err as AxiosError)?.response?.data?.message || "checkAuth error",
      })
    }
  }

export const login =
  (email: string, password: string) =>
  async (dispatch: Dispatch<UserAction>) => {
    dispatch({ type: UserActionTypes.LOGIN_USER_START })
    try {
      const { data } = await AuthService.login(email, password)
      localStorage.setItem(LS.ACCESS_TOKEN, data.accessToken)
      dispatch({ type: UserActionTypes.LOGIN_USER_SUCCESS, payload: data.user })
    } catch (err) {
      dispatch({
        type: UserActionTypes.LOGIN_USER_ERROR,
        payload:
          (err as AxiosError)?.response?.data?.message || "checkAuth error",
      })
    }
  }

export const logout = () => async (dispatch: Dispatch<UserAction>) => {
  dispatch({ type: UserActionTypes.LOGOUT_USER_START })
  try {
    await AuthService.logout()
    localStorage.removeItem(LS.ACCESS_TOKEN)
    dispatch({ type: UserActionTypes.LOGOUT_USER_SUCCESS })
  } catch (err) {
    dispatch({
      type: UserActionTypes.LOGOUT_USER_ERROR,
      payload:
        (err as AxiosError)?.response?.data?.message || "checkAuth error",
    })
  }
}

export const updateUserAvatar =
  (userId: string, formData: FormData) =>
  async (dispatch: Dispatch<UserAction>) => {
    dispatch({ type: UserActionTypes.UPDATE_USER_AVATAR_START })
    try {
      const { data } = await UserService.uploadAvatar(userId, formData)
      dispatch({
        type: UserActionTypes.UPDATE_USER_AVATAR_SUCCESS,
        payload: data,
      })
      //   store.user.avatar = data
    } catch (err) {
      dispatch({
        type: UserActionTypes.UPDATE_USER_AVATAR_ERROR,
        payload:
          (err as AxiosError)?.response?.data?.message || "checkAuth error",
      })
    }
  }
