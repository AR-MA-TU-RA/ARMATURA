import React from 'react';
import { SlidersHorizontal, RotateCcw, ShieldCheck, Check } from 'lucide-react';
import { DISTRICTS } from '../data/mockData';

export default function FilterSidebar({ filters, setFilters, resetFilters, totalResults }) {
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
    setFilters(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const Section = ({ title, children }) => (
    <div className="py-4 border-b border-slate-100">
      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2.5">{title}</div>
      {children}
    </div>
  );

  const ToggleGroup = ({ options, field, labelKey = 'label', valKey = 'val' }) => (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => {
        const val = typeof opt === 'object' ? opt[valKey] : opt;
        const label = typeof opt === 'object' ? opt[labelKey] : opt;
        const isActive = typeof val === 'string'
          ? (!filters[field] && val === '') || filters[field] === val
          : filters[field] === val;
        return (
          <button
            key={label}
            type="button"
            onClick={() => setFilters(prev => ({ ...prev, [field]: isActive && val !== '' ? '' : val === 0 ? 0 : val }))}
            className={`px-3 py-1.5 rounded text-xs font-semibold border transition cursor-pointer ${
              isActive
                ? 'bg-green-700 text-white border-green-700'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );

  return (
    <aside className="w-64 xl:w-72 shrink-0 bg-white border border-slate-200 rounded-lg self-start sticky top-[106px] max-h-[calc(100vh-120px)] overflow-y-auto">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 rounded-t-lg">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-green-700" />
          <span className="font-bold text-slate-900 text-sm">Filtre</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-green-700 hover:text-green-900 flex items-center gap-1 font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Resetează
        </button>
      </div>

      <div className="px-4 text-xs text-slate-700">
        {/* Compatibil cu profilul meu */}
        <div className="py-4 border-b border-slate-100">
          <label className="flex items-start gap-2.5 cursor-pointer p-2.5 rounded-lg border border-green-200 bg-green-50">
            <input
              type="checkbox"
              checked={filters.onlyCompatible}
              onChange={() => handleBooleanToggle('onlyCompatible')}
              className="mt-0.5 rounded border-green-300 accent-green-700 w-4 h-4 cursor-pointer"
            />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Compatibil cu profilul meu
              </span>
              <span className="text-[11px] text-green-700 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" />
                Potrivire &gt; 85%
              </span>
            </div>
          </label>
        </div>

        {/* Oraș */}
        <Section title="Oraș">
          <div className="flex flex-col gap-1.5">
            {[
              { label: 'Chișinău (120)', val: 'Chișinău' },
              { label: 'Bălți (7)', val: 'Bălți' },
            ].map(({ label, val }) => (
              <label key={val} className={`flex items-center gap-2 p-2 rounded border cursor-pointer transition ${
                filters.city === val
                  ? 'border-green-400 bg-green-50 font-bold text-slate-900'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="sidebarCity"
                  checked={filters.city === val}
                  onChange={() => setFilters(prev => ({ ...prev, city: val }))}
                  className="accent-green-700 w-3.5 h-3.5"
                />
                <span className="text-xs">{label}</span>
              </label>
            ))}
          </div>
        </Section>

        {/* Zonă */}
        <Section title="Zonă / Sector">
          <div className="grid grid-cols-2 gap-1">
            {DISTRICTS.map((district) => {
              const isChecked = filters.districts?.includes(district) || filters.district === district;
              return (
                <button
                  key={district}
                  type="button"
                  onClick={() => handleCheckboxToggle('districts', district)}
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded border text-xs font-medium transition cursor-pointer text-left ${
                    isChecked
                      ? 'bg-green-50 border-green-400 text-green-800 font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-3.5 h-3.5 rounded border shrink-0 flex items-center justify-center ${
                    isChecked ? 'bg-green-700 border-green-700' : 'border-slate-300'
                  }`}>
                    {isChecked && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                  </div>
                  {district}
                </button>
              );
            })}
          </div>
        </Section>

        {/* Preț maxim */}
        <Section title="Preț maxim / persoană">
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] text-slate-500">Până la:</span>
            <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
              {filters.maxBudget?.toLocaleString('ro-RO')} MDL
            </span>
          </div>
          <input
            type="range"
            min="1500"
            max="10000"
            step="200"
            value={filters.maxBudget}
            onChange={(e) => setFilters(prev => ({ ...prev, maxBudget: Number(e.target.value) }))}
            className="w-full accent-green-700 cursor-pointer h-1.5 bg-slate-200 rounded-full appearance-none"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>1 500</span>
            <span>5 000</span>
            <span>10 000 MDL</span>
          </div>
        </Section>

        {/* Tip locuință */}
        <Section title="Tip locuință">
          <ToggleGroup
            options={['', 'Apartament', 'Casă'].map(v => ({ label: v || 'Toate', val: v }))}
            field="propertyType"
          />
        </Section>

        {/* Persoane sharing */}
        <Section title="Persoane pentru sharing">
          <ToggleGroup
            options={[
              { label: 'Oricare', val: 0 },
              { label: '2 persoane', val: 2 },
              { label: '3 persoane', val: 3 },
            ]}
            field="sharingCapacity"
          />
        </Section>

        {/* Camere */}
        <Section title="Număr camere">
          <ToggleGroup
            options={['', '1+', '2+', '3+'].map(v => ({ label: v || 'Toate', val: v }))}
            field="rooms"
          />
        </Section>

        {/* Dotări */}
        <Section title="Dotări & Facilități">
          <div className="space-y-1.5">
            {[
              { id: 'furnished', label: '🛋️ Mobilat' },
              { id: 'internet', label: '📶 Wi-Fi inclus' },
              { id: 'washingMachine', label: '🫧 Mașină de spălat' },
              { id: 'balcony', label: '🪟 Balcon' },
              { id: 'parking', label: '🚗 Parcare' },
              { id: 'petFriendly', label: '🐾 Animale acceptate' },
              { id: 'smokerFriendly', label: '🚬 Fumat permis' },
            ].map(item => (
              <label key={item.id} className="flex items-center gap-2 py-1 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={Boolean(filters[item.id])}
                  onChange={() => handleBooleanToggle(item.id)}
                  className="rounded border-slate-300 accent-green-700 w-4 h-4 cursor-pointer"
                />
                <span className={`text-xs font-medium ${filters[item.id] ? 'text-green-800 font-bold' : 'text-slate-700'}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </Section>

        {/* Results count */}
        <div className="py-4">
          <div className="text-center text-xs text-slate-500">
            <span className="font-bold text-green-700 text-sm">{totalResults}</span> locuințe găsite
          </div>
        </div>
      </div>
    </aside>
  );
}
