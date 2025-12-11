# Dewan Chatbot

AI-powered chatbot for Dewan VS Group of Institutions using hybrid NLP + Google Gemini AI.

## Quick Setup

**1. Install Dependencies**

```bash
npm install
cd server && npm install
cd ../client && npm install
```

**2. Configure Backend**

Edit `server/.env`:

```env
PORT=5000
GEMINI_API_KEY=your_api_key_here
NLP_CONFIDENCE_THRESHOLD=0.75
```

**3. Run Application**

```bash
npm run dev
```

**4. Open Browser** → `http://localhost:3000`

## Features

- Hybrid NLP (node-nlp) + Gemini AI fallback
- 12 trained intents for college information
- Confidence threshold: 0.75 (uses Gemini for low-confidence queries)
- Modern React UI with source attribution badges

## Tech Stack

- **Frontend**: React 18.2, Axios
- **Backend**: Node.js, Express, node-nlp, Google Gemini AI
- **Deployment**: Render (backend) + Vercel (frontend)

## API Endpoints

**POST** `/api/chat`

```json
Request: { "message": "What courses are offered?" }
Response: {
  "response": "We offer MCA, MBA...",
  "confidence": 0.92,
  "source": "Local Bot",
  "intent": "Courses Offered"
}
```

**GET** `/api/health` - Check server status

**GET** `/api/intents` - List all trained intents

## Deployment

**Backend (Render)**:

- Set env vars: `GEMINI_API_KEY`, `NLP_CONFIDENCE_THRESHOLD=0.75`
- Build command: `cd server && npm install`
- Start command: `node server/server.js`

**Frontend (Vercel)**:

- Set env var: `REACT_APP_API_URL=<your-render-backend-url>`
- Framework: Create React App
- Build command: `cd client && npm run build`
- Output directory: `client/build`

---

**Made by Gungun Singh** | [LinkedIn](https://www.linkedin.com/in/gungun-singh-585617297/)
