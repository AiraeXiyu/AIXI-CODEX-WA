import { getStatus, getMeta } from './_runtime.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' })
  const status = await getStatus()
  const meta = await getMeta()
  return res.status(200).json({
    ok: true,
    connected: status?.connected === true,
    connection: status?.connection || 'close',
    phone: meta?.phone || status?.phone || null,
    updatedAt: status?.updatedAt || meta?.updatedAt || null
  })
}
