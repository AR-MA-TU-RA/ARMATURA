import React, { useState } from 'react';
import { 
  Sparkles, MessageSquare, UserPlus, Heart, Check, 
  MapPin, Calendar, ShieldCheck, ArrowRight, Filter
} from 'lucide-react';
import { ROOMMATES, TRANSLATIONS } from '../data/mockData';

export default function MatchesPage({ 
  onSelectPerson, 
  onStartChat, 
  onTeamUp,
  favorites = [],
  onToggleFavorite,
  language = 'en'
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const matches = ROOMMATES.filter(p => {
    if (selectedDistrict !== 'All' && p.district !== selectedDistrict) return false;
    return p.compatibility >= 80;
  }).sort((a, b) => b.compatibility - a.compatibility);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 mb-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.benefitsLifestyle}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.matches}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Calculated by parameter overlap: Budget (30%), Lifestyle (25%), Location (20%), Move-in (15%), and Living specs (10%).
          </p>
        </div>

        {/* District Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 text-xs">
          {['All', 'Centru', 'Botanica', 'Buiucani', 'Rîșcani'].map(d => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                selectedDistrict === d
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {d === 'All' ? t.allDistricts.split(' ')[0] : d}
            </button>
          ))}
        </div>
      </div>

      {/* MATCH CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map(person => {
          const isFavorite = favorites.includes(person.id);

          return (
            <div
              key={person.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Header: Photo, Name, Compatibility */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 
                          onClick={() => onSelectPerson(person)}
                          className="font-extrabold text-slate-900 dark:text-white text-lg hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                        >
                          {person.name}, {person.age}
                        </h3>
                        <ShieldCheck className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {person.occupation}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        <span>{person.district}</span>
                        <span>•</span>
                        <span className="font-semibold text-blue-700 dark:text-blue-400">{person.budgetFormatted}</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-1.5 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{person.compatibility}% {t.matchLabel}</span>
                  </div>
                </div>

                {/* "Why you matched" box */}
                <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800 rounded-2xl p-3.5 mb-4">
                  <span className="text-[11px] font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider block mb-1.5">
                    {t.whyMatched}
                  </span>
                  <div className="space-y-1 text-xs text-emerald-950 dark:text-emerald-200 font-medium">
                    {person.similarHabits.map((habit, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                        <span>{habit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bio quote */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 italic bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700">
                  "{person.bio}"
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {person.badges.map((b, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onToggleFavorite(person.id)}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    isFavorite
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600'
                      : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  title="Save to favorites"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectPerson(person)}
                    className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
                  >
                    {t.viewProfile}
                  </button>

                  <button
                    onClick={() => onTeamUp(person)}
                    className="px-3 py-2 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 rounded-xl border border-blue-200 dark:border-blue-800 transition cursor-pointer flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{t.teamUp}</span>
                  </button>

                  <button
                    onClick={() => onStartChat(person)}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{t.message}</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
