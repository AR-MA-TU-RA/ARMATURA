import React from 'react';
import { List, ArrowUpDown, FilterX, SlidersHorizontal } from 'lucide-react';
import PropertyCard from './PropertyCard';
import FilterSidebar from './FilterSidebar';

export default function PropertyGrid({
  properties,
  totalCount,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onSelectProperty,
  favorites,
  onToggleFavorite,
  interestedProperties,
  onToggleInterested,
  onResetFilters,
  filters,
  setFilters,
  resetFilters,
}) {
  return (
    <div className="flex gap-5 items-start">
      {/* LEFT: Persistent Filter Sidebar (desktop only) */}
      <div className="hidden lg:block">
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          resetFilters={resetFilters}
          totalResults={properties.length}
        />
      </div>

      {/* RIGHT: Results Area */}
      <div className="flex-1 min-w-0">
        {/* Results toolbar */}
        <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Locuințe disponibile
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                {properties.length} rezultate
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Apartamente și case cu chiria împărțită la 2–3 persoane în Chișinău
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Mobile filter button */}
            <button
              onClick={() => {}}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border border-slate-300 rounded bg-white text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtre
            </button>

            {/* Sort */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              <span className="hidden sm:inline font-semibold">Sortare:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded px-2.5 py-1.5 font-bold outline-none focus:border-green-600 cursor-pointer"
              >
                <option value="relevance">Relevanță</option>
                <option value="price-asc">Preț crescător</option>
                <option value="price-desc">Preț descrescător</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cards or Empty State */}
        {properties.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <FilterX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Niciun rezultat
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Încearcă să crești bugetul sau să selectezi mai multe sectoare.
            </p>
            <button
              onClick={onResetFilters}
              className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-xs font-bold rounded transition cursor-pointer"
            >
              Resetează filtrele
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
                isFavorite={favorites.includes(property.id)}
                onToggleFavorite={onToggleFavorite}
                isInterested={interestedProperties?.includes(property.id)}
                onToggleInterested={onToggleInterested}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
