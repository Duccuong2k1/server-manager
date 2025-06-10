import Input from '@/components/form/input/InputField'
import Label from '@/components/form/Label'
import Select from '@/components/form/Select'
import Button from '@/components/ui/button/Button'
import { useServers } from '@/hooks/useServers'
import { Server } from '@/lib/supabase/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import * as z from 'zod'

const serverSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  ip_address: z.string().min(1, 'IP Address is required'),
  os: z.string().min(1, 'OS is required'),
  platform: z.string().min(1, 'Platform is required'),
  architecture: z.string().min(1, 'Architecture is required'),
  status: z.enum(['active', 'inactive', 'maintenance'] as const),
  country: z.string().min(1, 'Country is required'),
  cpu_usage:  z.coerce.number().default(0).optional(),
  memory_usage: z.coerce.number().default(0).optional(),
  latitude: z.any().optional(),
  longitude: z.any().optional(),
})

type ServerFormData = z.infer<typeof serverSchema>

interface ServerFormProps {
  server?: Server
  onClose: () => void
  onSave?: (data: any) => Promise<void>
}

export default function ServerForm({ server, onClose, onSave }: ServerFormProps) {
  const { addServer, updateServer ,refreshServers} = useServers()
  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ServerFormData>({
    resolver: zodResolver(serverSchema) as any,
    defaultValues: {
      name: '',
      ip_address: '',
      os: '',
      platform: 'linux',
      architecture: 'x86_64',
      status: 'active',
      country: '',
      cpu_usage: 0,
      memory_usage: 0,
      latitude: 0,
      longitude: 0,
    }
  })

  useEffect(() => {
    if (server) {
      const formData = {
        name: server.name || '',
        ip_address: server.ip_address || '',
        os: server.os || '',
        platform: (server.platform ?? 'linux').toLowerCase(),
        architecture: (server.architecture ?? 'x86_64').toLowerCase(),
        status: (server.status ?? 'active').toLowerCase(),
        country: server.country ,
        cpu_usage: server.cpu_usage ?? 0,
        memory_usage: server.memory_usage ?? 0,
        latitude: server.latitude ?? 0,
        longitude: server.longitude ?? 0,
      }
      reset(formData as any)
    } else {
      reset({
        name: '',
        ip_address: '',
        os: '',
        platform: 'linux',
        architecture: 'x86_64',
        status: 'active',
        country: '',
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
      if (onSave) {
        await onSave(formData)
      } else {
        if (server) {
          await updateServer(server.id, formData)
        } else {
          await addServer(formData)
        }
        onClose()
        refreshServers()
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm as any)} className="space-y-4"  >
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
          <Label>Country</Label>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                defaultValue={field.value}
                {...field}
                error={!!errors.country}
                hint={errors.country?.message}
                placeholder="Enter country"
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
              <Input
              type="text"
                value={field.value ?? ''}
      onChange={field.onChange}
              error={!!errors.platform}
              hint={errors.platform?.message}
              placeholder="example: linux, windows, macos, azure, gcp, aws, on-premise"
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
              <Input
              type="text"
              defaultValue={field.value}
              {...field}
              error={!!errors.architecture}
              hint={errors.architecture?.message}
              placeholder="example: x86_64, arm64, i386"
            />
            )}
          />
        </div>

       {!server && <div>
          <Label>Status</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Maintenance', value: 'maintenance' }
              ]}
              placeholder="Select status"
              {...field}
                
              />
            )}
          />
        </div>}

        <div>
          <Label>CPU Usage (%)</Label>
          <Controller
            name="cpu_usage"
            control={control}
            render={({ field }) => (
              <Input
                type="number"
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
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
              value={field.value ?? ''}
onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Memory Usage"
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
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Latitude"
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
                value={field.value ?? ''}
                onChange={e => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Longitude"
              />
            )}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
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