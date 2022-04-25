import API from "../http"
import { AxiosResponse } from "axios"
import { AuthResponse } from "../models/response/AuthResponse"

export default class AuthService {
  static async login(
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return API.post<AuthResponse>("/auth/login", { email, password })
  }

  static async registration(
    name: string,
    email: string,
    password: string
  ): Promise<AxiosResponse<AuthResponse>> {
    return API.post<AuthResponse>("/auth/registration", {
      name,
      email,
      password,
    })
  }

  static async logout(): Promise<void> {
    return API.get("/auth/logout")
  }
}
