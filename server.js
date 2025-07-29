// server.js  (repo root)
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { RtcTokenBuilder, RtcRole } from '@jiasonglin/agora-access-token'

const { APP_ID, APP_CERT, DEFAULT_TTL = 3600 } = process.env
if (!APP_ID || !APP_CERT) throw new Error('APP_ID / APP_CERT missing')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (_, res) =>
  res.send('Agora token server alive – hit /token?channel=xxx'))

app.get('/token', (req, res) => {
  const { channel, uid = 0, role = 'publisher', ttl = DEFAULT_TTL } = req.query
  if (!channel) return res.status(400).json({ error: 'channel required' })

  const expireTs = Math.floor(Date.now() / 1000) + Number(ttl)
  const rtcRole = role === 'subscriber' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID, APP_CERT, channel, Number(uid), rtcRole, expireTs
  )
  res.json({ token, uid: Number(uid), expireTs })
})

export default app       // ← key change!
