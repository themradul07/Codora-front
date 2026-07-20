import React, { useState, useEffect } from "react";
import { getWeatherData, reverseGeoLookup } from "../lib/actions/weather";

import {
  Cloud,
  Thermometer,
  Droplets,
  Wind,
  LocateFixed,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";

import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

const WeatherCard = ({ Weather, setWeather }) => {
  const { t } = useLanguage();
  const [location, setLocation] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const searchLocation = async (loc) => {
    if (!loc.trim()) return;
    const res = await getWeatherData(loc);
    setWeather(res);
  };

  const handleSearch = () => {
    if (!location.trim()) {
      toast.error(t("enter_location_error"));
      return;
    }
    searchLocation(location);
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert(t("geolocation_not_supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        if (Weather?.location?.name) {
          const detectedCity = Weather.location.name;
          setLocation(detectedCity);
          searchLocation(detectedCity);
        }
      },
      () => alert(t("unable_to_detect_location"))
    );
  };

  const getweekday = (date) =>
    new Date(date).toLocaleDateString("en-US", { weekday: "short" });

  if (!Weather) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
      {/* Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Cloud className="h-5 w-5 text-emerald-600" />
          <span>{t("weather_forecast")}</span>
        </h2>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Input
              type="text"
              placeholder={t("enter_location")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pr-10"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-emerald-600 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={detectLocation}
            variant="secondary"
            size="icon"
            title="Detect location"
          >
            <LocateFixed className="h-4 w-4 text-emerald-600" />
          </Button>
        </div>
      </div>

      {/* Main Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-6 mb-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {Weather.location.name}, {Weather.location.country}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {Weather.current.condition.text}
            </p>
          </div>

          <div className="text-4xl font-extrabold text-emerald-400">
            {Weather.current.temp_c}°C
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-emerald-400" />
            <span>{t("feels_like")} {Weather.current.feelslike_c}°C</span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-emerald-400" />
            <span>{Weather.current.humidity}% {t("humidity")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-emerald-400" />
            <span>{Weather.current.wind_kph} km/h {t("wind")}</span>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Weather.forecast.forecastday.map((day, index) => (
          <div
            key={index}
            className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center"
          >
            <p className="font-bold text-xs text-slate-900 mb-1">
              {getweekday(day.date)}
            </p>
            <img
              src={day.day.condition.icon}
              alt=""
              className="w-8 h-8 mx-auto my-1"
            />
            <p className="text-[11px] text-slate-500 truncate mb-1">
              {day.day.condition.text}
            </p>
            <div className="text-xs font-semibold text-slate-800">
              <span>{day.day.maxtemp_c}°</span>
              <span className="text-slate-400 ml-1">{day.day.mintemp_c}°</span>
            </div>
          </div>
        ))}
      </div>

      {/* Farmer Recommendations */}
      <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5 shadow-sm">
        <h3 className="text-xl font-semibold text-green-700 flex items-center gap-2">
          🌾 Farmer’s Recommendation
        </h3>

        <ul className="mt-3 text-gray-700 space-y-2">
          {recommendations.map((tip, index) => (
            <li key={index}>• {tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WeatherCard;
