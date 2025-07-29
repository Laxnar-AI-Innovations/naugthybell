# Agora Token Server

Simple Express micro-service that issues Agora RTC tokens via HTTP.

## 1. Prerequisites

* Node 18 LTS or newer
* An Agora **App ID** and **App Certificate** (found in Project → Config)

## 2. Setup

```bash
# inside project root
cd agora-token-server
npm install            # or pnpm / yarn

# create .env with your real keys
cp .env.example .env   # if you created example file
# then edit .env (APP_ID, APP_CERT)
```

### Environment variables

| Var | Description |
|-----|-------------|
| `APP_ID` | Agora App ID |
| `APP_CERT` | Agora App Certificate |
| `DEFAULT_TTL` | Token validity in seconds (default 3600) |
| `PORT` | Server port (default 8080) |

## 3. Run locally

```bash
npm start
# → Agora token server running on http://localhost:8080
```

Example request:
```
GET http://localhost:8080/token?channel=test&uid=0
```
Response
```json
{ "token": "<token>", "uid": 0, "expireTs": 1718782726 }
```

## 4. Deploy (Render example)

1. Push this folder to GitHub.
2. Login to [Render](https://render.com) → *New +* → Web Service.
3. Point to your repo, root: `agora-token-server/`.
4. Build command: `npm install`  (Render auto-detects)
5. Start command: `npm start`
6. Add environment variables (same as .env) in Render dashboard.
7. Deploy → you’ll get `https://your-service.onrender.com`.

## 5. Update Android apps

`ApiClient.BASE_URL` already points to `/api/` – change it, or add new endpoint:

```kotlin
val token = tokenApi.getToken(channel, uid).token
AgoraEngineHolder.join(channel, token, uid, opts)
```

That’s all – no more expired temp tokens! ✨ 