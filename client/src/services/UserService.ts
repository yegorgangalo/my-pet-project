import API from "../http"
import { AxiosResponse } from "axios"
import { IUser } from "../interfaces/IUser"

export default class UserService {
  static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return API.get<IUser[]>("/users")
  }
}