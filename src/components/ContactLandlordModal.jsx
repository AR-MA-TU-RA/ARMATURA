import React, { useState } from 'react';
import { 
  X, Phone, MessageSquare, ShieldCheck, Check, Clock, Globe, Send, MessageCircle
} from 'lucide-react';

export default function ContactLandlordModal({ 
  isOpen, 
  onClose, 
  apartment,
  language = 'en' 
}) {
  if (!isOpen || !apartment) return null;

  const landlord = apartment.landlord || {
    name: "Nicu Rusu",
    phone: "+373 69 123 456",
    whatsapp: "37369123456",
    verified: true,
    responseTime: "Usually replies in 15 mins",
    languages: "RO, EN, RU"
  };

  const [message, setMessage] = useState(
    `Hello ${landlord.name}! I am interested in viewing the apartment "${apartment.title}" located at ${apartment.address}. When would it be possible to schedule a visit?`
  );
  const [sent, setSent] = useState(false);

  const handleSendMessage = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                Contact Landlord
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Verified property owner
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 text-xs">
          
          {/* Landlord profile info */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
            <div>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
                <span>{landlord.name}</span>
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />
                <span>{landlord.responseTime}</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Globe className="w-3 h-3" />
                <span>Languages: {landlord.languages}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                Verified Landlord
              </span>
            </div>
          </div>

          {/* Direct Contact Buttons (Phone & WhatsApp) */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={`tel:${landlord.phone.replace(/\s+/g, '')}`}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {landlord.phone}</span>
            </a>

            <a
              href={`https://wa.me/${landlord.whatsapp}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* In-app Message Form */}
          {sent ? (
            <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
              <Check className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-1.5" />
              <div className="font-extrabold text-slate-900 dark:text-white text-sm">Message Sent!</div>
              <div className="text-slate-600 dark:text-slate-400 text-xs mt-0.5">
                {landlord.name} received your request and will reply shortly.
              </div>
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Send a Direct Message
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 resize-none font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message to Landlord</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
