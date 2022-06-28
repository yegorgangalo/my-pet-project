import { LS } from "@mandruy/common/const"
import { put, takeEvery, call, takeLeading } from "redux-saga/effects"
import { UserActionTypes } from "redux/types/user"
import { AxiosError } from "axios"
import { refreshToken } from "http/API"
import { getErrorMessage } from "utils/helpers"
import AuthService from "services/AuthService"
import GoogleService from "services/GoogleService"
import UserService from "services/UserService"
import { IUser } from "interfaces/IUser"
import {
  GoogleAuthAction,
  RegisterAction,
  LoginAction,
  UpdateUserAvatarAction,
} from "./userActions"

export function* userWatcher() {
  yield takeLeading(UserActionTypes.CHECK_AUTH, checkAuthWorker)
  yield takeEvery(UserActionTypes.GOOGLE_AUTH, googleAuth)
  yield takeEvery(UserActionTypes.REGISTRATION_USER, registration)
  yield takeEvery(UserActionTypes.LOGIN_USER, login)
  yield takeEvery(UserActionTypes.LOGOUT_USER, logout)
  yield takeEvery(UserActionTypes.UPDATE_USER_AVATAR, updateUserAvatar)
}

//--------------check auth-------------------
const setCheckAuthSuccess = (user: IUser) => ({
  type: UserActionTypes.CHECK_AUTH_SUCCESS,
  payload: user,
})
const setCheckAuthError = (error: string) => ({
  type: UserActionTypes.CHECK_AUTH_SUCCESS,
  payload: error,
})

function* checkAuthWorker() {
  try {
    const user: IUser = yield call(refreshToken)
    yield put(setCheckAuthSuccess(user))
  } catch (err) {
    yield put(setCheckAuthError(getErrorMessage(err as AxiosError)))
  }
}
//--------------------------------------------

//--------------google auth-------------------
const setGoogleAuthStart = () => ({ type: UserActionTypes.GOOGLE_AUTH_START })
const setGoogleAuthSuccess = (user: IUser) => ({
  type: UserActionTypes.GOOGLE_AUTH_SUCCESS,
  payload: user,
})
const setGoogleAuthError = (error: string) => ({
  type: UserActionTypes.GOOGLE_AUTH_ERROR,
  payload: error,
})

export function* googleAuth(action: GoogleAuthAction) {
  try {
    yield put(setGoogleAuthStart())
    const { data } = yield call(GoogleService.login, action.payload)
    localStorage.setItem(LS.ACCESS_TOKEN, data.accessToken)
    yield put(setGoogleAuthSuccess(data.user))
  } catch (err) {
    yield put(setGoogleAuthError(getErrorMessage(err as AxiosError)))
  }
}
//--------------------------------------------

//---------------registration-----------------
const setRegistrationStart = () => ({
  type: UserActionTypes.REGISTRATION_USER_START,
})
const setRegistrationSuccess = (user: IUser) => ({
  type: UserActionTypes.REGISTRATION_USER_SUCCESS,
  payload: user,
})
const setRegistrationError = (error: string) => ({
  type: UserActionTypes.REGISTRATION_USER_ERROR,
  payload: error,
})

export function* registration(action: RegisterAction) {
  const { name, email, password } = action.payload
  try {
    yield put(setRegistrationStart())
    const { data } = yield call(AuthService.registration, name, email, password)
    localStorage.setItem(LS.ACCESS_TOKEN, data.accessToken)
    yield put(setRegistrationSuccess(data.user))
  } catch (err) {
    yield put(setRegistrationError(getErrorMessage(err as AxiosError)))
  }
}
//--------------------------------------------

//-----------------login----------------------
const setLoginStart = () => ({
  type: UserActionTypes.LOGIN_USER_START,
})
const setLoginSuccess = (user: IUser) => ({
  type: UserActionTypes.LOGIN_USER_SUCCESS,
  payload: user,
})
const setLoginError = (error: string) => ({
  type: UserActionTypes.LOGIN_USER_ERROR,
  payload: error,
})

export function* login(action: LoginAction) {
  const { email, password } = action.payload
  try {
    yield put(setLoginStart())
    const { data } = yield call(AuthService.login, email, password)
    localStorage.setItem(LS.ACCESS_TOKEN, data.accessToken)
    yield put(setLoginSuccess(data.user))
  } catch (err) {
    yield put(setLoginError(getErrorMessage(err as AxiosError)))
  }
}
//--------------------------------------------

//-----------------logout---------------------
const setLogoutStart = () => ({
  type: UserActionTypes.LOGOUT_USER_START,
})
const setLogoutSuccess = () => ({
  type: UserActionTypes.LOGOUT_USER_SUCCESS,
})
const setLogoutError = (error: string) => ({
  type: UserActionTypes.LOGOUT_USER_ERROR,
  payload: error,
})

export function* logout() {
  yield put(setLogoutStart())
  try {
    yield call(AuthService.logout)
    localStorage.removeItem(LS.ACCESS_TOKEN)
    yield put(setLogoutSuccess())
  } catch (err) {
    yield put(setLogoutError(getErrorMessage(err as AxiosError)))
  }
}
//--------------------------------------------

//-----------update user avatar---------------
const setUpdateUserAvatarStart = () => ({
  type: UserActionTypes.UPDATE_USER_AVATAR_START,
})
const setUpdateUserAvatarSuccess = (data: any) => ({
  type: UserActionTypes.UPDATE_USER_AVATAR_SUCCESS,
  payload: data,
})
const setUpdateUserAvatarError = (error: string) => ({
  type: UserActionTypes.UPDATE_USER_AVATAR_ERROR,
  payload: error,
})

export function* updateUserAvatar(action: UpdateUserAvatarAction) {
  const { userId, formData } = action.payload
  try {
    yield put(setUpdateUserAvatarStart())
    const { data } = yield call(UserService.uploadAvatar, userId, formData)
    yield put(setUpdateUserAvatarSuccess(data))
  } catch (err) {
    yield put(setUpdateUserAvatarError(getErrorMessage(err as AxiosError)))
  }
}
//--------------------------------------------
