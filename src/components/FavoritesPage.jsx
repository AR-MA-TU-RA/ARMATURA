import React, { useState } from 'react';
import { Heart, Users, Home, MapPin, Sparkles, MessageSquare, Trash2, ArrowRight, Check } from 'lucide-react';
import { ROOMMATES, APARTMENTS, TRANSLATIONS } from '../data/mockData';

export default function FavoritesPage({ 
  favorites = [], 
  appliedApartments = [],
  apartmentsList,
  onToggleFavorite, 
  onSelectPerson, 
  onStartChat, 
  onSelectApartment,
  onGoToSearch,
  language = 'en'
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState('roommates'); // 'roommates' | 'apartments' | 'applied'

  const savedRoommates = ROOMMATES.filter(r => favorites.includes(r.id));
  const savedApartments = (apartmentsList || APARTMENTS).filter(a => favorites.includes(a.id));
  const appliedApartmentList = (apartmentsList || APARTMENTS).filter(a => appliedApartments.includes(a.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* HEADER */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Saved Profiles & Listings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep track of roommates you liked and apartments you are considering.
          </p>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap items-center border border-slate-200 rounded-xl bg-slate-100 p-0.5 self-start sm:self-auto gap-1 sm:gap-0">
          <button
            onClick={() => setActiveTab('roommates')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'roommates'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.savedRoommatesTab || 'Roommates'} ({savedRoommates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('apartments')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'apartments'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t.savedApartmentsTab || 'Apartments'} ({savedApartments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applied')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'applied'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.appliedApartmentsTab || 'Applied flats'} ({appliedApartmentList.length})</span>
          </button>
        </div>
      </div>

      {/* CONTENT */}
      {activeTab === 'roommates' ? (
        savedRoommates.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              No saved roommates yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Tap the heart icon on any roommate card to save them here for quick access later.
            </p>
            <button
              onClick={onGoToSearch}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Browse Roommates
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedRoommates.map(person => (
              <div
                key={person.id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={person.avatar}
                        alt={person.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 
                          onClick={() => onSelectPerson(person)}
                          className="font-bold text-slate-900 text-sm hover:text-blue-600 cursor-pointer"
                        >
                          {person.name}, {person.age}
                        </h4>
                        <div className="text-[11px] text-slate-500">{person.district} • {person.budgetFormatted}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleFavorite(person.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    "{person.bio}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {person.compatibility}% Match
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectPerson(person)}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => onStartChat(person)}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : activeTab === 'apartments' ? (
        /* SAVED APARTMENTS */
        savedApartments.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-400 flex items-center justify-center mx-auto mb-3">
              <Home className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              No saved apartments yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Explore available apartments in Chișinău and save your favorites to compare.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedApartments.map(apt => (
              <div
                key={apt.id}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={apt.images[0]}
                    alt={apt.title}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onToggleFavorite(apt.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 text-rose-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{apt.title}</h4>
                  <div className="text-xs text-slate-500 mb-3">{apt.district} • {apt.rooms} rooms</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="font-black text-blue-700 text-sm">€{apt.pricePerPerson} / pers.</span>
                    <button
                      onClick={() => onSelectApartment(apt)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      {t.viewDetailsBtn || 'View details'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* APPLIED APARTMENTS */
        appliedApartmentList.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {t.noAppliedApartmentsTitle || 'No applied apartments yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              {t.noAppliedApartmentsSub || "When you click 'Team up for this flat' on a property, it will appear here for easy tracking."}
            </p>
            <button
              onClick={() => onGoToSearch?.()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              {t.exploreApartmentsBtn || 'Explore apartments'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appliedApartmentList.map(apt => (
              <div
                key={apt.id}
                className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={apt.images[0]}
                    alt={apt.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1 shadow-sm">
                    <Check className="w-3 h-3" />
                    <span>{t.appliedBadge || 'Applied for flatsharing'}</span>
                  </div>
                  <button
                    onClick={() => onToggleFavorite(apt.id)}
                    className={`absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 shadow-xs cursor-pointer ${
                      favorites.includes(apt.id) ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'
                    }`}
                    title={favorites.includes(apt.id) ? (language === 'ro' ? 'Șterge din favorite' : language === 'ru' ? 'Удалить из избранного' : 'Remove from saved') : (language === 'ro' ? 'Salvează la favorite' : language === 'ru' ? 'Сохранить в избранное' : 'Save to favorites')}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(apt.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1">{apt.title}</h4>
                  <div className="text-xs text-slate-500 mb-3">{apt.district} • {apt.address}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="font-black text-blue-700 text-sm">€{apt.pricePerPerson} / pers.</span>
                    <button
                      onClick={() => onSelectApartment(apt)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                    >
                      {t.viewDetailsBtn || 'View details'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

    </div>
  );
}
