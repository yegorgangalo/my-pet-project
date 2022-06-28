import { AxiosError } from "axios"

export const getErrorMessage = (err: AxiosError) => {
  return err?.response?.data?.message || "checkAuth error"
}
