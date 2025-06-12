import React, { useRef } from 'react';
import { Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Server } from '@/lib/supabase/types'; 

interface ServerGroup {
  lat: number;
  lng: number;
  servers: Server[];
}

interface ServerMarkerProps {
  group: ServerGroup;
  createIcon: (count: number) => L.DivIcon;
}

const ServerMarker: React.FC<ServerMarkerProps> = ({ group, createIcon }) => {
  const markerRef = useRef<L.Marker>(null);

  const handleMouseOver = () => {
    if (markerRef.current && group.servers.length > 1) {
      markerRef.current.openPopup();
    }
  };

  const handleMouseOut = () => {
    if (markerRef.current && group.servers.length > 1) {
      markerRef.current.closePopup();
    }
  };

  return (
    <Marker
      position={[group.lat, group.lng]}
      icon={createIcon(group.servers.length)}
      ref={markerRef}
      eventHandlers={{
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
        click: () => {
          if (markerRef.current) markerRef.current.openPopup();
        }
      }}
    >
      <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
        {group.servers.length === 1
          ? `${group.servers[0].name} (${group.servers[0].ip_address}) - ${group.servers[0].country}`
          : `${group.servers.length} servers`}
      </Tooltip>
      <Popup>
        {group.servers.length === 1 ? (
          <div>
            <b>{group.servers[0].name}</b><br />
            IP: {group.servers[0].ip_address}<br />
            Country: {group.servers[0].country}
          </div>
        ) : (
          <div>
            <b>{group.servers.length} servers at this location:</b>
            <ul style={{ margin: '8px 0 0 15px', padding: 0, listStyle: 'disc' }}>
              {group.servers.map(s => (
                <li key={s.id} style={{ marginBottom: '4px' }}>
                  <b>{s.name}</b> ({s.ip_address}) - {s.country}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Popup>
    </Marker>
  );
};

export default ServerMarker;