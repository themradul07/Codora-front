import React from "react";
import {
  Microscope,
  Bug,
  BarChart3,
  Store,
  FlaskConical,
  Sprout,
  CalendarDays,
  MapPin,
  ArrowRight,
  Wrench
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../ui/Button";

const FEATURES = [
  {
    to: "/upload",
    icon: <Microscope className="h-5 w-5 text-emerald-400" />,
    titleKey: "feature_detectCropDisease_title",
    textKey: "feature_detectCropDisease_text",
  },
  {
    to: "/pest-detection",
    icon: <Bug className="h-5 w-5 text-emerald-400" />,
    titleKey: "feature_pestDetection_title",
    textKey: "feature_pestDetection_text",
  },
  {
    to: "/market-trends",
    icon: <BarChart3 className="h-5 w-5 text-emerald-400" />,
    titleKey: "feature_marketTrends_title",
    textKey: "feature_marketTrends_text",
  },
  {
    to: "/market-place",
    icon: <Store className="h-5 w-5 text-emerald-400" />,
    titleKey: "feature_nearestMarketplace_title",
    textKey: "feature_nearestMarketplace_text",
  },
  {
    to: "/soil-scanner",
    icon: <FlaskConical className="h-5 w-5 text-emerald-400" />,
    titleKey: "feature_soilScanner_title",
    textKey: "feature_soilScanner_text",
  },
  {
    to: "/fertilizer-guidance",
    icon: <Sprout className="h-5 w-5 text-emerald-400" />,
    titleKey: "feature_fertilizerGuidance_title",
    textKey: "feature_fertilizerGuidance_text",
  },
  {
    to: "/crop-calender",
    icon: <CalendarDays className="h-5 w-5 text-emerald-400" />,
    titleKey: "feature_smartCropCalendar_title",
    textKey: "feature_smartCropCalendar_text",
  },
  {
    to: "/nearby-service",
    icon: <MapPin className="h-5 w-5 text-emerald-400" />,
    titleKey: "feature_nearbyServices_title",
    textKey: "feature_nearbyServices_text",
  },
];

const Grid = () => {
  const { t } = useLanguage();

  return (
    <section className="w-full bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 my-8 shadow-xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Wrench className="h-3.5 w-3.5" />
          <span>Agricultural Directory</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {t("toolsServicesTitle")}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
          {t("toolsServicesSubtitle")}
        </p>
      </div>

      {/* Grid Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {FEATURES.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="group p-5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/60 rounded-xl transition-all duration-200 flex flex-col justify-between hover:shadow-lg hover:shadow-emerald-950/20"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center mb-3 group-hover:scale-105 group-hover:bg-emerald-900/90 transition-all">
                {item.icon}
              </div>

              <h3 className="text-sm font-extrabold text-slate-100 group-hover:text-emerald-300 transition-colors">
                {t(item.titleKey)}
              </h3>
              <p className="mt-1.5 text-xs text-slate-400 leading-relaxed font-normal">
                {t(item.textKey)}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-emerald-400 opacity-90 group-hover:opacity-100">
              <span>Access Tool</span>
              <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-8 flex justify-center">
        <Link to="/tools">
          <Button variant="secondary" size="sm" className="bg-slate-800 border-slate-700 hover:bg-slate-750 hover:border-slate-600">
            {t("viewAllTools")}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default Grid;
