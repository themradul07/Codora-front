import React, { useEffect, useState } from "react";
import { Award, FileText, Loader2, AlertTriangle, Sparkles } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../lib/actions/authActions";
import { toast } from "react-toastify";

import AddActivity from "../components/AddActivity";
import axios from "axios";

// COMPONENTS
import WeatherCard from "../components/WeatherCard";
import Grid from "../components/Dashboard/Grid";
import { getJSON, postJSON } from "../api";
import CropCalendar from "../components/TasksComponent";

const Dashboard = () => {
  const [cropTips, setCropTips] = useState([]);
  const [marketPrices, setMarketPrices] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);

  const [tasks, setTasks] = useState([
    { id: 1, text: "Check paddy field for pest signs", done: false },
    { id: 2, text: "Irrigate banana plot (2 hrs)", done: true },
    { id: 3, text: "Visit nearby mandi for price info", done: false },
  ]);
  const [newTask, setNewTask] = useState("");

  const { t } = useLanguage();
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
  });

  // Fetch Market & Schemes
  const fetchData = async () => {
    try {
       const res = await getJSON('/tasks/today');
       console.log(res);
    } catch (err) {
      console.error("Market/Schemes error:", err);
    }
  };

  // Weather Fetch
  const loadWeather = async () => {
    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=748c922b6b124c14ad305356252111&q=Kerala&days=4&aqi=no&alerts=no`;

      const response = await fetch(url);
      const data = await response.json();

      if (data?.current) {
        data.current.temp_c = Math.ceil(data.current.temp_c);
        data.current.feelslike_c = Math.ceil(data.current.feelslike_c);
        data.current.humidity = Math.ceil(data.current.humidity);
        data.current.wind_kph = Math.ceil(data.current.wind_kph);
      }

      setWeather(data);
    } catch (error) {
      console.log("Weather error:", error);
    } fontally: {
      setLoadingWeather(false);
    }
  };

  // Auth check + load everything
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    if (!isAuthenticated()) {
      toast.error(t("pleaseLogin"));
      navigate("/login");
      return;
    }

    fetchData();
    loadWeather();
  }, []);

  if (loadingWeather) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <Loader2 className="h-10 w-10 text-emerald-600 animate-spin" />
        <p className="text-slate-600 font-medium text-sm animate-pulse">{t("loadingWeather")}</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
        <AlertTriangle className="h-10 w-10 text-amber-500" />
        <p className="text-rose-500 font-semibold">{t("weatherFailed")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 pb-12">
      {/* Dashboard Banner */}
      <div
        className="mb-10 flex flex-col items-center justify-center min-h-[280px] sm:min-h-[320px] gap-4 overflow-hidden shadow-lg relative bg-cover bg-center border-b border-emerald-100"
        style={{ backgroundImage: "url(/bg10.jpg)" }}
      >
        {/* Dark Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-emerald-950/80 to-slate-950/85 backdrop-blur-[2px]"></div>

        <div className="relative z-10 flex flex-col items-center gap-4 w-full text-center py-10 px-6 max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Smart Advisory Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
            {t("farmerDashboard")}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 max-w-xl drop-shadow font-medium">
            {t("dashboardSubtitle")}
          </p>

          <div className="mt-2">
            <AddActivity />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
           <WeatherCard Weather={weather} setWeather={setWeather} />
          </div>

          {/* RIGHT */}
          <div className="space-y-8 mb-8">
            <CropCalendar/>
          </div>
        </div>

        <div className="mt-10">
          <Grid />
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
