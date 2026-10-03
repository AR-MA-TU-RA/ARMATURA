import React, { useState } from 'react';
import { 
  Users, Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck, Globe, Check, Sun, Moon
} from 'lucide-react';
import { TRANSLATIONS } from '../data/mockData';

export default function WelcomeAuthScreen({ 
  onRegisterSuccess, 
  onLoginSuccess, 
  onExploreAsGuest,
  language,
  setLanguage,
  theme,
  setTheme
}) {
  const [isLoginTab, setIsLoginTab] = useState(false);
  const [name, setName] = useState('Anna Moraru');
  const [email, setEmail] = useState('anna.moraru@utm.md');
  const [password, setPassword] = useState('••••••••');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginTab) {
      onLoginSuccess(name);
    } else {
      onRegisterSuccess({
        name: name || 'Anna Moraru',
        email: email || 'anna.moraru@utm.md'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between transition-colors">
      
      {/* Top Header bar with Language & Theme toggle */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/domi-logo.jpg"
            alt="domi"
            className="h-9 sm:h-10 object-contain dark:invert rounded-md transition-all"
          />
          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800">
            Chișinău
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition cursor-pointer"
            title={theme === 'dark' ? t.lightMode : t.darkMode}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Language selector */}
          <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 p-0.5">
            {['en', 'ro', 'ru'].map(l => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                  language === l
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
          
          {/* Logo & Headline */}
          <div className="text-center mb-6">
            <div className="inline-block p-1 mb-2">
              <img
                src="/domi-logo.jpg"
                alt="domi"
                className="h-14 sm:h-16 mx-auto object-contain dark:invert rounded-lg transition-all"
              />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.welcomeTitle}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.welcomeSub}
            </p>
          </div>

          {/* Quick Demo One-Click Login */}
          <div className="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-3.5 mb-5 text-center">
            <div className="text-[11px] font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{t.instantDemoTitle}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onLoginSuccess("Anna")}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer text-center"
              >
                {t.demoAsAnna}
              </button>
              <button
                type="button"
                onClick={() => onLoginSuccess("Mihai")}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl font-bold text-xs transition cursor-pointer text-center"
              >
                {t.demoAsMihai}
              </button>
            </div>
          </div>

          {/* Tabs: Create account vs Log in */}
          <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold mb-5">
            <button
              onClick={() => setIsLoginTab(false)}
              className={`py-2 rounded-xl transition cursor-pointer ${
                !isLoginTab
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.createAccountTab}
            </button>
            <button
              onClick={() => setIsLoginTab(true)}
              className={`py-2 rounded-xl transition cursor-pointer ${
                isLoginTab
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.loginTab}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            
            {/* Full Name (Only on Registration) */}
            {!isLoginTab && (
              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  {t.fullNameLabel}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600"
                    placeholder="e.g. Anna Moraru"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600"
                  placeholder="e.g. student@utm.md"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600"
                  required
                />
              </div>
            </div>

            {/* Google connection mock */}
            <button
              type="button"
              onClick={() => onLoginSuccess("Anna")}
              className="w-full py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-200 text-xs transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{t.continueWithGoogle}</span>
            </button>

            {/* Primary Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>{isLoginTab ? t.logIn : t.createProfile}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Explore as guest option */}
          <div className="text-center mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onExploreAsGuest}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              {t.exploreAsGuest}
            </button>
          </div>

        </div>
      </div>

      {/* Footer info */}
      <div className="py-4 text-center text-xs text-slate-400">
        domi Chișinău — Republic of Moldova • All prices in EUR (€)
      </div>

    </div>
  );
}
