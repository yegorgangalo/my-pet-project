import API from "../http"
import { AxiosResponse } from "axios"
import { IAuthResponse } from "../interfaces/IAuthResponse"

export default class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<IAuthResponse>> {
    return API.post<IAuthResponse>("/auth/login", { email, password })
  }

  static async registration(
    name: string,
    email: string,
    password: string
  ): Promise<AxiosResponse<IAuthResponse>> {
    return API.post<IAuthResponse>("/auth/registration", {
      name,
      email,
      password,
    })
  }

  static async logout(): Promise<void> {
    return API.get("/auth/logout")
  }

  static async sendActivationMail(
    userId: string
  ): Promise<AxiosResponse<IAuthResponse>> {
    return API.get(`/mail/${userId}`)
  }
}
