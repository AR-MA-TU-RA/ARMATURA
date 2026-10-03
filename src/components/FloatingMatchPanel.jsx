import React, { useState } from 'react';
import { Sparkles, X, ChevronDown, ChevronUp, Bell, Check, User } from 'lucide-react';
import { MATCH_NOTIFICATIONS, COMPATIBLE_PEOPLE } from '../data/mockData';

export default function FloatingMatchPanel({ 
  isOpen, 
  setIsOpen, 
  onSelectPerson 
}) {
  const [showToast, setShowToast] = useState(true);
  const [toastDismissed, setToastDismissed] = useState(false);

  const mariaPerson = COMPATIBLE_PEOPLE.find(p => p.id === 'maria-colesnic') || COMPATIBLE_PEOPLE[1];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      
      {/* 1. Small Notification Toast Popup ("Nou match! Maria este compatibilă...") */}
      {showToast && !toastDismissed && (
        <div className="bg-white border-2 border-green-700 rounded-lg p-3.5 shadow-xl w-full pointer-events-auto transition duration-300 animate-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="relative shrink-0">
                <img
                  src={mariaPerson.avatar}
                  alt={mariaPerson.name}
                  className="w-10 h-10 rounded-full object-cover border border-green-200"
                />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                  ✓
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
                    Nou match!
                  </span>
                  <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.2 rounded font-bold">
                    87%
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                  Maria este compatibilă cu apartamentul tău
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Studentă ASEM • Buget până la 4 000 MDL
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 mt-2.5 pt-2 border-t border-slate-100">
            <button
              onClick={() => setToastDismissed(true)}
              className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
            >
              Mai târziu
            </button>
            <button
              onClick={() => {
                setShowToast(false);
                onSelectPerson(mariaPerson);
              }}
              className="px-3 py-1 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded shadow-xs cursor-pointer"
            >
              Vezi profilul
            </button>
          </div>
        </div>
      )}

      {/* 2. Floating Matching Panel (Inbox) */}
      <div className="w-full bg-white border border-slate-300 rounded-lg shadow-xl overflow-hidden pointer-events-auto transition">
        
        {/* Panel Header Bar */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="bg-slate-900 text-white px-3.5 py-2.5 flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <Sparkles className="w-4 h-4 text-green-500" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Potriveiri noi</span>
            <span className="px-1.5 py-0.2 bg-green-700 text-white rounded-full text-[10px] font-bold">
              {MATCH_NOTIFICATIONS.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        {/* Panel Body (Collapsible) */}
        {isOpen && (
          <div className="p-2 space-y-2 max-h-80 overflow-y-auto bg-slate-50">
            {MATCH_NOTIFICATIONS.map((match) => {
              const fullPerson = COMPATIBLE_PEOPLE.find(p => p.id === match.personId) || COMPATIBLE_PEOPLE[0];
              return (
                <div
                  key={match.id}
                  className="bg-white border border-slate-200 rounded-md p-2.5 hover:border-green-300 transition shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={match.avatar}
                        alt={match.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {match.name.split(' ')[0]}, {match.age}
                        </div>
                        <div className="text-[11px] text-slate-600 line-clamp-1">
                          {match.message}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded border border-green-200 shrink-0">
                      {match.compatibility}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100 text-[10px]">
                    <span className="text-slate-400">{match.time}</span>
                    <button
                      onClick={() => onSelectPerson(fullPerson)}
                      className="px-2.5 py-1 text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-700 hover:text-white rounded border border-green-200 transition cursor-pointer"
                    >
                      Vezi profil
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="text-center pt-1">
              <span className="text-[10px] text-slate-400">
                Notificările se actualizează automat
              </span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

