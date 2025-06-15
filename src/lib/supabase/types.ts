export type ServerStatus = 'active' | 'inactive' | 'maintenance'
export type ServerPlatform = 'linux' | 'windows' | 'macos'
export type ServerArch = 'x86_64' | 'arm64' | 'i386'

export interface Server {
    id: string
    name: string
    ip_address: string
    country: string
    os: string
    os_version: string
    platform: ServerPlatform
    architecture: ServerArch
    status: ServerStatus
    created_at: string
    updated_at: string
    region: string
    cpu_usage: number
    memory_usage: number
    disk_usage: number
    network_usage: number
    uptime: number
    last_check: string
    longitude: number
    latitude: number
    isp: string
    asn: string
    organization: string
    zip_code: string
    city: string

}

export interface ServerActivity {
    id: string
    server_id: string
    type: 'start' | 'stop' | 'restart' | 'update' | 'delete' | 'created' | 'maintenance'
    status: 'success' | 'failed' | 'offline' | "removed"
    message: string
    created_at: string
}

export interface TimeRangeStats {
    last24h: number
    last7d: number
    last30d: number
}

export interface ServerStats {
    totalServers: number
    statusCounts: Record<ServerStatus, number>
    platformCounts: Record<ServerPlatform, number>
    countryCounts: Record<string, number>
    countryStats: Array<{
        country: string
        count: number
        percentage: number
    }>
    timeRangeStats: TimeRangeStats
    archCounts: Record<string, number>
    osCounts: Record<string, number>
    newServersCount?: number
    filterStart?: Date
    filterEnd?: Date
}

export type Database = {
    public: {
        Tables: {
            servers: {
                Row: Server
                Insert: Omit<Server, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Server, 'id' | 'created_at' | 'updated_at'>>
            }
            server_activities: {
                Row: ServerActivity
                Insert: Omit<ServerActivity, 'id' | 'created_at'>
                Update: Partial<Omit<ServerActivity, 'id' | 'created_at'>>
            }
        }
    }
} 