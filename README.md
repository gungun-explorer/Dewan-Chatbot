# Dewan Chatbot 🤖

**Hybrid NLP + Gemini AI Chatbot for Dewan VS Group of Institutions**

A full-stack intelligent chatbot combining local NLP training (node-nlp) with Google Gemini AI fallback to provide accurate, helpful information about admissions, placements, facilities, and student life at DVSGI.

🌐 **Live Demo**: [https://dewanbot.vercel.app/](https://dewanbot.vercel.app/)



## 📚 Full Documentation

**See [DOCUMENTATION.md](DOCUMENTATION.md)** for complete guide including:


## 🛠️ Tech Stack

### Frontend

- **React 18.2.0** - UI framework
- **Tailwind CSS 3.4.17** - Utility-first styling
- **Axios 1.6.5** - HTTP client
- **Create React App** - Build tooling

### Backend

- **Node.js (v18+)** - Runtime environment
- **Express 4.18.2** - Web framework
- **node-nlp 4.27.0** - Natural Language Processing
- **@google/genai 1.0.0** - Google Gemini AI integration
- **CORS 2.8.5** - Cross-origin support
- **dotenv 16.3.1** - Environment configuration

### Deployment

- **Frontend**: Vercel (Production)
- **Backend**: Render (Production)
- **Version Control**: GitHub

## 📁 Project Structure

```
dewan-chatbot/
├── server/          # Node/Express backend
├── client/          # React frontend
├── package.json     # Root dev scripts
└── DOCUMENTATION.md # Complete guide
```

## 🎯 Features

- **Hybrid Intelligence**: Local NLP (node-nlp) + Gemini AI fallback
- **19 Trained Intents**: Comprehensive college information coverage
- **Smart Routing**: 0.75 confidence threshold for optimal responses
- **Modern UI**: Responsive design with Tailwind CSS
- **Real-time Chat**: Instant responses with typing indicators
- **Bilingual Support**: English + Hinglish queries
- **Production Ready**: Deployed on Render + Vercel

## 💬 Usage & Demo

### Try These Questions:

**Admissions:**

- "admission process kya hai?"
- "What documents are needed for admission?"
- "How to apply online?"

**Placements:**

- "highest package kitna hai?"
- "Which companies visit for placements?"
- "Tell me about placement record"

**Student Life:**

- "college mein kya clubs hain?"
- "What is Code-Warm Club?"
- "Tell me about annual events"

**Facilities:**

- "library mein kitni books hain?"
- "What labs are available?"
- "Is there a bus facility?"

**Scholarships:**

- "scholarship milti hai kya?"
- "Tell me about Shri VS Dewan scholarship"
- "How to apply for financial aid?"

### Sample Responses:

**Q:** "What is the highest placement package?"  
**A:** "We have an excellent placement record! 🎯 In 2024-25, Aditi Dev secured ₹15.7 LPA at Gartner. The average package is ₹4 LPA. Top recruiters include TCS, Wipro, Infosys, and Tech Mahindra."

**Q:** "admission ke liye kya documents chahiye"  
**A:** "To take admission at DVSGI: Submit documents: 10th/12th Marksheets, Migration Certificate, Graduation Degree (for PG), Aadhar Card, and 4 Passport Photos. Visit www.dewaninstitutes.com to apply online. Need help? Call: 0121-2440315"


See [DOCUMENTATION.md](DOCUMENTATION.md) for detailed deployment steps.

---

Made with ❤️ for Dewan VS Group of Institutions
