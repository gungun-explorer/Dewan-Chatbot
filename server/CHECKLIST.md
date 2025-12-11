# Render Deployment Checklist

## Pre-Deployment

- [ ] Test locally with `npm start` in the server folder
- [ ] Verify all intents are loading correctly
- [ ] Test Gemini API integration with valid API key
- [ ] Ensure `.env` file is in `.gitignore`
- [ ] Push latest code to GitHub

## Render Configuration

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set root directory to `server`
- [ ] Configure build command: `npm install`
- [ ] Configure start command: `npm start`

## Environment Variables (Required)

- [ ] `NODE_ENV` = `production`
- [ ] `GEMINI_API_KEY` = (your API key from Google AI Studio)
- [ ] `FRONTEND_URL` = (your frontend URL after deploying)

## Environment Variables (Optional - defaults provided)

- [ ] `GEMINI_MODEL` = `gemini-2.5-flash`
- [ ] `GEMINI_TIMEOUT_MS` = `30000`
- [ ] `NLP_CONFIDENCE_THRESHOLD` = `0.75`
- [ ] `GEMINI_API_VERSION` = `v1`

## Post-Deployment

- [ ] Wait for build to complete (3-5 minutes)
- [ ] Test health endpoint: `https://your-service.onrender.com/health`
- [ ] Test root endpoint: `https://your-service.onrender.com/`
- [ ] Test chat endpoint with curl or Postman
- [ ] Update frontend `.env` with backend URL
- [ ] Test end-to-end from frontend to backend

## Verification Tests

### 1. Health Check

```bash
curl https://your-service-name.onrender.com/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2025-12-11T...",
  "nlpTrained": true,
  "geminiConfigured": true
}
```

### 2. Chat Test

```bash
curl -X POST https://your-service-name.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What courses are offered?"}'
```

Expected: Valid response about courses

### 3. CORS Test

Open browser console on your frontend and verify no CORS errors when making requests.

## Troubleshooting

### Service Won't Start

1. Check Render logs for errors
2. Verify environment variables are set
3. Ensure Node version is compatible (18+)

### Gemini API Not Working

1. Verify `GEMINI_API_KEY` is correct
2. Check API key has proper permissions in Google AI Studio
3. Review logs for specific error messages

### NLP Not Loading

1. Check if `data/intents` folder is committed to Git
2. Verify JSON files are properly formatted
3. Look for syntax errors in intent files

### CORS Errors

1. Set `FRONTEND_URL` environment variable
2. Ensure it includes protocol (https://)
3. Verify no trailing slash in URL

## Performance Notes

- Free tier: ~512MB RAM, spins down after 15min inactivity
- First request after spin-down: 30-60 seconds
- Subsequent requests: <1 second
- Consider paid tier for production use (always-on)
