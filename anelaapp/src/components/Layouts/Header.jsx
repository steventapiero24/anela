import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, ShoppingCart, Bell, Search, Settings2 } from 'lucide-react';

const Header = ({ cartCount, appointmentCount, onCartClick, searchQuery, onSearchClick }) => {
  const navigate = useNavigate();

  return (
    <header className="px-6 pt-12 pb-6 space-y-6">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1 text-primary font-bold text-sm hover:text-primary/80 cursor-pointer mb-2"
          aria-label="Volver a landing"
        >
          <ArrowLeft size={16} />
          <span>Volver</span>
        </button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tu ubicación</span>
          <div className="flex items-center gap-1 text-text-dark font-bold">
            <MapPin size={14} className="text-primary" />
            <span>Madrid, España</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {/* Botón Carrito */}
          <button 
            onClick={onCartClick} 
            className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary relative"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Botón Notificaciones */}
          <button className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 relative">
            <Bell size={18} />
            {appointmentCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => onSearchClick?.(e.target.value)}
          placeholder="Busca masajes, faciales..." 
          className="w-full bg-white py-4 pl-12 pr-12 rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-primary/20 font-medium text-sm transition-all"
        />
        <div className="absolute inset-y-0 right-4 flex items-center text-primary">
          <Settings2 size={18} />
        </div>
      </div>
    </header>
  );
};

export default Header;