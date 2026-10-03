import React, { useState } from 'react';
import { 
  Users, Search, Check, ShieldCheck, Heart, Sparkles, 
  MapPin, ArrowRight, Home, Euro, Clock, Sliders, ChevronRight
} from 'lucide-react';
import { DISTRICTS, TRANSLATIONS } from '../data/mockData';

export default function Homepage({ 
  onSearchSubmit, 
  onSelectDistrict, 
  onStartCreateProfile, 
  language 
}) {
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [heroDistrict, setHeroDistrict] = useState('');
  const [heroBudget, setHeroBudget] = useState('350');
  const [heroMoveIn, setHeroMoveIn] = useState('any');
  const [heroGender, setHeroGender] = useState('any');

  const handleHeroSearch = (e) => {
    e.preventDefault();
    onSearchSubmit({
      district: heroDistrict,
      maxBudget: Number(heroBudget),
      moveInDate: heroMoveIn,
      gender: heroGender
    });
  };

  const POPULAR_DISTRICTS = [
    { name: "Centru", avgRent: "€280–350", count: `48 ${t.roommatesCountLabel}`, img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=500&q=80" },
    { name: "Botanica", avgRent: "€200–280", count: `34 ${t.roommatesCountLabel}`, img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80" },
    { name: "Buiucani", avgRent: "€220–290", count: `29 ${t.roommatesCountLabel}`, img: "https://images.unsplash.com/photo-1502005229762-ee1b2da94088?auto=format&fit=crop&w=500&q=80" },
    { name: "Rîșcani", avgRent: "€210–270", count: `26 ${t.roommatesCountLabel}`, img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=500&q=80" },
    { name: "Ciocana", avgRent: "€180–240", count: `19 ${t.roommatesCountLabel}`, img: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef3?auto=format&fit=crop&w=500&q=80" },
    { name: "Telecentru", avgRent: "€220–300", count: `16 ${t.roommatesCountLabel}`, img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=500&q=80" }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.subTagline}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] mb-5">
            {t.heroTitle}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            {t.heroSubtitle}
          </p>
        </div>

        {/* HERO SEARCH CARD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none p-4 sm:p-5 max-w-4xl mx-auto">
          <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
            
            {/* District */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.location}
              </label>
              <select
                value={heroDistrict}
                onChange={(e) => setHeroDistrict(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="">{t.districtPlaceholder}</option>
                {DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.budgetPlaceholder}
              </label>
              <select
                value={heroBudget}
                onChange={(e) => setHeroBudget(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="200">{t.upTo} €200 {t.perMonth}</option>
                <option value="250">{t.upTo} €250 {t.perMonth}</option>
                <option value="300">{t.upTo} €300 {t.perMonth}</option>
                <option value="350">{t.upTo} €350 {t.perMonth}</option>
                <option value="500">{t.upTo} €500 {t.perMonth}</option>
                <option value="600">{t.any} (€600+)</option>
              </select>
            </div>

            {/* Move-in Date */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.moveInPlaceholder}
              </label>
              <select
                value={heroMoveIn}
                onChange={(e) => setHeroMoveIn(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="any">Immediate / {t.any}</option>
                <option value="month">Within a month</option>
                <option value="october">October 2026</option>
                <option value="november">November 2026</option>
              </select>
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                {t.genderPlaceholder}
              </label>
              <select
                value={heroGender}
                onChange={(e) => setHeroGender(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white outline-none focus:border-blue-600 cursor-pointer"
              >
                <option value="any">{t.any}</option>
                <option value="Female">{t.female}</option>
                <option value="Male">{t.male}</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="sm:col-span-2 lg:col-span-1 pt-1 sm:pt-4">
              <button
                type="submit"
                className="w-full h-[42px] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{t.findRoommateBtn}</span>
              </button>
            </div>

          </form>
        </div>

        {/* Small Benefits Strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>{t.benefitsVerified}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>{t.benefitsLifestyle}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>{t.benefitsCheaper}</span>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (4 STEPS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3">
            {t.howItWorksTitle}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t.howItWorksSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: "01", title: t.step1Title, desc: t.step1Desc },
            { step: "02", title: t.step2Title, desc: t.step2Desc },
            { step: "03", title: t.step3Title, desc: t.step3Desc },
            { step: "04", title: t.step4Title, desc: t.step4Desc }
          ].map((s) => (
            <div 
              key={s.step} 
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-200 flex flex-col justify-between"
            >
              <div>
                <span className="text-3xl font-black text-blue-600 dark:text-blue-400 block mb-3 font-mono">{s.step}</span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2">{s.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. LIFESTYLE MATCHING SHOWCASE */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-3">
                <Check className="w-3.5 h-3.5" />
                <span>{t.personOverApartment}</span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
                {t.lifestyleShowcaseTitle}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                {t.lifestyleShowcaseSub}
              </p>

              <button
                onClick={onStartCreateProfile}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <span>{t.lifestyleQuizBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* PREVIEW INTERACTIVE MATCHING CARD */}
            <div className="w-full max-w-md bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-700 mb-4">
                <div className="flex items-center gap-2.5">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                    alt="Anna"
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-300 dark:border-slate-600"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">Anna, 21 • Centru</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Design student, UTM</div>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  92% match
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    <span>{t.cleanlinessLabel} & Order</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">95% Match</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[95%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    <span>{t.sleepScheduleLabel} (07:30 - 23:00)</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">90% Match</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[90%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                    <span>{t.budgetMonthly} (€250–300)</span>
                    <span className="text-emerald-700 dark:text-emerald-400 font-extrabold">100% Match</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[100%]" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. POPULAR AREAS IN CHIȘINĂU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t.popularAreas}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t.popularAreasSub}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {POPULAR_DISTRICTS.map((item) => (
            <div
              key={item.name}
              onClick={() => onSelectDistrict(item.name)}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-blue-400 hover:shadow-md transition cursor-pointer group flex flex-col"
            >
              <div className="h-28 overflow-hidden relative">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2 text-white">
                  <div className="font-extrabold text-sm">{item.name}</div>
                </div>
              </div>
              <div className="p-3 text-xs flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase">{t.avgRoommateShare}</div>
                  <div className="font-black text-slate-800 dark:text-white text-sm">{item.avgRent}</div>
                </div>
                <div className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-2 flex items-center justify-between">
                  <span>{item.count}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY DOMI BENEFITS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 dark:bg-slate-800/90 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-4">
              {t.whyDomiTitle}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              {t.whyDomiSub}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-black text-emerald-400 mb-1">{t.saveMonthly}</div>
                <div className="text-xs text-slate-300">{t.saveYearly}</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                <div className="text-2xl font-black text-blue-400 mb-1">{t.zeroBlindMatches}</div>
                <div className="text-xs text-slate-300">{t.zeroBlindMatchesSub}</div>
              </div>
            </div>

            <button
              onClick={() => onSearchSubmit({ district: '', maxBudget: 500 })}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg transition cursor-pointer flex items-center gap-2"
            >
              <span>{t.exploreBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
