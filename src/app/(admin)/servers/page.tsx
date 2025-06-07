import { Metadata } from 'next'
import ServerList from '@/components/servers/ServerList'

export const metadata: Metadata = {
  title: 'Server List',
  description: 'Manage your servers'
}

export default function ServersPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Server List</h1>
      <ServerList />
    </div>
  )
} 