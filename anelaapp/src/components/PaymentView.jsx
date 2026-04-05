import React, { useState, useEffect, useCallback } from 'react';

// pequeño componente que muestra fecha/hora
const ReservationInfo = ({ date, time }) => (
  <div className="bg-gray-100 p-4 rounded-2xl mb-6 text-sm text-gray-600">
    <p><strong>Fecha:</strong> {date || '---'}</p>
    <p><strong>Horario:</strong> {time || '---'}</p>
  </div>
);

const PaymentView = ({ handleAuth, user, cart, saveAppointment, setStep, selectedDate, selectedTime, reschedulingId }) => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('online');

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // Si el usuario ya está logueado, mostrar directamente las opciones de pago
  useEffect(() => {
    if (user && user.id) {
      // Usuario logueado, mostrar opciones de pago
      setShowPayment(true);
    }
  }, [user]);

  const launchStripeCheckout = useCallback(async () => {
    if (!cart || cart.length === 0) {
      setErrors({ submit: 'El carrito está vacío.' });
      return;
    }
    setLoading(true);
    setErrors({});
    try {
      localStorage.setItem('pending_appt', JSON.stringify({ cart, selectedDate, selectedTime, reschedulingId }));
      const resp = await fetch('http://localhost:4242/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, userId: user?.id, reschedulingId }),
      });
      const data = await resp.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrors({ submit: data.error || 'Error al crear sesión de pago' });
      }
    } catch (err) {
      console.error('checkout error', err);
      setErrors({ submit: err.message || 'Error al iniciar el pago' });
    } finally {
      setLoading(false);
    }
  }, [cart, selectedDate, selectedTime, reschedulingId, user]);

  // reprogramación sin pago
  if (reschedulingId) {
    return (
      <div className="max-w-md mx-auto pt-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 text-center">
          <h2 className="text-3xl font-black mb-4 italic tracking-tighter text-primary">
            Reprogramación sin pago
          </h2>
          <p className="text-gray-600 mb-6">
            No se requiere pago para cambiar la fecha u horario de tu cita.
          </p>
          {selectedDate && selectedTime && <ReservationInfo date={selectedDate} time={selectedTime} />}
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setStep('calendar')}
              className="flex-1 py-5 rounded-3xl font-bold shadow-xl uppercase text-[10px] tracking-widest border border-gray-200 text-gray-600"
            >
              Volver
            </button>
            <button
              onClick={saveAppointment}
              className="flex-1 bg-primary text-white py-5 rounded-3xl font-bold shadow-xl uppercase text-[10px] tracking-widest active:scale-95 transition-all"
            >
              Confirmar Reagendación
            </button>
          </div>
        </div>
      </div>
    );
  }

  // usuario logueado - muestra botón de pago
  if (user && user.id && cart && cart.length > 0) {
    const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    return (
      <div className="max-w-md mx-auto pt-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 text-center">
          <h2 className="text-3xl font-black mb-4 italic tracking-tighter text-primary">
            {reschedulingId ? 'Pagar reprogramación' : 'Resumen de tu orden'}
          </h2>
          {selectedDate && selectedTime && <ReservationInfo date={selectedDate} time={selectedTime} />}
          <div className="bg-gray-50 p-4 rounded-2xl mb-8">
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">{item.name}</span>
                  <span className="font-bold text-primary">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-primary">${totalPrice.toFixed(2)}</span>
            </div>
          </div>
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Método de pago:</p>
            <div className="flex gap-3">
              <button
                onClick={() => setPaymentMethod('online')}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${paymentMethod === 'online' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Pagar ahora
              </button>
              <button
                onClick={() => setPaymentMethod('efectivo')}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all ${paymentMethod === 'efectivo' ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Pagar en efectivo
              </button>
            </div>
          </div>
          {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => setStep('calendar')}
              className="flex-1 py-5 rounded-3xl font-bold shadow-xl uppercase text-[10px] tracking-widest border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-all"
            >
              Volver
            </button>
            {paymentMethod === 'online' ? (
              <button
                onClick={launchStripeCheckout}
                disabled={loading}
                className="flex-1 bg-primary text-white py-5 rounded-3xl font-bold shadow-xl uppercase text-[10px] tracking-widest active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Pagar ahora'}
              </button>
            ) : (
              <button
                onClick={() => saveAppointment({ paymentMethod: 'efectivo' })}
                className="flex-1 bg-primary text-white py-5 rounded-3xl font-bold shadow-xl uppercase text-[10px] tracking-widest active:scale-95 transition-all"
              >
                Agendar cita
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // placeholder mientras se procesa el login/registro
  if (showPayment && !user) {
    return (
      <div className="max-w-md mx-auto pt-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Completando tu registro...</p>
          <p className="text-gray-400 text-sm mt-2">Redirigiendo al pago en un momento</p>
        </div>
      </div>
    );
  }

  // validaciones y handlers para login/registro
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9+\-\s()]{10,}$/.test(phone.replace(/\s/g, ''));

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const getErrorMessage = (err) => {
    if (!err) return 'Ocurrió un error inesperado';
    if (typeof err === 'string') return err;
    return err?.message || err?.error_description || err?.statusText || JSON.stringify(err);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!loginData.email) newErrors.email = 'El email es requerido';
    else if (!validateEmail(loginData.email)) newErrors.email = 'Email inválido';
    if (!loginData.password) newErrors.password = 'La contraseña es requerida';
    else if (loginData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    console.log('[PAYMENT] login submit', { email: loginData.email });
    
    try {
      await handleAuth('login', loginData, { skipSave: true });
      console.log('[PAYMENT] login success');
      
      // ✅ APAGAMOS EL LOADING AQUÍ, justo después del éxito
      setLoading(false); 
    } catch (err) {
      console.error('login error', err);
      setErrors({ submit: getErrorMessage(err) || 'Error al ingresar' });
      setLoading(false); // ❌ Si falla, también lo apagamos aquí
    }
  };

 const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!signupData.firstName.trim()) newErrors.firstName = 'El nombre es requerido';
    if (!signupData.lastName.trim()) newErrors.lastName = 'El apellido es requerido';
    if (!signupData.email) newErrors.email = 'El email es requerido';
    else if (!validateEmail(signupData.email)) newErrors.email = 'Email inválido';
    if (!signupData.phone) newErrors.phone = 'El teléfono es requerido';
    else if (!validatePhone(signupData.phone)) newErrors.phone = 'Teléfono inválido';
    if (!signupData.password) newErrors.password = 'La contraseña es requerida';
    else if (signupData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (signupData.password !== signupData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    console.log('[PAYMENT] signup submit', { email: signupData.email });
    
    try {
      await handleAuth('signup', signupData, { skipSave: true });
      console.log('[PAYMENT] signup success');
      
      // ✅ APAGAMOS EL LOADING AQUÍ
      setLoading(false);
    } catch (err) {
      console.error('signup error', err);
      setErrors({ submit: getErrorMessage(err) || 'Error al registrar' });
      setLoading(false); // ❌ Si falla, también lo apagamos aquí
    }
  };

  return (
    <div className="max-w-md mx-auto pt-10">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black mb-2 italic tracking-tighter text-primary">
          {isLogin ? 'Inicia Sesión' : 'Regístrate'}
        </h2>
        <p className="text-gray-500 text-sm mb-2">
          {isLogin ? 'Accede a tu cuenta para agendar' : 'Crea tu cuenta para comenzar'}
        </p>
        {selectedDate && selectedTime && <ReservationInfo date={selectedDate} time={selectedTime} />}
        <div className="mb-6" />
        <div className="flex gap-2 mb-8 bg-gray-100 p-2 rounded-2xl">
          <button
            onClick={() => { setIsLogin(true); setErrors({}); }}
            className={`flex-1 py-3 rounded-xl font-bold uppercase text-[10px] transition-all ${isLogin ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Ingresar
          </button>
          <button
            onClick={() => { setIsLogin(false); setErrors({}); }}
            className={`flex-1 py-3 rounded-xl font-bold uppercase text-[10px] transition-all ${!isLogin ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Registrarse
          </button>
        </div>
        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Email</label>
              <input
                required
                type="email"
                name="email"
                value={loginData.email}
                onChange={handleLoginChange}
                placeholder="ejemplo@correo.com"
                className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium ${errors.email ? 'ring-2 ring-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs ml-3 mt-1">{errors.email}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Contraseña</label>
              <input
                required
                type="password"
                name="password"
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="••••••••"
                className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium ${errors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}
              />
              {errors.password && <p className="text-red-500 text-xs ml-3 mt-1">{errors.password}</p>}
            </div>
            {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white py-5 rounded-3xl font-bold shadow-xl mt-6 uppercase text-[10px] tracking-widest active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Ingresar y Agendar'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Nombre</label>
                <input
                  type="text"
                  name="firstName"
                  value={signupData.firstName}
                  onChange={handleSignupChange}
                  placeholder="Juan"
                  className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium ${errors.firstName ? 'ring-2 ring-red-500' : ''}`}
                />
                {errors.firstName && <p className="text-red-500 text-xs ml-3 mt-1">{errors.firstName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Apellido</label>
                <input
                  type="text"
                  name="lastName"
                  value={signupData.lastName}
                  onChange={handleSignupChange}
                  placeholder="Pérez"
                  className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium ${errors.lastName ? 'ring-2 ring-red-500' : ''}`}
                />
                {errors.lastName && <p className="text-red-500 text-xs ml-3 mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Email</label>
              <input
                type="email"
                name="email"
                value={signupData.email}
                onChange={handleSignupChange}
                placeholder="ejemplo@correo.com"
                className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium ${errors.email ? 'ring-2 ring-red-500' : ''}`}
              />
              {errors.email && <p className="text-red-500 text-xs ml-3 mt-1">{errors.email}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={signupData.phone}
                onChange={handleSignupChange}
                placeholder="+1 (555) 123-4567"
                className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
              />
              {errors.phone && <p className="text-red-500 text-xs ml-3 mt-1">{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="••••••••"
                  className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                />
                {errors.password && <p className="text-red-500 text-xs ml-3 mt-1">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Confirmar contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={handleSignupChange}
                  placeholder="••••••••"
                  className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 font-medium ${errors.confirmPassword ? 'ring-2 ring-red-500' : ''}`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs ml-3 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-5 rounded-3xl font-bold shadow-xl mt-6 uppercase text-[10px] tracking-widest active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Registrarse y Agendar'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentView;
