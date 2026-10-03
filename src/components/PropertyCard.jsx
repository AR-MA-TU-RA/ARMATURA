import React, { useState } from 'react';
import { 
  Heart, MapPin, Users, Sparkles, Check, ChevronRight, 
  Bed, Maximize2, Building, HelpCircle, X
} from 'lucide-react';

export default function PropertyCard({ 
  property, 
  onSelect, 
  isFavorite, 
  onToggleFavorite,
  isInterested,
  onToggleInterested,
}) {
  const [showCompatibilityWhy, setShowCompatibilityWhy] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md hover:border-slate-300 transition duration-200 flex flex-col sm:flex-row group relative">
      
      {/* LEFT: Property Photo */}
      <div 
        onClick={() => onSelect(property)}
        className="relative sm:w-72 lg:w-80 shrink-0 h-52 sm:h-auto overflow-hidden bg-slate-100 cursor-pointer"
      >
        <img
          src={property.images.main}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          loading="lazy"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Top badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="px-2 py-1 rounded text-[11px] font-bold bg-slate-900/80 text-white flex items-center gap-1">
            <Users className="w-3 h-3 text-green-400" />
            Sharing {property.sharingCapacity} pers.
          </span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(property.id); }}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow cursor-pointer ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 text-slate-600 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Bottom: occupancy */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-900/75 text-white flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {property.occupiedSpots || 1} / {property.sharingCapacity} ocupat
          </span>
        </div>
      </div>

      {/* RIGHT: Card Info */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          {/* Social proof strip */}
          <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {property.viewingNow || 5} se uită acum
            </span>
            <span>•</span>
            <span>{property.interestedCount || 2} interesați</span>
            <span>•</span>
            <span>{property.likesCount || 27} aprecieri</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(property)}
            className="font-bold text-slate-900 text-base leading-snug group-hover:text-green-700 transition cursor-pointer line-clamp-2 mb-1"
          >
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-slate-500 text-xs mb-2.5">
            <MapPin className="w-3.5 h-3.5 text-green-600 shrink-0" />
            <span className="truncate">{property.city}, {property.district} • {property.floor}</span>
          </div>

          {/* Property specs */}
          <div className="flex items-center gap-3 text-xs text-slate-600 mb-3 bg-slate-50 rounded px-3 py-2 border border-slate-100">
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <strong>{property.rooms}</strong> camere
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <strong>{property.area}</strong> m²
            </span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              {property.floor}
            </span>
          </div>

          {/* Amenity chips */}
          <div className="flex flex-wrap gap-1 mb-3">
            {property.amenities.slice(0, 5).map((amenity, idx) => (
              <span key={idx} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                {amenity}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom: Price + Actions */}
        <div className="flex items-end justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Pricing */}
          <div>
            <div className="text-[11px] text-slate-400 font-medium">
              Total: {property.totalRent.toLocaleString('ro-RO')} MDL / lună ÷ {property.sharingCapacity}
            </div>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-green-700 tracking-tight">
                {property.rentPerPerson.toLocaleString('ro-RO')} MDL
              </span>
              <span className="text-xs font-bold text-green-900/70">/ pers.</span>
            </div>
          </div>

          {/* Right: Compatibility + CTA */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            {/* Compatibility badge */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowCompatibilityWhy(!showCompatibilityWhy); }}
                className="flex items-center gap-1 px-2.5 py-1 bg-green-700 hover:bg-green-800 text-white text-[11px] font-bold rounded transition cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-yellow-300" />
                {property.compatibility}% compatibil
                <HelpCircle className="w-2.5 h-2.5 opacity-70" />
              </button>

              {/* Compatibility popover */}
              {showCompatibilityWhy && (
                <div 
                  className="absolute right-0 bottom-8 w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-3 text-xs z-30"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-100">
                    <div className="font-bold text-slate-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-green-600" />
                      De ce vă potriviți?
                    </div>
                    <button onClick={() => setShowCompatibilityWhy(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-700">
                    {(property.compatibilityReasons || [
                      'Buget compatibil cu profilul tău',
                      `Zonă preferată: ${property.district}`,
                      'Data mutării apropiată',
                      'Facilități potrivite'
                    ]).map((r, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <Check className="w-3 h-3 text-green-600 shrink-0 mt-0.5" />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onToggleInterested(property.id); }}
                className={`px-3 py-1.5 text-xs font-bold rounded border transition cursor-pointer ${
                  isInterested
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                {isInterested ? (
                  <span className="flex items-center gap-1"><Check className="w-3 h-3 text-emerald-600" /> Interes trimis</span>
                ) : 'Sunt interesat'}
              </button>

              <button
                type="button"
                onClick={() => onSelect(property)}
                className="px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded transition cursor-pointer flex items-center gap-1"
              >
                Vezi
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
