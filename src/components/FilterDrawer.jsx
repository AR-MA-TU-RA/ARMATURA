import React from 'react';
import { X, SlidersHorizontal, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { DISTRICTS } from '../data/mockData';

export default function FilterDrawer({ isOpen, onClose, filters, setFilters, resetFilters, totalResults }) {
  if (!isOpen) return null;

  const handleCheckboxToggle = (category, value) => {
    setFilters(prev => {
      const currentList = prev[category] || [];
      const exists = currentList.includes(value);
      return {
        ...prev,
        [category]: exists
          ? currentList.filter(item => item !== value)
          : [...currentList, value]
      };
    });
  };

  const handleBooleanToggle = (key) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-2xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Filtre detaliate</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Resetează
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body - Scrollable */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-slate-700 flex-1">
          
          {/* Oraș */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Oraș
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 p-2 rounded border border-blue-300 bg-blue-50 font-bold text-slate-900 cursor-pointer">
                <input
                  type="radio"
                  name="drawerCity"
                  checked={filters.city === 'Chișinău'}
                  onChange={() => setFilters(prev => ({ ...prev, city: 'Chișinău' }))}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                />
                <span>Chișinău (120)</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded border border-slate-200 opacity-60 cursor-pointer">
                <input
                  type="radio"
                  name="drawerCity"
                  checked={filters.city === 'Bălți'}
                  onChange={() => setFilters(prev => ({ ...prev, city: 'Bălți' }))}
                  className="w-3.5 h-3.5 text-blue-600 focus:ring-blue-500"
                />
                <span>Bălți (7)</span>
              </label>
            </div>
          </div>

          {/* Zonă / Sector */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Zonă / Sector (Chișinău)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {DISTRICTS.map((district) => {
                const isChecked = filters.districts?.includes(district) || filters.district === district;
                return (
                  <button
                    key={district}
                    type="button"
                    onClick={() => handleCheckboxToggle('districts', district)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-xs font-medium transition cursor-pointer text-left ${
                      isChecked
                        ? 'bg-blue-50 border-blue-400 text-blue-800 font-bold'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${isChecked ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                      {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                    <span>{district}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preț maxim / persoană */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Preț maxim / persoană
              </label>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                ≤ {filters.maxBudget?.toLocaleString('ro-RO')} MDL
              </span>
            </div>
            <input
              type="range"
              min="1500"
              max="10000"
              step="200"
              value={filters.maxBudget}
              onChange={(e) => setFilters(prev => ({ ...prev, maxBudget: Number(e.target.value) }))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
              <span>1 500 MDL</span>
              <span>5 000 MDL</span>
              <span>10 000 MDL</span>
            </div>
          </div>

          {/* 2 persoane / 3 persoane */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Persoane pentru sharing
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Oricare', val: 0 },
                { label: '2 persoane', val: 2 },
                { label: '3 persoane', val: 3 }
              ].map(item => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, sharingCapacity: item.val }))}
                  className={`py-1.5 rounded text-xs font-semibold border text-center transition cursor-pointer ${
                    filters.sharingCapacity === item.val
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Apartament / Casă */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Tip locuință
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['Toate', 'Apartament', 'Casă'].map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, propertyType: type === 'Toate' ? '' : type }))}
                  className={`py-1.5 rounded text-xs font-semibold border text-center transition cursor-pointer ${
                    (!filters.propertyType && type === 'Toate') || filters.propertyType === type
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Număr camere */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Număr camere
            </label>
            <div className="grid grid-cols-4 gap-1">
              {['Toate', '1+', '2+', '3+'].map(rooms => (
                <button
                  key={rooms}
                  type="button"
                  onClick={() => setFilters(prev => ({ ...prev, rooms: rooms === 'Toate' ? '' : rooms }))}
                  className={`py-1.5 rounded text-xs font-semibold border text-center transition cursor-pointer ${
                    (!filters.rooms && rooms === 'Toate') || filters.rooms === rooms
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {rooms}
                </button>
              ))}
            </div>
          </div>

          {/* Dotări esențiale */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Dotări & Criterii
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'furnished', label: 'Mobilat' },
                { id: 'internet', label: 'Wi-Fi' },
                { id: 'washingMachine', label: 'Mașină de spălat' },
                { id: 'balcony', label: 'Balcon' },
                { id: 'parking', label: 'Parcare' },
                { id: 'petFriendly', label: 'Animale acceptate' },
                { id: 'smokerFriendly', label: 'Fumat permis' }
              ].map(item => (
                <label key={item.id} className="flex items-center gap-2 p-1.5 rounded border border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(filters[item.id])}
                    onChange={() => handleBooleanToggle(item.id)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                  />
                  <span className="text-xs font-medium text-slate-800">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Arată doar locuințele compatibile cu profilul meu */}
          <div className="pt-3 border-t border-slate-100 bg-blue-50/80 p-3 rounded-lg border border-blue-200">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.onlyCompatible}
                onChange={() => handleBooleanToggle('onlyCompatible')}
                className="mt-0.5 rounded border-blue-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Arată doar locuințele compatibile cu profilul meu
                </span>
                <span className="text-[11px] text-blue-700 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Potrivire &gt; 85% bazată pe profilul tău complet
                </span>
              </div>
            </label>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <button
            onClick={resetFilters}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Resetează tot
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs transition cursor-pointer text-center"
          >
            Arată rezultatele ({totalResults})
          </button>
        </div>

      </div>
    </div>
  );
}
