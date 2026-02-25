import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  User, 
  CheckCircle, 
  ChevronLeft, 
  Scissors,
  Sparkles,
  Zap,
  Flower2,
  ShoppingCart,
  Plus,
  Search,
  Bell,
  MapPin,
  Star,
  Camera,
  Mail,
  Phone,
  LayoutDashboard,
  LogOut,
  Settings2,
  Heart,
  X,
  RefreshCw,
  Clock,
  ChevronRight,
  Edit3,
  Save,
  Trash2,
  Check,
  ArrowRight
} from 'lucide-react';

const App = () => {
  // --- ESTADOS ---
  const [step, setStep] = useState('home'); 
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [reschedulingId, setReschedulingId] = useState(null);
  
  // Estado para edición de perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    avatar: ""
  });

  // --- DATOS MOCK ---
  const CATEGORIES = [
    { id: 'hair', name: 'Cuidado Capilar', icon: <Scissors size={24} />, bg: 'bg-[#E8F0EA]' },
    { id: 'nails', name: 'Manicura', icon: <Sparkles size={24} />, bg: 'bg-[#F2E8E8]' },
    { id: 'spa', name: 'Masajes', icon: <Flower2 size={24} />, bg: 'bg-[#E8EEF2]' },
    { id: 'facial', name: 'Skin Care', icon: <Zap size={24} />, bg: 'bg-[#F2F2E8]' },
  ];

  const SERVICES = [
    { id: 1, category: 'hair', name: "Corte SilkSculpt", price: 45.00, rating: 4.9, time: '45 min', recommended: true },
    { id: 2, category: 'hair', name: "Tinte Botánico", price: 85.00, rating: 4.8, time: '120 min', recommended: false },
    { id: 3, category: 'facial', name: "Limpieza Profunda", price: 60.00, rating: 5.0, time: '60 min', recommended: true },
    { id: 4, category: 'spa', name: "Aromaterapia", price: 75.00, rating: 4.7, time: '90 min', recommended: true },
  ];

  const AVATARS = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Lilly",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Toby",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna"
  ];

  // --- LÓGICA DE NEGOCIO ---
  const addToCart = (service) => {
    if (!cart.find(i => i.id === service.id)) {
      setCart([...cart, service]);
    }
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter(item => item.id !== id);
    setCart(newCart);
    // Si el carrito se vacía estando en calendario, volvemos a servicios
    if (newCart.length === 0 && step === 'calendar') {
      setStep('services');
    }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    const mockUser = {
      full_name: "Leslie Alexander",
      email: "leslie.alex@example.com",
      phone: "+1 234 567 890",
      avatar: AVATARS[1],
      points: 850
    };
    setUser(mockUser);
    setEditForm({
      full_name: mockUser.full_name,
      email: mockUser.email,
      phone: mockUser.phone,
      avatar: mockUser.avatar
    });
    if (cart.length > 0) saveAppointment();
    else setStep('home');
  };

  const saveAppointment = () => {
    if (reschedulingId) {
      setAppointments(appointments.map(appt => 
        appt.id === reschedulingId 
          ? { ...appt, date: selectedDate, time: selectedTime } 
          : appt
      ));
      setReschedulingId(null);
    } else {
      const newAppt = {
        id: Math.random().toString(36).substr(2, 9),
        services: [...cart],
        date: selectedDate || "24 Feb",
        time: selectedTime || "10:00 AM",
        status: "Confirmado",
        timestamp: new Date().toLocaleDateString()
      };
      setAppointments([newAppt, ...appointments]);
    }
    setStep('confirmation');
    setCart([]);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const cancelAppointment = (id) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const startReschedule = (appt) => {
    setReschedulingId(appt.id);
    setCart(appt.services);
    setSelectedDate(appt.date);
    setSelectedTime(appt.time);
    setStep('calendar');
  };

  const handleSaveProfile = () => {
    setUser({ ...user, ...editForm });
    setIsEditingProfile(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#1A1A1A] font-sans pb-28">
      
      {/* HEADER */}
      {step !== 'profile' && (
        <header className="px-6 pt-12 pb-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tu ubicación</span>
              <div className="flex items-center gap-1 text-[#1A1A1A] font-bold">
                <MapPin size={14} className="text-[#3D5645]" />
                <span>Madrid, España</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => cart.length > 0 && setStep('calendar')} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#3D5645] relative">
                <ShoppingCart size={18} />
                {cart.length > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E6B9A6] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-bounce">{cart.length}</span>}
              </button>
              <button className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 relative">
                <Bell size={18} />
                {appointments.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border-2 border-white"></span>}
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Busca masajes, faciales..." 
              className="w-full bg-white py-4 pl-12 pr-12 rounded-2xl shadow-sm border-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium text-sm transition-all"
            />
            <div className="absolute inset-y-0 right-4 flex items-center text-[#3D5645]">
              <Settings2 size={18} />
            </div>
          </div>
        </header>
      )}

      {/* BOTÓN FLOTANTE "IR A RESERVAR" SI HAY CARRITO */}
      {cart.length > 0 && step !== 'calendar' && step !== 'payment' && step !== 'confirmation' && step !== 'profile' && (
        <div className="fixed bottom-32 left-6 right-6 z-[60] animate-in">
          <button 
            onClick={() => setStep('calendar')}
            className="w-full bg-[#E6B9A6] text-white p-5 rounded-2xl shadow-2xl flex items-center justify-between font-black uppercase tracking-widest text-[11px]"
          >
            <div className="flex items-center gap-3">
              <span className="bg-white text-[#E6B9A6] w-6 h-6 rounded-full flex items-center justify-center">{cart.length}</span>
              <span>Ir a Reservar</span>
            </div>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      <main className={`px-6 space-y-8 animate-in ${step === 'profile' ? 'pt-16' : ''}`}>
        
        {/* HOME VIEW */}
        {step === 'home' && (
          <div className="space-y-8">
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
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => {setSelectedCategory(cat); setStep('services')}} className="flex flex-col items-center gap-3 group">
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
                {SERVICES.filter(s => s.recommended).map(s => (
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
        )}

        {/* SERVICES VIEW */}
        {step === 'services' && (
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
        )}

        {/* CALENDAR VIEW */}
        {step === 'calendar' && (
          <div className="space-y-8 animate-in">
            <div className="flex items-center justify-between">
              <button onClick={() => setStep('services')} className="p-2 bg-white rounded-xl shadow-sm"><ChevronLeft size={20}/></button>
              <h2 className="text-xl font-bold">{reschedulingId ? "Reagendar" : "Finalizar Reserva"}</h2>
              <div className="w-10"></div>
            </div>

            <section className="space-y-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Servicios en tu plan</h3>
                <span className="text-[10px] font-bold bg-[#E6B9A6]/20 text-[#E6B9A6] px-2 py-1 rounded-md">{cart.length} item(s)</span>
              </div>
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100 shadow-sm animate-in">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#F4F4F4] rounded-xl flex items-center justify-center text-[#3D5645]">
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
               <h4 className="font-bold text-sm mb-5 text-[#3D5645]">Selecciona el día</h4>
               <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
                 {["24 Feb", "25 Feb", "26 Feb", "27 Feb", "28 Feb"].map(d => (
                   <button key={d} onClick={() => setSelectedDate(d)} className={`min-w-[70px] py-6 rounded-[1.8rem] border-2 transition-all flex flex-col items-center gap-1 ${selectedDate === d ? 'border-[#3D5645] bg-[#3D5645] text-white shadow-lg' : 'border-gray-50 bg-gray-50 text-gray-400'}`}>
                     <span className="text-[9px] font-bold uppercase tracking-widest">{d.split(' ')[1]}</span>
                     <span className="text-xl font-black">{d.split(' ')[0]}</span>
                   </button>
                 ))}
               </div>
               
               <h4 className="font-bold text-sm mt-8 mb-4 text-[#3D5645]">Horarios disponibles</h4>
               <div className="grid grid-cols-2 gap-3">
                 {["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"].map(t => (
                   <button key={t} onClick={() => setSelectedTime(t)} className={`py-4 rounded-2xl border-2 font-bold text-xs transition-all ${selectedTime === t ? 'border-[#3D5645] bg-[#3D5645]/5 text-[#3D5645]' : 'border-gray-50 text-gray-400'}`}>
                     {t}
                   </button>
                 ))}
               </div>

               <div className="flex flex-col gap-3 mt-10">
                 <button 
                   disabled={!selectedDate || !selectedTime}
                   onClick={() => user ? saveAppointment() : setStep('payment')}
                   className="w-full bg-[#3D5645] text-white py-5 rounded-[1.5rem] font-bold shadow-xl shadow-[#3D5645]/20 disabled:opacity-30 uppercase tracking-widest text-[10px] transition-all hover:scale-[1.02] active:scale-95"
                 >
                   {reschedulingId ? "Confirmar Cambio" : (user ? "Confirmar Reserva" : "Continuar al Pago")}
                 </button>
               </div>
            </div>
          </div>
        )}

        {/* AUTH VIEW */}
        {step === 'payment' && (
          <div className="max-w-md mx-auto pt-10">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
              <h2 className="text-3xl font-black mb-8 italic tracking-tighter text-[#3D5645]">Casi listo</h2>
              <form onSubmit={handleAuth} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Email</label>
                  <input required type="email" placeholder="ejemplo@correo.com" className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Contraseña</label>
                  <input required type="password" placeholder="••••••••" className="w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium" />
                </div>
                <button type="submit" className="w-full bg-[#3D5645] text-white py-5 rounded-[1.5rem] font-bold shadow-xl mt-6 uppercase text-[10px] tracking-widest active:scale-95 transition-all">Ingresar y Agendar</button>
              </form>
            </div>
          </div>
        )}

        {/* CONFIRMATION VIEW */}
        {step === 'confirmation' && (
          <div className="text-center p-12 bg-white rounded-[3.5rem] shadow-xl border border-gray-50 mt-10">
            <div className="w-24 h-24 bg-[#E8F0EA] text-[#3D5645] rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"><CheckCircle size={48}/></div>
            <h2 className="text-2xl font-black mb-3">¡Confirmado!</h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 px-4 leading-relaxed">Tu cita ha sido agendada con éxito.</p>
            <button onClick={() => setStep('home')} className="w-full bg-[#3D5645] text-white py-5 rounded-[1.5rem] font-bold shadow-xl text-[10px] uppercase tracking-widest">Ver mis citas</button>
          </div>
        )}

        {/* PROFILE VIEW */}
        {step === 'profile' && user && (
          <div className="space-y-8 animate-in pb-10">
            <div className="flex flex-col items-center">
              <div className="relative">
                <img src={isEditingProfile ? editForm.avatar : user.avatar} className="w-32 h-32 rounded-[3rem] bg-white shadow-xl p-1 border border-gray-100" alt="Profile" />
                {isEditingProfile && (
                  <div className="absolute -bottom-2 -right-2 bg-[#3D5645] text-white p-2 rounded-xl shadow-lg border-2 border-white">
                    <Check size={16} />
                  </div>
                )}
              </div>
              
              {!isEditingProfile ? (
                <>
                  <h2 className="text-2xl font-black mt-6 tracking-tight">{user.full_name}</h2>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">Cliente VIP</p>
                  <button onClick={() => setIsEditingProfile(true)} className="mt-4 flex items-center gap-2 bg-white px-6 py-2 rounded-xl text-[10px] font-bold text-[#3D5645] shadow-sm border border-gray-100">
                    <Edit3 size={14} /> Editar Perfil
                  </button>
                </>
              ) : (
                <div className="w-full mt-8 space-y-8">
                  <div className="space-y-4">
                    <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Elige tu avatar</p>
                    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-2">
                      {AVATARS.map((url, index) => (
                        <button 
                          key={index} 
                          onClick={() => setEditForm({...editForm, avatar: url})}
                          className={`min-w-[64px] h-16 rounded-2xl overflow-hidden border-4 transition-all ${editForm.avatar === url ? 'border-[#3D5645] scale-110 shadow-lg' : 'border-white opacity-60'}`}
                        >
                          <img src={url} className="w-full h-full bg-gray-50" alt={`Avatar ${index}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 px-4">
                    <input 
                      type="text" 
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                      placeholder="Nombre completo"
                      className="w-full p-4 bg-white rounded-2xl border-none text-center font-bold text-lg shadow-sm"
                    />
                    <div className="flex gap-2">
                      <button onClick={handleSaveProfile} className="flex-1 bg-[#3D5645] text-white py-3 rounded-xl font-bold text-[10px] uppercase flex items-center justify-center gap-2">
                        <Save size={14}/> Guardar Cambios
                      </button>
                      <button onClick={() => {setIsEditingProfile(false); setEditForm({full_name: user.full_name, email: user.email, phone: user.phone, avatar: user.avatar})}} className="px-6 bg-white text-gray-400 py-3 rounded-xl font-bold text-[10px] uppercase border border-gray-100">
                        X
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <section className="space-y-3">
              <h3 className="font-bold text-lg px-2 text-[#3D5645]">Información Personal</h3>
              <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#3D5645] shadow-sm"><Mail size={18}/></div>
                  <div className="flex-1">
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                    {isEditingProfile ? (
                       <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} className="text-xs font-bold bg-transparent border-b border-gray-200 outline-none w-full" />
                    ) : (
                      <p className="text-xs font-bold">{user.email}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#3D5645] shadow-sm"><Phone size={18}/></div>
                  <div className="flex-1">
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Teléfono</p>
                    {isEditingProfile ? (
                       <input type="text" value={editForm.phone} onChange={(e) => setEditForm({...editForm, phone: e.target.value})} className="text-xs font-bold bg-transparent border-b border-gray-200 outline-none w-full" />
                    ) : (
                      <p className="text-xs font-bold">{user.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#3D5645] p-6 rounded-[2.5rem] text-white flex flex-col justify-between aspect-square shadow-xl shadow-[#3D5645]/20">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><CalendarIcon size={20}/></div>
                <div>
                  <p className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Citas Activas</p>
                  <p className="text-3xl font-black">{appointments.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-[2.5rem] flex flex-col justify-between aspect-square shadow-sm border border-gray-100">
                <div className="w-10 h-10 bg-gray-50 text-[#3D5645] rounded-xl flex items-center justify-center"><Heart size={20}/></div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Puntos</p>
                  <p className="text-3xl font-black text-[#3D5645]">{user.points}</p>
                </div>
              </div>
            </div>

            <section className="space-y-4">
              <h3 className="font-bold text-lg text-[#3D5645]">Historial de citas</h3>
              <div className="space-y-4">
                {appointments.length > 0 ? (
                  appointments.map(appt => (
                    <div key={appt.id} className="bg-white p-5 rounded-[2.5rem] border border-gray-50 shadow-sm space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-[#3D5645]">
                            <Clock size={24} />
                          </div>
                          <div>
                            <p className="text-sm font-bold truncate w-40">{appt.services[0]?.name}</p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase">{appt.date} • {appt.time}</p>
                          </div>
                        </div>
                        <span className="w-8 h-8 rounded-full bg-[#E8F0EA] flex items-center justify-center text-[#3D5645]">
                          <CheckCircle size={14} />
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => startReschedule(appt)} className="flex-1 py-3 bg-[#3D5645] text-white rounded-2xl text-[10px] font-bold flex items-center justify-center gap-2">
                          <RefreshCw size={14} /> Reagendar
                        </button>
                        <button onClick={() => cancelAppointment(appt.id)} className="px-5 py-3 bg-red-50 text-red-400 rounded-2xl text-[10px] font-bold">
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Sin actividad reciente</p>
                  </div>
                )}
              </div>
            </section>

            <button onClick={() => {setUser(null); setStep('home'); setIsEditingProfile(false)}} className="w-full py-6 text-red-400 font-bold text-sm flex items-center justify-center gap-2 bg-white rounded-[2rem] shadow-sm border border-red-50">
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        )}

      </main>

      {/* NAV BAR FLOTANTE */}
      <nav className="fixed bottom-8 left-8 right-8 bg-white/80 backdrop-blur-2xl border border-white/50 shadow-[0_25px_60px_rgba(0,0,0,0.1)] rounded-[2.5rem] px-8 py-5 flex justify-between items-center z-50">
        <button onClick={() => setStep('home')} className={`flex flex-col items-center gap-1.5 transition-all ${step === 'home' ? 'text-[#3D5645] scale-110' : 'text-gray-300'}`}>
          <LayoutDashboard size={24} className={step === 'home' ? 'fill-[#3D5645]/10' : ''} />
          <span className={`text-[8px] font-black uppercase tracking-widest ${step === 'home' ? 'opacity-100' : 'opacity-0'}`}>Inicio</span>
        </button>
        <button onClick={() => {setSelectedCategory(null); setStep('services')}} className={`flex flex-col items-center gap-1.5 transition-all ${step === 'services' ? 'text-[#3D5645] scale-110' : 'text-gray-300'}`}>
          <Search size={24} />
          <span className={`text-[8px] font-black uppercase tracking-widest ${step === 'services' ? 'opacity-100' : 'opacity-0'}`}>Explorar</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-gray-300">
          <Heart size={24} />
        </button>
        <button onClick={() => user ? setStep('profile') : setStep('payment')} className={`flex flex-col items-center gap-1.5 transition-all ${(user && step === 'profile') || step === 'payment' ? 'text-[#3D5645] scale-110' : 'text-gray-300'}`}>
          {user ? (
            <img src={user.avatar} className={`w-7 h-7 rounded-xl transition-all ${step === 'profile' ? 'ring-2 ring-[#3D5645] ring-offset-2 shadow-lg scale-110' : ''}`} alt="avatar" />
          ) : (
            <User size={24} />
          )}
          <span className={`text-[8px] font-black uppercase tracking-widest ${step === 'profile' ? 'opacity-100' : 'opacity-0'}`}>Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default App;