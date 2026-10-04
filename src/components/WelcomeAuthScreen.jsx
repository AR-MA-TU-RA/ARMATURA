import React, { useState, useEffect } from 'react';
import { 
  Users, Mail, Lock, User, Sparkles, ArrowRight, ShieldCheck, Globe, Check, Sun, Moon,
  Loader2, AlertCircle, Database, RefreshCw, Camera, Upload
} from 'lucide-react';
import { TRANSLATIONS } from '../data/mockData';
import { compressImage } from '../utils/imageUtils';

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
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80');
  const [avatarError, setAvatarError] = useState(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking' | 'connected' | 'offline'

  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError(null);
    setIsUploadingAvatar(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 600, maxHeight: 600, quality: 0.85 });
      setAvatar(compressed);
    } catch (err) {
      setAvatarError(err.message || 'Eroare la procesarea fotografiei');
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // ─── Live Server Health Ping ─────────────────────────────────────────────
  const pingServer = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch('/api/health', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        setServerStatus('connected');
        return true;
      } else {
        setServerStatus('offline');
        return false;
      }
    } catch {
      setServerStatus('offline');
      return false;
    }
  };

  useEffect(() => {
    pingServer();
    const interval = setInterval(pingServer, 10000);
    return () => clearInterval(interval);
  }, []);

  // ─── Quick 1-Click Demo Login ────────────────────────────────────────────
  const handleQuickLogin = async (personName) => {
    setIsLoading(true);
    setErrorMessage(null);
    const isMihai = personName === 'Mihai';
    const demoEmail = isMihai ? 'mihai.ceban@utm.md' : 'anna.moraru@utm.md';
    
    console.log(`[domi Auth] 🚀 1-Click demo login as ${personName} (${demoEmail}). Checking backend...`);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: demoEmail,
          password: 'password123'
        }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        console.log('[domi Auth] ✅ Backend login successful:', data.user.name, 'Token:', data.token?.slice(0, 15) + '...');
        setServerStatus('connected');
        setIsLoading(false);
        onLoginSuccess(data.user, data.token);
        return;
      }
    } catch (err) {
      console.warn('[domi Auth] ⚠️ Backend offline, proceeding with instant mock login:', err.message);
      setServerStatus('offline');
    }
    setIsLoading(false);
    onLoginSuccess(personName);
  };

  // ─── Form Submission (Login / Register) ──────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const effectivePassword = password === '••••••••' ? 'password123' : password;
    const API_BASE = '/api/auth';

    if (isLoginTab) {
      const payload = { email: email.trim(), password: effectivePassword };
      console.log(`[domi Auth] 📤 Dispatching POST to ${API_BASE}/login with:`, { email: payload.email });

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const response = await fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          console.log('[domi Auth] ✅ Authenticated successfully:', data.user.name, 'Token:', data.token?.slice(0, 15) + '...');
          setServerStatus('connected');
          setIsLoading(false);
          onLoginSuccess(data.user, data.token);
          return;
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn('[domi Auth] ❌ Login rejected by server (HTTP ' + response.status + '):', errData);
          setIsLoading(false);
          setErrorMessage(errData.error || (language === 'ro' ? 'Email sau parolă incorectă' : language === 'ru' ? 'Неверный email или пароль' : 'Invalid email or password'));
          return;
        }
      } catch (err) {
        console.warn('[domi Auth] ⚠️ Backend server unreachable:', err.message);
        setServerStatus('offline');
        setIsLoading(false);
        setErrorMessage(
          language === 'ro'
            ? 'Serverul backend este offline. Poți porni serverul cu `npm run dev` sau continuă în mod Demo.'
            : language === 'ru'
            ? 'Бэкенд сервер отключен. Запустите `npm run dev` или войдите в демо-режиме.'
            : 'Backend server is offline. Start it with `npm run dev` or continue in Demo mode.'
        );
      }
    } else {
      const payload = {
        name: name.trim() || 'Anna Moraru',
        email: email.trim() || 'anna.moraru@utm.md',
        password: effectivePassword,
        avatar: avatar
      };
      console.log(`[domi Auth] 📤 Dispatching POST to ${API_BASE}/register with:`, { name: payload.name, email: payload.email });

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const response = await fetch(`${API_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          console.log('[domi Auth] ✅ Registered successfully:', data.user.name, 'Token:', data.token?.slice(0, 15) + '...');
          setServerStatus('connected');
          setIsLoading(false);
          onRegisterSuccess(data.user, data.token);
          return;
        } else {
          const errData = await response.json().catch(() => ({}));
          console.warn('[domi Auth] ❌ Registration rejected by server (HTTP ' + response.status + '):', errData);
          setIsLoading(false);
          setErrorMessage(errData.error || (language === 'ro' ? 'Eroare la înregistrare' : language === 'ru' ? 'Ошибка регистрации' : 'Registration error'));
          return;
        }
      } catch (err) {
        console.warn('[domi Auth] ⚠️ Backend server unreachable:', err.message);
        setServerStatus('offline');
        setIsLoading(false);
        setErrorMessage(
          language === 'ro'
            ? 'Serverul backend este offline. Poți porni serverul cu `npm run dev` sau continuă în mod Demo.'
            : language === 'ru'
            ? 'Бэкенд сервер отключен. Запустите `npm run dev` или войдите в демо-режиме.'
            : 'Backend server is offline. Start it with `npm run dev` or continue in Demo mode.'
        );
      }
    }
  };

  const handleBypassAsDemo = () => {
    if (isLoginTab) {
      onLoginSuccess(name || 'Anna');
    } else {
      onRegisterSuccess({
        name: name || 'Anna Moraru',
        email: email || 'anna.moraru@utm.md',
        avatar: avatar
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

          {/* Header Server Status Pill */}
          <button
            type="button"
            onClick={pingServer}
            title={serverStatus === 'connected' ? 'SQLite Database Connected' : 'Click to retry connection'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition cursor-pointer select-none ${
              serverStatus === 'connected'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                : serverStatus === 'offline'
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 hover:bg-amber-100'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${
              serverStatus === 'connected'
                ? 'bg-emerald-500 animate-pulse'
                : serverStatus === 'offline'
                ? 'bg-amber-500'
                : 'bg-slate-400'
            }`} />
            <span>
              {serverStatus === 'connected'
                ? (language === 'ro' ? 'Server Conectat' : language === 'ru' ? 'Сервер подключен' : 'Server Connected')
                : serverStatus === 'offline'
                ? (language === 'ro' ? 'Mod Offline (Mock)' : language === 'ru' ? 'Офлайн режим (Mock)' : 'Offline Mode (Mock)')
                : (language === 'ro' ? 'Verificare...' : language === 'ru' ? 'Проверка...' : 'Checking...')}
            </span>
          </button>
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
      <div className="flex-1 flex items-center justify-center p-3 sm:p-4 my-auto">
        <div className="w-full max-w-md max-h-[90vh] sm:max-h-none overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl p-5 sm:p-8 animate-in zoom-in-95 duration-200 overscroll-contain">
          
          {/* Logo & Headline */}
          <div className="text-center mb-5">
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

            {/* Mobile/Card Server Connection Indicator */}
            <div className="mt-3 flex items-center justify-center">
              <div 
                onClick={pingServer}
                title="Click to re-ping server"
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold border transition cursor-pointer select-none ${
                  serverStatus === 'connected'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : serverStatus === 'offline'
                    ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${
                  serverStatus === 'connected'
                    ? 'bg-emerald-500 animate-pulse'
                    : serverStatus === 'offline'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`} />
                <span>
                  {serverStatus === 'connected'
                    ? (language === 'ro' ? 'SQLite Backend Conectat' : language === 'ru' ? 'SQLite Сервер подключен' : 'SQLite Backend Connected')
                    : serverStatus === 'offline'
                    ? (language === 'ro' ? 'Mod Offline / Mock' : language === 'ru' ? 'Офлайн режим / Mock' : 'Offline / Mock Mode')
                    : (language === 'ro' ? 'Verificare conexiune server...' : 'Checking server...')}
                </span>
                <RefreshCw className="w-2.5 h-2.5 opacity-60 ml-0.5" />
              </div>
            </div>
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
                disabled={isLoading}
                onClick={() => handleQuickLogin("Anna")}
                className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer text-center disabled:opacity-50"
              >
                {t.demoAsAnna}
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin("Mihai")}
                className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl font-bold text-xs transition cursor-pointer text-center disabled:opacity-50"
              >
                {t.demoAsMihai}
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <p className="flex-1 font-semibold leading-relaxed">{errorMessage}</p>
                <button 
                  type="button" 
                  onClick={() => setErrorMessage(null)} 
                  className="text-red-400 hover:text-red-600 font-bold text-xs p-1"
                >
                  ✕
                </button>
              </div>
              {serverStatus === 'offline' && (
                <div className="pt-2 border-t border-red-200/60 dark:border-red-900/60 flex items-center justify-between">
                  <span className="text-[11px] text-red-600 dark:text-red-400">
                    {language === 'ro' ? 'Vrei să continui fără server?' : 'Continue without server?'}
                  </span>
                  <button
                    type="button"
                    onClick={handleBypassAsDemo}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[11px] transition cursor-pointer"
                  >
                    {language === 'ro' ? 'Intră ca Demo' : 'Enter as Demo'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tabs: Create account vs Log in */}
          <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold mb-5">
            <button
              onClick={() => { setIsLoginTab(false); setErrorMessage(null); }}
              className={`py-2 rounded-xl transition cursor-pointer ${
                !isLoginTab
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.createAccountTab}
            </button>
            <button
              onClick={() => { setIsLoginTab(true); setErrorMessage(null); }}
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
            
            {/* Avatar Upload (Only on Registration) */}
            {!isLoginTab && (
              <div className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700">
                <input
                  type="file"
                  id="auth-avatar-file"
                  accept="image/*"
                  onChange={handleAvatarFileChange}
                  className="hidden"
                />
                <div 
                  className="relative group cursor-pointer" 
                  onClick={() => document.getElementById('auth-avatar-file')?.click()}
                  title="Schimbă poza de profil"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 shadow-md bg-slate-200">
                    <img
                      src={avatar}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow border-2 border-white dark:border-slate-900">
                    <Camera className="w-3 h-3" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => document.getElementById('auth-avatar-file')?.click()}
                  disabled={isUploadingAvatar}
                  className="mt-2 min-h-[40px] px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingAvatar ? 'Se comprimă...' : (language === 'ro' ? 'Încarcă fotografie de profil' : language === 'ru' ? 'Загрузить фото профиля' : 'Upload profile photo')}</span>
                </button>

                {avatarError && (
                  <p className="text-[11px] text-rose-500 font-semibold mt-1">
                    {avatarError}
                  </p>
                )}
              </div>
            )}

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
                    className="w-full min-h-[44px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600"
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
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full min-h-[44px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600"
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
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full min-h-[44px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600"
                  required
                />
              </div>
            </div>

            {/* Google connection mock */}
            <button
              type="button"
              onClick={() => handleQuickLogin("Anna")}
              className="w-full min-h-[44px] py-2.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-200 text-xs transition flex items-center justify-center gap-2 cursor-pointer"
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
              disabled={isLoading}
              className={`w-full min-h-[48px] py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 ${
                isLoading ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>
                    {language === 'ro' ? 'Se procesează...' : language === 'ru' ? 'Обработка...' : 'Processing...'}
                  </span>
                </>
              ) : (
                <>
                  <span>{isLoginTab ? t.logIn : t.createProfile}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Explore as guest option */}
          <div className="text-center mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onExploreAsGuest}
              className="min-h-[44px] inline-flex items-center justify-center px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
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
