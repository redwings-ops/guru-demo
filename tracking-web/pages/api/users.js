import { supabaseAdmin } from '../../lib/supabaseServer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { name, age, user_id } = req.body
  if (!name || !age || !user_id) return res.status(400).json({ error: 'Missing fields' })
  const { error } = await supabaseAdmin.from('users').insert([{ name, age, user_id }])
  if (error) return res.status(500).json({ error: error.message })
  return res.status(200).json({ ok: true })
}
