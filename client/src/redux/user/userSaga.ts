import { LS } from "@mandruy/common/const"
import {
  put,
  takeEvery,
  call,
  takeLeading,
  take,
  cancel,
  fork,
} from "redux-saga/effects"
import { Task } from "redux-saga"
import { UserActionTypes } from "redux/types/user"
import { AxiosError, AxiosResponse } from "axios"
import { refreshToken } from "http/API"
import { getErrorMessage } from "utils/helpers"
import AuthService from "services/AuthService"
import GoogleService from "services/GoogleService"
import UserService from "services/UserService"
import { IUser } from "interfaces/IUser"
import { IAuthResponse } from "interfaces/IAuthResponse"
import {
  GoogleAuthAction,
  RegisterAction,
  LoginAction,
  UpdateUserAvatarAction,
} from "./userActions"

function* abortIdenticalRequestWorker(
  actionType: UserActionTypes,
  worker: any
) {
  let task: Task | null = null
  let abortController = new AbortController()

  while (true) {
    const payload: LoginAction = yield take(actionType)
    if (task) {
      abortController.abort()
      yield cancel(task as Task)
      task = null
      abortController = new AbortController()
    }
    task = yield fork(worker, payload, abortController.signal)
  }
}

export function* userWatcher() {
  yield takeLeading(UserActionTypes.CHECK_AUTH, checkAuthWorker)
  yield takeEvery(UserActionTypes.GOOGLE_AUTH, googleAuthWorker)
  yield takeEvery(UserActionTypes.REGISTRATION_USER, registrationWorker)
  yield takeEvery(UserActionTypes.LOGOUT_USER, logoutWorker)
  yield takeEvery(UserActionTypes.UPDATE_USER_AVATAR, updateUserAvatarWorker)
  // yield abortIdenticalRequestWorker(UserActionTypes.LOGIN_USER, loginWorker) //blocks next under
}

export function* userLoginWatcher() {
  yield abortIdenticalRequestWorker(UserActionTypes.LOGIN_USER, loginWorker) //blocks next under
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

function* googleAuthWorker(action: GoogleAuthAction) {
  try {
    yield put(setGoogleAuthStart())
    const res: AxiosResponse<IAuthResponse> = yield call(
      GoogleService.login,
      action.payload
    )
    const { accessToken, user } = res.data
    localStorage.setItem(LS.ACCESS_TOKEN, accessToken)
    yield put(setGoogleAuthSuccess(user))
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

function* registrationWorker(action: RegisterAction) {
  const { name, email, password } = action.payload
  try {
    yield put(setRegistrationStart())
    const res: AxiosResponse<IAuthResponse> = yield call(
      AuthService.registration,
      name,
      email,
      password
    )
    const { accessToken, user } = res.data
    localStorage.setItem(LS.ACCESS_TOKEN, accessToken)
    yield put(setRegistrationSuccess(user))
  } catch (err) {
    yield put(setRegistrationError(getErrorMessage(err as AxiosError)))
  }
}
//--------------------------------------------

//-----------------loginWorker----------------------
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

function* loginWorker(action: LoginAction, signal: AbortSignal) {
  const { email, password } = action.payload
  try {
    yield put(setLoginStart())
    const res: AxiosResponse<IAuthResponse> = yield call(
      AuthService.login,
      email,
      password,
      signal
    )
    const { accessToken, user } = res.data
    localStorage.setItem(LS.ACCESS_TOKEN, accessToken)
    yield put(setLoginSuccess(user))
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

function* logoutWorker() {
  console.log("logoutWorker")

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

function* updateUserAvatarWorker(action: UpdateUserAvatarAction) {
  const { userId, formData } = action.payload
  try {
    yield put(setUpdateUserAvatarStart())
    const res: AxiosResponse = yield call(
      UserService.uploadAvatar,
      userId,
      formData
    )
    yield put(setUpdateUserAvatarSuccess(res.data))
  } catch (err) {
    yield put(setUpdateUserAvatarError(getErrorMessage(err as AxiosError)))
  }
}
//--------------------------------------------
