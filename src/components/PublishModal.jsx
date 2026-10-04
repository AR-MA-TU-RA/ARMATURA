import React, { useState } from 'react';
import { 
  X, Plus, Euro, Home, Upload, Check, Building, Calendar, 
  Cigarette, Baby, Star, Trash2, Loader2, AlertCircle 
} from 'lucide-react';
import { DISTRICTS, TRANSLATIONS } from '../data/mockData';
import { compressImage } from '../utils/imageUtils';

export default function PublishModal({ 
  isOpen, 
  onClose, 
  onPublishSuccess, 
  currentUser,
  language = 'en' 
}) {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const defaultSampleImages = [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80'
  ];

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
  const [images, setImages] = useState(defaultSampleImages);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const rentPerPerson = Math.round(totalRent / (roommatesNeeded + 1));

  const handleFilesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const compressedList = [];
      for (const file of files) {
        if (!file.type || !file.type.startsWith('image/')) {
          throw new Error(
            language === 'ro' 
              ? `Fișierul "${file.name}" nu este o imagine validă.`
              : language === 'ru'
              ? `Файл "${file.name}" не является допустимым изображением.`
              : `File "${file.name}" is not a valid image.`
          );
        }
        if (file.size > 15 * 1024 * 1024) {
          throw new Error(
            language === 'ro'
              ? `Fișierul "${file.name}" depășește limita de 15MB.`
              : language === 'ru'
              ? `Файл "${file.name}" превышает лимит 15МБ.`
              : `File "${file.name}" exceeds the 15MB limit.`
          );
        }
        const compressed = await compressImage(file, { maxWidth: 1280, maxHeight: 720, quality: 0.82 });
        compressedList.push(compressed);
      }

      if (compressedList.length > 0) {
        // If currently using the initial default photos, replace them; otherwise append
        const isUsingDefaults = images.length === 2 && images[0] === defaultSampleImages[0] && images[1] === defaultSampleImages[1];
        if (isUsingDefaults) {
          setImages(compressedList);
        } else {
          setImages(prev => [...prev, ...compressedList]);
        }
      }
    } catch (err) {
      console.error('Error compressing apartment images:', err);
      setUploadError(err.message || (
        language === 'ro' 
          ? 'Eroare la încărcarea fotografiilor.' 
          : language === 'ru' 
          ? 'Ошибка при загрузке фотографий.' 
          : 'Error uploading photos.'
      ));
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSetAsCover = (index) => {
    setImages(prev => {
      const next = [...prev];
      const [item] = next.splice(index, 1);
      next.unshift(item);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalImages = images.length > 0 
      ? images 
      : defaultSampleImages;

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
      image: finalImages[0],
      images: finalImages,
      roommatesNeeded: Number(roommatesNeeded),
      sharingCapacity: Number(rooms),
      occupiedSpots: 1,
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

          {/* APARTMENT PHOTO UPLOADS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {language === 'ro' ? 'Fotografii apartament' : language === 'ru' ? 'Фотографии квартиры' : 'Apartment Photos'}
              </label>
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                {images.length} {language === 'ro' ? 'foto' : language === 'ru' ? 'фото' : 'photos'}
              </span>
            </div>

            {/* Hidden native file input supporting multi-select & camera */}
            <input
              type="file"
              id="apartment-images-upload"
              accept="image/*"
              multiple
              onChange={handleFilesUpload}
              className="hidden"
            />

            {/* Upload Area / Dropzone */}
            <label
              htmlFor="apartment-images-upload"
              className={`w-full min-h-[52px] border-2 border-dashed rounded-2xl flex items-center gap-3 p-3 sm:p-4 cursor-pointer transition text-left ${
                isUploading 
                  ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40' 
                  : 'border-slate-300 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/60 hover:bg-blue-50/50 hover:border-blue-400 dark:hover:border-blue-600'
              }`}
            >
              <div className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                {isUploading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {isUploading
                    ? (language === 'ro' ? 'Se comprimă fotografiile...' : language === 'ru' ? 'Сжатие фотографий...' : 'Compressing photos...')
                    : (language === 'ro' ? 'Încarcă fotografii de pe dispozitiv' : language === 'ru' ? 'Загрузить фото с устройства' : 'Upload photos from device')}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {language === 'ro' 
                    ? 'Alege mai multe poze (JPG, PNG, WebP). Prima poză va fi coperta.' 
                    : language === 'ru'
                    ? 'Выберите несколько фото. Первое фото будет обложкой.'
                    : 'Select multiple photos. First photo is the cover.'}
                </p>
              </div>
              <span className="min-h-[44px] px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs hover:bg-blue-700 transition">
                {language === 'ro' ? 'Alege' : language === 'ru' ? 'Выбрать' : 'Browse'}
              </span>
            </label>

            {/* Upload Error Banner */}
            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{uploadError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadError('')}
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-rose-500 hover:text-rose-700 cursor-pointer"
                  aria-label="Close error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Photos Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 aspect-video shadow-xs"
                  >
                    <img
                      src={img}
                      alt={`Apartment preview ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                    {/* Cover badge / Set as cover button */}
                    <div className="absolute top-2 left-2 z-10">
                      {idx === 0 ? (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-blue-600 text-white flex items-center gap-1 shadow">
                          <Star className="w-3 h-3 fill-current text-amber-300" />
                          {language === 'ro' ? 'Copertă' : language === 'ru' ? 'Обложка' : 'Cover'}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetAsCover(idx)}
                          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-900/80 hover:bg-blue-600 text-white transition flex items-center gap-1 shadow cursor-pointer min-h-[30px]"
                          title={language === 'ro' ? 'Setează ca imagine principală' : 'Set as main cover'}
                        >
                          <Star className="w-3 h-3" />
                          <span className="hidden sm:inline">{language === 'ro' ? 'Fă copertă' : language === 'ru' ? 'Сделать обложкой' : 'Set cover'}</span>
                        </button>
                      )}
                    </div>

                    {/* Delete button (minimum 44x44px touch area) */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 z-10 min-h-[44px] min-w-[44px] rounded-full flex items-center justify-center text-white/90 hover:text-white bg-slate-900/60 hover:bg-rose-600 active:scale-90 transition cursor-pointer"
                      title={language === 'ro' ? 'Șterge fotografia' : 'Remove image'}
                      aria-label="Remove image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-1.5 right-2 text-[10px] font-bold text-white/90 pointer-events-none">
                      #{idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
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
