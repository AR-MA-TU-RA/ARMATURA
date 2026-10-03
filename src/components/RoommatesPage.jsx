import React, { useState, useMemo } from 'react';
import { 
  Users, Search, Heart, Sparkles, MapPin, Calendar, 
  Euro, ShieldCheck, Check, MessageSquare, ArrowUpDown, 
  RotateCcw, SlidersHorizontal, Home, UserPlus, Info, X
} from 'lucide-react';
import { DISTRICTS, ROOMMATES, TRANSLATIONS } from '../data/mockData';

export default function RoommatesPage({
  roommatesList = ROOMMATES,
  onSelectRoommate,
  onStartChat,
  onTeamUp,
  favorites = [],
  onToggleFavorite,
  language = 'en',
  initialFilters = {}
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  // Filter state
  const [districts, setDistricts] = useState(initialFilters.district ? [initialFilters.district] : []);
  const [maxBudget, setMaxBudget] = useState(initialFilters.maxBudget || 400);
  const [moveIn, setMoveIn] = useState(initialFilters.moveInDate || 'any');
  const [gender, setGender] = useState(initialFilters.gender || 'any');
  const [ageRange, setAgeRange] = useState('any');
  const [apartmentStatus, setApartmentStatus] = useState('all');
  const [lifestyleTags, setLifestyleTags] = useState([]);
  const [sortBy, setSortBy] = useState('compatibility');
  const [smartSearchQuery, setSmartSearchQuery] = useState('');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const LIFESTYLE_OPTIONS = [
    { id: "non-smoker", label: language === 'ro' ? "Nefumător" : language === 'ru' ? "Некурящий" : "Non-smoker" },
    { id: "clean", label: language === 'ro' ? "Ordonat / Curat" : language === 'ru' ? "Любит порядок" : "Likes order / Very tidy" },
    { id: "quiet", label: language === 'ro' ? "Liniștit / Calm" : language === 'ru' ? "Тихий / Спокойный" : "Likes quiet / Calm" },
    { id: "student", label: language === 'ro' ? "Student" : language === 'ru' ? "Студент" : "Student" },
    { id: "wfh", label: language === 'ro' ? "Lucrează de acasă" : language === 'ru' ? "Работает из дома" : "Works from home" },
    { id: "no-pets", label: language === 'ro' ? "Fără animale" : language === 'ru' ? "Без питомцев" : "No pets" },
    { id: "pet-friendly", label: language === 'ro' ? "Iubitor de animale" : language === 'ru' ? "С питомцами" : "Pet-friendly / Has Pet" }
  ];

  const toggleDistrict = (d) => {
    setDistricts(prev => 
      prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
    );
  };

  const toggleLifestyle = (tag) => {
    setLifestyleTags(prev =>
      prev.includes(tag) ? prev.filter(x => x !== tag) : [...prev, tag]
    );
  };

  const handleResetFilters = () => {
    setDistricts([]);
    setMaxBudget(400);
    setMoveIn('any');
    setGender('any');
    setAgeRange('any');
    setApartmentStatus('all');
    setLifestyleTags([]);
    setSmartSearchQuery('');
  };

  // Smart Search Natural Language parser
  const handleSmartSearchChange = (query) => {
    setSmartSearchQuery(query);
    const q = query.toLowerCase();

    // Parse District
    DISTRICTS.forEach(d => {
      if (q.includes(d.toLowerCase())) {
        if (!districts.includes(d)) setDistricts([d]);
      }
    });

    // Parse Gender
    if (q.includes('girl') || q.includes('female') || q.includes('fată') || q.includes('девушка')) {
      setGender('Female');
    } else if (q.includes('boy') || q.includes('male') || q.includes('băiat') || q.includes('парень')) {
      setGender('Male');
    }

    // Parse Budget
    const budgetMatch = q.match(/(?:under|sub|до|până la)\s*(\d+)/i) || q.match(/(\d+)\s*(?:euro|eur|€)/i);
    if (budgetMatch && budgetMatch[1]) {
      const b = Number(budgetMatch[1]);
      if (b >= 150 && b <= 600) {
        setMaxBudget(b);
      }
    }

    // Parse Lifestyle
    if (q.includes('student')) {
      if (!lifestyleTags.includes('student')) setLifestyleTags(prev => [...prev, 'student']);
    }
    if (q.includes('quiet') || q.includes('liniștit') || q.includes('тихий')) {
      if (!lifestyleTags.includes('quiet')) setLifestyleTags(prev => [...prev, 'quiet']);
    }
  };

  // Filtered roommates list
  const filteredRoommates = useMemo(() => {
    return roommatesList.filter(roommate => {
      if (districts.length > 0 && !districts.includes(roommate.district)) return false;
      if (maxBudget && roommate.budgetMin > maxBudget) return false;
      if (gender !== 'any' && roommate.gender !== gender) return false;
      if (ageRange === '18-25' && (roommate.age < 18 || roommate.age > 25)) return false;
      if (ageRange === '26-35' && (roommate.age < 26 || roommate.age > 35)) return false;
      if (moveIn !== 'any' && roommate.moveInKey !== moveIn) return false;
      if (apartmentStatus !== 'all' && roommate.apartmentStatus !== apartmentStatus) return false;

      if (lifestyleTags.length > 0) {
        const matchesAllTags = lifestyleTags.every(tag => {
          if (tag === 'non-smoker') return roommate.lifestyle.smoking.toLowerCase().includes('non-smoker');
          if (tag === 'clean') return roommate.badges.some(b => b.toLowerCase().includes('clean') || b.toLowerCase().includes('order'));
          if (tag === 'quiet') return roommate.badges.some(b => b.toLowerCase().includes('quiet'));
          if (tag === 'student') return roommate.badges.some(b => b.toLowerCase().includes('student'));
          if (tag === 'wfh') return roommate.lifestyle.wfh.toLowerCase().includes('yes');
          if (tag === 'no-pets') return roommate.lifestyle.pets.toLowerCase().includes('no pets');
          if (tag === 'pet-friendly') return roommate.lifestyle.pets.toLowerCase().includes('dog') || roommate.lifestyle.pets.toLowerCase().includes('cat') || roommate.badges.some(b => b.toLowerCase().includes('pet'));
          return true;
        });
        if (!matchesAllTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'budget-asc') return a.budgetMin - b.budgetMin;
      if (sortBy === 'budget-desc') return b.budgetMax - a.budgetMax;
      return b.compatibility - a.compatibility;
    });
  }, [roommatesList, districts, maxBudget, gender, ageRange, moveIn, apartmentStatus, lifestyleTags, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* SMART NATURAL LANGUAGE SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-3 sm:p-4 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              value={smartSearchQuery}
              onChange={(e) => handleSmartSearchChange(e.target.value)}
              placeholder={t.smartSearchPlaceholder}
              className="w-full text-xs sm:text-sm font-medium text-slate-800 dark:text-white placeholder-slate-400 outline-none bg-transparent"
            />
          </div>
          {smartSearchQuery && (
            <button 
              onClick={() => handleSmartSearchChange('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick query chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            {t.quickFiltersLabel}
          </span>
          {[
            "Girl under 300 euro in Centru",
            "Botanica non-smoker",
            "Buiucani quiet student",
            "Has an apartment already"
          ].map(chip => (
            <button
              key={chip}
              onClick={() => handleSmartSearchChange(chip)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition shrink-0 cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT: DESKTOP LEFT SIDEBAR (280px) + RIGHT CARDS */}
      <div className="flex gap-6 items-start">
        
        {/* ================= DESKTOP LEFT SIDEBAR (280px) ================= */}
        <aside className="hidden lg:block w-[280px] shrink-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm sticky top-[80px] max-h-[calc(100vh-100px)] overflow-y-auto">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">{t.filtersTitle}</h3>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              {t.reset}
            </button>
          </div>

          <div className="space-y-5 text-xs">
            
            {/* 1. Location (Chișinău Districts) */}
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {t.location}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {DISTRICTS.map(d => {
                  const isChecked = districts.includes(d);
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => toggleDistrict(d)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer text-left ${
                        isChecked
                          ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-400 text-blue-800 dark:text-blue-300 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center ${
                        isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-700'
                      }`}>
                        {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </div>
                      <span className="truncate">{d}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Budget Range Slider */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  {t.budgetMonthly}
                </label>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
                  {t.upTo} €{maxBudget} {t.perMonth}
                </span>
              </div>
              <input
                type="range"
                min="150"
                max="600"
                step="25"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>€150</span>
                <span>€350</span>
                <span>€600</span>
              </div>
            </div>

            {/* 3. Move-in Date */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {t.moveInPlaceholder}
              </label>
              <select
                value={moveIn}
                onChange={(e) => setMoveIn(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2 text-xs font-semibold outline-none cursor-pointer"
              >
                <option value="any">Immediate / {t.any}</option>
                <option value="immediate">Immediate</option>
                <option value="month">Within a month</option>
                <option value="october">October 2026</option>
                <option value="november">November 2026</option>
                <option value="3months">Within 3 months</option>
              </select>
            </div>

            {/* 4. Gender */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {t.genderPlaceholder}
              </label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { label: t.any, val: 'any' },
                  { label: t.female, val: 'Female' },
                  { label: t.male, val: 'Male' }
                ].map(g => (
                  <button
                    key={g.val}
                    type="button"
                    onClick={() => setGender(g.val)}
                    className={`py-1.5 text-center text-xs font-semibold rounded-xl border transition cursor-pointer ${
                      gender === g.val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Age */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {t.age}
              </label>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { label: t.any, val: 'any' },
                  { label: "18–25", val: '18-25' },
                  { label: "26–35", val: '26-35' }
                ].map(a => (
                  <button
                    key={a.val}
                    type="button"
                    onClick={() => setAgeRange(a.val)}
                    className={`py-1.5 text-center text-xs font-semibold rounded-xl border transition cursor-pointer ${
                      ageRange === a.val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Apartment Status */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {t.apartmentStatus}
              </label>
              <div className="space-y-1">
                {[
                  { id: 'all', label: t.allStatuses },
                  { id: 'has_apartment', label: t.hasApartment },
                  { id: 'looking', label: t.lookingForApartment },
                  { id: 'wants_teamup', label: t.wantsToLookTogether }
                ].map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setApartmentStatus(st.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      apartmentStatus === st.id
                        ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-400 text-blue-800 dark:text-blue-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Lifestyle Checkboxes */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                {t.lifestylePrefs}
              </label>
              <div className="space-y-1.5">
                {LIFESTYLE_OPTIONS.map(opt => {
                  const isChecked = lifestyleTags.includes(opt.id);
                  return (
                    <label 
                      key={opt.id} 
                      className="flex items-center gap-2 py-1 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleLifestyle(opt.id)}
                        className="rounded border-slate-300 dark:border-slate-700 accent-blue-600 w-4 h-4 cursor-pointer"
                      />
                      <span className={`text-xs ${isChecked ? 'font-bold text-blue-800 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {opt.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

          </div>
        </aside>

        {/* ================= RIGHT ROOMMATES LISTING ================= */}
        <div className="flex-1 min-w-0">
          
          {/* Results Toolbar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl px-4 py-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{t.roommatesPageTitle}</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                  {filteredRoommates.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t.roommatesPageSub}
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{t.filtersTitle}</span>
              </button>

              <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold hidden sm:inline">{t.sortLabel}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs rounded-xl px-2.5 py-1.5 font-bold outline-none cursor-pointer"
                >
                  <option value="compatibility">{t.sortHighestMatch}</option>
                  <option value="budget-asc">{t.sortBudgetAsc}</option>
                  <option value="budget-desc">{t.sortBudgetDesc}</option>
                </select>
              </div>
            </div>
          </div>

          {/* ROOMMATE CARDS */}
          {filteredRoommates.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white mb-1">
                {t.noRoommatesFound}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
                {t.noRoommatesSub}
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                {t.resetAllFilters}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRoommates.map(roommate => {
                const isFavorite = favorites.includes(roommate.id);

                return (
                  <div
                    key={roommate.id}
                    className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition duration-200 flex flex-col sm:flex-row gap-5 relative group"
                  >
                    {/* LEFT: PHOTO + VERIFICATION */}
                    <div 
                      onClick={() => onSelectRoommate(roommate)}
                      className="sm:w-44 shrink-0 flex flex-col items-center cursor-pointer"
                    >
                      <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700">
                        <img
                          src={roommate.avatar}
                          alt={roommate.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/95 dark:bg-slate-900/95 text-blue-700 dark:text-blue-400 shadow-sm flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-blue-600" />
                          <span>{t.verifiedResident}</span>
                        </div>
                      </div>

                      <div className="mt-2.5 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                          roommate.apartmentStatus === 'has_apartment'
                            ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : roommate.apartmentStatus === 'wants_teamup'
                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {roommate.apartmentStatus === 'has_apartment' ? t.hasApartment : t.wantsToLookTogether}
                        </span>
                      </div>
                    </div>

                    {/* CENTER & RIGHT: PROFILE CONTENT */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        
                        {/* Top bar: Name, Age, Location, Compatibility & Heart */}
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 
                                onClick={() => onSelectRoommate(roommate)}
                                className="font-extrabold text-slate-900 dark:text-white text-lg hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
                              >
                                {roommate.name}, {roommate.age}
                              </h3>
                              <span className="text-slate-300 dark:text-slate-700">•</span>
                              <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-semibold">
                                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                                <span>{roommate.district}</span>
                              </div>
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                              {roommate.occupation}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Compatibility Badge */}
                            <div className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>{roommate.compatibility}% {t.matchLabel}</span>
                            </div>

                            {/* Save Heart */}
                            <button
                              onClick={() => onToggleFavorite(roommate.id)}
                              className={`p-2 rounded-xl border transition cursor-pointer ${
                                isFavorite
                                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                              title={isFavorite ? "Unsave" : "Save"}
                            >
                              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Headline */}
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                          "{roommate.headline}"
                        </p>

                        {/* Budget & Move-in strip */}
                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300 mb-3 bg-slate-50 dark:bg-slate-800 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-700">
                          <div className="flex items-center gap-1 text-slate-900 dark:text-white font-bold">
                            <span className="text-slate-400 font-medium">{t.budgetMonthly}:</span>
                            <span className="text-blue-700 dark:text-blue-400">{roommate.budgetFormatted}</span>
                          </div>
                          <span className="text-slate-300 dark:text-slate-700">|</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{t.moveInLabel} <strong className="text-slate-800 dark:text-slate-100">{roommate.moveInDate}</strong></span>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {roommate.badges.map((badge, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>

                        {/* Similar habits */}
                        <div className="text-[11px] text-slate-600 dark:text-slate-300 mb-4 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60 rounded-2xl p-2.5">
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-1">
                            {t.similarHabits}
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-700 dark:text-slate-300">
                            {roommate.similarHabits.map((habit, i) => (
                              <div key={i} className="flex items-center gap-1 text-emerald-900 dark:text-emerald-300">
                                <span className="text-emerald-600 font-bold">✓</span>
                                <span>{habit}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="text-[11px] text-slate-400">
                          {t.languagesLabel}: {roommate.languages.join(", ")}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectRoommate(roommate)}
                            className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
                          >
                            {t.viewProfile}
                          </button>

                          <button
                            onClick={() => onTeamUp(roommate)}
                            className="px-3 py-2 text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 rounded-xl border border-blue-200 dark:border-blue-800 transition cursor-pointer flex items-center gap-1"
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>{t.teamUp}</span>
                          </button>

                          <button
                            onClick={() => onStartChat(roommate)}
                            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm transition cursor-pointer flex items-center gap-1.5"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{t.message}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
