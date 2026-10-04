import React, { useState, useMemo } from 'react';
import { 
  Home, MapPin, Euro, Calendar, Users, Bed, Maximize2, 
  Check, Filter, ArrowUpDown, Eye, Sparkles, X, Cigarette, Baby
} from 'lucide-react';
import { APARTMENTS, DISTRICTS, TRANSLATIONS, getLocalizedContent, getLocalizedField } from '../data/mockData';

export default function ApartmentsPage({ 
  onSelectApartment, 
  onOpenPublishModal,
  apartmentsList,
  language = 'en'
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [maxPrice, setMaxPrice] = useState(400); // per person
  const [rooms, setRooms] = useState('');
  const [petFriendly, setPetFriendly] = useState(false);
  const [smokerFriendly, setSmokerFriendly] = useState(false);
  const [childrenFriendly, setChildrenFriendly] = useState(false);
  const [furnished, setFurnished] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  const sourceApartments = apartmentsList && apartmentsList.length > 0 ? apartmentsList : APARTMENTS;

  const filteredApartments = useMemo(() => {
    return sourceApartments.filter(apt => {
      if (selectedDistrict && apt.district !== selectedDistrict) return false;
      if (maxPrice && apt.pricePerPerson > maxPrice) return false;
      if (rooms && apt.rooms < Number(rooms)) return false;
      if (petFriendly && !apt.petsAllowed) return false;
      if (smokerFriendly && !apt.smokingAllowed) return false;
      if (childrenFriendly && !apt.childrenAllowed) return false;
      if (furnished && !apt.furnished) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.pricePerPerson - b.pricePerPerson;
      if (sortBy === 'price-desc') return b.pricePerPerson - a.pricePerPerson;
      return 0;
    });
  }, [sourceApartments, selectedDistrict, maxPrice, rooms, petFriendly, smokerFriendly, childrenFriendly, furnished, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 mb-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Home className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t.apartmentsTitle}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.apartmentsSub}
          </p>
        </div>

        <div>
          <button
            onClick={onOpenPublishModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition cursor-pointer"
          >
            {t.publishFlat}
          </button>
        </div>
      </div>

      {/* FILTERS BAR (Includes Smoker and Children Options) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 mb-6 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* District */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2 font-semibold outline-none cursor-pointer"
          >
            <option value="">{t.allDistricts}</option>
            {DISTRICTS.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {/* Max Price / person */}
          <select
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2 font-semibold outline-none cursor-pointer"
          >
            <option value={250}>{t.upTo} €250 {t.perPerson}</option>
            <option value={300}>{t.upTo} €300 {t.perPerson}</option>
            <option value={350}>{t.upTo} €350 {t.perPerson}</option>
            <option value={500}>{t.upTo} €500 {t.perPerson}</option>
          </select>

          {/* Rooms */}
          <select
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2 font-semibold outline-none cursor-pointer"
          >
            <option value="">{t.anyRooms}</option>
            <option value="2">2+ {t.roomsCount}</option>
            <option value="3">3+ {t.roomsCount}</option>
          </select>

          {/* Smoker Friendly Checkbox */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold cursor-pointer text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              checked={smokerFriendly}
              onChange={() => setSmokerFriendly(!smokerFriendly)}
              className="accent-blue-600 rounded"
            />
            <span>🚬 {t.smokerFriendly}</span>
          </label>

          {/* Children / Family Friendly Checkbox */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold cursor-pointer text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              checked={childrenFriendly}
              onChange={() => setChildrenFriendly(!childrenFriendly)}
              className="accent-blue-600 rounded"
            />
            <span>👶 {t.childrenFriendly}</span>
          </label>

          {/* Pet Friendly Checkbox */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold cursor-pointer text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              checked={petFriendly}
              onChange={() => setPetFriendly(!petFriendly)}
              className="accent-blue-600 rounded"
            />
            <span>🐾 {t.petFriendly}</span>
          </label>

          {/* Furnished */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold cursor-pointer text-slate-800 dark:text-slate-200">
            <input
              type="checkbox"
              checked={furnished}
              onChange={() => setFurnished(!furnished)}
              className="accent-blue-600 rounded"
            />
            <span>🛋️ {t.furnished}</span>
          </label>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-bold">{t.sortLabel}</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-1.5 font-semibold outline-none cursor-pointer"
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* APARTMENTS GRID */}
      {filteredApartments.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center my-6">
          <Home className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
            {language === 'ro' ? 'Niciun apartament găsit' : language === 'ru' ? 'Квартиры не найдены' : 'No apartments found'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {language === 'ro' ? 'Încearcă să resetezi filtrele sau să selectezi alt cartier.' : language === 'ru' ? 'Попробуйте сбросить фильтры или выбрать другой район.' : 'Try resetting the filters or selecting another district.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApartments.map(apt => (
            <div
              key={apt.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition duration-200 flex flex-col justify-between group"
            >
              {/* Photo & Badges */}
              <div 
                onClick={() => onSelectApartment(apt)}
                className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
              >
                <img
                  src={(Array.isArray(apt.images) ? apt.images[0] : null) || apt.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'}
                  alt={apt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>{apt.roommatesNeeded || 1} {t.roommatesNeeded}</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-slate-900 dark:text-white px-2.5 py-1 rounded-xl text-xs font-black shadow-sm">
                  €{apt.pricePerPerson} {t.perPerson}
                </div>
              </div>

              {/* Card info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs mb-1.5 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{apt.address || `${getLocalizedContent(apt.district, language)}, Chișinău`}</span>
                    <span>•</span>
                    <span className="shrink-0">{apt.rooms} {t.roomsCount}</span>
                    <span>•</span>
                    <span className="shrink-0">{apt.area} m²</span>
                  </div>

                  <h3 
                    onClick={() => onSelectApartment(apt)}
                    className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition cursor-pointer line-clamp-1 mb-2"
                  >
                    {getLocalizedField(apt, 'title', language)}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                    {getLocalizedField(apt, 'description', language)}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {apt.smokingAllowed && (
                      <span className="text-[11px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-lg border border-blue-200/60 dark:border-blue-800">
                        🚬 {t.smokerFriendly}
                      </span>
                    )}
                    {apt.childrenAllowed && (
                      <span className="text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-lg border border-emerald-200/60 dark:border-emerald-800">
                        👶 {t.childrenFriendly}
                      </span>
                    )}
                    {(apt.amenities || []).slice(0, 2).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg"
                      >
                        {getLocalizedContent(amenity, language)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400">{t.totalRentLabel}: €{apt.priceTotal} {t.perMonth}</div>
                    <div className="text-lg font-black text-blue-700 dark:text-blue-400">
                      €{apt.pricePerPerson} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">{t.perPerson}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectApartment(apt)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                  >
                    {t.viewFlatDetails}
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
