import type { IAuthUser } from "~/types/auth/auth-user.interface"

export interface IAdminUsersResponse {
  users: IAuthUser[]
  total: number
  page: number
  limit: number
}
