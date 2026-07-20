import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cloud, TrendingUp, Shield, Users, Sprout, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);
  const { t } = useLanguage();

  const features = [
    { icon: Cloud, title: 'Weather Intelligence', description: "Real-time weather forecasts and localized alerts tailored for Kerala's farming seasons." },
    { icon: TrendingUp, title: 'Market Insights', description: 'Live mandi commodity prices and historical trends to maximize crop sale profits.' },
    { icon: Shield, title: 'Disease Detection', description: 'Instant AI-powered crop pest and disease identification with organic treatment guides.' },
    { icon: Users, title: 'Expert Advisory', description: 'Direct access to agricultural assistance and government subsidy guidance.' },
  ];

  const stats = [
    { value: "50,000+", label: "Farmers Registered" },
    { value: "98.4%", label: "Advisory Accuracy" },
    { value: "14 Districts", label: "Kerala Coverage" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Hero Section */}
      <section
        className="relative py-24 sm:py-32 bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{
          backgroundImage:
            "url(https://cdn.pixabay.com/photo/2020/01/22/16/33/rice-4785684_1280.jpg)",
        }}
      >
        {/* Dark Contrast Overlay */}
        <div className="absolute inset-0 bg-slate-950/75"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sprout className="h-4 w-4 text-emerald-400" />
            <span>Kerala Agricultural Assistant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            {t('Ai-Powered Farming Assistant for Kerala')}
          </h1>

          <p className="text-base sm:text-lg text-slate-200 mb-10 max-w-3xl mx-auto leading-relaxed font-normal">
            {t('Empowering kerala farmers with smart technology for better crops, weather insights, and market intelligence')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14">
            <Link
              to="/twilio-invite"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base rounded-xl shadow-md transition-colors"
            >
              <span>{t('GetStarted')}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/twilio-invite"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-base rounded-xl transition-colors"
            >
              {t('Login')}
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8 border-t border-white/20">
            {stats.map((stat, i) => (
              <div key={i} className="bg-slate-900/60 rounded-xl p-4 border border-white/10 text-center">
                <div className="text-2xl font-bold text-emerald-400">{stat.value}</div>
                <div className="text-xs text-slate-300 font-medium uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Platform Features
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-3 mb-3 tracking-tight">
              Smart Farming Solutions
            </h2>
            <p className="text-base text-slate-600 max-w-2xl mx-auto">
              Tailored tools and data streams built specifically for farmers across Kerala.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="bg-emerald-50 text-emerald-700 w-12 h-12 rounded-xl flex items-center justify-center mb-5 border border-emerald-200/60">
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-700">
                    <span>Explore Feature</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Ready to Optimize Your Crop Yields?
          </h2>

          <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl mx-auto">
            Join thousands of Kerala farmers utilizing real-time advice and agricultural intelligence today.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm transition-colors"
          >
            <span>Start Free Today</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;