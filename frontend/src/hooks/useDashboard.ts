import { useState, useCallback } from "react";
import type { DashboardStats } from "../types";
import { getDashboardStats } from "../api/dashboard";

export function useDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const loadStats = useCallback(async ()=>{
        setIsLoading(true)
        try{
            const data = await getDashboardStats()
            setStats(data)
        }catch(err){
            console.error('Failed to load dashboard stats:', err)
        } finally {
            setIsLoading(false)
        }
    },[])
    return {stats, isLoading, loadStats}
}