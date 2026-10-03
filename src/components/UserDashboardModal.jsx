import React from 'react';
import { 
  X, User, Sparkles, Heart, MessageSquare, Home, Settings, 
  ShieldCheck, Check, ArrowRight, Bell, Users
} from 'lucide-react';

export default function UserDashboardModal({ 
  isOpen, 
  onClose, 
  currentUser,
  onNavigate,
  onOpenCreateProfile,
  onOpenPublishApartment
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-300 shadow-xs"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-black text-slate-900">
                  Hi, {currentUser.name} 👋
                </h2>
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Active resident in Chișinău • Centru
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* PROFILE COMPLETENESS (Point 16) */}
        <div className="p-6 border-b border-slate-100 bg-blue-50/50">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-700">Profile completeness</span>
            <span className="text-blue-700 font-extrabold">80% completed</span>
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
            <div className="bg-blue-600 h-full w-[80%]" />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Add student ID proof to reach 100% verified badge</span>
            <button
              onClick={() => {
                onClose();
                onOpenCreateProfile();
              }}
              className="text-blue-600 hover:underline font-bold cursor-pointer"
            >
              Update profile →
            </button>
          </div>
        </div>

        {/* STATS TILES (Point 16: 12 matches, 5 saved, 3 conversations) */}
        <div className="p-6 grid grid-cols-3 gap-3 text-center border-b border-slate-100">
          <div 
            onClick={() => { onClose(); onNavigate('matches'); }}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-blue-50 hover:border-blue-200 transition cursor-pointer"
          >
            <div className="text-2xl font-black text-slate-900">12</div>
            <div className="text-[11px] font-bold text-slate-500">Matches</div>
          </div>

          <div 
            onClick={() => { onClose(); onNavigate('favorites'); }}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-rose-50 hover:border-rose-200 transition cursor-pointer"
          >
            <div className="text-2xl font-black text-slate-900">5</div>
            <div className="text-[11px] font-bold text-slate-500">Saved</div>
          </div>

          <div 
            onClick={() => { onClose(); onNavigate('messages'); }}
            className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-emerald-50 hover:border-emerald-200 transition cursor-pointer"
          >
            <div className="text-2xl font-black text-slate-900">3</div>
            <div className="text-[11px] font-bold text-slate-500">Chats</div>
          </div>
        </div>

        {/* DASHBOARD ACTIONS LIST */}
        <div className="p-6 space-y-2 text-xs">
          {[
            { label: "My Matches & Compatibility", icon: Sparkles, color: "text-emerald-600", action: () => { onClose(); onNavigate('matches'); } },
            { label: "Messages & Chats", icon: MessageSquare, color: "text-blue-600", action: () => { onClose(); onNavigate('messages'); } },
            { label: "Saved Roommates & Apartments", icon: Heart, color: "text-rose-600", action: () => { onClose(); onNavigate('favorites'); } },
            { label: "Publish or Edit My Flat", icon: Home, color: "text-blue-600", action: () => { onClose(); onOpenPublishApartment(); } },
            { label: "Redo Lifestyle Onboarding", icon: User, color: "text-purple-600", action: () => { onClose(); onOpenCreateProfile(); } }
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="w-full p-3 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50 transition flex items-center justify-between cursor-pointer font-bold text-slate-800"
            >
              <div className="flex items-center gap-2.5">
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.label}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
