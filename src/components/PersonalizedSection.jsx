import React from 'react';
import { Sparkles, Heart, Users, MapPin, ChevronRight, Eye } from 'lucide-react';

export default function PersonalizedSection({ 
  properties, 
  onSelectProperty, 
  favorites, 
  onToggleFavorite 
}) {
  // Take top 3 highest compatibility properties
  const recommended = properties.slice(0, 3);

  if (recommended.length === 0) return null;

  return (
    <div className="mb-6 bg-gradient-to-r from-blue-50/90 via-indigo-50/50 to-slate-50 border border-green-200/90 rounded-xl p-4 sm:p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-green-700 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
              Pentru tine
            </h2>
            <p className="text-xs text-slate-600">
              Locuințe care corespund bugetului și preferințelor tale de colocatar
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto text-[11px] font-bold text-green-700 bg-white/80 px-2.5 py-1 rounded-full border border-green-200 shadow-2xs">
          Match personalizat 90%+
        </span>
      </div>

      {/* Recommended 3-card mini grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {recommended.map(prop => {
          const isFav = favorites.includes(prop.id);
          return (
            <div
              key={prop.id}
              onClick={() => onSelectProperty(prop)}
              className="bg-white border border-slate-200 hover:border-green-400 rounded-lg overflow-hidden shadow-2xs hover:shadow-md transition duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div className="relative h-36 overflow-hidden bg-slate-100">
                <img
                  src={prop.images.main}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-104 transition duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs">
                    Sharing {prop.sharingCapacity} pers.
                  </span>
                </div>

                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(prop.id);
                    }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition shadow-xs cursor-pointer ${
                      isFav ? 'bg-rose-500 text-white' : 'bg-white/90 text-slate-600 hover:bg-white hover:text-rose-500'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Compatibility badge */}
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-700 text-white shadow-xs flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                    {prop.compatibility}% compatibil
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 font-medium mb-0.5">
                    <MapPin className="w-3 h-3 text-green-700 shrink-0" />
                    <span>Chișinău, {prop.district}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-green-700 transition">
                    {prop.title}
                  </h3>
                </div>

                {/* Pricing & CTA */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400">Total: {prop.totalRent.toLocaleString('ro-RO')} MDL</div>
                    <div className="text-sm font-extrabold text-green-700">
                      {prop.rentPerPerson.toLocaleString('ro-RO')} MDL <span className="text-[10px] font-semibold text-slate-600">/ om</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-green-700 group-hover:translate-x-0.5 transition flex items-center">
                    Detalii <ChevronRight className="w-3 h-3 ml-0.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

