import {create} from 'zustand'
import type {User} from '../types'

interface AuthState {
    user : User | null
    isAuthenticated : boolean
    isLoading: boolean
    setUser : (user:User)=> void
    setLoading: (loading: boolean) => void
    logout :() => void
}

export const useAuthStore  = create<AuthState>((set)=>({
    user : null,
    isAuthenticated: !!localStorage.getItem('access_token'),
    isLoading: !!localStorage.getItem('access_token'),
    setUser : (user:User)=> set({
        user,
        isAuthenticated:true
    }),
    setLoading: (loading: boolean) => set({ isLoading: loading }),
    logout: () =>{
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        set({user :null, isAuthenticated: false, isLoading: false})
    }
}))