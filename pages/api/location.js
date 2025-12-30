import { supabaseAdmin } from '../../lib/supabaseServer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { device_id, user_id, lat, lon, accuracy } = req.body
  if (!device_id || lat === undefined || lon === undefined) return res.status(400).json({ error: 'Missing fields' })
  const payload = { device_id, user_id: user_id || null, lat, lon, accuracy }
  const { error } = await supabaseAdmin.from('locations').insert([payload])
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true })
}
