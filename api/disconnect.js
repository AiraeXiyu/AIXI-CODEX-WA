import { closeBot } from './_runtime.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' })
  await closeBot()
  return res.status(200).json({ ok: true, message: 'Runtime WhatsApp dihentikan. Session tetap disimpan.' })
}
