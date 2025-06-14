
import ServerList from '@/components/servers/ServerList'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Server List',
  description: 'Manage your servers'
}

export default function ServersPage() {

  return (
    <div className="p-6 flex flex-col gap-8">
      <ServerList />
    </div>
  )
} 