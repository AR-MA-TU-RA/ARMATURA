import React from 'react';
import { 
  X, MapPin, Calendar, Euro, ShieldCheck, Sparkles, 
  MessageSquare, UserPlus, Heart, Flag, Check, Building, 
  Clock, Coffee, BookOpen, Ban
} from 'lucide-react';
import { TRANSLATIONS, getLocalizedContent, getLocalizedField } from '../data/mockData';

export default function UserProfileModal({ 
  person, 
  onClose, 
  onStartChat, 
  onTeamUp,
  onReport,
  isFavorite,
  onToggleFavorite,
  language = 'en'
}) {
  if (!person) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER BAR WITH PHOTO & QUICK STATS */}
        <div className="relative bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Large Centered Photo */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden shadow-md shrink-0 border-2 border-white dark:border-slate-700 bg-slate-200 mx-auto sm:mx-0">
            <img
              src={person.avatar}
              alt={person.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>

          {/* Quick info */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {person.name}, {person.age}
              </h2>
              <div className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.verifiedResident}</span>
              </div>
            </div>

            <div className="flex items-center justify-center sm:justify-start gap-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold mb-2.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Chișinău · {getLocalizedContent(person.district, language)}</span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-md mx-auto sm:mx-0">
              "{getLocalizedField(person, 'bio', language)}"
            </p>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300 flex-1">
          
          {/* ## COMPATIBILITY BLOCK */}
          <div className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4.5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-emerald-200/60 dark:border-emerald-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                  {t.yourCompatibility}
                </span>
              </div>
              <div className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white">
                {person.compatibility}% Total Match
              </div>
            </div>

            <p className="text-[11px] text-emerald-900 dark:text-emerald-300 mb-3 italic">
              {t.compatibilityNote}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white/90 dark:bg-slate-800 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60">
                <div className="text-[10px] text-slate-400 font-bold uppercase">{t.budgetMatch}</div>
                <div className="text-base font-black text-emerald-700 dark:text-emerald-400">{person.compatibilityBreakdown?.budget || 95}%</div>
              </div>
              <div className="bg-white/90 dark:bg-slate-800 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60">
                <div className="text-[10px] text-slate-400 font-bold uppercase">{t.lifestyleMatch}</div>
                <div className="text-base font-black text-emerald-700 dark:text-emerald-400">{person.compatibilityBreakdown?.lifestyle || 90}%</div>
              </div>
              <div className="bg-white/90 dark:bg-slate-800 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60">
                <div className="text-[10px] text-slate-400 font-bold uppercase">{t.locationMatch}</div>
                <div className="text-base font-black text-emerald-700 dark:text-emerald-400">{person.compatibilityBreakdown?.location || 100}%</div>
              </div>
              <div className="bg-white/90 dark:bg-slate-800 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/60">
                <div className="text-[10px] text-slate-400 font-bold uppercase">{t.moveInMatch}</div>
                <div className="text-base font-black text-emerald-700 dark:text-emerald-400">{person.compatibilityBreakdown?.moveIn || 85}%</div>
              </div>
            </div>
          </div>

          {/* ## ABOUT */}
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>{t.aboutTitle}</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">{t.occupationLabel}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{getLocalizedContent(person.occupation, language)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">{t.universityLabel}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{person.university}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">{t.districtLabel}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{getLocalizedContent(person.district, language)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">{t.languagesLabel}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{person.languages.join(", ")}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">{t.age}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{person.age}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] font-bold uppercase">{t.verificationLabel}</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400">{t.emailPhoneVerified}</span>
              </div>
            </div>
          </div>

          {/* ## BUDGET & MOVE-IN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-4">
              <div className="text-slate-400 text-[10px] font-bold uppercase mb-1">{t.budgetMonthly}</div>
              <div className="text-xl font-black text-blue-700 dark:text-blue-400">{person.budgetFormatted}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Flexible for high quality flats</div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-4">
              <div className="text-slate-400 text-[10px] font-bold uppercase mb-1">{t.targetMoveIn}</div>
              <div className="text-xl font-black text-slate-900 dark:text-white">{person.moveInDate}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Flexible +/- 1 week</div>
            </div>
          </div>

          {/* ## LIFESTYLE */}
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
              <Coffee className="w-4 h-4 text-blue-600" />
              <span>{t.lifestyleTitle}</span>
            </h3>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              {person.badges.map((b, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800"
                >
                  {getLocalizedContent(b, language)}
                </span>
              ))}
            </div>

            {/* Matrix details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">{t.smokingLabel}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{getLocalizedContent(person.lifestyle.smoking, language)}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">{t.petsLabel}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{getLocalizedContent(person.lifestyle.pets, language)}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">{t.cleanlinessLabel}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{getLocalizedContent(person.lifestyle.cleanliness, language)}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">{t.sleepScheduleLabel}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{getLocalizedContent(person.lifestyle.schedule, language)}</span>
              </div>
            </div>
          </div>

          {/* ## LOOKING FOR */}
          <div className="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900 rounded-2xl p-4">
            <h3 className="font-bold text-blue-900 dark:text-blue-300 text-sm mb-1.5">
              {t.lookingForTitle}
            </h3>
            <p className="text-xs text-blue-950 dark:text-blue-200 leading-relaxed font-medium">
              "{getLocalizedField(person, 'lookingFor', language)}"
            </p>
          </div>

          {/* ## APARTMENT IF ALREADY FOUND */}
          {person.apartmentDetails ? (
            <div className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Building className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {t.hasApartmentTitle}
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-3">
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">{t.totalRentLabel}</span>
                  <span className="font-bold text-slate-900 dark:text-white">€{person.apartmentDetails.rentTotal} / mo</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">{t.yourShareLabel}</span>
                  <span className="font-black text-emerald-700 dark:text-emerald-400">€{person.apartmentDetails.roommateShare} / mo</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">{t.roomsLabel}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{person.apartmentDetails.rooms} {t.roomsCount}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] font-bold uppercase block">{t.districtLabel}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{person.apartmentDetails.district}</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                📍 {person.apartmentDetails.address}
              </div>
            </div>
          ) : (
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">{t.readyToTeamUp}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{t.readyToTeamUpSub}</p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onTeamUp(person);
                }}
                className="px-3.5 py-1.5 text-xs font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 rounded-xl hover:bg-blue-50 cursor-pointer shadow-xs"
              >
                {t.teamUp}
              </button>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <button
              onClick={() => onToggleFavorite(person.id)}
              className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold min-h-[44px] min-w-[44px] ${
                isFavorite
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-600'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isFavorite ? t.savedToFavorites : t.saveLabel}</span>
            </button>

            {/* PROMINENT REPORT BUTTON */}
            <button
              onClick={() => onReport(person)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-rose-300 dark:border-rose-700 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950 font-bold transition cursor-pointer text-xs min-h-[44px]"
              title="Report profile"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{t.report || 'Raportează'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onTeamUp(person);
              }}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <UserPlus className="w-4 h-4" />
              <span>{t.proposeTeamUp}</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onStartChat(person);
              }}
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.sendMessage}</span>
            </button>
          </div>
        </div>

        {/* SAFETY TIP STRIP */}
        <div className="px-6 py-3 bg-blue-50 dark:bg-blue-950/40 border-t border-blue-100 dark:border-blue-900 flex items-center gap-2 text-[11px] text-blue-700 dark:text-blue-300 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-blue-500" />
          <span>domi nu va solicita niciodată bani în avans. Raportați orice comportament suspect.</span>
        </div>

      </div>
    </div>
  );
}
