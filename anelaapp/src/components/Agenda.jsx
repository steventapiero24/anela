import React, { useState, useEffect } from 'react';
import { Scissors, Sparkles, Flower2, Zap } from 'lucide-react';
import Header from './Header';
import FloatingButton from './FloatingButton';
import HomeView from './HomeView';
import ServicesView from './ServicesView';
import CalendarView from './CalendarView';
import PaymentView from './PaymentView';
import ConfirmationView from './ConfirmationView';
import ProfileView from './ProfileView';
import NavBar from './NavBar';

// supabase helpers
import {
  supabase,
  signIn,
  signUp,
  signOut,
  getUserProfile,
  upsertProfile,
  fetchAppointments,
  addAppointment as dbAddAppointment,
  updateAppointment as dbUpdateAppointment,
  deleteAppointment as dbDeleteAppointment,
  getCurrentSession,
} from '../lib/supabaseClient';

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

  // persistencia de sesion
  useEffect(() => {
    const init = async () => {
      try {
        const sessionUser = await getCurrentSession();
        if (sessionUser) {
          // sessionUser may be full profile or just user object
          const id = sessionUser.id || sessionUser.user?.id || sessionUser.uid;
          const profile = await getUserProfile(id);
          const userObj = profile || sessionUser;
          setUser(userObj);
          setEditForm({
            full_name: userObj.full_name || '',
            email: userObj.email || sessionUser.email || '',
            phone: userObj.phone || '',
            avatar: userObj.avatar || AVATARS[1],
          });
          const appts = await fetchAppointments(id);
          setAppointments(appts || []);
        }
      } catch (err) {
        console.error('init session error', err);
      }
    };
    init();

    // we don't need to listen for auth state changes here;
    // session persistence is handled by getCurrentSession on mount.
    // returning noop cleanup
    return () => {}
  }, []);

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

  const handleAuth = async (mode, formData) => {
    // mode = 'login' | 'signup'
    try {
      let authUser;
      if (mode === 'login') {
        authUser = await signIn({ email: formData.email, password: formData.password });
      } else if (mode === 'signup') {
        authUser = await signUp({ email: formData.email, password: formData.password });
        // create profile immediately
        const profile = {
          id: authUser.id,
          email: formData.email,
          full_name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          avatar: AVATARS[1],
          points: 0,
        };
        await upsertProfile(profile);
      }

      // fetch profile and appointments
      const profile = await getUserProfile(authUser.id);
      const userObj = profile || { id: authUser.id, email: authUser.email };

      setUser(userObj);
      setEditForm({
        full_name: userObj.full_name || '',
        email: userObj.email || authUser.email,
        phone: userObj.phone || '',
        avatar: userObj.avatar || AVATARS[1],
      });

      const appts = await fetchAppointments(authUser.id);
      setAppointments(appts || []);

      if (cart.length > 0) await saveAppointment();
      else setStep('home');
    } catch (err) {
      console.error('auth error:', err.message || err);
      throw err;
    }
  };

  const saveAppointment = async () => {
    if (!user) return;

    if (reschedulingId) {
      try {
        await dbUpdateAppointment(reschedulingId, {
          date: selectedDate,
          time: selectedTime,
        });
        setAppointments(appointments.map(appt =>
          appt.id === reschedulingId
            ? { ...appt, date: selectedDate, time: selectedTime }
            : appt
        ));
        setReschedulingId(null);
      } catch (err) {
        console.error('update appt error', err);
      }
    } else {
      const payload = {
        user_id: user.id,
        services: cart,
        date: selectedDate || "24 Feb",
        time: selectedTime || "10:00 AM",
        status: "Confirmado",
        timestamp: new Date().toLocaleDateString()
      };
      try {
        const inserted = await dbAddAppointment(payload);
        setAppointments([inserted, ...appointments]);
      } catch (err) {
        console.error('add appt error', err);
      }
    }

    setStep('confirmation');
    setCart([]);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const cancelAppointment = async (id) => {
    setAppointments(appointments.filter(a => a.id !== id));
    try {
      await dbDeleteAppointment(id);
    } catch (err) {
      console.error('delete appt error', err);
    }
  };

  const startReschedule = (appt) => {
    setReschedulingId(appt.id);
    setCart(appt.services);
    setSelectedDate(appt.date);
    setSelectedTime(appt.time);
    setStep('calendar');
  };

  const handleSaveProfile = async () => {
    const updated = { ...user, ...editForm };
    setUser(updated);
    setIsEditingProfile(false);
    try {
      await upsertProfile({
        id: user.id,
        full_name: updated.full_name,
        email: updated.email,
        phone: updated.phone,
        avatar: updated.avatar,
        points: updated.points || 0,
      });
    } catch (err) {
      console.error('save profile error', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('supabase signOut error', err);
    }
    setUser(null);
    setStep('home');
    setIsEditingProfile(false);
    setAppointments([]);
    setCart([]);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#1A1A1A] font-sans pb-28">
      
      {/* HEADER */}
      {step !== 'profile' && <Header cart={cart} appointments={appointments} setStep={setStep} />}

      {/* BOTÓN FLOTANTE "IR A RESERVAR" SI HAY CARRITO */}
      <FloatingButton cart={cart} setStep={setStep} />

      <main className={`px-6 space-y-8 animate-in ${step === 'profile' ? 'pt-16' : ''}`}>
        
        {/* HOME VIEW */}
        {step === 'home' && <HomeView appointments={appointments} setStep={setStep} CATEGORIES={CATEGORIES} SERVICES={SERVICES} cart={cart} addToCart={addToCart} startReschedule={startReschedule} cancelAppointment={cancelAppointment} setSelectedCategory={setSelectedCategory} />}

        {/* SERVICES VIEW */}
        {step === 'services' && <ServicesView setStep={setStep} selectedCategory={selectedCategory} SERVICES={SERVICES} cart={cart} addToCart={addToCart} />}

        {/* CALENDAR VIEW */}
        {step === 'calendar' && <CalendarView setStep={setStep} cart={cart} removeFromCart={removeFromCart} CATEGORIES={CATEGORIES} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} user={user} saveAppointment={saveAppointment} reschedulingId={reschedulingId} />}

        {/* AUTH VIEW */}
        {step === 'payment' && <PaymentView handleAuth={handleAuth} />}

        {/* CONFIRMATION VIEW */}
        {step === 'confirmation' && <ConfirmationView setStep={setStep} />}

        {/* PROFILE VIEW */}
        {step === 'profile' && user && <ProfileView user={user} setUser={setUser} setStep={setStep} isEditingProfile={isEditingProfile} setIsEditingProfile={setIsEditingProfile} editForm={editForm} setEditForm={setEditForm} handleSaveProfile={handleSaveProfile} appointments={appointments} startReschedule={startReschedule} cancelAppointment={cancelAppointment} AVATARS={AVATARS} handleLogout={handleLogout} />}

      </main>

      {/* NAV BAR FLOTANTE */}
      <NavBar step={step} setStep={setStep} user={user} setSelectedCategory={setSelectedCategory} />
    </div>
  );
};

export default App;