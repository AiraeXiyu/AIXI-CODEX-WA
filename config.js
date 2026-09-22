import { LRUCache } from 'lru-cache'
import { cpus } from 'os'

const CPU_COUNT = cpus().length

Object.assign(globalThis, {

   ownerName: process.env.AIXI_OWNER_NAME || 'AIXI CODEX',
   ownerNumber: process.env.AIXI_OWNER_NUMBER || process.env.AIXI_BOT_NUMBER || '',
   botName: 'AIXI CODEX WA',
   footer: '✦ AIXI CODEX WA',
   botNumber: process.env.AIXI_BOT_NUMBER || '',

   pairingCode: true, // ga usah gnti 

   defaultLimit: 15,

   stickerPackName: 'AIXI CODEX WA', // bebas gnti atau tidak

   stickerPackPublisher: 'AIXI CODEX', // bebas gnti atau tidak 

   googleApiKey: process.env.GEMINI_API_KEY || '',

   apiUser: '', // tinggal apiky mu klo ga ada ga usah biarin ae 
   apiSecret: '', // tinggal apiky mu klo ga ada ga usah biarin ae 

   localTimezone: 'Asia/Jakarta',

   botThumbnail: './media/Image/thumbnail.jpg',

   botMenuMusic: './media/Audio/menu-music.mp3',

   temporaryFolder: 'temp',

   pluginsFolder: 'plugins',

   authFolder: process.env.AIXI_AUTH_FOLDER || 'session',

   storeFilename: 'store.json',

   databaseFilename: 'database.json',

   temporaryFileInterval: 30 * 60 * 1_000,

   dataInterval: 10 * 60 * 1_000,

   gcInterval: 1 * 60 * 60 * 1_000,

   requestTimeout: 1.5 * 60 * 1_000,

   ffmpegTimeout: 1 * 60 * 1_000,

   minDelay: 100,

   maxDelay: 3 * 1_000,

   ignoreOldMessageTS: 30,

   rssLimit: 384 * 1_024 * 1_024,

   ffmpegConcurrency: Math.max(4, Math.floor(CPU_COUNT * 1.3)),

   maxNSFWScore: 0.75,

   maxHistoryChatSize: 20,

   ExploreSession: new LRUCache({
      max: 256,
      ttl: 1.5 * 60 * 1_000,
      updateAgeOnGet: false,
      updateAgeOnHas: false,
      ttlAutopurge: true
   })
})
