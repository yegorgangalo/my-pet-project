import { ROLES } from "@mandruy/common/const"

export interface IRole {
  _id: string
  value: keyof typeof ROLES
  description: string
}
