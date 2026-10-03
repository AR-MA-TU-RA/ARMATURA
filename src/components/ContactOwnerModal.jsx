import React, { useState } from 'react';
import { X, Phone, MessageSquare, ShieldCheck, Calendar, Clock, CheckCircle2 } from 'lucide-react';

export default function ContactOwnerModal({ owner, onClose }) {
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("Bună ziua! Sunt interesat de sharing în apartamentul dumneavoastră. Am un profil verificat de colocatar și aș dori să stabilim o vizionare.");
  const [phone, setPhone] = useState("+373 69 123 789");

  if (!owner) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-green-500" />
            <span className="font-bold text-sm">Contactează proprietarul</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-700">
          
          {/* Owner details strip */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <img
              src={owner.avatar}
              alt={owner.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-300"
            />
            <div>
              <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                {owner.name}
                <span className="text-[10px] bg-green-100 text-green-800 px-1.5 py-0.2 rounded font-semibold flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5 text-green-700" />
                  Verificat
                </span>
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                {owner.responseTime} • {owner.memberSince}
              </div>
              <div className="text-green-700 font-bold text-xs mt-1 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {owner.phone}
              </div>
            </div>
          </div>

          {sent ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-slate-900 text-sm">Mesajul a fost transmis!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {owner.name} a primit notificarea prin SMS și în aplicație și vă va contacta în scurt timp.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer"
              >
                Închide
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Numărul tău de contact:
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-xs text-slate-800 outline-none focus:border-green-700 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Mesaj pentru proprietar:
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-xs text-slate-800 outline-none focus:border-green-700 font-sans"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-semibold rounded shadow-xs cursor-pointer"
                >
                  Trimite mesaj
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

