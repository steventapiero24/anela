import React from 'react';
import { ArrowRight } from 'lucide-react';

const FloatingButton = ({ cart, setStep }) => (
  cart.length > 0 && (
    <div className="fixed bottom-32 right-6 z-[60] animate-in">
      <button 
        onClick={() => setStep('calendar')}
        className="bg-secondary-light  text-primary p-3 rounded-2xl shadow-2xl flex items-center justify-between font-black uppercase tracking-widest text-[11px] cursor-pointer hover:bg-secondary transition-colors hover:scale-[1.02]"
      >
        <div className="flex items-center gap-3">
          <span className="bg-white text-primary w-6 h-6 rounded-full flex items-center justify-center">{cart.length}</span>
          <span>Ir a Reservar</span>
        </div>
        <ArrowRight size={18} />
      </button>
    </div>
  )
);

export default FloatingButton;