import React from 'react';
import { LayoutDashboard, Search, Heart, User, ShieldCheck } from 'lucide-react';

const NavBar = ({ step, setStep, user, setSelectedCategory, isAdmin }) => (
  <nav className="fixed bottom-8 left-8 right-8 bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_25px_60px_rgba(0,0,0,0.1)] rounded-[2.5rem] px-8 py-5 flex justify-between items-center z-50">
    {!isAdmin && (
      <>
        <button onClick={() => setStep('home')} className={`flex flex-col items-center gap-1.5 transition-all ${step === 'home' ? 'text-primary scale-110' : 'text-gray-300'}`}>
          <LayoutDashboard size={24} className={step === 'home' ? 'fill-primary/10' : ''} />
          <span className={`text-[8px] font-black uppercase tracking-widest ${step === 'home' ? 'opacity-100' : 'opacity-0'}`}>Inicio</span>
        </button>
        <button onClick={() => {setSelectedCategory(null); setStep('services')}} className={`flex flex-col items-center gap-1.5 transition-all ${step === 'services' ? 'text-primary scale-110' : 'text-gray-300'}`}>
          <Search size={24} />
          <span className={`text-[8px] font-black uppercase tracking-widest ${step === 'services' ? 'opacity-100' : 'opacity-0'}`}>Explorar</span>
        </button>
      </>
    )}

    <button className="flex flex-col items-center gap-1.5 text-gray-300">
      <Heart size={24} />
    </button>
    {isAdmin && (
      <button onClick={() => setStep('admin')} className={`flex flex-col items-center gap-1.5 transition-all ${step === 'admin' ? 'text-primary scale-110' : 'text-gray-300'}`}>
        <ShieldCheck size={24} />
        <span className={`text-[8px] font-black uppercase tracking-widest ${step === 'admin' ? 'opacity-100' : 'opacity-0'}`}>Admin</span>
      </button>
    )}
    <button onClick={() => user ? setStep('profile') : setStep('payment')} className={`flex flex-col items-center gap-1.5 transition-all ${(user && step === 'profile') || step === 'payment' ? 'text-primary scale-110' : 'text-gray-300'}`}>
      {user ? (
        <img src={user.avatar} className={`w-7 h-7 rounded-xl transition-all ${step === 'profile' ? 'ring-2 ring-primary ring-offset-2 shadow-lg scale-110' : ''}`} alt="avatar" />
      ) : (
        <User size={24} />
      )}
      <span className={`text-[8px] font-black uppercase tracking-widest ${step === 'profile' ? 'opacity-100' : 'opacity-0'}`}>Perfil</span>
    </button>
  </nav>
);

export default NavBar;