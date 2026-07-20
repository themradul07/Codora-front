import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Microscope,
  Bug,
  BarChart,
  MapPin,
  CalendarDays,
  Sparkles,
  ScrollText,
  ShoppingCart,
  UserRound,
  Droplet ,
  Sprout,
  Store ,
  PlusCircle,
  FlaskConical,
  ArrowRight,
  Wrench
} from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const FEATURES = (t) => [
  {
    to: "/mediator",
    icon: <Microscope className="h-7 w-7 text-emerald-400" />,
    titleKey: "features.detectCrop.title",
    textKey: "features.detectCrop.text",
    badge: "AI Powered"
  },
  {
    to: "/pest-detection",
    icon: <Bug className="h-7 w-7 text-lime-400" />,
    titleKey: "features.pestDetection.title",
    textKey: "features.pestDetection.text",
    badge: "Popular"
  },
  {
    to: "/market-trends",
    icon: <BarChart className="h-7 w-7 text-amber-400" />,
    titleKey: "features.marketTrends.title",
    textKey: "features.marketTrends.text",
  },
  {
    to: "/market-calculator",
    icon: <Sprout className="h-7 w-7 text-emerald-300" />,
    titleKey: "Price Calculator",
    textKey: "Calculate optimal prices for your crops.",
  },
  {
    to: "/market-place",
    icon: <MapPin className="h-7 w-7 text-teal-400" />,
    titleKey: "features.nearestMarketplace.title",
    textKey: "features.nearestMarketplace.text",
  },
  {
    to: "/fertilizer-guidance",
    icon: <Microscope className="h-7 w-7 text-teal-300" />,
    titleKey: "features.fertilizerGuidance.title",
    textKey: "features.fertilizerGuidance.text",
  },
  {
    to: "/crop-calender",
    icon: <CalendarDays className="h-7 w-7 text-lime-300" />,
    titleKey: "features.cropCalendar.title",
    textKey: "features.cropCalendar.text",
  },
  {
    to: "/nearby-service",
    icon: <MapPin className="h-7 w-7 text-emerald-400" />,
    titleKey: "features.nearbyServices.title",
    textKey: "features.nearbyServices.text",
  },
  {
    to: "/schemes",
    icon: <ScrollText className="h-7 w-7 text-amber-300" />,
    titleKey: "features.schemes.title",
    textKey: "features.schemes.text",
    badge: "Government"
  },
  {
    to: "/market-place/create-requirement",
    icon: <ShoppingCart className="h-7 w-7 text-emerald-400" />,
    titleKey: "features.createBuySell.title",
    textKey: "features.createBuySell.text",
  },
  {
    to: "/farmer-profile",
    icon: <UserRound className="h-7 w-7 text-teal-300" />,
    titleKey: "features.updateProfile.title",
    textKey: "features.updateProfile.text",
  },
  {
    to: "/farms",
    icon: <MapPin className="h-7 w-7 text-sky-400" />,
    titleKey: "features.showallfarms.title",
    textKey: "features.showallfarms.text",
  },
  {
    to: "/farms/add",
    icon: <PlusCircle className="h-7 w-7 text-emerald-400" />,
    titleKey: "Add New Farm",
    textKey: "Register a new farm with location and details.",
  },
  {
    to: "/detact-pesticide",
    icon: <FlaskConical className="h-7 w-7 text-teal-300" />,
    titleKey: "Pesticide Restriction Checker",
    textKey: "Check pesticide restrictions for crops.",
  },
  {
    to: "/soil-scanner",
    icon: <Microscope className="h-7 w-7 text-emerald-300" />,
    titleKey: "features.soilScanner.title",
    textKey: "features.soilScanner.text",
    badge: "Scanner"
  },
  {
    to: "/loans/all",
    icon: <PlusCircle className="h-7 w-7 text-emerald-400" />,
    titleKey: "Get Loan",
    textKey: "Apply for agricultural loans easily.",
    badge: "Financial"
  },
];

const ViewTools = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  const { t } = useLanguage();
  const features = FEATURES(t);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Ambient background glow Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Wrench className="h-4 w-4" />
            <span>Smart Agricultural Toolkit</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            {t("tools.title")}
          </h1>
          <p className="max-w-xl mx-auto text-base text-slate-400 leading-relaxed">
            {t("tools.subtitle")}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <Link
              key={item.to || idx}
              to={item.to}
              className="group glass-card-dark p-6 rounded-2xl hover:border-emerald-500/60 hover:bg-slate-900/90 transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-950/50 flex flex-col justify-between relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-bl-full group-hover:bg-emerald-500/10 transition-colors pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/90 border border-slate-700/80 group-hover:border-emerald-500/50 group-hover:bg-emerald-950/60 group-hover:scale-110 shadow-md transition-all duration-300">
                    {item.icon}
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-100 group-hover:text-emerald-300 transition-colors mb-2">
                  {t(item.titleKey)}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {t(item.textKey)}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-emerald-400 opacity-80 group-hover:opacity-100 transition-opacity">
                <span>Access Tool</span>
                <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ViewTools;
