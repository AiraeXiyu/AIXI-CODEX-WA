import { ensureBot, getMeta, getStatus, setMeta, waitForPairingCode, normalizePhone } from './_runtime.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' })

  try {
    const meta = await getMeta()
    const phone = normalizePhone(req.body?.phone || meta?.phone)
    if (!phone) return res.status(400).json({ ok: false, error: 'Belum ada session yang tersimpan.' })

    await setMeta({ phone, updatedAt: Date.now() })
    const sock = await ensureBot(phone)

    if (sock?.user) {
      return res.status(200).json({ ok: true, connected: true, phone, message: 'Session berhasil dipulihkan.' })
    }

    const status = await getStatus()
    const code = await waitForPairingCode(5000)
    return res.status(200).json({
      ok: true,
      connected: false,
      phone,
      connection: status.connection,
      code: code || null,
      message: code ? 'Session tidak aktif. Pairing code baru tersedia.' : 'Bot sedang memulai ulang.'
    })
  } catch (error) {
    console.error('Reconnect API:', error)
    return res.status(500).json({ ok: false, error: error?.message || 'Gagal reconnect session.' })
  }
}
