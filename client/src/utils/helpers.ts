// import { AxiosError } from "axios"

export const getErrorMessage = (err: any /* AxiosError */) => {
  return err?.response?.data?.message || "checkAuth error"
}
