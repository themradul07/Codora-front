import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Square, Sparkles } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { getBotResponse } from "../lib/actions/chatbot";
import AudioRecorder from "../components/AudioRecorder";
import { PageHeader } from "../components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const Chatbot = () => {
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
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasAskedQuestion, setHasAskedQuestion] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  const suggestions = [
    "Help me profile a new farmer for Krishi Sakhi",
    "What should I do on my field this week based on weather?",
    "Log an activity: irrigated 1 acre of banana today evening",
    "Are there any pest outbreaks reported near my village?",
  ];

  const quickQuestions = [
    "Best time to plant rice in Kerala?",
    "How to prevent coconut diseases?",
    "Current weather suitable for planting?",
    "Organic fertilizer recommendations",
  ];

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSend = async (textFromBtn) => {
    const content = (textFromBtn ?? input).trim();
    if (!content) return;

    const userMessage = {
      id: Date.now().toString(),
      text: content,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    if (!hasAskedQuestion) setHasAskedQuestion(true);

    try {
      const botText = await getBotResponse(content);
      let botResponseData;
      try {
        botResponseData = botText;
      } catch {
        botResponseData = { answer: botText, templateId: 1, steps: [] };
      }

      const botMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        timestamp: new Date(),
        ...botResponseData,
      };

      if (botResponseData.audioBase64) {
        playBotAudio(botResponseData.audioBase64);
      }

      setMessages((prev) => [...prev, botMessage]);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <PageHeader
          badge="Agri Intelligence"
          badgeIcon={Sparkles}
          title="Krishi Sakhi Knowledge Engine"
          subtitle="Direct conversational access to localized crop recommendations, weather alerts, and pest advisories."
        />

        <Card className="mb-6">
          <CardHeader className="bg-slate-900 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-emerald-400" />
              <CardTitle className="text-white text-base">Conversational Assistant Console</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            
            {/* Messages */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto p-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start gap-2.5 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`p-2 rounded-xl text-white shadow-xs shrink-0 ${msg.sender === "user" ? "bg-emerald-600" : "bg-slate-800"}`}>
                      {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    <div className={`p-3.5 rounded-2xl text-xs border ${msg.sender === "user" ? "bg-emerald-600 text-white border-emerald-600 rounded-tr-none" : "bg-slate-50 text-slate-800 border-slate-200/90 rounded-tl-none"}`}>
                      {msg.sender === "bot" && msg.templateId === 2 ? (
                        <div>
                          <p className="font-semibold">{msg.answer}</p>
                          <ol className="list-decimal list-inside mt-2 space-y-1">
                            {msg.steps.map((step, idx) => (
                              <li key={idx}>{step.replace(/\*\*/g, "")}</li>
                            ))}
                          </ol>
                        </div>
                      ) : (
                        <p className="leading-relaxed">{msg.answer || msg.text}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-800 text-white">
                      <Bot className="h-4 w-4 animate-spin" />
                    </div>
                    <span className="text-xs text-slate-500 font-medium">Generating response...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSubmit} className="flex gap-2 pt-3 border-t border-slate-100">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
              />

              <AudioRecorder setMessage={setInput} setProcessing={setIsTyping} />

              {isPlaying && (
                <button
                  type="button"
                  onClick={stopAudio}
                  className="px-3 py-2 bg-rose-600 text-white rounded-xl text-xs font-semibold"
                >
                  <Square className="h-3.5 w-3.5" />
                </button>
              )}

              <Button type="submit" disabled={!input.trim()} size="sm">
                <Send className="h-3.5 w-3.5" />
                <span>Send</span>
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {suggestions.map((text, i) => (
            <div
              key={i}
              onClick={() => handleSend(text)}
              className="p-3 bg-white border border-slate-200/90 rounded-xl hover:border-emerald-300 text-xs text-slate-700 font-medium cursor-pointer transition-colors"
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
