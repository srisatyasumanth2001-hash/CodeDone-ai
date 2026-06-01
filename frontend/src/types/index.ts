
export interface User {
  id: number
  email: string
  full_name: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface SignupData {
  email: string
  password: string
  full_name: string
}

export interface LoginData {
  email: string
  password: string
}