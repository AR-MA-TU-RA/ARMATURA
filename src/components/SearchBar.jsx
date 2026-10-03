import React from 'react';
import { Search, MapPin, Banknote, Users, Calendar } from 'lucide-react';
import { DISTRICTS } from '../data/mockData';

export default function SearchBar({ filters, setFilters, onSearch }) {
  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <div className="bg-[#003b25] py-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-white font-bold text-lg mb-3">
          Găsește o locuință de împărțit în Chișinău
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row items-stretch gap-2">
            
            {/* Location */}
            <div className="flex-1 relative bg-white rounded overflow-hidden flex items-center">
              <MapPin className="w-4 h-4 text-green-700 absolute left-3 shrink-0" />
              <select
                value={filters.district}
                onChange={(e) => handleChange('district', e.target.value)}
                className="w-full pl-9 pr-3 py-3 text-sm text-slate-900 font-medium bg-transparent appearance-none outline-none cursor-pointer"
              >
                <option value="">Toate sectoarele — Chișinău</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>{d}, Chișinău</option>
                ))}
              </select>
            </div>

            {/* Budget */}
            <div className="flex-1 relative bg-white rounded overflow-hidden flex items-center">
              <Banknote className="w-4 h-4 text-green-700 absolute left-3 shrink-0" />
              <select
                value={filters.maxBudget}
                onChange={(e) => handleChange('maxBudget', Number(e.target.value))}
                className="w-full pl-9 pr-3 py-3 text-sm text-slate-900 font-medium bg-transparent appearance-none outline-none cursor-pointer"
              >
                <option value={10000}>Orice buget</option>
                <option value={3000}>Până la 3 000 MDL / pers.</option>
                <option value={3500}>Până la 3 500 MDL / pers.</option>
                <option value={4000}>Până la 4 000 MDL / pers.</option>
                <option value={5000}>Până la 5 000 MDL / pers.</option>
              </select>
            </div>

            {/* Sharing */}
            <div className="bg-white rounded overflow-hidden flex items-center px-3 gap-2">
              <Users className="w-4 h-4 text-green-700 shrink-0" />
              <span className="text-xs text-slate-500 font-semibold shrink-0">Sharing:</span>
              <div className="flex gap-1 py-2">
                {[0, 2, 3].map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => handleChange('sharingCapacity', filters.sharingCapacity === v ? 0 : v)}
                    className={`px-2.5 py-1 text-xs font-bold rounded transition cursor-pointer ${
                      filters.sharingCapacity === v && v !== 0
                        ? 'bg-green-700 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {v === 0 ? 'Oricare' : `${v} pers.`}
                  </button>
                ))}
              </div>
            </div>

            {/* Move-in date */}
            <div className="relative bg-white rounded overflow-hidden flex items-center">
              <Calendar className="w-4 h-4 text-green-700 absolute left-3 shrink-0" />
              <select
                value={filters.moveInDate}
                onChange={(e) => handleChange('moveInDate', e.target.value)}
                className="w-full pl-9 pr-3 py-3 text-sm text-slate-900 font-medium bg-transparent appearance-none outline-none cursor-pointer"
              >
                <option value="oricand">Oricând / Imediat</option>
                <option value="octombrie">Octombrie 2026</option>
                <option value="noiembrie">Noiembrie 2026</option>
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-sm rounded shadow transition cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Search className="w-4 h-4" />
              Caută
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
