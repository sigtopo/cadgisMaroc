import React, { useState } from 'react';
import { ProvinceData } from '../types';
import { REGIONS_LIST } from '../constants';

interface SidebarProps {
  provinces: ProvinceData[];
  onSelect: (name: string | null) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  regionFilter: string;
  setRegionFilter: (val: string) => void;
  selectedProvince: string | null;
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  provinces, 
  onSelect, 
  searchTerm, 
  setSearchTerm, 
  regionFilter, 
  setRegionFilter, 
  selectedProvince
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  return (
    <>
      <aside className="hidden md:flex flex-col w-80 bg-white border-r border-slate-200 h-full transition-all duration-300 shadow-2xl z-30">
        <div className="p-5 space-y-4 flex-shrink-0 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-xs font-black text-slate-800 flex items-center uppercase tracking-widest">
            <i className="fas fa-map-marked-alt mr-2 text-blue-600"></i>
            Explorateur Territorial
          </h2>
          <div className="space-y-3">
            <div className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher une province..."
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm"
              />
              <i className="fas fa-search absolute left-3.5 top-3.5 text-slate-400 text-[10px] group-focus-within:text-blue-500 transition-colors"></i>
            </div>
            <div className="relative">
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-sm cursor-pointer"
              >
                <option value="">Toutes les régions</option>
                {REGIONS_LIST.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              <i className="fas fa-chevron-down absolute right-3 top-3.5 text-slate-400 pointer-events-none text-[10px]"></i>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          <div className="divide-y divide-slate-50">
            {provinces.length > 0 ? provinces.map((p) => (
              <button 
                key={p.nomFr}
                onClick={() => onSelect(selectedProvince === p.nomFr ? null : p.nomFr)}
                className={`w-full text-left px-5 py-3.5 transition-all flex items-center justify-between group ${selectedProvince === p.nomFr ? 'bg-blue-600 text-white shadow-inner' : 'hover:bg-slate-50'}`}
              >
                <div className="flex-1">
                  <div className={`text-[11px] font-black uppercase tracking-tight ${selectedProvince === p.nomFr ? 'text-white' : 'text-slate-800 group-hover:text-blue-700'}`}>{p.nomFr}</div>
                  <div className={`text-[9px] mt-0.5 font-bold uppercase ${selectedProvince === p.nomFr ? 'text-blue-100' : 'text-slate-400'}`}>
                    {p.region.split('. ')[1] || p.region}
                  </div>
                </div>
                <div className="ml-3">
                  {p.downloadUrl ? (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedProvince === p.nomFr ? 'bg-white/20' : 'bg-emerald-50'}`}>
                      <i className={`fas fa-check-double ${selectedProvince === p.nomFr ? 'text-white' : 'text-emerald-500'} text-[9px]`}></i>
                    </div>
                  ) : (
                    <i className={`fas fa-lock opacity-20 text-[9px] ${selectedProvince === p.nomFr ? 'text-white' : 'text-slate-300'}`}></i>
                  )}
                </div>
              </button>
            )) : (
              <div className="p-10 text-center space-y-3">
                <i className="fas fa-search-minus text-slate-200 text-3xl"></i>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aucun résultat trouvé</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <button 
        onClick={() => setIsMobileDrawerOpen(true)}
        className="md:hidden fixed top-24 left-4 z-[450] w-12 h-12 bg-white/90 backdrop-blur-md text-blue-600 rounded-2xl shadow-xl flex flex-col items-center justify-center active:scale-95 transition-all border border-slate-100"
      >
        <i className="fas fa-list-ul text-lg"></i>
        <span className="text-[7px] font-black mt-0.5 uppercase">Liste</span>
      </button>

      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000] animate-in fade-in duration-300" onClick={() => setIsMobileDrawerOpen(false)}>
          <div className="absolute top-0 left-0 h-full w-[85%] max-w-[320px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-left duration-500" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <span className="font-black text-blue-900 text-sm uppercase tracking-tighter">Provinces du Maroc</span>
              <button onClick={() => setIsMobileDrawerOpen(false)} className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shadow-sm">
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>
            
            <div className="p-4 space-y-2 border-b border-slate-50">
               <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Chercher..."
                className="w-full px-4 py-3 bg-slate-100 border-none rounded-xl text-xs font-bold outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-3">
              <div className="space-y-1">
                {provinces.map((p) => (
                  <button
                    key={p.nomFr}
                    onClick={() => { onSelect(p.nomFr); setIsMobileDrawerOpen(false); }}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all ${selectedProvince === p.nomFr ? 'bg-blue-600 text-white shadow-lg' : 'bg-white active:bg-slate-50'}`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className={`text-[12px] font-black uppercase truncate ${selectedProvince === p.nomFr ? 'text-white' : 'text-slate-800'}`}>{p.nomFr}</div>
                      <div className={`text-[9px] font-bold opacity-70 ${selectedProvince === p.nomFr ? 'text-blue-100' : 'text-slate-400'}`}>{p.region.split('. ')[1]}</div>
                    </div>
                    {p.downloadUrl && <i className="fas fa-check-circle text-[10px] ml-2"></i>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;