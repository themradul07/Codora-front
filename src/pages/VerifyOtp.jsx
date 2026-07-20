import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { postJSON } from "../api";
import { ShieldCheck, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const phone = state?.phone;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef([]);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!phone) {
      toast.error("No phone number found");
      navigate("/register");
    }
  }, [phone, navigate]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleClear = () => {
    setOtp(["", "", "", "", "", ""]);
    inputsRef.current[0]?.focus();
  };

  const handleSubmit = async () => {
    const code = otp.join("");

    if (code.length !== 6) {
      return toast.error("Enter 6-digit OTP");
    }

    try {
      const data = await postJSON("/auth/verify", { phone, otp: code });

      if (data.success) {
        toast.success("OTP Verified!");
        localStorage.setItem("token", data.token);
        navigate("/update-profile", { state: { phone } });
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Server error. Please try again.");
    }
  };

  const resendOtp = async () => {
    setResending(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/auth/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("OTP resent successfully.");
        setOtp(["", "", "", "", "", ""]);
        inputsRef.current[0]?.focus();
      } else {
        toast.error(data.message || "Failed to resend OTP.");
      }
    } catch (e) {
      toast.error("Server error. Please try again.");
    }
    setResending(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 w-full max-w-md p-8 text-center">
        
        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="h-6 w-6" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
          Security Verification
        </h2>
        <p className="text-sm text-slate-500 mb-6">
          Enter the 6-digit verification code sent to <span className="font-semibold text-slate-800">{phone}</span>
        </p>

        {/* OTP Input Boxes */}
        <div className="flex justify-center gap-2.5 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength="1"
              className="w-11 h-12 text-center text-lg font-bold border border-slate-300 rounded-xl bg-white text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>

        {/* Resend Action */}
        <div className="flex justify-between items-center mb-6 text-xs text-slate-500">
          <span>Didn&apos;t receive the code?</span>
          <button
            className="text-emerald-600 font-semibold hover:underline disabled:opacity-50 flex items-center gap-1 cursor-pointer"
            onClick={resendOtp}
            disabled={resending}
          >
            <RefreshCw className={`h-3 w-3 ${resending ? "animate-spin" : ""}`} />
            <span>{resending ? "Resending..." : "Resend OTP"}</span>
          </button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={otp.some((d) => d === "")}
          className="w-full mb-3"
        >
          Verify & Continue
        </Button>

        <button
          onClick={handleClear}
          className="text-xs text-slate-500 hover:text-slate-800 font-medium hover:underline cursor-pointer"
        >
          Clear Fields
        </button>
      </div>
    </div>
  );
};

export default VerifyOtp;
