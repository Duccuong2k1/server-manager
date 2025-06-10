"use client"
import { useServers } from '@/hooks/useServers'
import React from 'react'
import ServerMap from '../common/ServerMap'

type Props = {}

export default function ServerMapBox({}: Props) {

  
  const { servers } = useServers(1, 1000)
  return (
    <ServerMap servers={servers} />
  )
}