import React, { useState } from 'react';
import { 
  Users, Home, Shield, Bell, Heart, MessageSquare, 
  PlusCircle, User, LogIn, ChevronDown, Check, Globe, 
  Sparkles, Settings, LogOut, ShieldCheck, LayoutDashboard, Sun, Moon
} from 'lucide-react';
import { TRANSLATIONS } from '../data/mockData';

export default function Navbar({ 
  activePage, 
  setActivePage, 
  isLoggedIn, 
  setIsLoggedIn, 
  currentUser,
  language,
  setLanguage,
  theme,
  setTheme,
  unreadMessagesCount,
  unreadNotificationsCount,
  favoritesCount,
  onOpenNotifications,
  onOpenAuth,
  onOpenCreateProfile,
  onOpenPublishApartment,
  onOpenDashboard,
  onOpenAdmin
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleNav = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LEFT: DOMI LOGO */}
          <div className="flex items-center gap-6 lg:gap-8">
            <button 
              onClick={() => handleNav('home')} 
              className="flex items-center gap-2 focus:outline-none cursor-pointer group"
              title="domi Chișinău"
            >
              <img
                src="/domi-logo.jpg"
                alt="domi"
                className="h-8 sm:h-9 object-contain dark:invert rounded transition-all"
              />
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded border border-blue-200/60 dark:border-blue-800">
                Chișinău
              </span>
            </button>

            {/* MAIN DESKTOP NAVIGATION */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => handleNav('roommates')}
                className={`px-3 py-2 text-xs lg:text-sm font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  activePage === 'roommates'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4 text-blue-500" />
                <span>{t.findRoommate}</span>
              </button>

              <button
                onClick={() => handleNav('apartments')}
                className={`px-3 py-2 text-xs lg:text-sm font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  activePage === 'apartments'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800'
                }`}
              >
                <Home className="w-4 h-4 text-blue-500" />
                <span>{t.apartments}</span>
              </button>

              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => handleNav('matches')}
                    className={`px-3 py-2 text-xs lg:text-sm font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                      activePage === 'matches'
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>{t.matches}</span>
                  </button>

                  <button
                    onClick={() => handleNav('messages')}
                    className={`px-3 py-2 text-xs lg:text-sm font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5 relative ${
                      activePage === 'messages'
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-blue-500" />
                    <span>{t.messages}</span>
                    {unreadMessagesCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNav('home')}
                  className="px-3 py-2 text-xs lg:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  {t.howItWorks}
                </button>
              )}

              <button
                onClick={() => handleNav('safety')}
                className={`px-3 py-2 text-xs lg:text-sm font-semibold rounded-xl transition cursor-pointer flex items-center gap-1.5 ${
                  activePage === 'safety'
                    ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800'
                }`}
              >
                <Shield className="w-4 h-4 text-blue-500" />
                <span>{t.safety}</span>
              </button>
            </nav>
          </div>

          {/* RIGHT ACTION BAR */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* THEME TOGGLE (DARK / LIGHT) */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title={theme === 'dark' ? t.lightMode : t.darkMode}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Language Switcher [EN | RO | RU] */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                title="Switch Language"
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span>{language.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1 z-50 animate-in fade-in"
                  onClick={() => setLangDropdownOpen(false)}
                >
                  {[
                    { code: 'en', label: 'English (EN)' },
                    { code: 'ro', label: 'Română (RO)' },
                    { code: 'ru', label: 'Русский (RU)' }
                  ].map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLanguage(l.code)}
                      className={`w-full px-3 py-1.5 text-left text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer ${
                        language === l.code ? 'text-blue-600 dark:text-blue-400 font-bold bg-blue-50/50 dark:bg-blue-950/40' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{l.label}</span>
                      {language === l.code && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Favorites (Saved) Button */}
            <button
              onClick={() => handleNav('favorites')}
              className={`p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative cursor-pointer ${
                activePage === 'favorites' ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' : ''
              }`}
              title={t.saved}
            >
              <Heart className="w-4 h-4" />
              {favoritesCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 text-[9px] font-bold bg-rose-500 text-white rounded-full flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 text-[9px] font-bold bg-blue-600 text-white rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* ADMIN QUICK TOGGLE */}
            <button
              onClick={onOpenAdmin}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
              title="Admin Panel"
            >
              <LayoutDashboard className="w-3 h-3 text-slate-500" />
              <span>{t.admin}</span>
            </button>

            {/* USER LOGGED IN VS LOGGED OUT STATE */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer focus:outline-none"
                >
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  </div>
                  <div className="hidden sm:block text-left text-xs leading-tight">
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                      {currentUser.name}
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                    </div>
                    <div className="text-[10px] text-slate-400">80% complete</div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{currentUser.name}</div>
                      <div className="text-xs text-slate-500">{currentUser.email || 'anna.moraru@utm.md'}</div>
                      <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[80%]" />
                      </div>
                      <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">80% profile strength</div>
                    </div>

                    <button
                      onClick={onOpenDashboard}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-blue-600" />
                      {t.dashboard}
                    </button>

                    <button
                      onClick={() => handleNav('matches')}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      {t.matches}
                    </button>

                    <button
                      onClick={onOpenPublishApartment}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                    >
                      <PlusCircle className="w-4 h-4 text-blue-600" />
                      {t.publishFlat}
                    </button>

                    <button
                      onClick={onOpenAdmin}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2.5 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-500" />
                      Admin Moderation
                    </button>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={() => setIsLoggedIn(false)}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                >
                  {t.logIn}
                </button>
                <button
                  onClick={onOpenCreateProfile}
                  className="px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm hover:shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{t.createProfile}</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            activePage === 'home' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleNav('roommates')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            activePage === 'roommates' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Roommates</span>
        </button>

        <button
          onClick={() => handleNav('apartments')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold ${
            activePage === 'apartments' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Flats</span>
        </button>

        <button
          onClick={() => handleNav('matches')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold relative ${
            activePage === 'matches' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Matches</span>
        </button>

        <button
          onClick={() => handleNav('messages')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold relative ${
            activePage === 'messages' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Chat</span>
          {unreadMessagesCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-0 right-3" />
          )}
        </button>

        <button
          onClick={onOpenDashboard}
          className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-slate-500"
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </button>
      </div>
    </header>
  );
}
