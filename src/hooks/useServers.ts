import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Server } from '@/lib/supabase/types'

export function useServers() {
    const [servers, setServers] = useState<Server[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchServers()
    }, [])

    const fetchServers = async () => {
        try {
            setLoading(true)
            const { data, error } = await supabase
                .from('servers')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setServers(data || [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    const addServer = async (server: Omit<Server, 'id' | 'created_at' | 'updated_at'>) => {
        try {
            const { data, error } = await supabase
                .from('servers')
                .insert([server])
                .select()
                .single()

            if (error) throw error
            setServers(prev => [data, ...prev])
            return data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            throw err
        }
    }

    const updateServer = async (id: string, updates: Partial<Server>) => {
        try {
            const { data, error } = await supabase
                .from('servers')
                .update(updates)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            setServers(prev => prev.map(server =>
                server.id === id ? { ...server, ...data } : server
            ))
            return data
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            throw err
        }
    }

    const deleteServer = async (id: string) => {
        try {
            const { error } = await supabase
                .from('servers')
                .delete()
                .eq('id', id)

            if (error) throw error
            setServers(prev => prev.filter(server => server.id !== id))
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            throw err
        }
    }

    return {
        servers,
        loading,
        error,
        addServer,
        updateServer,
        deleteServer,
        refreshServers: fetchServers
    }
} 