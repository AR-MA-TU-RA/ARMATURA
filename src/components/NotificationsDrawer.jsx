import React from 'react';
import { X, Bell, Sparkles, Heart, Building, Check, ArrowRight, UserPlus, MessageSquare } from 'lucide-react';
import { NOTIFICATIONS_LIST, ROOMMATES } from '../data/mockData';

export default function NotificationsDrawer({ 
  isOpen, 
  onClose, 
  onSelectPerson, 
  onSelectApartment 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-2xs animate-in fade-in">
      <div 
        className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
              Notifications & Alerts
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {NOTIFICATIONS_LIST.map((notif) => {
            const person = ROOMMATES.find(p => p.id === notif.personId);

            return (
              <div
                key={notif.id}
                onClick={() => {
                  if (person) {
                    onClose();
                    onSelectPerson(person);
                  }
                }}
                className="p-3.5 rounded-2xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/40 transition cursor-pointer bg-white shadow-2xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    notif.type === 'match' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : notif.type === 'message'
                      ? 'bg-blue-100 text-blue-800'
                      : notif.type === 'teamup'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    {notif.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">{notif.time}</span>
                </div>

                <div className="flex items-start gap-2.5">
                  {notif.avatar && (
                    <img
                      src={notif.avatar}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                    />
                  )}
                  <p className="text-slate-800 font-medium text-xs leading-snug">
                    {notif.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
          <span className="text-[11px] text-slate-400">All notifications updated in real-time</span>
        </div>
      </div>
    </div>
  );
}
