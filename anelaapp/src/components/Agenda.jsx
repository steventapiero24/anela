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

  const handleAuth = (formData) => {
    // Aceptar datos del formulario (login, signup, o evento del formulario antiguo)
    const firstName = formData?.firstName || '';
    const lastName = formData?.lastName || '';
    const email = formData?.email || 'user@example.com';
    const phone = formData?.phone || '+1 234 567 890';
    
    const fullName = (firstName && lastName) 
      ? `${firstName} ${lastName}`.trim()
      : "Leslie Alexander";

    const mockUser = {
      full_name: fullName,
      email: email,
      phone: phone,
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
        {step === 'profile' && user && <ProfileView user={user} setUser={setUser} setStep={setStep} isEditingProfile={isEditingProfile} setIsEditingProfile={setIsEditingProfile} editForm={editForm} setEditForm={setEditForm} handleSaveProfile={handleSaveProfile} appointments={appointments} startReschedule={startReschedule} cancelAppointment={cancelAppointment} AVATARS={AVATARS} />}

      </main>

      {/* NAV BAR FLOTANTE */}
      <NavBar step={step} setStep={setStep} user={user} setSelectedCategory={setSelectedCategory} />
    </div>
  );
};

export default App;