export interface IAuthUser {
  _id: string
  name: string
  email: string
  roles: string[]
  fileCount?: number
  authMethods?: string[]
}
