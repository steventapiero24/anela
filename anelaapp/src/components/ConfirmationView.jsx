import React from 'react';
import { CheckCircle } from 'lucide-react';

const ConfirmationView = ({ setStep }) => (
  <div className="text-center p-12 bg-white rounded-[3.5rem] shadow-xl border border-gray-50 mt-10">
    <div className="w-24 h-24 bg-[#E8F0EA] text-[#3D5645] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><CheckCircle size={48}/></div>
    <h2 className="text-2xl font-black mb-3">¡Confirmado!</h2>
    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 px-4 leading-relaxed">Tu cita ha sido agendada con éxito.</p>
    <button onClick={() => setStep('home')} className="w-full bg-[#3D5645] text-white py-5 rounded-[1.5rem] font-bold shadow-xl text-[10px] uppercase tracking-widest">Ver mis citas</button>
  </div>
);

export default ConfirmationView;