import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ServerActivity } from '@/lib/supabase/types'

export function useServerActivities(serverId?: string) {
    const [activities, setActivities] = useState<ServerActivity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (serverId) {
            fetchActivities(serverId)
        } else {
            fetchActivities()
        }
    }, [serverId])

    const fetchActivities = async (id?: string) => {
        try {
            setLoading(true)
            let query = supabase
                .from('server_activities')
                .select('*')
                .order('created_at', { ascending: false })
            if (id) {
                query = query.eq('server_id', id)
            }
            const { data, error } = await query
            if (error) throw error
            setActivities(data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const addActivity = async (activity: Omit<ServerActivity, 'id' | 'created_at'>) => {
        try {
            const { data, error } = await supabase
                .from('server_activities')
                .insert([activity])
                .select()
                .single()

            if (error) throw error
            setActivities(prev => [data, ...prev])
            return data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            throw err
        }
    }

    const clearActivities = async (id: string) => {
        try {
            const { error } = await supabase
                .from('server_activities')
                .delete()
                .eq('server_id', id)

            if (error) throw error
            setActivities([])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            throw err
        }
    }

    return {
        activities,
        loading,
        error,
        addActivity,
        clearActivities,
        refreshActivities: fetchActivities
    }
} 