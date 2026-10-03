import React, { useState } from 'react';
import { X, Lock, Mail, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onLoginSuccess,
  onOpenCreateProfile
}) {
  if (!isOpen) return null;

  const [tab, setTab] = useState('login'); // 'login' | 'signup'
  const [email, setEmail] = useState('anna.moraru@utm.md');
  const [password, setPassword] = useState('••••••••');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'signup') {
      onClose();
      onOpenCreateProfile();
    } else {
      onLoginSuccess();
      onClose();
    }
  };

  const handleDemoLogin = (name = "Anna") => {
    onLoginSuccess(name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black">
              R
            </div>
            <span className="font-extrabold text-slate-900 text-lg">roomie</span>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TABS */}
        <div className="grid grid-cols-2 border-b border-slate-100 text-xs font-bold text-center">
          <button
            onClick={() => setTab('login')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              tab === 'login' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`py-3 border-b-2 transition cursor-pointer ${
              tab === 'signup' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Quick Demo One-Click Login */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-3.5 text-center">
            <div className="text-[11px] font-bold text-blue-900 mb-1">
              ⚡ Instant Hackathon Demo Login
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleDemoLogin("Anna")}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
              >
                Log in as Anna (Student)
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin("Mihai")}
                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs cursor-pointer"
              >
                Log in as Mihai
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-slate-400 text-[11px]">or use email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold outline-none focus:border-blue-600 focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-9 pr-3 text-xs font-semibold outline-none focus:border-blue-600 focus:bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer mt-2"
          >
            {tab === 'login' ? "Log In" : "Sign Up & Start Lifestyle Quiz"}
          </button>

          <p className="text-[11px] text-slate-400 text-center pt-2">
            By proceeding you agree to Roomie's Terms of Service & Safety Guidelines.
          </p>

        </form>

      </div>
    </div>
  );
}
