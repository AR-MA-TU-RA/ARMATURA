import React, { useState } from 'react';
import { X, Sparkles, Users, Filter, Check, ArrowRight } from 'lucide-react';
import { COMPATIBLE_PEOPLE } from '../data/mockData';

export default function MatchesModal({ onClose, onSelectPerson }) {
  const [selectedDistrict, setSelectedDistrict] = useState('Toate');

  const filtered = selectedDistrict === 'Toate'
    ? COMPATIBLE_PEOPLE
    : COMPATIBLE_PEOPLE.filter(p => p.locationPref.includes(selectedDistrict));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Match-uri pentru tine
              </h3>
              <p className="text-xs text-slate-500">
                Candidați compatibili cu profilul tău de sharing (Chișinău)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold">Sector:</span>
          {['Toate', 'Botanica', 'Centru', 'Buiucani', 'Râșcani'].map(district => (
            <button
              key={district}
              onClick={() => setSelectedDistrict(district)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer ${
                selectedDistrict === district
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {district}
            </button>
          ))}
        </div>

        {/* List of matches */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 bg-slate-100/60">
          {filtered.map(person => (
            <div
              key={person.id}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-blue-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <img
                  src={person.avatar}
                  alt={person.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{person.name}, {person.age} ani</span>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5 text-blue-600" />
                      {person.compatibility}% compatibil
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{person.occupation}</div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1 italic">
                    "{person.bio}"
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                    <span>Buget: <strong className="text-slate-700">{person.budget}</strong></span>
                    <span>•</span>
                    <span>Zone: <strong className="text-slate-700">{person.locationPref}</strong></span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  onClick={() => {
                    onClose();
                    onSelectPerson(person);
                  }}
                  className="w-full px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Vezi profil complet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 px-5 py-3 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
          >
            Închide
          </button>
        </div>
      </div>
    </div>
  );
}
