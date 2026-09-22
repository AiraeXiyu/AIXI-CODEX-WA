import { ensureBot, waitForPairingCode, normalizePhone, setMeta } from './_runtime.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(204).end()
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' })

  try {
    const phone = normalizePhone(req.body?.phone)
    if (!/^\d{7,15}$/.test(phone)) {
      return res.status(400).json({ ok: false, error: 'Masukkan nomor WhatsApp internasional tanpa tanda +.' })
    }

    await setMeta({ phone, updatedAt: Date.now() })
    const sock = await ensureBot(phone)

    if (sock?.user) {
      return res.status(200).json({ ok: true, connected: true, phone })
    }

    let code = await waitForPairingCode(10000)

    if (!code && sock?.requestPairingCode) {
      try {
        const raw = await sock.requestPairingCode(phone)
        code = String(raw).replace(/(.{4})(?=.)/g, '$1-')
      } catch {}
    }

    if (!code) {
      return res.status(504).json({
        ok: false,
        error: 'Pairing code belum tersedia. Tekan GET PAIRING CODE lagi.'
      })
    }

    return res.status(200).json({ ok: true, connected: false, phone, code })
  } catch (error) {
    console.error('Pairing API:', error)
    return res.status(500).json({ ok: false, error: error?.message || 'Gagal memulai pairing.' })
  }
}
