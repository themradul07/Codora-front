import React from 'react';
import { Sprout, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from "react-router-dom";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo & Info */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="bg-emerald-600 p-2 rounded-lg text-white">
                <Sprout className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Krishi Sakhi <span className="text-emerald-400 font-semibold text-sm">Kerala</span>
              </span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              {t("footerDescription")}
            </p>

            <div className="flex items-center space-x-2 text-slate-400 text-xs pt-1">
              <MapPin className="h-4 w-4 text-emerald-400" />
              <span>{t("locationKerala")}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              {t("quickLinks")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link to="/crop-calender" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {t("cropCalendar")}
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {t("weatherAlerts")}
                </Link>
              </li>
              <li>
                <Link to="/market-trends" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  {t("marketUpdates")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              {t('contact')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center space-x-2 text-slate-400">
                <Mail className="h-4 w-4 text-emerald-400" />
                <span>support@keralafarm.ai</span>
              </li>
              <li className="flex items-center space-x-2 text-slate-400">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>+91 9876543210</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>© 2025 Krishi Sakhi. {t("allRightsReserved")}</p>

          <div className="flex space-x-6 mt-3 md:mt-0">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              {t('privacy')}
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              {t('terms')}
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
