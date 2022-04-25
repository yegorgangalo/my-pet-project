import { IRole } from "./IRole"

export interface IUser {
  _id: string
  name: string
  email: string
  isActivated: boolean
  roles: Array<IRole>
}
