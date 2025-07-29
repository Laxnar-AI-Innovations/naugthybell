import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { RtcTokenBuilder, RtcRole } from '@jiasonglin/agora-access-token'

const {
  APP_ID,
  APP_CERT,
  DEFAULT_TTL = 3600,
  PORT = 8080
} = process.env

if (!APP_ID || !APP_CERT) {
  console.error('APP_ID or APP_CERT missing in environment variables')
  process.exit(1)
}

const app = express()
app.use(cors())
app.use(express.json())
    
app.get('/', (_, res) => res.send('Agora token server is alive. Hit /token?channel=xxx'))

app.get('/token', (req, res) => {
  const { channel, uid = 0, role = 'publisher', ttl = DEFAULT_TTL } = req.query
  if (!channel) return res.status(400).json({ error: 'channel required' })

  const roleEnum = role === 'subscriber' ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER
  const expireTs = Math.floor(Date.now() / 1000) + Number(ttl)

  try {
    const token = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERT,
      channel,
      Number(uid),
      roleEnum,
      expireTs
    )
    res.json({ token, uid: Number(uid), expireTs })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'failed to generate token' })
  }
})

app.listen(PORT, () => console.log(`Agora token server running on http://localhost:${PORT}`)) 
