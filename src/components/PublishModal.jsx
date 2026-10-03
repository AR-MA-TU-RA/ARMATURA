import React, { useState } from 'react';
import { X, Plus, Euro, Home, Upload, Check, Building, Calendar, Cigarette, Baby } from 'lucide-react';
import { DISTRICTS, TRANSLATIONS } from '../data/mockData';

export default function PublishModal({ 
  isOpen, 
  onClose, 
  onPublishSuccess, 
  currentUser,
  language = 'en' 
}) {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [title, setTitle] = useState('');
  const [district, setDistrict] = useState('Centru');
  const [address, setAddress] = useState('');
  const [rooms, setRooms] = useState(2);
  const [totalRent, setTotalRent] = useState(600);
  const [roommatesNeeded, setRoommatesNeeded] = useState(1);
  const [availableFrom, setAvailableFrom] = useState('October 15, 2026');
  const [furnished, setFurnished] = useState(true);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [smokingAllowed, setSmokingAllowed] = useState(false);
  const [childrenAllowed, setChildrenAllowed] = useState(false);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80');

  const rentPerPerson = Math.round(totalRent / (roommatesNeeded + 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    const newApartment = {
      id: `apt-${Date.now()}`,
      title: title || `Cozy ${rooms}-room flat in ${district}`,
      district,
      address: address || `str. Principală 10, ${district}, Chișinău`,
      priceTotal: Number(totalRent),
      pricePerPerson: rentPerPerson,
      rooms: Number(rooms),
      area: 60,
      availableFrom,
      furnished,
      petsAllowed,
      smokingAllowed,
      childrenAllowed,
      isUserOwned: true, // Flag as owned by the user (prevents self teamup bug)
      amenities: ["Wi-Fi", "Washing machine", "Balcony", "Fridge"],
      images: [imageUrl],
      roommatesNeeded: Number(roommatesNeeded),
      currentRoommate: {
        name: `${currentUser?.name || 'You'} (Host)`,
        age: currentUser?.age || 22,
        avatar: currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        occupation: "Roommate Host"
      },
      landlord: {
        name: currentUser?.name || "You",
        phone: "+373 69 123 456",
        whatsapp: "37369123456",
        verified: true,
        responseTime: "Usually replies in 15 mins",
        languages: "RO, EN, RU"
      },
      description: description || "Freshly listed apartment looking for a reliable, tidy roommate."
    };

    onPublishSuccess(newApartment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              {t.publishFlat}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FORM BODY */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh] text-xs text-slate-700 dark:text-slate-300 space-y-4">
          
          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:bg-white"
              placeholder="e.g. Modern 2-room flat next to USM campus"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {t.location} (Chișinău)
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs font-semibold outline-none cursor-pointer"
              >
                {DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                {t.roomsLabel}
              </label>
              <select
                value={rooms}
                onChange={(e) => setRooms(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs font-semibold outline-none cursor-pointer"
              >
                <option value={2}>2 {t.roomsCount}</option>
                <option value={3}>3 {t.roomsCount}</option>
                <option value={4}>4 {t.roomsCount}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs outline-none focus:border-blue-600"
              placeholder="e.g. str. Alexandr Pușkin 38"
            />
          </div>

          {/* RENT AND ROOMMATE SHARE CALCULATION */}
          <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-2xl p-4">
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  {t.totalRentLabel} (€)
                </label>
                <input
                  type="number"
                  step="20"
                  value={totalRent}
                  onChange={(e) => setTotalRent(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 text-sm font-black outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider block mb-1">
                  {t.roommatesNeeded}
                </label>
                <select
                  value={roommatesNeeded}
                  onChange={(e) => setRoommatesNeeded(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs font-bold outline-none cursor-pointer"
                >
                  <option value={1}>1 {t.roommatesNeeded}</option>
                  <option value={2}>2 {t.roommatesNeeded}</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-200/80 dark:border-blue-900 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">{t.yourShareLabel}:</span>
              <span className="text-base font-black text-blue-700 dark:text-blue-400">
                €{rentPerPerson} {t.perPerson} {t.perMonth}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              Photo URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs outline-none"
            />
          </div>

          {/* RULES / POLICIES (Includes Smoker and Children options) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <label className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={furnished}
                onChange={() => setFurnished(!furnished)}
                className="accent-blue-600 rounded"
              />
              <span>{t.furnished}</span>
            </label>

            <label className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={petsAllowed}
                onChange={() => setPetsAllowed(!petsAllowed)}
                className="accent-blue-600 rounded"
              />
              <span>{t.petFriendly}</span>
            </label>

            <label className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={smokingAllowed}
                onChange={() => setSmokingAllowed(!smokingAllowed)}
                className="accent-blue-600 rounded"
              />
              <span>{t.smokerFriendly}</span>
            </label>

            <label className="flex items-center gap-1.5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold cursor-pointer">
              <input
                type="checkbox"
                checked={childrenAllowed}
                onChange={() => setChildrenAllowed(!childrenAllowed)}
                className="accent-blue-600 rounded"
              />
              <span>{t.childrenFriendly}</span>
            </label>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              {t.aboutTitle}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-xs outline-none resize-none font-medium"
              placeholder="Describe the rooms, building, transport, and who lives here..."
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md transition cursor-pointer"
            >
              {t.publishFlat}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
