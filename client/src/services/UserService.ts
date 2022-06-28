import API from "http/API"
import { AxiosResponse } from "axios"
import { IUser } from "interfaces/IUser"

export default class UserService {
  static async fetchUsers(): Promise<AxiosResponse<IUser[]>> {
    return API.get<IUser[]>("/users")
  }

  static async uploadAvatar(
    userId: string,
    formData: FormData
  ): Promise<AxiosResponse<string>> {
    return API.post(`/users/avatar/${userId}`, formData)
  }
}
