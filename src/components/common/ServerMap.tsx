import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMemo, useEffect } from 'react';
import { Server } from '@/lib/supabase/types';

interface ServerMapProps {
  servers: Server[];
}


function AutoZoom({ grouped }: { grouped: Array<{ lat: number; lng: number; servers: Server[] }> }) {
  const map = useMap();

  useEffect(() => {
    if (grouped.length === 0) return;


    const maxGroup = grouped.reduce((max, current) => 
      current.servers.length > max.servers.length ? current : max
    );


    const bounds = L.latLngBounds([
      [maxGroup.lat - 5, maxGroup.lng - 5], 
      [maxGroup.lat + 5, maxGroup.lng + 5]  
    ]);

  
    map.fitBounds(bounds, {
      padding: [10, 10],
      maxZoom: 3
    });
  }, [grouped, map]);

  return null;
}


function groupServers(servers: Server[]) {
  const map = new Map<string, { lat: number; lng: number; servers: Server[] }>();
  servers.forEach(s => {
    const key = `${s.latitude},${s.longitude}`;
    if (!map.has(key)) {
      map.set(key, { lat: s.latitude, lng: s.longitude, servers: [s] });
    } else {
      map.get(key)!.servers.push(s);
    }
  });
  return Array.from(map.values());
}


const createIcon = (count: number) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background:#00eaff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:14px;box-shadow:0 0 8px #00eaff99;animation:bounce 1s infinite alternate;">${count}</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function ServerMap({ servers }: ServerMapProps) {
  const grouped = useMemo(() => groupServers(servers), [servers]);

  const center = grouped.length > 0 ? [grouped[0].lat, grouped[0].lng] : [20, 0];

  return (
    <div style={{ width: '100%', height: 350 }}>
      <MapContainer 
        center={center as [number, number]} 
        zoom={2} 
        style={{ width: '100%', height: '100%' }} 
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <AutoZoom grouped={grouped} />
        {grouped.map((g, idx) => (
          <Marker key={idx} position={[g.lat, g.lng]} icon={createIcon(g.servers.length)}>
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
              {g.servers.length === 1
                ? `${g.servers[0].name} (${g.servers[0].ip_address})\n${g.servers[0].country}`
                : `${g.servers.length} servers`}
            </Tooltip>
            <Popup>
              {g.servers.length === 1 ? (
                <div>
                  <b>{g.servers[0].name}</b><br />
                  IP: {g.servers[0].ip_address}<br />
                  Country: {g.servers[0].country}
                </div>
              ) : (
                <div>
                  <b>{g.servers.length} servers</b>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {g.servers.map(s => (
                      <li key={s.id}>{s.name} ({s.ip_address}) - {s.country}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <style>{`
        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
} 