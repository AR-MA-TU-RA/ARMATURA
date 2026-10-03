import React from 'react';
import { 
  X, User, ShieldCheck, DollarSign, MapPin, Calendar, 
  Moon, Heart, Check, Building, Sparkles 
} from 'lucide-react';

export default function MyProfileModal({ 
  isOpen, 
  onClose, 
  savedProperties, 
  onSelectProperty,
  onOpenOnboarding
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
                alt="Mihai Ceban"
                className="w-20 h-20 rounded-full object-cover border-3 border-white shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-black">Mihai Ceban, 22 ani</h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Profil verificat 92%
                </span>
              </div>
              <p className="text-blue-100 text-xs mt-0.5 font-medium">
                Student la UTM (Calculatoare și Tehnologii Informaționale, anul 3) • Chișinău
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-3 text-xs text-blue-100">
                <span>📍 Chișinău, R. Moldova</span>
                <span>•</span>
                <span>📅 Mutare din 15 octombrie</span>
                <span>•</span>
                <span>💰 Buget: max. 4 500 MDL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          
          {/* Despre mine */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Despre mine
            </h4>
            <p className="text-sm text-slate-800 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              "Sunt student la UTM, calm, serios și pasionat de tehnologie. În timpul săptămânii merg la cursuri și lucrez part-time. Caut un apartament de 2 sau 3 camere în Botanica sau Centru, alături de colegi ordonați care respectă orele de somn și curățenia comună."
            </p>
          </div>

          {/* Buget și zone preferate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-green-700" />
                Buget maxim lunar / om
              </span>
              <div className="text-base font-extrabold text-green-700">4 500 MDL / lună</div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-green-700" />
                Sectoare preferate
              </span>
              <div className="text-sm font-bold text-slate-900">Botanica, Centru, Râșcani</div>
            </div>
          </div>

          {/* Obiceiuri & Stil de conviețuire */}
          <div>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Obiceiuri & Conviețuire
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">FUMAT</span>
                <span className="font-bold text-slate-800">Nefumător</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">ANIMALE</span>
                <span className="font-bold text-slate-800">Fără animale</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">SOMN</span>
                <span className="font-bold text-slate-800">23:00 – 07:30</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">MUSAFIRI</span>
                <span className="font-bold text-slate-800">Rar, doar în weekend</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">CURĂȚENIE</span>
                <span className="font-bold text-slate-800">Foarte ordonat</span>
              </div>
              <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">SHARING</span>
                <span className="font-bold text-slate-800">2 sau 3 persoane</span>
              </div>
            </div>
          </div>

          {/* Locuințe Salvate (Saved properties visible only on "Profilul meu") */}
          <div className="pt-3 border-t border-slate-200">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-current" />
                Locuințe salvate în favorite ({savedProperties?.length || 0})
              </span>
              <span className="text-[11px] text-slate-400 font-normal">Vizibile doar pentru tine</span>
            </h4>

            {savedProperties && savedProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedProperties.map(prop => (
                  <div
                    key={prop.id}
                    onClick={() => {
                      onClose();
                      onSelectProperty(prop);
                    }}
                    className="p-2.5 rounded-lg border border-slate-200 hover:border-green-400 bg-slate-50 flex items-center gap-3 cursor-pointer transition group"
                  >
                    <img
                      src={prop.images.main}
                      alt={prop.title}
                      className="w-14 h-14 rounded object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-900 text-xs truncate group-hover:text-green-700">
                        {prop.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {prop.district} • <strong className="text-green-700">{prop.rentPerPerson} MDL/om</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Nu ai nicio locuință salvată încă.</p>
            )}
          </div>

          {/* Action to re-run onboarding */}
          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenOnboarding();
              }}
              className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-md hover:bg-slate-50 cursor-pointer"
            >
              Editează preferințele (Wizard)
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-green-700 text-white text-xs font-bold rounded-md shadow-xs cursor-pointer"
            >
              Închide
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

