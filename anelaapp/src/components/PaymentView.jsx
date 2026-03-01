import React, { useState, useEffect } from 'react';

const PaymentView = ({ handleAuth, user, cart, saveAppointment, setStep, selectedDate, selectedTime }) => {
  // show reservation details helper
  const ReservationInfo = () => (
    <div className="bg-gray-100 p-4 rounded-2xl mb-6 text-sm text-gray-600">
      <p><strong>Fecha:</strong> {selectedDate || '---'}</p>
      <p><strong>Horario:</strong> {selectedTime || '---'}</p>
    </div>
  );

  // === shared state/hooks ===
  const [paymentData, setPaymentData] = useState({
    cardName: (user && user.full_name) || '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  // keep cardName in sync if user logs in while on this screen
  React.useEffect(() => {
    if (user && user.full_name) {
      setPaymentData(prev => ({ ...prev, cardName: user.full_name }));
    }
  }, [user]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  // ensure payment form is hidden by default and whenever the user logs out
  React.useEffect(() => {
    setShowPayment(false);
  }, [user]);

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  // shared handler for payment fields (used by all branches)
  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').slice(0, 16);
      formattedValue = formattedValue.replace(/(\d{4})/g, '$1 ').trim();
    }
    if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2);
      }
    }
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setPaymentData(prev => ({ ...prev, [name]: formattedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // If user is already logged in (must have an id) show payment summary only
  if (user && user.id && cart && cart.length > 0) {
    const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);

    const handleConfirmPayment = async (e) => {
      e.preventDefault();
      const newErrors = {};

      if (!paymentData.cardName.trim()) newErrors.cardName = 'El nombre es requerido';
      if (!paymentData.cardNumber) newErrors.cardNumber = 'El número de tarjeta es requerido';
      else if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Número de tarjeta inválido';

      if (!paymentData.expiryDate) newErrors.expiryDate = 'La fecha es requerida';
      else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) newErrors.expiryDate = 'Formato MM/AA';

      if (!paymentData.cvv) newErrors.cvv = 'El CVV es requerido';
      else if (paymentData.cvv.length !== 3) newErrors.cvv = 'CVV inválido';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setLoading(true);
      try {
        console.log('tarjeta procesada:', paymentData);
        await saveAppointment();
      } catch (error) {
        console.error('payment error:', error?.message || error);
        setErrors({ submit: error?.message || 'Error al procesar el pago. Intenta de nuevo.' });
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="max-w-md mx-auto pt-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
          <h2 className="text-3xl font-black mb-2 italic tracking-tighter text-[#3D5645]">Confirmar Pago</h2>
          <p className="text-gray-500 text-sm mb-6">Completa los datos de tu tarjeta para confirmar la reserva</p>
          {selectedDate && selectedTime && <ReservationInfo />}

          {/* Resumen de pago */}
          <div className="bg-gray-50 p-4 rounded-2xl mb-8">
            <div className="space-y-2">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 font-medium">{item.name}</span>
                  <span className="font-bold text-[#3D5645]">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-black text-[#3D5645]">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <form onSubmit={handleConfirmPayment} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Nombre en la Tarjeta</label>
              <input
                type="text"
                name="cardName"
                value={paymentData.cardName}
                onChange={handlePaymentChange}
                placeholder="Tu Nombre Completo"
                className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                  errors.cardName ? 'ring-2 ring-red-500' : ''
                }`}
              />
              {errors.cardName && <p className="text-red-500 text-xs ml-3 mt-1">{errors.cardName}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Número de Tarjeta</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handlePaymentChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                  errors.cardNumber ? 'ring-2 ring-red-500' : ''
                }`}
              />
              {errors.cardNumber && <p className="text-red-500 text-xs ml-3 mt-1">{errors.cardNumber}</p>}
              <p className="text-[10px] text-gray-400 italic ml-3 mt-1">(mock) usa 4242 4242 4242 4242</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Vencimiento</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handlePaymentChange}
                  placeholder="MM/AA"
                  className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                    errors.expiryDate ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                {errors.expiryDate && <p className="text-red-500 text-xs ml-3 mt-1">{errors.expiryDate}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handlePaymentChange}
                  placeholder="123"
                  maxLength="3"
                  className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                    errors.cvv ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                {errors.cvv && <p className="text-red-500 text-xs ml-3 mt-1">{errors.cvv}</p>}
              </div>
            </div>

            {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

            <div className="flex gap-3 mt-8">
              <button
                type="button"
                onClick={() => setStep('calendar')}
                className="flex-1 py-5 rounded-[1.5rem] font-bold shadow-xl uppercase text-[10px] tracking-widest border-2 border-gray-200 text-gray-600 hover:border-gray-300 transition-all"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#3D5645] text-white py-5 rounded-[1.5rem] font-bold shadow-xl uppercase text-[10px] tracking-widest active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Procesando...' : 'Confirmar Pago'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Original registration + payment flow for new users
  // (shared hooks declared above)

  // Validaciones
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[0-9+\-\s()]{10,}$/.test(phone.replace(/\s/g, ''));

  // Manejador para cambios en login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Manejador para cambios en signup
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };


  // Validar y procesar login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!loginData.email) newErrors.email = 'El email es requerido';
    else if (!validateEmail(loginData.email)) newErrors.email = 'Email inválido';

    if (!loginData.password) newErrors.password = 'La contraseña es requerida';
    else if (loginData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // authenticate but do not save appointment yet
      await handleAuth('login', loginData, { skipSave: true });
      // once logged in, show the payment form
      setShowPayment(true);
    } catch (error) {
      // Error handled by handleAuth
    }
    setLoading(false);
  };

  // Validar y procesar registro
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

    if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Mostrar formulario de pago - se completará el registro después del pago
      setShowPayment(true);
    } catch (error) {
      // Error silencioso
    }
    setLoading(false);
  };

  // Procesar pago
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!paymentData.cardName.trim()) newErrors.cardName = 'El nombre es requerido';
    if (!paymentData.cardNumber) newErrors.cardNumber = 'El número de tarjeta es requerido';
    else if (paymentData.cardNumber.replace(/\s/g, '').length !== 16) newErrors.cardNumber = 'Número de tarjeta inválido';

    if (!paymentData.expiryDate) newErrors.expiryDate = 'La fecha es requerida';
    else if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) newErrors.expiryDate = 'Formato MM/AA';

    if (!paymentData.cvv) newErrors.cvv = 'El CVV es requerido';
    else if (paymentData.cvv.length !== 3) newErrors.cvv = 'CVV inválido';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      console.log('tarjeta mock procesada:', paymentData);
      // Crear la cuenta del usuario (handleAuth crea la cita automáticamente después)
      await handleAuth('signup', signupData);
    } catch (error) {
      console.error('signup/payment error:', error?.message || error);
      setErrors({ submit: error?.message || 'Error al completar el registro y pago. Intenta de nuevo.' });
    } finally {
      setLoading(false);
    }
  };

  // Render del formulario de pago
  if (showPayment) {
    const totalPrice = cart ? cart.reduce((sum, item) => sum + (item.price || 0), 0) : 0;
    return (
      <div className="max-w-md mx-auto pt-10">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
          <h2 className="text-3xl font-black mb-2 italic tracking-tighter text-[#3D5645]">Información de Pago</h2>
          <p className="text-gray-500 text-sm mb-2">A continuación ingresa tus datos para completar la reserva</p>
          {selectedDate && selectedTime && <ReservationInfo />}

          {/* Resumen de pago (nuevo usuario) */}
          {cart && cart.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-2xl mb-8">
              <div className="space-y-2">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">{item.name}</span>
                    <span className="font-bold text-[#3D5645]">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-2xl font-black text-[#3D5645]">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          )}

          <p className="text-[10px] text-gray-400 italic mb-4">(mock) usa tarjeta 4242 4242 4242 4242, cualquier vencimiento y CVV</p>
          
          <form onSubmit={handlePaymentSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Nombre en la Tarjeta</label>
              <input
                type="text"
                name="cardName"
                value={paymentData.cardName}
                onChange={handlePaymentChange}
                placeholder="Tu Nombre Completo"
                className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                  errors.cardName ? 'ring-2 ring-red-500' : ''
                }`}
              />
              {errors.cardName && <p className="text-red-500 text-xs ml-3 mt-1">{errors.cardName}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Número de Tarjeta</label>
              <input
                type="text"
                name="cardNumber"
                value={paymentData.cardNumber}
                onChange={handlePaymentChange}
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                  errors.cardNumber ? 'ring-2 ring-red-500' : ''
                }`}
              />
              {errors.cardNumber && <p className="text-red-500 text-xs ml-3 mt-1">{errors.cardNumber}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Vencimiento</label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentData.expiryDate}
                  onChange={handlePaymentChange}
                  placeholder="MM/AA"
                  className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                    errors.expiryDate ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                {errors.expiryDate && <p className="text-red-500 text-xs ml-3 mt-1">{errors.expiryDate}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentData.cvv}
                  onChange={handlePaymentChange}
                  placeholder="123"
                  maxLength="3"
                  className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                    errors.cvv ? 'ring-2 ring-red-500' : ''
                  }`}
                />
                {errors.cvv && <p className="text-red-500 text-xs ml-3 mt-1">{errors.cvv}</p>}
              </div>
            </div>

            {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3D5645] text-white py-5 rounded-[1.5rem] font-bold shadow-xl mt-6 uppercase text-[10px] tracking-widest active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Completar Pago'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render del formulario de login/registro
  return (
    <div className="max-w-md mx-auto pt-10">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black mb-2 italic tracking-tighter text-[#3D5645]">
          {isLogin ? 'Inicia Sesión' : 'Regístrate'}
        </h2>
        <p className="text-gray-500 text-sm mb-2">
          {isLogin ? 'Accede a tu cuenta para agendar' : 'Crea tu cuenta para comenzar'}
        </p>
        {selectedDate && selectedTime && <ReservationInfo />}
        <div className="mb-6" />

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-gray-100 p-2 rounded-2xl">
          <button
            onClick={() => {
              setIsLogin(true);
              setErrors({});
            }}
            className={`flex-1 py-3 rounded-xl font-bold uppercase text-[10px] transition-all ${
              isLogin
                ? 'bg-[#3D5645] text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Ingresar
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setErrors({});
            }}
            className={`flex-1 py-3 rounded-xl font-bold uppercase text-[10px] transition-all ${
              !isLogin
                ? 'bg-[#3D5645] text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Registrarse
          </button>
        </div>

        {/* Formulario de Login */}
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
                className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                  errors.email ? 'ring-2 ring-red-500' : ''
                }`}
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
                className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                  errors.password ? 'ring-2 ring-red-500' : ''
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs ml-3 mt-1">{errors.password}</p>}
            </div>

            {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3D5645] text-white py-5 rounded-[1.5rem] font-bold shadow-xl mt-6 uppercase text-[10px] tracking-widest active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Ingresando...' : 'Ingresar y Agendar'}
            </button>
          </form>
        ) : (
          /* Formulario de Registro */
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
                  className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                    errors.firstName ? 'ring-2 ring-red-500' : ''
                  }`}
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
                  className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                    errors.lastName ? 'ring-2 ring-red-500' : ''
                  }`}
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
                className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                  errors.email ? 'ring-2 ring-red-500' : ''
                }`}
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
                className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                  errors.phone ? 'ring-2 ring-red-500' : ''
                }`}
              />
              {errors.phone && <p className="text-red-500 text-xs ml-3 mt-1">{errors.phone}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Contraseña</label>
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                placeholder="••••••••"
                className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                  errors.password ? 'ring-2 ring-red-500' : ''
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs ml-3 mt-1">{errors.password}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-3">Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={signupData.confirmPassword}
                onChange={handleSignupChange}
                placeholder="••••••••"
                className={`w-full p-5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#3D5645]/20 font-medium ${
                  errors.confirmPassword ? 'ring-2 ring-red-500' : ''
                }`}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs ml-3 mt-1">{errors.confirmPassword}</p>}
            </div>

            {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#3D5645] text-white py-5 rounded-[1.5rem] font-bold shadow-xl mt-6 uppercase text-[10px] tracking-widest active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Registrando...' : 'Crear Cuenta'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentView;