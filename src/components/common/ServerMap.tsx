
"use client";

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMemo, useEffect } from 'react';
import { Server } from '@/lib/supabase/types';
import MarkerClusterGroup from 'react-leaflet-cluster';
import ServerMarker from './ServerMarker'; 

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


interface ServerMapProps {
  servers: Server[];
}

interface ServerGroup {
  lat: number;
  lng: number;
  servers: Server[];
}


function AutoZoom({ grouped }: { grouped: ServerGroup[] }) {
  const map = useMap();

  useEffect(() => {
    if (grouped.length === 0) {
      map.setView([20, 0], 2); // Center of the map, zoom level 2
      return;
    }

    const bounds = L.latLngBounds(grouped.map(g => [g.lat, g.lng]));

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 6,
      animate: true,
      duration: 1
    });

  }, [grouped, map]);

  return null;
}


function groupServers(servers: Server[]): ServerGroup[] {
  const map = new Map<string, ServerGroup>();
  servers.forEach(s => {
    
    const key = `${s.latitude?.toFixed(4)},${s.longitude?.toFixed(4)}`;
    if (!map.has(key)) {
      map.set(key, { lat: s.latitude, lng: s.longitude, servers: [s] });
    } else {
      map.get(key)!.servers.push(s);
    }
  });
  return Array.from(map.values());
}

// Icon change for marker
const createIcon = (count: number) => L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="
      background: linear-gradient(145deg, #00eaff, #00aaff); /* Gradient blue */
      border-radius: 50%;
      width: ${count > 1 ? '40px' : '32px'}; /* Larger for clusters */
      height: ${count > 1 ? '40px' : '32px'};
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: bold;
      font-size: ${count > 1 ? '16px' : '14px'};
      box-shadow: 0 0 10px rgba(0, 234, 255, 0.6); /* Lighter shadow */
      animation: bounce 1.5s infinite alternate; /* Slower bounce */
      border: 2px solid rgba(255,255,255,0.7); /* Subtle white border */
    ">
      ${count}
    </div>`,
  iconSize: count > 1 ? [40, 40] : [32, 32],
  iconAnchor: count > 1 ? [20, 40] : [16, 32], 
  popupAnchor: [0, -20], 
});

export default function ServerMap({ servers }: ServerMapProps) {
  const grouped = useMemo(() => groupServers(servers), [servers]);

  const defaultCenter: [number, number] = [20, 0];
  const initialCenter = grouped.length > 0 ? [grouped[0].lat, grouped[0].lng] : defaultCenter;

  const southWest = L.latLng(-90, -180);
  const northEast = L.latLng(90, 180);
  const maxBounds = L.latLngBounds(southWest, northEast);

  return (
    <div style={{ width: '100%', height: 350, position: 'relative', overflow: 'hidden' }}>
      <MapContainer
        center={initialCenter as [number, number]}
        zoom={2}
        minZoom={2}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        style={{ width: '100%', height: '100%', backgroundColor: '#f8f8f8' }}
        scrollWheelZoom={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          noWrap={true}
        />
        <AutoZoom grouped={grouped} />

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={80}
          showCoverageOnHover={true}
          iconCreateFunction={(cluster:any) => {
            const count = cluster.getChildCount();
            let size = 'large';
            let color = '#2196F3'; 
            if (count < 10) {
              size = 'small';
              color = '#4CAF50'; 
            } else if (count < 100) {
              size = 'medium';
              color = '#FFC107'; 
            }

            return L.divIcon({
              html: `
                <div class="cluster-icon cluster-icon-${size}" style="background-color: ${color};">
                  <span>${count}</span>
                </div>
              `,
              className: 'marker-cluster-custom',
              iconSize: L.point(40, 40),
            });
          }}
        >
          {/* Render ServerMarker component for groups */}
          {grouped.map((g, idx) => (
            <ServerMarker key={idx} group={g} createIcon={createIcon} />
          ))}
        </MarkerClusterGroup>
      </MapContainer>

      <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

       
        .marker-cluster-custom {
          background-color: transparent !important;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .marker-cluster-custom div {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          color: white;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
          width: 100%;
          height: 100%;
        }

        .cluster-icon {
          animation: none;
        }

        .cluster-icon-small { font-size: 14px; }
        .cluster-icon-medium { font-size: 16px; }
        .cluster-icon-large { font-size: 18px; }
      `}</style>
    </div>
  );
}