import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

export default function MapClient({ center, locations }) {
  return (
    <MapContainer center={center} zoom={4} style={{ width: '100%', height: '500px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {locations.map((loc) => (
        <Marker key={loc.id} position={[loc.lat, loc.lon]}>
          <Popup>
            <div>
              <p><strong>Device:</strong> {loc.device_id}</p>
              <p><strong>User:</strong> {loc.user_id || 'N/A'}</p>
              <p><strong>Lat:</strong> {loc.lat.toFixed(6)}</p>
              <p><strong>Lon:</strong> {loc.lon.toFixed(6)}</p>
              {loc.accuracy && <p><strong>Accuracy:</strong> {loc.accuracy.toFixed(2)}m</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
