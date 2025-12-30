import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import Map, { Marker } from 'react-map-gl'

export default function Home() {
  const [qr, setQr] = useState('')
  const [form, setForm] = useState({ name: '', age: '', user_id: '' })
  const [locations, setLocations] = useState([])
  const [viewport, setViewport] = useState({ latitude: 0, longitude: 0, zoom: 2 })

  const handleScan = (data) => {
    if (data) {
      setQr(data)
      setForm((f) => ({ ...f, user_id: data }))
    }
  }
  const handleError = (err) => console.error(err)

  async function submitUser(e) {
    e.preventDefault()
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (!res.ok) alert('Save failed')
    else alert('User saved')
  }

  useEffect(() => {
    const subscription = supabase
      .channel('public:locations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'locations' }, (payload) => {
        setLocations((prev) => [...prev, payload.new])
        setViewport({ latitude: payload.new.lat, longitude: payload.new.lon, zoom: 14 })
      })
      .subscribe()
    return () => {
      supabase.removeChannel(subscription)
    }
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Tracker Dashboard</h1>
      <div className="flex gap-6">
        <div className="w-1/3">
          <h2 className="font-semibold">Scan QR</h2>
          <p className="mb-2 text-sm text-gray-600">(QR scanner placeholder — paste QR payload below)</p>
          <textarea value={qr} onChange={(e) => { setQr(e.target.value); setForm((f)=>({...f,user_id:e.target.value})); }} className="w-full p-2 border" rows={3} />
          <form onSubmit={submitUser} className="mt-4 flex flex-col gap-2">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" required className="p-2 border" />
            <input value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="Age" type="number" required className="p-2 border" />
            <input value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} placeholder="User ID" required className="p-2 border" />
            <button type="submit" className="bg-blue-600 text-white p-2">Save</button>
          </form>
        </div>
        <div className="w-2/3">
          <h2 className="font-semibold">Live Map</h2>
          <Map initialViewState={viewport} style={{ width: '100%', height: '500px' }} mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} mapStyle="mapbox://styles/mapbox/streets-v11">
            {locations.map((loc) => (
              <Marker key={loc.id} longitude={loc.lon} latitude={loc.lat}>
                <div className="bg-red-600 w-3 h-3 rounded-full" />
              </Marker>
            ))}
          </Map>
        </div>
      </div>
    </div>
  )
}
