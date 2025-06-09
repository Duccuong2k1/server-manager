import { Metadata } from 'next'
import ServerList from '@/components/servers/ServerList'

export const metadata: Metadata = {
  title: 'Server List',
  description: 'Manage your servers'
}

export default function ServersPage() {
  return (
    <div className="p-6">
      <ServerList />
    </div>
  )
} 