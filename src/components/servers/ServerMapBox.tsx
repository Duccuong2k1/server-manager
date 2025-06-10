"use client"
import { useServers } from '@/hooks/useServers'
import React from 'react'

import dynamic from "next/dynamic";

const ServerMap = dynamic(() => import("../common/ServerMap"), { ssr: false });

export default function ServerMapBox() {

  
  const { servers } = useServers(1, 1000)
  return (
    <ServerMap servers={servers} />
  )
}