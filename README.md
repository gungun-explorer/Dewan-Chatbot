# Dewan Chatbot

**MERN Stack Chatbot with Hybrid NLP + Gemini AI**

A full-stack intelligent chatbot combining local NLP training (node-nlp) with Google Gemini AI fallback for Dewan VS Group of Institutions.

## 🚀 Quick Start

```bash
# Install dependencies
npm install
cd server && npm install
cd ../client && npm install

# Configure backend
# Edit server/.env and add your GEMINI_API_KEY

# Add your college logo (optional)
# Place a 512x512px logo.png in client/public/

# Run both servers
cd ..
npm run dev
```

Open http://localhost:3000 and start chatting!

## 📚 Full Documentation

**See [DOCUMENTATION.md](DOCUMENTATION.md)** for complete guide including:

- Installation & setup
- Architecture overview
- API documentation
- Frontend & backend guides
- Deployment instructions (Render + Vercel)
- Troubleshooting

## 🛠️ Tech Stack

- **Frontend**: React 18, Axios, CSS3
- **Backend**: Node.js, Express, node-nlp, Gemini AI
- **Development**: nodemon, concurrently

## 📁 Project Structure

```
dewan-chatbot/
├── server/          # Node/Express backend
├── client/          # React frontend
├── package.json     # Root dev scripts
└── DOCUMENTATION.md # Complete guide
```

## 🎯 Features

- Hybrid NLP + Gemini AI system
- Beautiful dark glassy UI
- Source attribution badges
- Confidence score display
- Responsive mobile design
- Auto-scroll & typing indicators
- Suggested quick questions

## 🚀 Deployment

**Recommended:**

- Backend → [Render](https://render.com) (free tier, persistent Node.js)
- Frontend → [Vercel](https://vercel.com) (free tier, optimized for React)

See [DOCUMENTATION.md](DOCUMENTATION.md) for detailed deployment steps.

---

Made with ❤️ for Dewan VS Group of Institutions
