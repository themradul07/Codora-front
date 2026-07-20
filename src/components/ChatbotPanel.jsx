import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Volume2, Square } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { getBotResponse } from "../lib/actions/chatbot";
import AudioRecorder from "./AudioRecorder";
import { Button } from "./ui/Button";

const ChatbotPanel = () => {
  const { t, language } = useLanguage();

  const [messages, setMessages] = useState([
    {
      id: "1",
      text:
        language === "en"
          ? "Hello! I'm your AI farming assistant. Ask anything about crops, weather, or Kerala farming."
          : "ഹലോ! ഞാൻ നിങ്ങളുടെ AI കൃഷി സഹായിയാണ്. കേരളത്തിലെ കൃഷി, കാലാവസ്ഥ, രോഗങ്ങൾ എന്നിവയെക്കുറിച്ച് എന്തും ചോദിക്കൂ.",
      sender: "bot",
      timestamp: new Date(),
      templateId: 1,
      answer:
        language === "en"
          ? "Hello! I'm your AI farming assistant. Ask anything about crops, weather, or Kerala farming."
          : "ഹലോ! ഞാൻ നിങ്ങളുടെ AI കൃഷി സഹായിയാണ്. കേരളത്തിലെ കൃഷി, കാലാവസ്ഥ, രോഗങ്ങൾ എന്നിവയെക്കുറിച്ച് എന്തും ചോദിക്കൂ.",
      steps: [],
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasAskedQuestion, setHasAskedQuestion] = useState(false);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    if (!hasAskedQuestion) {
      setHasAskedQuestion(true);
    }

    try {
      const botText = await getBotResponse(inputText);
      let botResponseData;
      try {
        botResponseData = botText;
      } catch {
        botResponseData = { answer: botText, templateId: 1, steps: [] };
      }

      const botResponse = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        timestamp: new Date(),
        ...botResponseData,
      };

      if (botResponseData?.audioBase64) {
        playBotAudio(botResponseData.audioBase64);
      }

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          timestamp: new Date(),
          answer: "Sorry, something went wrong. Please try again later.",
          templateId: 1,
          steps: [],
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const playBotAudio = (base64audio) => {
    try {
      if (!base64audio) return;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audioBlob = new Blob(
        [Uint8Array.from(atob(base64audio), (c) => c.charCodeAt(0))],
        { type: "audio/mp3" }
      );
      const audioUrl = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.onended = () => setIsPlaying(false);
      audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const quickQuestions = [
    "Best time to plant rice in Kerala?",
    "How to prevent coconut diseases?",
    "Current weather suitable for planting?",
    "Organic fertilizer recommendations",
  ];

  return (
    <div className="w-80 sm:w-96 h-[30rem] bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-600">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xs">Krishi Sakhi AI Assistant</h2>
            <p className="text-[10px] text-slate-300">24/7 Kerala Agri Advisory</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`flex items-start gap-2 max-w-[85%] ${
                msg.sender === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`p-1.5 rounded-lg text-white shadow-xs shrink-0 ${
                  msg.sender === "user" ? "bg-emerald-600" : "bg-slate-800"
                }`}
              >
                {msg.sender === "user" ? (
                  <User className="h-3.5 w-3.5" />
                ) : (
                  <Bot className="h-3.5 w-3.5" />
                )}
              </div>

              <div
                className={`p-3 rounded-2xl text-xs border ${
                  msg.sender === "user"
                    ? "bg-emerald-600 text-white border-emerald-600 rounded-tr-none"
                    : "bg-white text-slate-800 border-slate-200/90 rounded-tl-none shadow-xs"
                }`}
              >
                {msg.sender === "bot" && msg.templateId === 2 ? (
                  <div>
                    <p className="font-medium">{msg.answer}</p>
                    <ol className="list-decimal list-inside mt-2 space-y-1 text-xs text-slate-700">
                      {msg.steps.map((step, idx) => (
                        <li key={idx}>{step.replace(/\*\*/g, "")}</li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <p className="leading-relaxed">{msg.answer || msg.text}</p>
                )}
                <p
                  className={`mt-1.5 text-[10px] ${
                    msg.sender === "user" ? "text-emerald-100" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-slate-800 text-white">
                <Bot className="h-3.5 w-3.5" />
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.15s" }}
                  ></div>
                  <div
                    className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.3s" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestions */}
      {!hasAskedQuestion && (
        <div className="px-3 py-2 border-t border-slate-100 bg-white">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
            Quick Prompts
          </p>
          <div className="flex flex-wrap gap-1">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInputText(q)}
                className="px-2 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 rounded-full text-[10px] text-slate-600 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input controls */}
      <div className="p-3 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-1.5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={language === "en" ? "Ask your farming question..." : "നിങ്ങളുടെ കൃഷി ചോദ്യം ചോദിക്കുക..."}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-xl focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none text-xs"
          />

          <AudioRecorder setMessage={setInputText} setProcessing={setIsTyping} />

          {isPlaying && (
            <button
              onClick={stopAudio}
              className="p-2 bg-rose-600 text-white rounded-xl text-xs hover:bg-rose-700"
              title="Stop audio playback"
            >
              <Square className="h-3.5 w-3.5" />
            </button>
          )}

          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            size="sm"
            className="px-3 py-2 text-xs"
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPanel;
