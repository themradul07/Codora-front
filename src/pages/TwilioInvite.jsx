import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ArrowRight, QrCode } from "lucide-react";
import { Button } from "../components/ui/Button";

const TwilioInvite = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 w-full max-w-md p-8 text-center flex flex-col items-center">
        
        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
          <MessageSquare className="h-6 w-6" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          WhatsApp Alert Channel
        </h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Powered by Twilio – receive daily mandi price updates, pest advisories, and weather warnings directly on WhatsApp.
        </p>

        {/* QR Code Container */}
        <div className="w-48 h-48 rounded-2xl overflow-hidden border border-slate-200 shadow-sm p-2 bg-slate-50 mb-6 group relative">
          <img
            src="/TwilioNotification.png"
            alt="Twilio WhatsApp QR Code"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <p className="text-xs text-slate-600 mb-6 bg-emerald-50 border border-emerald-200/60 p-3 rounded-xl">
          Scan the QR code with your mobile camera to join our official WhatsApp alert channel.
        </p>

        <Link to="/login" className="w-full">
          <Button className="w-full">
            <span>Continue to Sign In</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TwilioInvite;
