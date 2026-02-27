import React from 'react';
import { 
  Calendar as CalendarIcon, 
  Scissors, 
  Sparkles, 
  Flower2, 
  Zap, 
  Check, 
  Plus, 
  RefreshCw, 
  X 
} from 'lucide-react';

const HomeView = ({ 
  appointments, 
  categories, 
  services, 
  cart, 
  setStep, 
  setSelectedCategory, 
  addToCart, 
  startReschedule, 
  cancelAppointment 
}) => {
  return (
    <div className="space-y-8">
      {/* HERO / OFERTA EXCLUSIVA */}
      <div className="bg-[#3D5645] rounded-[2.5rem] p-8 text-white flex justify-between items-center relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-4 max-w-[60%]">
          <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Oferta Exclusiva</span>
          <h2 className="text-2xl font-bold leading-tight">Tu piel merece lo <span className="text-[#E6B9A6]">mejor</span></h2>
          <button onClick={() => setStep('services')} className="bg-white text-[#3D5645] px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg">Descubrir</button>
        </div>
        <img src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=400" className="absolute right-0 top-0 h-full w-1/3 object-cover opacity-30" alt="Spa hero" />
      </div>

      {/* CITAS ACTIVAS */}
      {appointments.length > 0 && (
        <section className="animate-in">
          <div className="flex justify-between items-center mb-5 px-1">
            <h3 className="text-lg font-bold tracking-tight">Tus próximas citas</h3>
            <button onClick={() => setStep('profile')} className="text-xs font-bold text-[#3D5645]">Ver todas</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {appointments.map(appt => (
              <div key={appt.id} className="min-w-[300px] bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-5">
                <div className="flex justify-between items-start border-b border-gray-50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#3D5645] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#3D5645]/10">
                      <CalendarIcon size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[#3D5645]">{appt.date}</h4>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{appt.time}</p>
                    </div>
                  </div>
                  <span className="bg-[#E8F0EA] text-[#3D5645] px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-tighter">Confirmado</span>
                </div>
                <div className="space-y-3">
                  <p className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Servicios contratados</p>
                  <div className="space-y-2">
                    {appt.services.map(srv => (
                      <div key={srv.id} className="flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#E6B9A6] group-hover:scale-125 transition-transform" />
                          <span className="text-[11px] font-bold text-gray-600">{srv.name}</span>
                        </div>
                        <span className="text-[10px] font-medium text-gray-400">{srv.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => startReschedule(appt)}
                    className="flex-1 py-3.5 bg-gray-50 text-[#3D5645] rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-95 transition-all uppercase tracking-widest"
                  >
                    <RefreshCw size={12} /> Reagendar
                  </button>
                  <button 
                    onClick={() => cancelAppointment(appt.id)}
                    className="w-12 h-12 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center hover:bg-red-100 active:scale-95 transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CATEGORÍAS */}
      <section>
        <h3 className="text-lg font-bold mb-5">Categorías</h3>
        <div className="flex justify-between">
          {categories.map(cat => (
            <button 
              key={cat.id} 
              onClick={() => {setSelectedCategory(cat); setStep('services')}} 
              className="flex flex-col items-center gap-3 group"
            >
              <div className={`w-16 h-16 ${cat.bg} rounded-full flex items-center justify-center text-[#3D5645] shadow-sm group-active:scale-90 transition-transform`}>
                {cat.icon}
              </div>
              <span className="text-[11px] font-bold text-gray-500">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* RECOMENDADOS */}
      <section className="space-y-5">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Recomendados</h3>
          <button className="text-[11px] font-bold text-[#3D5645]">Ver todos</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {services.filter(s => s.recommended).map(s => (
            <div key={s.id} className="min-w-[200px] bg-white rounded-[2rem] p-4 shadow-sm border border-gray-50 space-y-3">
              <div className="relative">
                 <img src={`https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&q=80&w=200&id=${s.id}`} className="w-full h-32 object-cover rounded-2xl" alt={s.name} />
                 <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-bold text-[#3D5645]">★ {s.rating}</span>
              </div>
              <div>
                <h4 className="font-bold text-xs truncate">{s.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase">{s.time}</p>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#3D5645] text-sm">${s.price}</span>
                <button 
                  onClick={() => addToCart(s)} 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${cart.find(i => i.id === s.id) ? 'bg-[#E8F0EA] text-[#3D5645]' : 'bg-gray-50 text-gray-400'}`}
                >
                  {cart.find(i => i.id === s.id) ? <Check size={18}/> : <Plus size={18}/>}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomeView;