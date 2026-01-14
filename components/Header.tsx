import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-amber-600 to-blue-800 text-white shadow-lg p-4 z-50 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-white rounded-full w-10 h-10 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm">
          <img 
            src="https://p7.hiclipart.com/preview/838/297/128/computer-icons-check-mark-cross-clip-art-x-thumbnail.jpg" 
            alt="Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-lg md:text-xl font-black tracking-tighter text-white uppercase leading-none">télécharger données topographique Maroc ©</h1>
          <p className="text-[9px] md:text-xs text-amber-100 hidden sm:block mt-1 font-medium">Titres fonciers | Bornes | Zonage | Limites ADM</p>
        </div>
      </div>
      <div className="hidden md:flex space-x-4 text-xs font-bold uppercase tracking-widest">
        <span className="hover:text-amber-200 cursor-pointer">Tableau de bord</span>
        <span className="hover:text-amber-200 cursor-pointer">Cartographie</span>
      </div>
    </header>
  );
};

export default Header;