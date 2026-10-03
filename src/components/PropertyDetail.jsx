import React, { useState } from 'react';
import { 
  ArrowLeft, Heart, Share2, MapPin, Users, Calendar, 
  Bed, Maximize2, Building, ShieldCheck, Check, MessageSquare, 
  UserPlus, Euro, Phone, Mail, Sparkles, ChevronRight, AlertCircle, Baby, Cigarette
} from 'lucide-react';
import { TRANSLATIONS } from '../data/mockData';
import ContactLandlordModal from './ContactLandlordModal';

export default function PropertyDetail({
  apartment,
  onBack,
  onStartChatWithPerson,
  onTeamUpForApartment,
  currentUser,
  isFavorite,
  onToggleFavorite,
  language = 'en'
}) {
  if (!apartment) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const [activePhoto, setActivePhoto] = useState(0);
  const [isContactLandlordOpen, setIsContactLandlordOpen] = useState(false);
  const [ownApartmentNotice, setOwnApartmentNotice] = useState(false);

  // Check if apartment is owned by the logged in user (Bug 3 fix)
  const isOwnApartment = 
    apartment.isUserOwned || 
    apartment.currentRoommate?.name?.toLowerCase().includes('you') ||
    apartment.currentRoommate?.name?.toLowerCase().includes(currentUser?.name?.toLowerCase());

  const handleTeamUpClick = () => {
    if (isOwnApartment) {
      setOwnApartmentNotice(true);
    } else {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-3xl overflow-hidden shadow-sm bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
        <div className="md:col-span-2 h-72 sm:h-96 overflow-hidden">
          <img
            src={apartment.images[activePhoto] || apartment.images[0]}
            alt={apartment.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="hidden md:flex flex-col gap-3 h-96">
          {apartment.images.slice(0, 2).map((img, i) => (
            <div
              key={i}
              onClick={() => setActivePhoto(i)}
              className={`flex-1 overflow-hidden cursor-pointer relative border-2 ${
                activePhoto === i ? 'border-blue-600' : 'border-transparent'
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
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>{apartment.address}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
              {apartment.title}
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
              {apartment.description}
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
                  <span>{item}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{apartment.petsAllowed ? t.petFriendly : 'No pets'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{apartment.smokingAllowed ? t.smokerFriendly : 'Non-smoking only'}</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{apartment.childrenAllowed ? t.childrenFriendly : 'No children'}</span>
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
                  {isOwnApartment ? "Your Listing" : "Current Flatmate / Host"}
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
                      {apartment.currentRoommate.occupation}
                    </div>
                    {!isOwnApartment && (
                      <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        ✓ 92% Compatibility Score
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
                  onClick={() => onStartChatWithPerson(apartment.currentRoommate)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t.messageRoommate}</span>
                </button>
              )}

              <button
                onClick={handleTeamUpClick}
                className="w-full py-2.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs rounded-xl border border-blue-200 dark:border-blue-800 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t.teamUpForFlat}</span>
              </button>

              {/* FUNCTIONAL CONTACT LANDLORD BUTTON (Fix for Bug 1) */}
              <button
                onClick={() => setIsContactLandlordOpen(true)}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-blue-600" />
                <span>{t.contactLandlord}</span>
              </button>
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
