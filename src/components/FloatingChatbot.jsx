import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Sparkles } from "lucide-react";
import ChatbotPanel from "./ChatbotPanel";
import { isAuthenticated } from "../lib/actions/authActions";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FloatingChatbot = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const chatRef = useRef(null);
  const buttonRef = useRef(null);

  const handleToggle = () => {
    if (!open) {
      const authed = isAuthenticated();
      if (!authed) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (
        chatRef.current &&
        !chatRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {/* Floating Button with Pulse Glow */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          ref={buttonRef}
          onClick={handleToggle}
          aria-label="Toggle AI Assistant Chat"
          className="relative group bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-full p-4 shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/50 flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          {/* Animated Pulse Ring */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500/30 animate-ping opacity-75 pointer-events-none"></span>

          {open ? (
            <X className="w-7 h-7 transition-transform duration-300 rotate-90" />
          ) : (
            <div className="relative">
              <MessageCircle className="w-7 h-7" />
              <Sparkles className="w-3.5 h-3.5 text-lime-300 absolute -top-1 -right-1 animate-bounce" />
            </div>
          )}
        </button>
      </div>

      {/* Animated Chat Window Container */}
      {open && (
        <div
          ref={chatRef}
          className="fixed bottom-24 right-4 sm:right-6 z-40 animate-fade-in-up shadow-2xl rounded-2xl overflow-hidden border border-emerald-200/80 max-w-[calc(100vw-2rem)] sm:max-w-md"
        >
          <ChatbotPanel />
        </div>
      )}
    </>
  );
};

export default FloatingChatbot;
