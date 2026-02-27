import React from 'react';
import { ChevronLeft, Star, Plus, Check } from 'lucide-react';

const ServicesView = ({ setStep, selectedCategory, SERVICES, cart, addToCart }) => (
  <div className="space-y-6">
    <button onClick={() => setStep('home')} className="flex items-center gap-2 text-[#3D5645] font-bold text-sm">
      <ChevronLeft size={20} /> Volver
    </button>
    <h2 className="text-2xl font-bold">{selectedCategory?.name || "Todos los Servicios"}</h2>
    <div className="space-y-4">
      {SERVICES.filter(s => !selectedCategory || s.category === selectedCategory?.id).map(s => (
        <div key={s.id} className="bg-white p-4 rounded-[2rem] shadow-sm flex items-center gap-4 border border-gray-50">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden">
            <img src={`https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=150&id=${s.id}`} className="w-full h-full object-cover" alt={s.name} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm">{s.name}</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase">{s.time} • Experto</p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={10} className="fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] font-bold text-gray-500">{s.rating}</span>
            </div>
          </div>
          <button 
            onClick={() => addToCart(s)}
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all ${cart.find(i => i.id === s.id) ? 'bg-[#E8F0EA] text-[#3D5645]' : 'bg-[#3D5645] text-white'}`}
          >
            {cart.find(i => i.id === s.id) ? <Check size={20}/> : <Plus size={20}/>}
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default ServicesView;