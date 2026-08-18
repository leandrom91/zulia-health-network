import React from 'react';
import { Search, MapPin, RefreshCw, Building2 } from 'lucide-react';
import { ClinicType } from '../types';

interface SearchAndIndicatorsProps {
  search: string;
  setSearch: (val: string) => void;
  selectedMunicipality: string;
  setSelectedMunicipality: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
  resetFilters: () => void;
  totalClinicsCount?: number;
}

const MUNICIPALITIES = [
  'ALL',
  'Maracaibo',
  'San Francisco',
  'Cabimas',
  'Lagunillas',
  'Mara',
  'Guajira',
  'Machiques de Perijá',
  'Colón',
  'Baralt',
];

const CLINIC_TYPES: { label: string; value: string }[] = [
  { label: 'Tipo de clínicas (Todos)', value: 'ALL' },
  { label: 'Ambulatorio Urbano I', value: ClinicType.AMBULATORIO_I },
  { label: 'Ambulatorio Urbano II', value: ClinicType.AMBULATORIO_II },
  { label: 'Ambulatorio Urbano III', value: ClinicType.AMBULATORIO_III },
  { label: 'Hospital General', value: ClinicType.HOSPITAL },
  { label: 'Centro Diagnóstico (CDI)', value: ClinicType.CDI },
];

export const SearchAndIndicators: React.FC<SearchAndIndicatorsProps> = ({
  search,
  setSearch,
  selectedMunicipality,
  setSelectedMunicipality,
  selectedType,
  setSelectedType,
  resetFilters,
  totalClinicsCount = 84,
}) => {
  return (
    <section id="busqueda-centros" className="w-full bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-200/90 my-6 scroll-mt-36 sm:scroll-mt-44 md:scroll-mt-52">
      {/* 1. Header Title: BÚSQUEDA DE CLÍNICAS Y CENTROS DE SALUD */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight font-sans">
          BÚSQUEDA DE CLÍNICAS Y CENTROS DE SALUD
        </h2>
        <p className="text-xs md:text-sm text-slate-500 font-semibold mt-1">
          Red Regional de Atención Médica del Estado Zulia
        </p>
      </div>

      {/* 2. Main Search & Interactive Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Side: Selectors & Filters (5 Columns) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Dropdown 1: SELECCIONAR MUNICIPIO */}
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-black uppercase text-slate-700 tracking-wider">
              SELECCIONAR MUNICIPIO
            </label>
            <div className="relative">
              <select
                value={selectedMunicipality}
                onChange={(e) => setSelectedMunicipality(e.target.value)}
                className="w-full p-3 text-sm font-bold bg-white text-slate-800 border-2 border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none shadow-xs appearance-none cursor-pointer pr-10"
              >
                <option value="ALL">Seleccionar municipio</option>
                {MUNICIPALITIES.filter((m) => m !== 'ALL').map((muni) => (
                  <option key={muni} value={muni}>
                    {muni}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-blue-600 font-bold text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Dropdown 2: TIPO DE CLÍNICA */}
          <div className="space-y-2">
            <label className="block text-xs md:text-sm font-black uppercase text-slate-700 tracking-wider">
              TIPO DE CLÍNICA
            </label>
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-3 text-sm font-bold bg-white text-slate-800 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none shadow-xs appearance-none cursor-pointer pr-10"
              >
                {CLINIC_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 font-bold text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Text Input Search by Name/Sector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs md:text-sm font-black uppercase text-slate-700 tracking-wider">
                BÚSQUEDA POR NOMBRE O SECTOR
              </label>
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="text-[11px] text-red-600 font-bold hover:underline"
                >
                  Borrar texto
                </button>
              )}
            </div>
            <div className="relative">
              <Search className="w-5 h-5 text-blue-600 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ej: Corito, La Victoria, Sabaneta, San Francisco..."
                className="w-full pl-11 pr-10 py-3 text-sm font-bold bg-white text-slate-900 border-2 border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-blue-600 focus:outline-none shadow-xs transition-all placeholder:text-slate-400 font-sans"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center text-xs font-black transition-colors"
                  title="Limpiar búsqueda"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Sector Tags for Instant Filtering */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider mr-1">
                Sectores clave:
              </span>
              {[
                { label: '⭐ Corito 1', query: 'Corito' },
                { label: 'La Victoria', query: 'La Victoria' },
                { label: 'Sabaneta', query: 'Sabaneta' },
                { label: 'San Francisco', query: 'San Francisco' },
              ].map((chip) => (
                <button
                  key={chip.query}
                  type="button"
                  onClick={() => setSearch(search === chip.query ? '' : chip.query)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all ${
                    search === chip.query
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-700 border-slate-200 hover:border-blue-300'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={resetFilters}
              className="text-xs text-blue-700 font-extrabold hover:text-blue-900 flex items-center gap-1.5 transition-colors uppercase tracking-wider bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Limpiar Filtros
            </button>

            <span className="text-xs text-slate-500 font-bold">
              {search ? (
                <span className="text-blue-700 font-extrabold">Filtrando por: "{search}"</span>
              ) : (
                'Mostrando centros activos en Zulia'
              )}
            </span>
          </div>

        </div>

        {/* Right Side: Zulia Map Graphic & 84 CLÍNICAS Starburst Badge (HIDDEN on Mobile < lg) */}
        <div className="hidden lg:flex lg:col-span-6 relative items-center justify-center bg-blue-50/50 p-6 rounded-2xl border border-blue-100 min-h-[340px]">
          
          {/* Exact Zulia Map Graphic Image with Overlay Pins */}
          <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center">
            
            {/* User Provided Official Zulia Silhouette Map */}
            <img
              src="/mapa-zulia.png"
              alt="Mapa Oficial del Estado Zulia"
              className="w-full h-full object-contain filter drop-shadow-md"
            />

            {/* Overlay Red Location Pins across Zulia Municipalities */}
            {/* Maracaibo / San Francisco */}
            <div className="absolute top-[34%] left-[45%] group cursor-pointer -translate-x-1/2 -translate-y-1/2" title="Maracaibo / San Francisco">
              <span className="absolute -inset-2 rounded-full bg-red-600/40 animate-ping" />
              <div className="w-5 h-5 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center relative">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>

            {/* Cabimas / Costa Oriental */}
            <div className="absolute top-[36%] left-[75%] group cursor-pointer -translate-x-1/2 -translate-y-1/2" title="Cabimas / Costa Oriental">
              <span className="absolute -inset-2 rounded-full bg-red-600/40 animate-ping" />
              <div className="w-5 h-5 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center relative">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>

            {/* Lagunillas / Ciudad Ojeda */}
            <div className="absolute top-[48%] left-[82%] group cursor-pointer -translate-x-1/2 -translate-y-1/2" title="Lagunillas">
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <span className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Mara / El Moán */}
            <div className="absolute top-[22%] left-[42%] group cursor-pointer -translate-x-1/2 -translate-y-1/2" title="Mara">
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <span className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Guajira Peninsula */}
            <div className="absolute top-[7%] left-[62%] group cursor-pointer -translate-x-1/2 -translate-y-1/2" title="Guajira">
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <span className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Machiques / Perijá */}
            <div className="absolute top-[60%] left-[28%] group cursor-pointer -translate-x-1/2 -translate-y-1/2" title="Machiques de Perijá">
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <span className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Colón / Sur del Lago */}
            <div className="absolute top-[85%] left-[42%] group cursor-pointer -translate-x-1/2 -translate-y-1/2" title="Sur del Lago / Colón">
              <span className="absolute -inset-2 rounded-full bg-red-600/40 animate-ping" />
              <div className="w-5 h-5 bg-red-600 rounded-full border-2 border-white shadow-lg flex items-center justify-center relative">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>

            {/* Baralt / Mene Grande */}
            <div className="absolute top-[66%] left-[84%] group cursor-pointer -translate-x-1/2 -translate-y-1/2" title="Baralt">
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <span className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>

            {/* Villa del Rosario */}
            <div className="absolute top-[48%] left-[32%] group cursor-pointer -translate-x-1/2 -translate-y-1/2" title="Rosario de Perijá">
              <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-md flex items-center justify-center">
                <span className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>

          </div>

          {/* Badge: 84 CLÍNICAS (Dark Blue Starburst Emblem) */}
          <div className="absolute top-4 right-4 bg-[#002868] text-white w-20 h-20 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center p-2 text-center shadow-2xl border-4 border-white font-sans ring-4 ring-blue-900/30 transition-transform hover:scale-110">
            <span className="text-xl md:text-2xl font-black leading-none text-white">
              {totalClinicsCount}
            </span>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-amber-300 mt-0.5">
              CLÍNICAS
            </span>
          </div>

        </div>

      </div>
    </section>
  );
};
