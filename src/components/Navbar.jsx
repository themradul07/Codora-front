import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sprout, Menu, X, Globe, LogOut, LogIn, ChevronRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";
import { logout } from "../lib/actions/authActions";

const Navbar = ({ isAuthenticated }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/", label: t("Home"), show: !isAuthenticated },
    { path: "/dashboard", label: t("dashboard"), show: true },
    { path: "/Activity", label: t("My Activity"), show: true },
    { path: "/tools", label: t("Tools"), show: true },
    {
      path: "/farmer-profile",
      label: t("Profile"),
      show: isAuthenticated,
    },
  ];

  const LanguageButton = () => (
    <button
      onClick={() => setLanguage(language === "en" ? "ml" : "en")}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                 text-slate-700 bg-slate-100 hover:bg-slate-200 hover:text-emerald-700 
                 border border-slate-200 transition-colors duration-150 cursor-pointer"
    >
      <Globe className="h-3.5 w-3.5 text-emerald-600" />
      <span>{language === "en" ? "മലയാളം" : "English"}</span>
    </button>
  );

  const NavLink = ({ item }) => {
    const active = isActive(item.path);
    return (
      <Link
        to={item.path}
        className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors duration-150 ${
          active
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
        }`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="bg-emerald-600 p-2 rounded-lg text-white shadow-xs group-hover:bg-emerald-700 transition-colors">
              <Sprout className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                {t("Krishi Sakhi")}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 tracking-wider uppercase mt-0.5">
                Kerala Agri Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <NavLink key={item.path} item={item} />
              ))}

            <div className="h-4 w-px bg-slate-200 mx-2"></div>

            <LanguageButton />

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold 
                           text-rose-600 hover:bg-rose-50 border border-rose-200/80 transition-colors cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>{t("Logout")}</span>
              </button>
            ) : (
              <Link
                to="/twilio-invite"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold text-white
                           bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>{t("login")}</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1.5">
            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-lg text-sm font-semibold ${
                    isActive(item.path)
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>
              ))}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2">
              <LanguageButton />

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200"
                >
                  {t("Logout")}
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-600"
                >
                  {t("login")}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
