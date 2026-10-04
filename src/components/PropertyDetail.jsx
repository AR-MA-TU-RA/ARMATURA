import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Heart, Share2, MapPin, Users, Calendar, 
  Bed, Maximize2, Building, ShieldCheck, Check, MessageSquare, 
  UserPlus, Euro, Phone, Mail, Sparkles, ChevronRight, AlertCircle, Baby, Cigarette
} from 'lucide-react';
import { TRANSLATIONS, ROOMMATES, getLocalizedContent, getLocalizedField } from '../data/mockData';
import ContactLandlordModal from './ContactLandlordModal';

export default function PropertyDetail({
  apartment,
  onBack,
  onStartChat,
  onStartChatWithPerson,
  onTeamUpForApartment,
  currentUser,
  roommatesList,
  appliedApartments = [],
  onApplyApartment,
  isFavorite,
  onToggleFavorite,
  language = 'en'
}) {
  if (!apartment) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activePhoto, setActivePhoto] = useState(0);
  const [isContactLandlordOpen, setIsContactLandlordOpen] = useState(false);
  const [ownApartmentNotice, setOwnApartmentNotice] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [localApplied, setLocalApplied] = useState(false);
  const interestedSectionRef = useRef(null);

  const isApplied = appliedApartments.includes(apartment.id) || localApplied;

  // Resolve candidate roommates from interestedRoommates array + localStorage applications
  const staticCandidateIds = apartment.interestedRoommates || [];
  const allRoommates = roommatesList && roommatesList.length > 0 ? roommatesList : ROOMMATES;
  
  const staticCandidates = staticCandidateIds
    .map(id => allRoommates.find(r => r.id === id))
    .filter(Boolean);

  // Dynamic applicants from localStorage (User A / User B multi-user flow)
  let storedApps = {};
  try {
    const raw = localStorage.getItem('domi_apartment_applications');
    if (raw) storedApps = JSON.parse(raw);
  } catch (e) {}

  const dynamicApplicants = (storedApps[apartment.id] || [])
    .map(app => {
      if (typeof app === 'string') {
        return allRoommates.find(r => r.id === app) || { id: app, name: 'Applicant' };
      }
      return app;
    })
    .filter(Boolean);

  // Combine and deduplicate
  const combinedCandidates = [...staticCandidates];
  dynamicApplicants.forEach(candidate => {
    if (!combinedCandidates.some(c => c.id === candidate.id)) {
      combinedCandidates.push(candidate);
    }
  });

  // Filter out the active user viewing this apartment so they don't see themselves as someone else to message
  const currentUserId = currentUser?.id || (currentUser?.name?.toLowerCase().includes('mihai') ? 'mihai-ceban' : 'anna-moraru');
  const candidates = combinedCandidates.filter(c => {
    if (c.id === currentUserId) return false;
    if (currentUser?.name && c.name?.toLowerCase() === currentUser.name.toLowerCase()) return false;
    return true;
  });

  // Check if apartment is owned by the logged in user (Bug 3 fix)
  const isOwnApartment = 
    apartment.isUserOwned || 
    apartment.currentRoommate?.name?.toLowerCase().includes('you') ||
    apartment.currentRoommate?.name?.toLowerCase().includes(currentUser?.name?.toLowerCase());

  const handleStartChatWithCandidate = (roommateId) => {
    const apartmentContext = {
      apartment: {
        id: apartment.id,
        title: apartment.title,
        address: apartment.address,
        district: apartment.district,
        pricePerPerson: apartment.pricePerPerson
      }
    };
    if (onStartChat) {
      onStartChat(roommateId, apartmentContext);
    } else if (onStartChatWithPerson) {
      const candidateObj = allRoommates.find(r => r.id === roommateId) || { id: roommateId };
      onStartChatWithPerson(candidateObj, apartmentContext);
    }
  };

  const handleTeamUpClick = () => {
    if (isOwnApartment) {
      setOwnApartmentNotice(true);
      return;
    }

    if (onApplyApartment) {
      onApplyApartment(apartment.id);
    }
    setLocalApplied(true);

    if (interestedSectionRef.current) {
      interestedSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    setIsHighlighted(true);
    setTimeout(() => {
      setIsHighlighted(false);
    }, 2000);

    if (onTeamUpForApartment) {
      onTeamUpForApartment(apartment);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* TOP NAVIGATION BREADCRUMB */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.apartments}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(apartment.id)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
              isFavorite
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
            <span>{isFavorite ? t.savedToFavorites : t.saveLabel}</span>
          </button>
        </div>
      </div>

      {/* PHOTO GALLERY */}
      {(() => {
        const apartmentImages = Array.isArray(apartment.images) && apartment.images.length > 0
          ? apartment.images
          : [apartment.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80'];

        return (
          <div className="mb-6 sm:mb-8 rounded-3xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 h-64 sm:h-80 md:h-96 overflow-hidden relative group">
                <img
                  src={apartmentImages[activePhoto] || apartmentImages[0]}
                  alt={apartment.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
                {/* Image counter indicator */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                  {Math.min(activePhoto + 1, apartmentImages.length)} / {apartmentImages.length}
                </div>

                {/* Mobile tap navigation buttons */}
                {apartmentImages.length > 1 && (
                  <div className="flex md:hidden absolute inset-y-0 inset-x-2 items-center justify-between pointer-events-none">
                    <button
                      type="button"
                      onClick={() => setActivePhoto(prev => (prev > 0 ? prev - 1 : apartmentImages.length - 1))}
                      className="pointer-events-auto min-h-[44px] min-w-[44px] rounded-full bg-slate-900/70 text-white flex items-center justify-center shadow-lg active:scale-95 transition text-lg font-bold"
                      aria-label="Previous photo"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => setActivePhoto(prev => (prev < apartmentImages.length - 1 ? prev + 1 : 0))}
                      className="pointer-events-auto min-h-[44px] min-w-[44px] rounded-full bg-slate-900/70 text-white flex items-center justify-center shadow-lg active:scale-95 transition text-lg font-bold"
                      aria-label="Next photo"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>

              {/* Desktop 2-image vertical stack */}
              <div className="hidden md:flex flex-col gap-3 h-96">
                {apartmentImages.slice(0, 2).map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className={`flex-1 overflow-hidden cursor-pointer relative rounded-2xl border-2 transition ${
                      activePhoto === i ? 'border-blue-600 ring-2 ring-blue-300' : 'border-transparent hover:opacity-90'
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile horizontal swipeable/scrollable thumbnail strip */}
            {apartmentImages.length > 1 && (
              <div className="flex md:hidden gap-2 p-2.5 overflow-x-auto bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                {apartmentImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhoto(i)}
                    className={`shrink-0 w-16 h-14 rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                      activePhoto === i ? 'border-blue-600 ring-2 ring-blue-400' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* OWN APARTMENT WARNING BANNER (Fix for Bug 3) */}
      {ownApartmentNotice && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start justify-between gap-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-extrabold text-sm">{t.ownApartmentNoticeTitle}</div>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5 leading-relaxed">
                {t.ownApartmentNoticeBody}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setOwnApartmentNotice(false)}
            className="text-amber-600 hover:text-amber-900 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* TWO-COLUMN DETAILS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: SPECS, DESCRIPTION, AMENITIES */}
        <div className="lg:col-span-2 space-y-6">
          
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-semibold mb-2">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{apartment.address} • <strong className="text-slate-700 dark:text-slate-200">{getLocalizedContent(apartment.district, language)}</strong>, Chișinău</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              {getLocalizedField(apartment, 'title', language)}
            </h1>

            {/* SPECS STRIP */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-2xl shadow-xs">
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-slate-400" />
                <span>{apartment.rooms} {t.roomsCount}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <div className="flex items-center gap-1.5">
                <Maximize2 className="w-4 h-4 text-slate-400" />
                <span>{apartment.area} m²</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 dark:text-blue-400 font-bold">{apartment.roommatesNeeded} {t.roommatesNeeded}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>{apartment.availableFrom}</span>
              </div>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-3">
              {t.aboutTitle}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {getLocalizedField(apartment, 'description', language)}
            </p>
          </div>

          {/* AMENITIES & POLICIES (Includes Smoker and Children options) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base mb-3">
              {t.lifestyleTitle} & Policies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-medium">
              {apartment.amenities.map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{getLocalizedContent(item, language)}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{apartment.petsAllowed ? (t.petFriendly || 'Pet friendly') : (language === 'ro' ? 'Fără animale de companie' : language === 'ru' ? 'Без животных' : 'No pets')}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{apartment.smokingAllowed ? (t.smokerFriendly || 'Smoker-friendly') : (language === 'ro' ? 'Fumatul interzis' : language === 'ru' ? 'Для некурящих' : 'Non-smoking only')}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{apartment.childrenAllowed ? (t.childrenFriendly || 'Children / Family welcome') : (language === 'ro' ? 'Fără copii' : language === 'ru' ? 'Без детей' : 'No children')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: PRICING CARD & HOST INFO */}
        <div className="space-y-6">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 shadow-md sticky top-[90px]">
            
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {t.yourShareLabel}
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-black text-blue-700 dark:text-blue-400 tracking-tight">
                  €{apartment.pricePerPerson}
                </span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {t.perPerson} {t.perMonth}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.totalRentLabel}: €{apartment.priceTotal} {t.perMonth}
              </div>
            </div>

            {/* CURRENT ROOMMATE / HOST INFO */}
            {apartment.currentRoommate && (
              <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-2xl p-4 mb-5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  {isOwnApartment 
                    ? (language === 'ro' ? 'Anunțul tău' : language === 'ru' ? 'Ваше объявление' : 'Your Listing')
                    : (language === 'ro' ? 'Coleg actual / Gazdă' : language === 'ru' ? 'Текущий сосед / Хозяин' : 'Current Flatmate / Host')}
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={apartment.currentRoommate.avatar}
                    alt={apartment.currentRoommate.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                      {apartment.currentRoommate.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {getLocalizedContent(apartment.currentRoommate.occupation, language)}
                    </div>
                    {!isOwnApartment && (
                      <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        ✓ 92% {t.matchLabel || (language === 'ro' ? 'Scor de potrivire' : language === 'ru' ? 'Совместимость' : 'Compatibility Score')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ACTION BUTTONS (Fix for Bug 1 and Bug 3) */}
            <div className="space-y-2.5">
              
              {!isOwnApartment && apartment.currentRoommate && (
                <button
                  onClick={() => handleStartChatWithCandidate(apartment.currentRoommate.id)}
                  className="w-full min-h-[44px] py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.messageRoommate}</span>
                </button>
              )}

              {/* MAIN CTA BUTTON: Team Up / Vreau sa impart acest apartament */}
              <button
                onClick={handleTeamUpClick}
                className={`w-full min-h-[48px] py-3 font-bold text-xs sm:text-sm rounded-xl border transition cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                  isApplied
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300'
                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-transparent'
                }`}
              >
                {isApplied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.appliedForFlat || 'Applied for this flat'}</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>{t.wantToShareFlat || t.teamUpForFlat || 'Team up for this flat'}</span>
                  </>
                )}
              </button>

              {/* FUNCTIONAL CONTACT LANDLORD BUTTON */}
              <button
                onClick={() => setIsContactLandlordOpen(true)}
                className="w-full min-h-[44px] py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.contactLandlord}</span>
              </button>
            </div>

            {/* INTERESTED CANDIDATES SECTION */}
            <div
              ref={interestedSectionRef}
              className={`mt-5 pt-5 border-t border-slate-200/80 dark:border-slate-800 transition-all duration-300 rounded-2xl ${
                isHighlighted
                  ? 'ring-2 ring-blue-500 bg-blue-50/60 dark:bg-blue-950/40 p-3 -mx-1'
                  : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                    {t.interestedRoommatesTitle || "People interested in this apartment"}
                  </h3>
                </div>
                {candidates.length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                    {candidates.length}
                  </span>
                )}
              </div>

              {candidates.length > 0 ? (
                <div className="space-y-2.5">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={candidate.avatar}
                          alt={candidate.name}
                          className="w-11 h-11 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                              {candidate.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                              {candidate.compatibility}% match
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                            {t.budgetLabel || 'Budget'}: {candidate.budgetFormatted || `€${candidate.budgetMin} - €${candidate.budgetMax}`}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartChatWithCandidate(candidate.id)}
                        className="w-full sm:w-auto min-h-[44px] sm:min-h-0 px-3.5 py-2 sm:py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{t.writeMessage || 'Send message'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                  {t.firstInterestedPerson || 'Be the first to express interest in sharing this flat!'}
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center text-[11px] text-slate-400">
              🛡️ Verified lease agreement • No agency fee
            </div>

          </div>

        </div>

      </div>

      {/* CONTACT LANDLORD MODAL (Bug 1 Fix) */}
      <ContactLandlordModal
        isOpen={isContactLandlordOpen}
        onClose={() => setIsContactLandlordOpen(false)}
        apartment={apartment}
        language={language}
      />

    </div>
  );
}
