import { useState, useEffect } from 'react'
import { Server } from '@/lib/supabase/types'
import { supabase } from '@/lib/supabase/client'

export function useServers(page = 1, pageSize = 10) {
    const [servers, setServers] = useState<Server[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [total, setTotal] = useState(0)
    const [currentPage, setCurrentPage] = useState(page)
    const [currentPageSize, setCurrentPageSize] = useState(pageSize)

    useEffect(() => {
        fetchServers(currentPage, currentPageSize)
    }, [currentPage, currentPageSize])

    const fetchServers = async (page: number, pageSize: number) => {
        try {
            setLoading(true)
            const res = await fetch(`/api/servers?page=${page}&pageSize=${pageSize}`)
            if (!res.ok) throw new Error('Failed to fetch servers')
            const data = await res.json()
            setServers(data.servers)
            setTotal(data.total)
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
            setTotal(prev => prev + 1)
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
            setServers(prev => prev.map(server => server.id === id ? { ...server, ...data } : server))
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
            setTotal(prev => prev - 1)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
            throw err
        }
    }

    return {
        servers,
        loading,
        error,
        total,
        currentPage,
        setCurrentPage,
        pageSize: currentPageSize,
        setPageSize: setCurrentPageSize,
        refreshServers: () => fetchServers(currentPage, currentPageSize),
        addServer,
        updateServer,
        deleteServer
    }
} 