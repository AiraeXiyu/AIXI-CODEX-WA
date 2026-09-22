import { Redis } from '@upstash/redis'

const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
  : null

const META_KEY = 'aixi:wa:meta'
const STATUS_KEY = 'aixi:wa:status'

export const getRedis = () => redis

export const normalizePhone = (value) => String(value || '').replace(/\D/g, '').replace(/^0+/, '')

const setStatus = async (status) => {
  globalThis.__AIXI_STATUS = { ...status, updatedAt: Date.now() }
  if (redis) {
    try { await redis.set(STATUS_KEY, globalThis.__AIXI_STATUS) } catch {}
  }
}

export const getStatus = async () => {
  if (globalThis.__AIXI_STATUS) return globalThis.__AIXI_STATUS
  if (redis) {
    try {
      const value = await redis.get(STATUS_KEY)
      if (value) return value
    } catch {}
  }
  return { connection: 'close', connected: false }
}

export const getMeta = async () => {
  if (redis) {
    try { return await redis.get(META_KEY) } catch {}
  }
  return globalThis.__AIXI_META || null
}

export const setMeta = async (meta) => {
  globalThis.__AIXI_META = meta
  if (redis) await redis.set(META_KEY, meta)
}

export const ensureBot = async (phone) => {
  phone = normalizePhone(phone)
  if (!phone) throw new Error('Nomor WhatsApp tidak valid.')

  process.env.AIXI_WEB_RUNTIME = '1'
  process.env.AIXI_BOT_NUMBER = phone
  process.env.AIXI_SESSION_ID = phone
  process.env.AIXI_AUTH_FOLDER = '/tmp/aixi-codex-wa-session'

  globalThis.__AIXI_WA_STATUS_UPDATE = (update) => {
    const connection = update?.connection || 'unknown'
    const status = {
      connection,
      connected: connection === 'open',
      phone,
      updatedAt: Date.now()
    }
    globalThis.__AIXI_STATUS = status
    setStatus(status)
    if (connection === 'open') globalThis.__AIXI_WA_PAIRING_CODE = null
  }

  if (!globalThis.__AIXI_BOT_STARTED) {
    const mod = await import('../bot-source/socket.js')
    globalThis.__AIXI_BOT_MODULE = mod
    globalThis.__AIXI_BOT_STARTED = true
    await mod.Setup()
  }

  const deadline = Date.now() + 20000
  while (!globalThis.__AIXI_WA_SOCKET && Date.now() < deadline) {
    await new Promise(resolve => setTimeout(resolve, 250))
  }

  await setMeta({ phone, updatedAt: Date.now() })
  return globalThis.__AIXI_WA_SOCKET || null
}

export const waitForPairingCode = async (timeout = 30000) => {
  const deadline = Date.now() + timeout
  while (Date.now() < deadline) {
    if (globalThis.__AIXI_WA_PAIRING_CODE) return globalThis.__AIXI_WA_PAIRING_CODE
    await new Promise(resolve => setTimeout(resolve, 300))
  }
  return null
}

export const closeBot = async () => {
  const sock = globalThis.__AIXI_WA_SOCKET
  if (sock) {
    try { sock.ws?.close() } catch {}
  }
  globalThis.__AIXI_WA_SOCKET = null
  await setStatus({ connection: 'close', connected: false })
}
