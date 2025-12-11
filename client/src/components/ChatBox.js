import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Generates a unique ID for each message to keep React keys stable
const createMessageId = () =>
  `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const ChatBox = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Welcome to Dewan VS Group of Institutions!\n\nI'm your virtual assistant. Ask me about:\n\n🎓 Admissions & Courses\n👨‍🏫 Faculty & Departments\n💰 Fees & Scholarships\n📍 Campus & Facilities\n\nHow can I assist you today?",
      sender: "bot",
      source: "System",
      timestamp: new Date(),
      isInitial: true,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAbout, setShowAbout] = useState(false);
  const messagesEndRef = useRef(null);

  const [suggestedQuestions] = useState([
    "What are the courses offered?",
    "What is the admission process?",
    "Where is the college located?",
    "What are the fee structures?",
  ]);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const messageToSend = input.trim();
    if (!messageToSend) {
      setErrorMessage("Please enter a message first!");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }

    setErrorMessage("");

    // Add user message to chat
    const userMessage = {
      id: createMessageId(),
      text: messageToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      // Send to backend
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: messageToSend,
      });

      const {
        response: botResponse,
        source,
        confidence,
        intent,
      } = response.data;

      if (!botResponse) {
        throw new Error("Invalid response from server");
      }

      // Add bot response to chat
      const botMessage = {
        id: createMessageId(),
        text: botResponse,
        sender: "bot",
        source,
        confidence,
        intent,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);

      const errorBotMessage = {
        id: createMessageId(),
        text:
          error.response?.data?.error ||
          "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        source: "Error",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorBotMessage]);
      setErrorMessage("Failed to send message. Please try again.");
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestedQuestion = (question) => {
    setInput(question);
    setTimeout(() => {
      const textarea = document.querySelector(".message-input");
      if (textarea) {
        textarea.focus();
      }
    }, 0);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 text-white px-4 sm:px-6 py-3 sm:py-4 shadow-lg border-b border-white/10 relative">
        <div className="flex items-center justify-between max-w-6xl mx-auto w-full gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            {/* Logo */}
            <div className="relative flex-shrink-0  sm:p-1.5 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/30">
              <img
                src="/logo.png"
                alt="Dewan VS Group Logo"
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-md sm:rounded-lg object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              <div className="hidden w-8 h-8 sm:w-12 sm:h-12 rounded-md sm:rounded-lg bg-gradient-to-br from-white/20 to-white/10 items-center justify-center">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                  fill="none"
                  className="sm:w-8 sm:h-8">
                  <rect
                    width="48"
                    height="48"
                    rx="8"
                    fill="rgba(255,255,255,0.1)"
                  />
                  <path
                    d="M24 14L32 20V32L24 38L16 32V20L24 14Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="24" cy="24" r="4" fill="white" />
                </svg>
              </div>
            </div>
            {/* Header Text */}
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight truncate">
                Dewan Chatbot
              </h1>
              <p className="text-xs sm:text-sm text-white/90 font-medium truncate">
                Powered by AI • Always here to help
              </p>
            </div>
          </div>
          {/* About Button */}
          <button
            onClick={() => setShowAbout(true)}
            className="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/20 text-xs sm:text-sm font-medium flex-shrink-0 whitespace-nowrap">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="hidden sm:inline">About</span>
          </button>
        </div>
      </div>

      {/* Error Notification */}
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 px-6 py-3 animate-pulse">
          <span className="font-medium">⚠️ {errorMessage}</span>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 relative">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            } animate-[slideIn_0.3s_ease-out]`}>
            <div
              className={`max-w-[75%] md:max-w-[60%] rounded-2xl px-5 py-3 shadow-md ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-primary-500 to-primary-700 text-white"
                  : "bg-white text-gray-800"
              }`}>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {msg.text}
              </p>
              <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                <span
                  className={`text-xs font-semibold ml-auto ${
                    msg.sender === "user"
                      ? "text-white/90"
                      : "text-gray-700 bg-gray-200/80 px-2 py-1 rounded-md backdrop-blur-sm"
                  }`}>
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-5 py-3 shadow-md">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer with Input */}
      <div className="border-t border-gray-300 bg-white/80 backdrop-blur-md px-3 sm:px-4 py-3 sm:py-4 space-y-2 sm:space-y-3">
        <div className="flex gap-2 sm:gap-3 items-end max-w-6xl mx-auto w-full">
          <textarea
            className="flex-1 resize-none rounded-xl sm:rounded-2xl border-2 border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm outline-none transition-all duration-200 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your question..."
            rows="1"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-primary-500/40 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-lg transition-all duration-200 relative overflow-hidden group">
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            {/* Button content */}
            <div className="relative flex items-center justify-center">
              {loading ? (
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                </div>
              ) : (
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-y-0.5 transition-transform duration-200"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16345898 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99 L3.03521743,10.4309931 C3.03521743,10.5880905 3.19218622,10.7451879 3.50612381,10.7451879 L16.6915026,11.5306748 C16.6915026,11.5306748 17.1624089,11.5306748 17.1624089,12.0019669 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
                </svg>
              )}
            </div>
          </button>
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && !loading && (
          <div className="max-w-6xl mx-auto w-full">
            <p className="text-xs font-semibold text-gray-600 mb-2 px-2">
              Quick suggestions:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 px-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-left text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-cyan-400 to-primary-500 text-white rounded-lg sm:rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-medium line-clamp-1 sm:line-clamp-2">
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* About Modal */}
      {showAbout && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setShowAbout(false)}>
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative animate-[slideIn_0.3s_ease-out] my-auto"
            onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setShowAbout(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💜</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                About This Chatbot
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
                An AI-powered assistant for Dewan VS Group of Institutions,
                combining local NLP with Google Gemini AI.
              </p>

              {/* Project Details */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 text-left">
                <p className="text-xs sm:text-sm font-semibold text-gray-800 mb-2">
                  📚 Project Details:
                </p>
                <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
                  <li>
                    • <strong>Developed as:</strong> Minor Project for MCA 3rd
                    Semester
                  </li>
                  <li>
                    • <strong>Under Guidance:</strong> Dr. Sandeep Gupta Sir
                  </li>
                  <li>
                    • <strong>Training Data:</strong> Dialogflow
                  </li>
                  <li>
                    • <strong>Technologies:</strong> React, Node.js, node-nlp,
                    Gemini AI
                  </li>
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-xs sm:text-sm text-gray-600 mb-3 font-medium">
                  Designed & Developed by
                </p>
                <a
                  href="https://www.linkedin.com/in/gungun-singh-585617297/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-xs sm:text-sm">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Gungun Singh
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
