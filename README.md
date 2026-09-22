# AIXI CODEX WA

AIXI CODEX WA combines the supplied Baileys bot source with a Vercel pairing portal.

## Deploy
1. Push the contents of this folder to a GitHub repository.
2. Import the repository into Vercel.
3. Keep **Root Directory** as `./`.
4. Leave Build Command and Output Directory un-overridden. `vercel.json` serves the `public/` frontend.
5. Add these Vercel Environment Variables:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - Optional: `GEMINI_API_KEY`
6. Deploy.

## Pairing
Open the Vercel URL, enter the WhatsApp number in international format without `+`, and press **GET PAIRING CODE**.

After a successful login, Baileys auth files are mirrored to Upstash Redis. **Reconnect Session** restores them when a new serverless runtime starts.

## Important Vercel limitation
Vercel Functions are not a permanent VPS process. The bot runtime can be suspended or terminated after the function lifecycle ends. Redis keeps the WhatsApp authentication state, but it does not turn Vercel into a 24/7 bot host. The web's reconnect action starts a fresh runtime and restores the saved session.

## Local / Pterodactyl
The original bot entry point remains available:

```bash
npm install
npm start
```

For a permanent WhatsApp bot process, a VPS/Pterodactyl runtime is still the appropriate host.

## Security
Do not commit Redis tokens or Gemini keys. The supplied Gemini key was removed from `config.js` and is read from `GEMINI_API_KEY` instead.
