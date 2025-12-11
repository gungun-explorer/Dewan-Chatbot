# Dewan Chatbot Backend - Render Deployment Guide

## Quick Deploy to Render

### Prerequisites

- Render account (free tier available)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### Deployment Steps

1. **Push your code to GitHub**

   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create New Web Service on Render**

   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `server` folder as the root directory

3. **Configure Build Settings**

   - **Name**: `dewan-chatbot-backend`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables**
   Add the following environment variables in Render dashboard:

   | Key                        | Value                                                    | Required              |
   | -------------------------- | -------------------------------------------------------- | --------------------- |
   | `NODE_ENV`                 | `production`                                             | Yes                   |
   | `GEMINI_API_KEY`           | Your Gemini API key                                      | Yes                   |
   | `GEMINI_MODEL`             | `gemini-2.5-flash`                                       | No (default provided) |
   | `GEMINI_TIMEOUT_MS`        | `30000`                                                  | No (default provided) |
   | `NLP_CONFIDENCE_THRESHOLD` | `0.75`                                                   | No (default provided) |
   | `FRONTEND_URL`             | Your frontend URL (e.g., `https://your-app.netlify.app`) | Yes                   |

5. **Health Check**

   - Path: `/health`
   - This endpoint will be automatically monitored by Render

6. **Deploy**
   - Click "Create Web Service"
   - Wait for the build and deployment to complete
   - Your API will be available at: `https://your-service-name.onrender.com`

### Important Notes

- **Free Tier Limitations**: Render free tier services spin down after 15 minutes of inactivity. First request after spin-down may take 30-60 seconds.
- **API Key Security**: Never commit your `.env` file. Use Render's environment variables.
- **CORS**: Update `FRONTEND_URL` environment variable with your actual frontend URL after deploying frontend.

### Testing Your Deployment

Once deployed, test your API:

```bash
# Health check
curl https://your-service-name.onrender.com/health

# Chat endpoint
curl -X POST https://your-service-name.onrender.com/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"What courses are offered?"}'
```

### Updating Your Deployment

Render automatically deploys when you push to your connected branch:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

### Monitoring

- View logs in Render dashboard under your service → "Logs" tab
- Monitor health check status
- Check metrics for response times and uptime

### Troubleshooting

**Service won't start?**

- Check logs in Render dashboard
- Verify all environment variables are set correctly
- Ensure `GEMINI_API_KEY` is valid

**CORS errors?**

- Verify `FRONTEND_URL` environment variable is set
- Check that frontend URL matches exactly (including protocol)

**Slow first response?**

- This is normal on free tier due to spin-down
- Consider upgrading to paid tier for always-on service

### Alternative: Using render.yaml

You can also use the included `render.yaml` file for Blueprint deployment:

1. Go to Render Dashboard → "Blueprints"
2. Click "New Blueprint Instance"
3. Connect your repository
4. Render will automatically detect `render.yaml` and configure your service

### Support

For issues or questions, check:

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com/)
