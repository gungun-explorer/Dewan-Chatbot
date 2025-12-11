#!/bin/bash

echo "================================"
echo "Dewan Chatbot Setup Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}❌ Node.js is not installed. Please install it first.${NC}"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js ${NC}$(node --version)${GREEN} detected${NC}"
echo -e "${GREEN}✓ npm ${NC}$(npm --version)${GREEN} detected${NC}"
echo ""

# Setup Backend
echo -e "${BLUE}Setting up Backend...${NC}"
cd server

if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
PORT=5000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
NLP_CONFIDENCE_THRESHOLD=0.8
EOF
    echo -e "${GREEN}✓ .env created. Please update GEMINI_API_KEY${NC}"
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Some dependencies may have failed to install${NC}"
fi

echo ""

# Setup Frontend
echo -e "${BLUE}Setting up Frontend...${NC}"
cd ../client

if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
REACT_APP_API_URL=http://localhost:5000
EOF
    echo -e "${GREEN}✓ .env created${NC}"
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

echo -e "${YELLOW}Installing dependencies...${NC}"
npm install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠ Some dependencies may have failed to install${NC}"
fi

echo ""
echo "================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "================================"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. Update server/.env with your Gemini API key"
echo "   Get it from: https://aistudio.google.com/app/apikey"
echo ""
echo "2. Start Backend (in one terminal):"
echo "   cd server"
echo "   npm run dev"
echo ""
echo "3. Start Frontend (in another terminal):"
echo "   cd client"
echo "   npm start"
echo ""
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For more info, see README.md"
