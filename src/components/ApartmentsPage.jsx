import React, { useState, useMemo } from 'react';
import { 
  Home, MapPin, Euro, Calendar, Users, Bed, Maximize2, 
  Check, Filter, ArrowUpDown, Map as MapIcon, List, Eye, Sparkles, X, Cigarette, Baby
} from 'lucide-react';
import { APARTMENTS, DISTRICTS, TRANSLATIONS } from '../data/mockData';

export default function ApartmentsPage({ 
  onSelectApartment, 
  onOpenPublishModal,
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
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [selectedMapApt, setSelectedMapApt] = useState(null);

  const filteredApartments = useMemo(() => {
    return APARTMENTS.filter(apt => {
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
  }, [selectedDistrict, maxPrice, rooms, petFriendly, smokerFriendly, childrenFriendly, furnished, sortBy]);

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

        <div className="flex items-center gap-3">
          {/* List / Map view toggle */}
          <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-100 dark:bg-slate-800 p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>{t.viewList}</span>
            </button>

            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>{t.viewMap}</span>
            </button>
          </div>

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

      {/* VIEW: MAP VIEW */}
      {viewMode === 'map' ? (
        <div className="relative bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm h-[600px] mb-8">
          
          <div className="w-full h-full relative bg-[#e5e9ec] dark:bg-slate-950 overflow-hidden flex items-center justify-center">
            
            {/* Map styling */}
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="absolute top-1/4 left-1/3 w-96 h-12 bg-blue-200/50 dark:bg-blue-900/30 rounded-full blur-xl transform -rotate-12" />
            <div className="absolute bottom-1/3 right-1/4 w-80 h-10 bg-emerald-200/50 dark:bg-emerald-900/30 rounded-full blur-xl" />

            {/* District Labels */}
            <div className="absolute top-16 left-28 text-slate-400 dark:text-slate-600 font-extrabold text-sm tracking-widest uppercase">
              Rîșcani
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 font-extrabold text-base tracking-widest uppercase">
              Centru
            </div>
            <div className="absolute bottom-20 right-32 text-slate-400 dark:text-slate-600 font-extrabold text-sm tracking-widest uppercase">
              Botanica
            </div>
            <div className="absolute top-36 left-16 text-slate-400 dark:text-slate-600 font-extrabold text-sm tracking-widest uppercase">
              Buiucani
            </div>
            <div className="absolute top-24 right-20 text-slate-400 dark:text-slate-600 font-extrabold text-sm tracking-widest uppercase">
              Ciocana
            </div>

            {/* Clickable Map Pins */}
            {filteredApartments.map((apt, index) => {
              const pinPositions = [
                { top: '65%', left: '68%' },
                { top: '35%', left: '22%' },
                { top: '48%', left: '50%' },
                { top: '22%', left: '52%' },
                { top: '26%', left: '76%' },
                { top: '78%', left: '42%' },
                { top: '44%', left: '46%' },
                { top: '40%', left: '28%' }
              ];
              const pos = pinPositions[index % pinPositions.length];
              const isSelected = selectedMapApt?.id === apt.id;

              return (
                <div
                  key={apt.id}
                  style={{ top: pos.top, left: pos.left }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                  onClick={() => setSelectedMapApt(apt)}
                >
                  <div className={`px-2.5 py-1 rounded-full font-black text-xs shadow-md transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-blue-600 text-white scale-110 ring-4 ring-blue-300'
                      : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}>
                    <span>€{apt.pricePerPerson}</span>
                    <span className="text-[10px] font-normal opacity-70">/p</span>
                  </div>
                </div>
              );
            })}

            {/* Selected Apartment Card Popup */}
            {selectedMapApt && (
              <div className="absolute bottom-6 left-6 right-6 sm:right-auto sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xl z-30 animate-in slide-in-from-bottom duration-200">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <img
                      src={selectedMapApt.images[0]}
                      alt={selectedMapApt.title}
                      className="w-16 h-16 rounded-2xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-1">
                        {selectedMapApt.title}
                      </h4>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        <span>{selectedMapApt.district}</span>
                        <span>•</span>
                        <span>{selectedMapApt.rooms} {t.roomsCount}</span>
                      </div>
                      <div className="text-xs font-black text-blue-700 dark:text-blue-400 mt-1">
                        €{selectedMapApt.pricePerPerson} {t.perPerson}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMapApt(null)}
                    className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-400">Total: €{selectedMapApt.priceTotal} {t.perMonth}</span>
                  <button
                    onClick={() => onSelectApartment(selectedMapApt)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    {t.viewFlatDetails}
                  </button>
                </div>
              </div>
            )}

            {/* Map Overlay Badge */}
            <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm pointer-events-none">
              {t.interactiveMapBanner}
            </div>

          </div>

        </div>
      ) : (
        /* VIEW: LIST VIEW */
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
                  src={apt.images[0]}
                  alt={apt.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>{apt.roommatesNeeded} {t.roommatesNeeded}</span>
                </div>

                <div className="absolute bottom-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs text-slate-900 dark:text-white px-2.5 py-1 rounded-xl text-xs font-black shadow-sm">
                  €{apt.pricePerPerson} {t.perPerson}
                </div>
              </div>

              {/* Card info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs mb-1.5 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    <span>{apt.district}</span>
                    <span>•</span>
                    <span>{apt.rooms} {t.roomsCount}</span>
                    <span>•</span>
                    <span>{apt.area} m²</span>
                  </div>

                  <h3 
                    onClick={() => onSelectApartment(apt)}
                    className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition cursor-pointer line-clamp-1 mb-2"
                  >
                    {apt.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                    {apt.description}
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
                    {apt.amenities.slice(0, 2).map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg"
                      >
                        {amenity}
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
