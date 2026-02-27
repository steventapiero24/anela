import React from 'react';
import { LayoutDashboard, Search, Heart, User } from 'lucide-react';

const Navbar = ({ currentStep, setStep, user }) => {
  return (
    <nav className="fixed bottom-8 left-8 right-8 bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_25px_60px_rgba(0,0,0,0.1)] rounded-[2.5rem] px-8 py-5 flex justify-between items-center z-50">
      {/* Inicio */}
      <button 
        onClick={() => setStep('home')} 
        className={`flex flex-col items-center gap-1.5 transition-all ${currentStep === 'home' ? 'text-[#3D5645] scale-110' : 'text-gray-300'}`}
      >
        <LayoutDashboard size={24} className={currentStep === 'home' ? 'fill-[#3D5645]/10' : ''} />
        <span className={`text-[8px] font-black uppercase tracking-widest ${currentStep === 'home' ? 'opacity-100' : 'opacity-0'}`}>Inicio</span>
      </button>

      {/* Explorar */}
      <button 
        onClick={() => { setStep('services'); }} 
        className={`flex flex-col items-center gap-1.5 transition-all ${currentStep === 'services' ? 'text-[#3D5645] scale-110' : 'text-gray-300'}`}
      >
        <Search size={24} />
        <span className={`text-[8px] font-black uppercase tracking-widest ${currentStep === 'services' ? 'opacity-100' : 'opacity-0'}`}>Explorar</span>
      </button>

      {/* Favoritos (Placeholder) */}
      <button className="flex flex-col items-center gap-1.5 text-gray-300">
        <Heart size={24} />
      </button>

      {/* Perfil / Login */}
      <button 
        onClick={() => user ? setStep('profile') : setStep('payment')} 
        className={`flex flex-col items-center gap-1.5 transition-all ${(user && currentStep === 'profile') || currentStep === 'payment' ? 'text-[#3D5645] scale-110' : 'text-gray-300'}`}
      >
        {user ? (
          <img 
            src={user.avatar} 
            className={`w-7 h-7 rounded-xl transition-all ${currentStep === 'profile' ? 'ring-2 ring-[#3D5645] ring-offset-2 shadow-lg scale-110' : ''}`} 
            alt="avatar" 
          />
        ) : (
          <User size={24} />
        )}
        <span className={`text-[8px] font-black uppercase tracking-widest ${currentStep === 'profile' ? 'opacity-100' : 'opacity-0'}`}>Perfil</span>
      </button>
    </nav>
  );
};

export default Navbar;