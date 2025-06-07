import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ServerStats, TimeRangeStats } from '@/lib/supabase/types'

export function useServerStats() {
    const [stats, setStats] = useState<ServerStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            setLoading(true)

            // Get total servers count
            const { count: totalServers, error: countError } = await supabase
                .from('servers')
                .select('*', { count: 'exact', head: true })

            if (countError) throw countError

            // Get servers by status
            const { data: statusData, error: statusError } = await supabase
                .from('servers')
                .select('status')
                .order('status')

            if (statusError) throw statusError

            const statusCounts = statusData.reduce((acc, { status }) => {
                acc[status] = (acc[status] || 0) + 1
                return acc
            }, {} as Record<string, number>)

            // Get servers by platform
            const { data: platformData, error: platformError } = await supabase
                .from('servers')
                .select('platform')
                .order('platform')

            if (platformError) throw platformError

            const platformCounts = platformData.reduce((acc, { platform }) => {
                acc[platform] = (acc[platform] || 0) + 1
                return acc
            }, {} as Record<string, number>)

            // Get servers by country
            const { data: countryData, error: countryError } = await supabase
                .from('servers')
                .select('country')
                .order('country')

            if (countryError) throw countryError

            const countryCounts = countryData.reduce((acc, { country }) => {
                acc[country] = (acc[country] || 0) + 1
                return acc
            }, {} as Record<string, number>)

            // Get time range stats
            const now = new Date()
            const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
            const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

            const { data: timeData, error: timeError } = await supabase
                .from('servers')
                .select('created_at')
                .gte('created_at', last30d.toISOString())

            if (timeError) throw timeError

            const timeRangeStats: TimeRangeStats = {
                last24h: timeData.filter(d => new Date(d.created_at) >= last24h).length,
                last7d: timeData.filter(d => new Date(d.created_at) >= last7d).length,
                last30d: timeData.filter(d => new Date(d.created_at) >= last30d).length
            }

            setStats({
                totalServers: totalServers || 0,
                statusCounts,
                platformCounts,
                countryCounts,
                timeRangeStats
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return {
        stats,
        loading,
        error,
        refreshStats: fetchStats
    }
} 