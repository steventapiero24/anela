import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, Hand, TextAlignStart,  Footprints, CircleFadingPlus } from 'lucide-react';
import Header from './Layouts/Header';
import FloatingButton from './FloatingButton';
import HomeView from './HomeView';
import ServicesView from './ServicesView';
import CalendarView from './CalendarView';
import PaymentView from './PaymentView';
import ConfirmationView from './ConfirmationView';
import ProfileView from './ProfileView';
import AdminView from './AdminView';
import NavBar from './NavBar';

// supabase helpers
import {
  signIn,
  signUp,
  signOut,
  getUserProfile,
  upsertProfile,
  fetchAppointments,
  fetchAllAppointments,
  addAppointment as dbAddAppointment,
  updateAppointment as dbUpdateAppointment,
  deleteAppointment as dbDeleteAppointment,
  initializeSession,
  supabase,
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
  const [adminAppointments, setAdminAppointments] = useState([]);
  const [reschedulingId, setReschedulingId] = useState(null);

  // tarjetas guardadas (por usuario)
  const [savedCards, setSavedCards] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      const stored = localStorage.getItem(`cards_${user.id}`);
      if (stored) setSavedCards(JSON.parse(stored));
    }
  }, [user]);

  const addSavedCard = (card) => {
    if (!user || !user.id) return;
    // solo almacenar si no existe una tarjeta con los mismos 4 últimos
    const last4 = card.number.slice(-4);
    if (savedCards.find(c => c.last4 === last4)) return;
    const newList = [...savedCards, { ...card, last4 }];
    setSavedCards(newList);
    localStorage.setItem(`cards_${user.id}`, JSON.stringify(newList));
  };
  
  // Estado para edición de perfil
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    avatar: ""
  });

  // persistencia de sesion con listener de Supabase
  useEffect(() => {
    let unsubscribe = null;
    let mounted = true;
    console.log('[AGENDA] Mount - initializing session');

    // Función para cargar datos del usuario
    const loadUserData = async (userId) => {
      if (!mounted) return;
      try {
        console.log('[AGENDA] Loading user data for:', userId);
        const profile = await getUserProfile(userId);
        console.log('[AGENDA] Profile loaded:', profile?.id);
        if (mounted) setUser(profile);
        if (mounted) setEditForm({
          full_name: profile?.full_name || '',
          email: profile?.email || '',
          phone: profile?.phone || '',
          avatar: profile?.avatar || AVATARS[1],
        });
        const appts = await fetchAppointments(userId);
        console.log('[AGENDA] Appointments loaded:', appts?.length);
        if (mounted) setAppointments(appts || []);

        // Si el usuario es admin, abrir directamente el panel de administración
        const isAdmin = profile?.is_admin || profile?.email === 'admin@anela.com';
        if (mounted && isAdmin) setStep('admin');
      } catch (err) {
        console.error('[AGENDA] loadUserData error:', err);
      }
    };

    // Setup listener de autenticación
    if (supabase?.auth?.onAuthStateChange) {
      console.log('[AGENDA] Setting up auth state listener');
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('[AGENDA] Auth state changed:', event, '- User:', session?.user?.id || 'NONE');
          
          if (!mounted) return;
          
          if (event === 'SIGNED_OUT' || !session?.user) {
            console.log('[AGENDA] User signed out');
            setUser(null);
            setAppointments([]);
            setEditForm({
              full_name: '',
              email: '',
              phone: '',
              avatar: AVATARS[1],
            });
          } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') {
            const userId = session.user?.id;
            console.log('[AGENDA] Auth event:', event, 'userId:', userId);
            if (userId) {
              await loadUserData(userId);
            }
          }
        }
      );
      unsubscribe = subscription?.unsubscribe;
      
      // IMPORTANTE: También cargar la sesión actual inmediatamente después de setup
      // No confiar solo en que el listener dispare INITIAL_SESSION
      setTimeout(async () => {
        if (!mounted) return;
        console.log('[AGENDA] Checking for existing session...');
        try {
          const { data: { session } } = await supabase.auth.getSession();
          console.log('[AGENDA] Session check result:', session?.user?.id ? 'YES' : 'NO');
          if (session?.user?.id && mounted) {
            console.log('[AGENDA] Found existing session, loading user');
            await loadUserData(session.user.id);
          }
        } catch (err) {
          console.error('[AGENDA] Session check error:', err);
        }
      }, 50);
    } else {
      // Fallback: cargar sesión manualmente si no está Supabase
      console.log('[AGENDA] No Supabase listener, using fallback');
      (async () => {
        const sessionUser = await initializeSession();
        console.log('[AGENDA] Fallback session:', sessionUser?.id || 'NONE');
        if (sessionUser && mounted) {
          const userId = sessionUser.id || sessionUser.user?.id || sessionUser.uid;
          await loadUserData(userId);
        }
      })();
    }

    return () => {
      console.log('[AGENDA] Cleanup');
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // --- ADMIN DATA (solo para administradores) ---
  useEffect(() => {
    const loadAdminAppointments = async () => {
      if (!user) return;
      const isAdmin = user?.is_admin || user?.email === 'admin@anela.com';
      if (!isAdmin) return;

      try {
        const allAppts = await fetchAllAppointments();
        setAdminAppointments(allAppts || []);
      } catch (err) {
        console.error('[AGENDA] loadAdminAppointments error', err);
      }
    };

    loadAdminAppointments();
  }, [user]);

  // --- DATOS MOCK ---
  const CATEGORIES = useMemo(() => [
    { id: 'manicura', name: 'Manicuras', icon: <Hand size={24} />, bg: 'bg-secondary-light' },
    { id: 'acrilico', name: ' Softgel', icon: <Sparkles size={24} />, bg: 'bg-secondary-light' },
    { id: 'pedicuras', name: ' Pedicuras', icon: <Footprints size={24} />, bg: 'bg-secondary-light' },
    { id: 'suplementos', name: 'Suplementos', icon: <CircleFadingPlus size={24} />, bg: 'bg-secondary-light' },
    { id: 'otros', name: 'Otros', icon: <TextAlignStart size={24} />, bg: 'bg-secondary-light' },
  ], []);

  const SERVICES = useMemo(() => [
    { id: 1, category: 'manicura', name: "Manicura sin pintar", price: 10.00, rating: 4.9, time: '20 min', recommended: false, image: "./src/assets/images/sin-esmalte.jpeg" },
    { id: 2, category: 'manicura', name: "Manicura con esmaltado tradicional", price: 15.00, rating: 4.9, time: '30 min', recommended: false, image: "./src/assets/images/tradicional.jpeg" },
    { id: 3, category: 'manicura', name: "Manicura semipermanente ", price: 20.00, rating: 4.9, time: '45 min', recommended: false, image: "./src/assets/images/semipermanente.jpeg" },
    { id: 4, category: 'manicura', name: "Manicura semipermanente express", price: 15.00, rating: 4.9, time: '30 min ', recommended: false, image: "./src/assets/images/semiexpress.jpeg" },
    { id: 5, category: 'manicura', name: "Manicura con base protein", price: 25.00, rating: 4.9, time: '1 hora', recommended: true, image: "./src/assets/images/base-protein.jpeg" },
    { id: 6, category: 'acrilico', name: "Sencillo unicolor largo 2/3", price: 28.00, rating: 4.8, time: '1 hora 30 min', recommended: true, image: "./src/assets/images/acrilico-unicolor.jpeg" },
    { id: 7, category: 'acrilico', name: "Con diseño largo 2/3", price: 30.00, rating: 4.8, time: '1 hora y 45 min', recommended: false, image: "./src/assets/images/acril-largo.jpeg" },
    { id: 8, category: 'acrilico', name: "Elaborados largo 2/3/4", price: 35.00, rating: 4.8, time: '2 horas', recommended: false, image: "./src/assets/images/largo-diseño.jpeg" },
    { id: 9, category: 'acrilico', name: "Extra elaborados Diseño largo 4/5/6", price: 45.00, rating: 4.8, time: '2 horas y 30 min', recommended: false, image: "./src/assets/images/extra-elaborado.jpeg" },
    { id: 10, category: 'pedicuras', name: "Pedicura basica tradicional", price: 25.00, rating: 5.0, time: '1 hora', recommended: false, image: "./src/assets/images/base-protein.jpeg" },
    { id: 11, category: 'pedicuras', name: "Pedicura semipermanente", price: 30.00, rating: 5.0, time: 'una hora y 15 min', recommended: false, image: "./src/assets/images/base-protein.jpeg" },
    { id: 12, category: 'pedicuras', name: "Pedicura express(semipermanente)", price: 20.00, rating: 5.0, time: '40 min', recommended: false, image: "./src/assets/images/base-protein.jpeg" },
    { id: 13, category: 'pedicuras', name: "Pedicura tecnica", price: 45.00, rating: 5.0, time: '1 hora y 45 min', recommended: false, image: "./src/assets/images/base-protein.jpeg" },
    { id: 14, category: 'suplementos', name: "Frances", price: 5.00, rating: 4.7, time: '10 min', recommended: false, image: "./src/assets/images/frances.jpeg" },
    { id: 15, category: 'suplementos', name: "Efecto aurora", price: 5.00, rating: 4.7, time: '10 min', recommended: false, image: "./src/assets/images/aurora.jpeg" },
    { id: 16, category: 'suplementos', name: "Relieves", price: 5.00, rating: 4.7, time: '10 min', recommended: false, image: "./src/assets/images/relieve.jpeg" },
    { id: 17, category: 'suplementos', name: "Babyboomer", price: 5.00, rating: 4.7, time: '10 min', recommended: false, image: "./src/assets/images/base-protein.jpeg" },
    { id: 18, category: 'suplementos', name: "Flores 3D", price: 5.00, rating: 4.7, time: '10 min', recommended: false, image: "./src/assets/images/flores.jpeg" },
    { id: 19, category: 'suplementos', name: "Cristales", price: 5.00, rating: 4.7, time: '10 min', recommended: false, image: "./src/assets/images/cristales.jpeg" },
    { id: 20, category: 'otros', name: "Retiro semipermanente", price: 5.00, rating: 4.7, time: '15 min', recommended: false, image: "./src/assets/images/base-protein.jpeg" },
    { id: 21, category: 'otros', name: "Retiro por mantenimiento", price: 5.00, rating: 4.7, time: '15 min', recommended: false, image: "./src/assets/images/base-protein.jpeg" },
    { id: 22, category: 'otros', name: "Reparacion de uña", price: 3.00, rating: 4.7, time: '15 min', recommended: false, image: "./src/assets/images/base-protein.jpeg" },
    { id: 23, category: 'otros', name: "Manos y pies semipermanente", price: 45.00, rating: 4.7, time: '2 horas 15 min', recommended: true, image: "./src/assets/images/base-protein.jpeg" },
  ], []);

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

  const handleAuth = async (mode, formData, options = {}) => {
    // mode = 'login' | 'signup'
    // options.skipSave -> avoid creating appointment immediately (used during payment flow)
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

      // Si el usuario es admin, abrir panel admin en lugar de home
      const isAdmin = userObj?.is_admin || userObj?.email === 'admin@anela.com';
      const defaultStep = isAdmin ? 'admin' : 'home';

      if (cart.length > 0 && !options.skipSave) await saveAppointment({ userId: authUser.id });
      else if (cart.length === 0) setStep(defaultStep);
    } catch (err) {
      console.error('auth error:', err.message || err);
      throw err;
    }
  };

  const saveAppointment = async (options = {}) => {
    const { userId, paymentMethod } = options;
    const currentUser = userId ? { id: userId } : user;
    if (!currentUser) return;

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
        await refreshAdminAppointments();
      } catch (err) {
        console.error('update appt error', err);
      }
    } else {
      const payload = {
        user_id: currentUser.id,
        services: cart,
        date: selectedDate || "24 Feb",
        time: selectedTime || "10:00 AM",
        status: "Confirmado",
        payment_method: paymentMethod || 'online',
        timestamp: new Date().toISOString()
      };
      try {
        const inserted = await dbAddAppointment(payload);
        setAppointments([inserted, ...appointments]);
        await refreshAdminAppointments();
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
    setAdminAppointments(adminAppointments.filter(a => a.id !== id));
    try {
      await dbDeleteAppointment(id);
      await refreshAdminAppointments();
    } catch (err) {
      console.error('delete appt error', err);
    }
  };

  const refreshAdminAppointments = async () => {
    const isAdmin = user?.is_admin || user?.email === 'admin@anela.com';
    if (!isAdmin) return;
    try {
      const allAppts = await fetchAllAppointments();
      setAdminAppointments(allAppts || []);
    } catch (err) {
      console.error('[AGENDA] refreshAdminAppointments error', err);
    }
  };

  const togglePaidStatus = async (appt) => {
    const isPaid = (appt.paid ?? (appt.status?.toLowerCase().includes('confirm') || appt.status?.toLowerCase().includes('pagado')));
    const newStatus = isPaid ? 'Pendiente' : 'Confirmado';

    try {
      const updated = await dbUpdateAppointment(appt.id, { status: newStatus });
      setAppointments(appointments.map(a => (a.id === appt.id ? updated : a)));
      setAdminAppointments(adminAppointments.map(a => (a.id === appt.id ? updated : a)));
    } catch (err) {
      console.error('[AGENDA] togglePaidStatus error', err);
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
    setAdminAppointments([]);
    setCart([]);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    if (!searchQuery) return SERVICES;
    const q = searchQuery.toLowerCase().trim();
    return SERVICES.filter(s => {
      return (
        s.name.toLowerCase().includes(q) ||
        (s.category && s.category.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, SERVICES]);

  const isAdmin = user?.is_admin || user?.email === 'admin@anela.com';

  return (
    <div className="min-h-screen bg-bg text-text-dark font-sans pb-28">
      
      {/* HEADER */}
      {step !== 'profile' && (
        <Header
          cartCount={cart.length}
          appointmentCount={appointments.length}
          setStep={setStep}
          onCartClick={() => setStep('calendar')}
          searchQuery={searchQuery}
          onSearchClick={setSearchQuery}
        />
      )}

      {/* BOTÓN FLOTANTE "IR A RESERVAR" SI HAY CARRITO */}
      {!isAdmin && <FloatingButton cart={cart} setStep={setStep} />}

      <main className={`px-6 space-y-8 animate-in ${step === 'profile' ? 'pt-16' : ''}`}>
        
        {/* HOME VIEW */}
        {step === 'home' && !isAdmin && <HomeView appointments={appointments} setStep={setStep} CATEGORIES={CATEGORIES} SERVICES={filteredServices} cart={cart} addToCart={addToCart} startReschedule={startReschedule} cancelAppointment={cancelAppointment} setSelectedCategory={setSelectedCategory} />}

        {/* SERVICES VIEW */}
        {!isAdmin && step === 'services' && <ServicesView setStep={setStep} selectedCategory={selectedCategory} SERVICES={filteredServices} cart={cart} addToCart={addToCart} />}

        {/* CALENDAR VIEW */}
        {!isAdmin && step === 'calendar' && <CalendarView setStep={setStep} cart={cart} removeFromCart={removeFromCart} CATEGORIES={CATEGORIES} selectedDate={selectedDate} setSelectedDate={setSelectedDate} selectedTime={selectedTime} setSelectedTime={setSelectedTime} user={user} saveAppointment={saveAppointment} reschedulingId={reschedulingId} />}

        {/* AUTH VIEW */}
        {step === 'payment' && (
          <PaymentView
            handleAuth={handleAuth}
            user={user}
            cart={cart}
            saveAppointment={saveAppointment}
            setStep={setStep}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            reschedulingId={reschedulingId}
            savedCards={savedCards}
            addSavedCard={addSavedCard}
          />
        )}

        {/* CONFIRMATION VIEW */}
        {step === 'confirmation' && <ConfirmationView setStep={setStep} />}

        {/* ADMIN VIEW */}
        {step === 'admin' && isAdmin && (
          <AdminView
            appointments={adminAppointments}
            setStep={setStep}
            startReschedule={startReschedule}
            cancelAppointment={cancelAppointment}
            togglePaidStatus={togglePaidStatus}
          />
        )}

        {/* PROFILE VIEW */}
        {step === 'profile' && user && <ProfileView user={user} setUser={setUser} setStep={setStep} isEditingProfile={isEditingProfile} setIsEditingProfile={setIsEditingProfile} editForm={editForm} setEditForm={setEditForm} handleSaveProfile={handleSaveProfile} appointments={appointments} startReschedule={startReschedule} cancelAppointment={cancelAppointment} AVATARS={AVATARS} handleLogout={handleLogout} />}

      </main>

      {/* NAV BAR FLOTANTE */}
      <NavBar step={step} setStep={setStep} user={user} isAdmin={isAdmin} setSelectedCategory={setSelectedCategory} />
    </div>
  );
};

export default App;