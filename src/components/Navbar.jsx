import React, { useState } from 'react';
import { 
  Users, Home, Shield, Bell, Heart, MessageSquare, 
  PlusCircle, User, LogIn, ChevronDown, Check, Globe, 
  Sparkles, Settings, LogOut, ShieldCheck, LayoutDashboard, Sun, Moon,
  Menu, X
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleNav = (page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
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

            {/* Favorites (Saved) Button (Desktop) */}
            <button
              onClick={() => handleNav('favorites')}
              className={`hidden md:flex p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition relative cursor-pointer ${
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

            {/* Notifications Bell (Desktop) */}
            <button
              onClick={onOpenNotifications}
              className="hidden md:flex p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition relative cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 text-[9px] font-bold bg-blue-600 text-white rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* ADMIN QUICK TOGGLE (Desktop) */}
            <button
              onClick={onOpenAdmin}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
              title="Admin Panel"
            >
              <LayoutDashboard className="w-3 h-3 text-slate-500" />
              <span>{t.admin}</span>
            </button>

            {/* USER LOGGED IN VS LOGGED OUT STATE (Desktop) */}
            {isLoggedIn ? (
              <div className="hidden md:block relative">
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
              <div className="hidden md:flex items-center gap-2">
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

            {/* MOBILE USER AVATAR / LOGIN (MOBILE ONLY) */}
            {isLoggedIn ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDashboard();
                }}
                className="md:hidden flex items-center justify-center p-1 rounded-full min-h-[44px] min-w-[44px] cursor-pointer focus:outline-none"
                title={currentUser?.name || 'Profilul Meu'}
                aria-label="Deschide Profilul Meu"
              >
                <div className="relative">
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'}
                    alt={currentUser?.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover border-2 border-blue-500 shadow-xs"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                </div>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="md:hidden flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 rounded-xl min-h-[44px] cursor-pointer"
                title="Login"
                aria-label="Conectează-te"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{language === 'ro' ? 'Intră' : language === 'ru' ? 'Вход' : 'Login'}</span>
              </button>
            )}

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex items-center justify-center p-2.5 min-h-[44px] min-w-[44px] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer relative"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-800 dark:text-white" />
              ) : (
                <Menu className="w-5 h-5 text-slate-800 dark:text-white" />
              )}
              {/* Unread badge dot on hamburger */}
              {(unreadNotificationsCount > 0 || unreadMessagesCount > 0) && !mobileMenuOpen && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE SLIDE-DOWN DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/90 dark:border-slate-800 bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200 shadow-2xl max-h-[82vh] overflow-y-auto">
          <div className="max-w-md mx-auto px-4 py-4 space-y-3">
            
            {/* USER ACCOUNT CARD AT THE VERY TOP */}
            {isLoggedIn ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="relative shrink-0">
                    <img
                      src={currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'}
                      alt={currentUser?.name || 'User'}
                      className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 shadow-xs"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5 truncate">
                      <span>{currentUser?.name || 'Anna Moraru'}</span>
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {currentUser?.email || 'anna.moraru@utm.md'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDashboard();
                    }}
                    className="w-full min-h-[44px] px-3 py-2 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-xl border border-blue-200 dark:border-blue-800 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>{language === 'ro' ? 'Profilul Meu' : language === 'ru' ? 'Мой Профиль' : 'My Profile'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setIsLoggedIn(false);
                    }}
                    className="w-full min-h-[44px] px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-950 rounded-xl border border-rose-200 dark:border-rose-900 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.logout || 'Deconectare'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs text-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2.5">
                  <User className="w-5 h-5" />
                </div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-sm mb-1">
                  {language === 'ro' ? 'Bun venit pe domi!' : language === 'ru' ? 'Добро пожаловать в domi!' : 'Welcome to domi!'}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3.5 max-w-xs mx-auto">
                  {language === 'ro' ? 'Conectează-te pentru a găsi colegi compatibili și apartamente verificate.' : language === 'ru' ? 'Войдите, чтобы найти соседей и проверить квартиры.' : 'Sign in to find compatible flatmates and verified flats.'}
                </p>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full min-h-[46px] py-2.5 px-4 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{language === 'ro' ? 'Conectează-te / Înregistrează-te' : language === 'ru' ? 'Войти / Зарегистрироваться' : 'Sign In / Register'}</span>
                </button>
              </div>
            )}

            {/* CLEAR LANGUAGE SELECTOR ROW */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>{language === 'ro' ? 'Limbă' : language === 'ru' ? 'Язык' : 'Language'}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'ro', label: 'Română' },
                  { code: 'en', label: 'English' },
                  { code: 'ru', label: 'Русский' }
                ].map((langItem) => (
                  <button
                    key={langItem.code}
                    onClick={() => setLanguage(langItem.code)}
                    className={`min-h-[44px] py-2 px-1 text-center text-xs font-bold rounded-xl border transition cursor-pointer flex items-center justify-center gap-1 ${
                      language === langItem.code
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {language === langItem.code && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{langItem.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* DARK MODE / LIGHT MODE TOGGLE SWITCH CLEARLY LABELED */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-2xs">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {language === 'ro' ? 'Aspect Vizual' : language === 'ru' ? 'Тема оформления' : 'Theme Mode'}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {theme === 'dark'
                      ? (language === 'ro' ? 'Mod Întunecat' : language === 'ru' ? 'Тёмная тема' : 'Dark Mode')
                      : (language === 'ro' ? 'Mod Luminos' : language === 'ru' ? 'Светлая тема' : 'Light Mode')}
                  </div>
                </div>
              </div>

              <button
                onClick={toggleTheme}
                className={`min-h-[44px] px-3.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-amber-400 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
                }`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'ro' ? 'Luminos' : language === 'ru' ? 'Светлая' : 'Light'}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-600" />
                    <span>{language === 'ro' ? 'Întunecat' : language === 'ru' ? 'Тёмная' : 'Dark'}</span>
                  </>
                )}
              </button>
            </div>

            {/* NAVIGATION LINKS */}
            <div className="space-y-1 pt-1">
              <button
                onClick={() => handleNav('apartments')}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activePage === 'apartments'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-4 h-4 text-blue-500" />
                  <span>{t.apartments}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('roommates')}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activePage === 'roommates'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{t.findRoommate}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('matches')}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activePage === 'matches'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <span>{t.matches}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('favorites')}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activePage === 'favorites'
                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>{t.saved}</span>
                </div>
                {favoritesCount > 0 ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-500 text-white rounded-full">
                    {favoritesCount}
                  </span>
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
                )}
              </button>

              <button
                onClick={() => { onOpenNotifications(); setMobileMenuOpen(false); }}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-blue-500" />
                  <span>{language === 'ro' ? 'Notificări' : language === 'ru' ? 'Уведомления' : 'Notifications'}</span>
                </div>
                {unreadNotificationsCount > 0 ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                    {unreadNotificationsCount}
                  </span>
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
                )}
              </button>

              <button
                onClick={() => handleNav('messages')}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activePage === 'messages'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <span>{t.messages}</span>
                </div>
                {unreadMessagesCount > 0 ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                    {unreadMessagesCount}
                  </span>
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
                )}
              </button>

              <button
                onClick={() => { onOpenPublishApartment(); setMobileMenuOpen(false); }}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <PlusCircle className="w-4 h-4 text-blue-500" />
                  <span>{t.publishFlat}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard className="w-4 h-4 text-slate-500" />
                  <span>{t.admin} Moderation</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </button>

              <button
                onClick={() => handleNav('safety')}
                className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-bold flex items-center justify-between transition cursor-pointer ${
                  activePage === 'safety'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span>{t.safety}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
              </button>
            </div>

            {/* LOGOUT BUTTON IF LOGGED IN */}
            {isLoggedIn && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => { setIsLoggedIn(false); setMobileMenuOpen(false); }}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl text-left text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2.5 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.logout}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-1 py-1 flex items-center justify-around shadow-lg">
        <button
          onClick={() => handleNav('home')}
          className={`min-h-[48px] py-1 px-2 flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition ${
            activePage === 'home' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleNav('roommates')}
          className={`min-h-[48px] py-1 px-2 flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition ${
            activePage === 'roommates' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Roommates</span>
        </button>

        <button
          onClick={() => handleNav('apartments')}
          className={`min-h-[48px] py-1 px-2 flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition ${
            activePage === 'apartments' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Flats</span>
        </button>

        <button
          onClick={() => handleNav('matches')}
          className={`min-h-[48px] py-1 px-2 flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition relative ${
            activePage === 'matches' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          <Sparkles className="w-5 h-5 text-emerald-500" />
          <span>Matches</span>
        </button>

        <button
          onClick={() => handleNav('messages')}
          className={`min-h-[48px] py-1 px-2 flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition relative ${
            activePage === 'messages' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Chat</span>
          {unreadMessagesCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1 right-4" />
          )}
        </button>
      </nav>
    </header>
  );
}
