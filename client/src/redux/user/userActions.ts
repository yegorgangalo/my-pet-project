import { UserActionTypes } from "redux/types/user"
import { IRegisterData } from "interfaces/IRegisterData"
import { ILoginData } from "interfaces/ILoginData"
import { IUpdateUserAvatarData } from "interfaces/IUpdateUserAvatarData"

export const setIsLoadedBE = () => ({
  type: UserActionTypes.SET_IS_LOADED_BE,
}) //sync without saga

export const checkAuth = () => ({
  type: UserActionTypes.CHECK_AUTH,
})

export const googleAuth = (token: string) => ({
  type: UserActionTypes.GOOGLE_AUTH,
  payload: token,
})
export const register = (payload: IRegisterData) => ({
  type: UserActionTypes.REGISTRATION_USER,
  payload,
})

export const login = (payload: ILoginData) => ({
  type: UserActionTypes.LOGIN_USER,
  payload,
})

export const logout = () => ({
  type: UserActionTypes.LOGOUT_USER,
})

export const updateUserAvatar = (payload: IUpdateUserAvatarData) => ({
  type: UserActionTypes.UPDATE_USER_AVATAR,
  payload,
})

export type GoogleAuthAction = ReturnType<typeof googleAuth>
export type RegisterAction = ReturnType<typeof register>
export type LoginAction = ReturnType<typeof login>
export type LogoutAction = ReturnType<typeof logout>
export type UpdateUserAvatarAction = ReturnType<typeof updateUserAvatar>
