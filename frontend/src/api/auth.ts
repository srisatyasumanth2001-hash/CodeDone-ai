import api from './axios'
import type { SignupData, LoginData, User, TokenResponse } from '../types'

export const signupUser = async(data:SignupData):Promise<User>=>{
    const response= await api.post('/auth/signup', data)
    return response.data
}

export const loginUser = async(data:LoginData):Promise<TokenResponse>=>{
    const response = await api.post('/auth/login', data)
    return response.data
}

export const getMyProfile = async():Promise<User>=>{
    const response = await api.get('/auth/me')
    return response.data
}

export const updateProfile = async (fullName: string): Promise<User> => {
  const response = await api.patch('/auth/me', { full_name: fullName })
  return response.data
}