import { IUser } from "interfaces/IUser"

export interface UserState {
  user: IUser
  isAuth: boolean
  isLoadedBE: boolean
  isLoading: boolean
  error: null | string
}

export enum UserActionTypes {
  SET_IS_LOADED_BE = "SET_IS_LOADED_BE",

  CHECK_AUTH_SUCCESS = "CHECK_AUTH_SUCCESS",
  CHECK_AUTH_ERROR = "CHECK_AUTH_ERROR",

  GOOGLE_AUTH_START = "GOOGLE_AUTH_START",
  GOOGLE_AUTH_SUCCESS = "GOOGLE_AUTH_SUCCESS",
  GOOGLE_AUTH_ERROR = "GOOGLE_AUTH_ERROR",

  REGISTRATION_USER_START = "REGISTRATION_USER_START",
  REGISTRATION_USER_SUCCESS = "REGISTRATION_USER_SUCCESS",
  REGISTRATION_USER_ERROR = "REGISTRATION_USER_ERROR",

  LOGIN_USER_START = "LOGIN_USER_START",
  LOGIN_USER_SUCCESS = "LOGIN_USER_SUCCESS",
  LOGIN_USER_ERROR = "LOGIN_USER_ERROR",

  LOGOUT_USER_START = "LOGOUT_USER_START",
  LOGOUT_USER_SUCCESS = "LOGOUT_USER_SUCCESS",
  LOGOUT_USER_ERROR = "LOGOUT_USER_ERROR",

  UPDATE_USER_AVATAR_START = "UPDATE_USER_AVATAR_START",
  UPDATE_USER_AVATAR_SUCCESS = "UPDATE_USER_AVATAR_SUCCESS",
  UPDATE_USER_AVATAR_ERROR = "UPDATE_USER_AVATAR_ERROR",
}

interface SetIsLoadedBE {
  type: UserActionTypes.SET_IS_LOADED_BE
}

interface CheckAuthSuccessAction {
  type: UserActionTypes.CHECK_AUTH_SUCCESS
  payload: IUser
}
interface CheckAuthErrorAction {
  type: UserActionTypes.CHECK_AUTH_ERROR
  payload: string
}

interface GoogleAuthStartAction {
  type: UserActionTypes.GOOGLE_AUTH_START
}
interface GoogleAuthSuccessAction {
  type: UserActionTypes.GOOGLE_AUTH_SUCCESS
  payload: IUser
}
interface GoogleAuthErrorAction {
  type: UserActionTypes.GOOGLE_AUTH_ERROR
  payload: string
}

interface RegistrationUserStartAction {
  type: UserActionTypes.REGISTRATION_USER_START
}
interface RegistrationUserSuccessAction {
  type: UserActionTypes.REGISTRATION_USER_SUCCESS
  payload: IUser
}
interface RegistrationUserErrorAction {
  type: UserActionTypes.REGISTRATION_USER_ERROR
  payload: string
}

interface LoginUserStartAction {
  type: UserActionTypes.LOGIN_USER_START
}
interface LoginUserSuccessAction {
  type: UserActionTypes.LOGIN_USER_SUCCESS
  payload: IUser
}
interface LoginUserErrorAction {
  type: UserActionTypes.LOGIN_USER_ERROR
  payload: string
}

interface LogoutUserStartAction {
  type: UserActionTypes.LOGOUT_USER_START
}
interface LogoutUserSuccessAction {
  type: UserActionTypes.LOGOUT_USER_SUCCESS
}
interface LogoutUserErrorAction {
  type: UserActionTypes.LOGOUT_USER_ERROR
  payload: string
}

interface UpdateUserAvatarStartAction {
  type: UserActionTypes.UPDATE_USER_AVATAR_START
}
interface UpdateUserAvatarSuccessAction {
  type: UserActionTypes.UPDATE_USER_AVATAR_SUCCESS
  payload: string
}
interface UpdateUserAvatarErrorAction {
  type: UserActionTypes.UPDATE_USER_AVATAR_ERROR
  payload: string
}

export type UserAction =
  | SetIsLoadedBE
  | CheckAuthSuccessAction
  | CheckAuthErrorAction
  | GoogleAuthStartAction
  | GoogleAuthSuccessAction
  | GoogleAuthErrorAction
  | RegistrationUserStartAction
  | RegistrationUserSuccessAction
  | RegistrationUserErrorAction
  | LoginUserStartAction
  | LoginUserSuccessAction
  | LoginUserErrorAction
  | LogoutUserStartAction
  | LogoutUserSuccessAction
  | LogoutUserErrorAction
  | UpdateUserAvatarStartAction
  | UpdateUserAvatarSuccessAction
  | UpdateUserAvatarErrorAction
