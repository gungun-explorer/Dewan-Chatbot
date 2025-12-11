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
- 19 trained intents for comprehensive college information
- Confidence threshold: 0.75 (uses Gemini for low-confidence queries)
- Modern React UI with real-time chat interface
- Detailed responses with specific college data (placements, scholarships, facilities, etc.)

## Tech Stack

### Frontend

- **Framework**: React 18.2.0
- **Styling**: Tailwind CSS 3.4.17 with custom configuration
- **HTTP Client**: Axios 1.6.5
- **UI Components**: Custom ChatBox component with responsive design
- **Build Tool**: Create React App (Webpack)
- **State Management**: React Hooks (useState, useEffect, useRef)

### Backend

- **Runtime**: Node.js (v18.0.0+)
- **Framework**: Express 4.18.2
- **NLP Engine**: node-nlp 4.27.0 (Natural Language Processing)
- **AI Integration**: @google/genai 1.0.0 (Google Gemini 2.5 Flash model)
- **Middleware**:
  - CORS 2.8.5 (Cross-Origin Resource Sharing)
  - body-parser 1.20.2 (Request parsing)
  - dotenv 16.3.1 (Environment configuration)

### NLP Training Data

- **Format**: Dialogflow JSON intent structure
- **Total Intents**: 19 (12 original + 7 detailed intents)
- **Languages**: English + Hinglish support
- **Intent Categories**:
  - Admission Process & Eligibility
  - Placements & Career Statistics
  - Student Clubs & Activities
  - Scholarships & Financial Aid
  - Transport & Bus Routes
  - Campus Facilities & Labs
  - Faculty Information
  - Course Details (MCA, B.Tech, MBA, etc.)
  - Fee Structure
  - College Location & Contact

### Deployment

- **Backend Hosting**: Render (Free Tier)
- **Frontend Hosting**: Vercel
- **CI/CD**: GitHub integration with automatic deployments
- **Configuration**: render.yaml (Blueprint deployment)
- **Environment Variables**: Managed via platform dashboards

### Architecture

```
Client (React) → API Gateway (Express) → NLP Classifier (node-nlp)
                                              ↓
                                    [Confidence Check]
                                         ↙        ↘
                              High (≥0.75)    Low (<0.75)
                                   ↓              ↓
                            Intent Response   Gemini AI Fallback
```

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
