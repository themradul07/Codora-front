import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isAuthenticated, onLogin } from "../lib/actions/authActions";
import GoogleAuth from "../components/GoogleAuth";
import { postJSON } from "../api";
import { Sprout, Phone, Lock, LogIn } from "lucide-react";

const Login = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
  const navigate = useNavigate();

  const [phone, setphone] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      toast.error("Already Logged In");
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await postJSON("/auth/login", { phone, password, isAdmin });

      if (data.success) {
        console.log("Login successful:", data);
        const role = data.role;
        onLogin({ id: data.userId, token: data.token, isAdmin, role: data.role });
        toast.success(data.message);

        setTimeout(() => {
          if (isAdmin) {
            window.location.href = "/admin/dashboard";
          } else if (role === 'buyer') {
            toast.info("Redirecting to Marketplace...");
            window.location.href = "/market/buyer";
          } else if (role === 'loan') {
            toast.info("Redirecting to Loan Mediator Page...");
            window.location.href = "/ngo/profile/update";
          } else {
            window.location.href = "/dashboard";
          }
        }, 800);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full max-w-md p-8">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs mb-3">
            <Sprout className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to your Krishi Sakhi account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="tel"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setphone(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-slate-700 font-medium">Sign in as Administrator</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="px-3 text-xs text-slate-400 font-medium uppercase tracking-wider">
            or continue with
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Google Auth */}
        <div className="mb-2">
          <GoogleAuth />
        </div>

        {/* Footer Link */}
        <p className="text-xs text-center text-slate-500 mt-6">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="text-emerald-600 font-semibold hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
