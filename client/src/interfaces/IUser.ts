import { IRole } from "./IRole"

export interface IUser {
  _id: string
  name: string
  email: string
  avatar: string
  isActivated: boolean
  roles: Array<IRole>
}
