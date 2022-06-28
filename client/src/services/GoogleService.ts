import API from "http/API"
import { AxiosResponse } from "axios"
import { IAuthResponse } from "../interfaces/IAuthResponse"

export default class GoogleService {
  static async login(token: string): Promise<AxiosResponse<IAuthResponse>> {
    return API.post<IAuthResponse>("/auth-google/login", { token })
  }
}
