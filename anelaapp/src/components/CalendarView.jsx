import React from 'react';
import { ChevronLeft, Trash2, Sparkles, Scissors, Flower2, Zap } from 'lucide-react';

const CalendarView = ({ setStep, cart, removeFromCart, CATEGORIES, selectedDate, setSelectedDate, selectedTime, setSelectedTime, user, saveAppointment, reschedulingId }) => (
  <div className="space-y-8 animate-in">
    <div className="flex items-center justify-between">
      <button onClick={() => setStep('services')} className="p-2 bg-white rounded-xl shadow-sm"><ChevronLeft size={20}/></button>
      <h2 className="text-xl font-bold">{reschedulingId ? "Reagendar" : "Finalizar Reserva"}</h2>
      <div className="w-10"></div>
    </div>

    <section className="space-y-4">
      <div className="flex justify-between items-center px-2">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Servicios en tu plan</h3>
        <span className="text-[10px] font-bold bg-secondary/20 text-secondary px-2 py-1 rounded-md">{cart.length} item(s)</span>
      </div>
      <div className="space-y-2">
        {cart.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100 shadow-sm animate-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-bg-default rounded-xl flex items-center justify-center text-primary">
                {CATEGORIES.find(c => c.id === item.category)?.icon || <Sparkles size={18}/>}
              </div>
              <div>
                <h4 className="font-bold text-[12px]">{item.name}</h4>
                <p className="text-[9px] text-gray-400 font-bold uppercase">{item.time} • ${item.price}</p>
              </div>
            </div>
            <button onClick={() => removeFromCart(item.id)} className="text-red-300 hover:text-red-500 p-2 transition-colors">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
    
    <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100">
       <h4 className="font-bold text-sm mb-5 text-primary">Selecciona el día</h4>
       <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
         {["24 Feb", "25 Feb", "26 Feb", "27 Feb", "28 Feb"].map(d => (
           <button key={d} onClick={() => setSelectedDate(d)} className={`min-w-[70px] py-6 rounded-[1.8rem] border-2 transition-all flex flex-col items-center gap-1 ${selectedDate === d ? 'border-primary bg-primary text-white shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
             <span className="text-[9px] font-bold uppercase tracking-widest">{d.split(' ')[1]}</span>
             <span className="text-xl font-black">{d.split(' ')[0]}</span>
           </button>
         ))}
       </div>
       
       <h4 className="font-bold text-sm mt-8 mb-4 text-primary">Horarios disponibles</h4>
       <div className="grid grid-cols-2 gap-3">
         {["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"].map(t => (
           <button key={t} onClick={() => setSelectedTime(t)} className={`py-4 rounded-2xl border-2 font-bold text-xs transition-all ${selectedTime === t ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 text-gray-400'}`}>
             {t}
           </button>
         ))}
       </div>

       <div className="flex flex-col gap-3 mt-10">
         <button 
           disabled={!selectedDate || !selectedTime}
           onClick={() => {
             if (reschedulingId) {
               // directly save updated date/time without going through payment
               saveAppointment();
             } else {
               setStep('payment');
             }
           }}
           className="w-full bg-primary text-white py-5 rounded-3xl font-bold shadow-xl disabled:opacity-30 uppercase tracking-widest text-[10px] transition-all cursor-pointer"
         >
           {reschedulingId ? 'Guardar cambios' : 'Ir a Pago'}
         </button>
       </div>
    </div>
  </div>
);

export default CalendarView;