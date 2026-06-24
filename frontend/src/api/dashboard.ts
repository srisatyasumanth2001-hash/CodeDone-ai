import api from './axios'
import type { DashboardStats } from '../types'

export const getDashboardStats = async (): Promise<DashboardStats> =>{

    const response = await api.get('/dashboard/stats')
    
    return response.data
}