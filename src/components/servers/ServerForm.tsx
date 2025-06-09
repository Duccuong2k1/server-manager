import { useForm, Controller, SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Server } from '@/lib/supabase/types'
import Button from '@/components/ui/button/Button'
import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import { useServers } from '@/hooks/useServers'
import { useEffect } from 'react'

const serverSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  ip_address: z.string().min(1, 'IP Address is required'),
  os: z.string().min(1, 'OS is required'),
  platform: z.enum(['linux', 'windows', 'macos'] as const),
  architecture: z.enum(['x86_64', 'arm64', 'i386'] as const),
  status: z.enum(['active', 'inactive', 'maintenance'] as const),
  region: z.string().min(1, 'Region is required'),
  cpu_usage:  z.coerce.number().default(0),
  memory_usage: z.coerce.number().default(0),
  latitude: z.coerce.number().default(0),
  longitude: z.coerce.number().default(0),
})

type ServerFormData = z.infer<typeof serverSchema>

interface ServerFormProps {
  server?: Server
  onClose: () => void
}

export default function ServerForm({ server, onClose }: ServerFormProps) {
  const { addServer, updateServer ,refreshServers} = useServers()
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ServerFormData>({
    resolver: zodResolver(serverSchema) as any,
    defaultValues: {
      name: '',
      ip_address: '',
      os: '',
      platform: 'linux',
      architecture: 'x86_64',
      status: 'inactive',
      region: '',
      cpu_usage: 0,
      memory_usage: 0,
      latitude: 0,
      longitude: 0,
    }
  })

  useEffect(() => {
    console.log('Server data:', server)
    if (server) {
      const formData = {
        name: server.name || '',
        ip_address: server.ip_address || '',
        os: server.os || '',
        platform: server.platform || 'linux',
        architecture: server.architecture || 'x86_64',
        status: server.status || 'inactive',
        region: server.region || '',
        cpu_usage: server.cpu_usage || '0',
        memory_usage: server.memory_usage || '0',
        latitude: server.latitude || '0',
        longitude: server.longitude || '0',
      }
      console.log('Form data to reset:', formData)
      reset(formData as any)
    } else {
      reset({
        name: '',
        ip_address: '',
        os: '',
        platform: 'linux',
        architecture: 'x86_64',
        status: 'inactive',
        region: '',
        cpu_usage: 0,
        memory_usage: 0,
        latitude: 0,
        longitude: 0,
      })
    }
  }, [server, reset])

  const onSubmitForm: SubmitHandler<ServerFormData> = async (data) => {
    try {
      const formData: any = {
        ...data,
        updated_at: new Date().toISOString(),
     
      }

      if (server) {
        await updateServer(server.id, formData)
      } else {
        await addServer(formData)
      }
      onClose()
      refreshServers()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm as any)} className="space-y-4" >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                defaultValue={field.value}
                {...field}
                error={!!errors.name}
                hint={errors.name?.message}
                placeholder="Enter server name"
              />
            )}
          />
        </div>

        <div>
          <Label>IP Address</Label>
          <Controller
            name="ip_address"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                defaultValue={field.value}
                {...field}
                error={!!errors.ip_address}
                hint={errors.ip_address?.message}
                placeholder="example: 172.16.10.10"
              />
            )}
          />
        </div>

        <div>
          <Label>Region</Label>
          <Controller
            name="region"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                defaultValue={field.value}
                {...field}
                error={!!errors.region}
                hint={errors.region?.message}
                placeholder="Enter region"
              />
            )}
          />
        </div>

        <div>
          <Label>OS</Label>
          <Controller
            name="os"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                defaultValue={field.value}
                {...field}
                error={!!errors.os}
                hint={errors.os?.message}
                placeholder="example: Ubuntu, CentOS, Windows Server"
              />
            )}
          />
        </div>

        <div>
          <Label>Platform</Label>
          <Controller
            name="platform"
            control={control}
            render={({ field }) => (
              <Select
                defaultValue={field.value}
                options={[
                  { value: 'linux', label: 'Linux' },
                  { value: 'windows', label: 'Windows' },
                  { value: 'macos', label: 'macOS' },
                ]}
                placeholder="Select platform"
                {...field}
              />
            )}
          />
        </div>

        <div>
          <Label>Architecture</Label>
          <Controller
            name="architecture"
            control={control}
            render={({ field }) => (
              <Select
                defaultValue={field.value}
                options={[
                  { value: 'x86_64', label: 'x86_64' },
                  { value: 'arm64', label: 'ARM64' },
                  { value: 'i386', label: 'i386' },
                ]}
                placeholder="Select architecture"
                {...field}
              />
            )}
          />
        </div>

        <div>
          <Label>Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                defaultValue={field.value}
                options={[
                  { value: 'active', label: 'Active' },
                  { value: 'inactive', label: 'Inactive' },
                  { value: 'maintenance', label: 'Maintenance' },
                ]}
                placeholder="Select status"
                {...field}
              />
            )}
          />
        </div>

        <div>
          <Label>CPU Usage (%)</Label>
          <Controller
            name="cpu_usage"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                defaultValue={field.value}  
                {...field}
                error={!!errors.cpu_usage}
                hint={errors.cpu_usage?.message}
                placeholder="Enter CPU usage"
              />
            )}
          />
        </div>

        <div>
          <Label>Memory Usage (%)</Label>
          <Controller
            name="memory_usage"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                defaultValue={field.value}
                {...field}
                error={!!errors.memory_usage}
                hint={errors.memory_usage?.message}
                placeholder="Enter memory usage"
              />
            )}
          />
        </div>

     

        <div>
          <Label>Latitude</Label>
          <Controller
            name="latitude"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                defaultValue={field.value}
                onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}   
                error={!!errors.latitude}
                hint={errors.latitude?.message}
                placeholder="Enter latitude"
              />
            )}
          />
        </div>

        <div>
          <Label>Longitude</Label>
          <Controller
            name="longitude"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
              
                defaultValue={field.value}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                error={!!errors.longitude}
                hint={errors.longitude?.message}
                placeholder="Enter longitude"
     
              />
            )}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : server ? 'Update Server' : 'Create Server'}
        </Button>
      </div>
    </form>
  )
} 