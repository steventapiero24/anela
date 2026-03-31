import React, { useState } from 'react';
import { Star, Check, Recycle, ArrowRight, Plus, Minus, Instagram, Facebook, Twitter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-6">
      <button 
        className="w-full flex justify-between items-center text-left group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-serif text-xl md:text-2xl group-hover:italic transition-all">{question}</span>
        {isOpen ? <Minus size={20} className="text-gray-400" /> : <Plus size={20} className="text-gray-400" />}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 mt-4' : 'max-h-0'}`}>
        <p className="text-gray-500 text-sm leading-relaxed max-w-2xl text-left">
          {answer}
        </p>
      </div>
    </div>
  );
};

const App = () => {
  const navigate = useNavigate();
  const faqs = [
  {
    question: "¿Cuánto tiempo dura el esmaltado semipermanente?",
    answer: "Nuestros esmaltes de alta gama están diseñados para durar entre 15 y 21 días con un brillo impecable, dependiendo del crecimiento natural de tu uña y los cuidados posteriores."
  },
  {
    question: "¿Sus productos son libres de tóxicos?",
    answer: "Totalmente. Utilizamos fórmulas '10-Free', lo que significa que están libres de los 10 componentes químicos más dañinos presentes en los esmaltes convencionales."
  },
  {
    question: "¿Es necesario pedir cita previa para pedicura?",
    answer: "Para garantizarte una experiencia de relajación completa y sin esperas, recomendamos agendar tu cita con al menos 48 horas de antelación."
  },
  {
    question: "¿Cuánto dura una cita de manicura o pedicura?",
    answer: "La duración depende del servicio. Una manicura semipermanente suele durar entre 45 y 60 minutos, mientras que servicios más completos o con diseño pueden requerir más tiempo."
  },
  {
    question: "¿Puedo acudir sin cita previa?",
    answer: "Trabajamos principalmente con cita previa para garantizar la mejor atención. Si tenemos disponibilidad, estaremos encantadas de atenderte sin cita."
  },
  {
    question: "¿Qué pasa si llego tarde a mi cita?",
    answer: "Te recomendamos llegar puntual para disfrutar de tu servicio completo. En caso de retraso, es posible que tengamos que adaptar o reprogramar tu cita."
  },
  {
    question: "¿Cuál es la política de cancelación?",
    answer: "Puedes cancelar o modificar tu cita con al menos 24 horas de antelación. Esto nos permite reorganizar la agenda y ofrecer el espacio a otra clienta."
  },
  {
    question: "¿Retiran esmalte o uñas de otros centros?",
    answer: "Sí, realizamos retiradas de trabajos de otros centros. Te recomendamos indicarlo al reservar para asignarte el tiempo adecuado."
  },
  {
    question: "¿Se dañan las uñas con el esmaltado semipermanente?",
    answer: "No, siempre que se aplique y retire correctamente. En Anela Nails priorizamos la salud de tu uña natural utilizando técnicas seguras y productos de calidad."
  },
  {
    question: "¿Hacen diseños personalizados?",
    answer: "Sí, nos encanta personalizar cada manicura. Puedes traer tu idea o inspirarte con nuestros diseños en el estudio."
  },
  {
    question: "¿Cómo debo preparar mis uñas antes de la cita?",
    answer: "Recomendamos acudir con las uñas limpias y sin producto previo. Si llevas esmalte o uñas de otro centro, indícalo al reservar."
  },
  {
    question: "¿Ofrecen tarjetas regalo?",
    answer: "Sí, disponemos de tarjetas regalo perfectas para sorprender con una experiencia de belleza y cuidado."
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer: "Aceptamos efectivo, tarjeta y otros métodos digitales para tu comodidad."
  },
  {
    question: "¿Puedo cambiar el servicio una vez en el estudio?",
    answer: "Intentaremos adaptarnos siempre que nuestra agenda lo permita, aunque recomendamos elegir el servicio correctamente al reservar."
  }
];

  return (
    <div className="min-h-screenfont-sans text-[#2D2D2D] selection:bg-[#4A5D4E] selection:text-white">

      {/* Hero */}

      <nav className='flex px-5 md:px-0'>
        <div className='flex flex-1 justify-center bg-primary rounded-4xl p-5 '>
          <img src="../src/assets/images/logo-yellow.svg" alt="logo" className="w-54  rounded-full" />
        </div>
      </nav>
      {/* Contenedor Principal */}
      <main className="max-w-6xl mx-auto px-6 py-12 md:py-20">
        
        {/* Sección Superior: Título y Reseñas */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif tracking-tight leading-[1.1] max-w-md text-left">
              Un ritual para tus manos.
            </h1>
            <p className='text-left'>Más que una manicura.</p>
             <div className='flex items-start'>
          <button
          onClick={() => navigate('/agenda')}
          className="cursor-pointer mt-6 bg-primary text-white px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest  h"
        >
          Quiero mi cita
        </button>
        </div>
          </div>
            <div className="flex items-center gap-3 pb-2">            
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-[#F8F7F2] overflow-hidden bg-gray-200">
                    <img 
                      src={`https://i.pravatar.cc/100?img=${i + 22}`} 
                      alt={`Cliente ${i}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-yellow-600 mb-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <p className="text-gray-500 font-medium text-[11px] tracking-wide">4.9 (2,450 reseñas)</p>
              </div>
            </div>
        </div>

        {/* Grid Principal (Hero + Cards laterales) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-24">
          
          {/* 1. Imagen Principal (Izquierda) */}
          <div className="md:col-span-7 relative">
            <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=1000" 
                alt="Manicura elegante en tonos neutros" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Badge Flotante "Salud para tus uñas" */}
            <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-2xl max-w-[260px] border border-white/20">
              <div className="flex gap-4">
                <div className="bg-[#4A5D4E] text-white p-1 rounded-full h-fit mt-1 shrink-0">
                  <Check size={14} strokeWidth={3} />
                </div>
                <div>
                  <h3 className="font-bold text-sm mb-1">Cuidado Dermatológico</h3>
                  <p className="text-[10px] leading-relaxed text-gray-500 uppercase tracking-widest">
                    Tratamientos que fortalecen y cuidan tu uña desde el interior, para que luzca sana incluso sin esmalte.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="md:col-span-5 flex flex-col gap-6">
            
            {/* 2. Tarjeta Pedicura SPA (Superior Derecha) */}
            <div className="bg-[#EAE8E1] p-10 rounded-2xl flex-1 flex  justify-between relative overflow-hidden">
              <div className="relative z-10">
                <Recycle className="mb-6 opacity-60" size={24} />
                <h2 className="text-3xl font-serif italic mb-4 leading-tight text-left">Pedicura Orgánica & profunda</h2>
                <p className="text-[13px] text-gray-600 leading-relaxed max-w-[180px] text-left">
                  Un ritual de exfoliación y masaje que libera tensión y devuelve ligereza a tus pies.
                </p>
              </div>
              <div className="bottom-0 right-0 w-full h-3/5">
                <img 
                  src="https://plus.unsplash.com/premium_photo-1661499249417-c20d6b668469?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Relajación de pies con aceites" 
                  className="w-full h-full object-cover rounded-tl-3xl shadow-[-20px_-20px_40px_rgba(0,0,0,0.05)]"
                />
              </div>
            </div>

            {/* 3. Tarjeta Esmaltes 10-Free (Inferior Derecha) */}
            <div className="bg-[#3B473C] p-10 rounded-2xl text-white relative overflow-hidden">
              <div className="flex gap-8 items-center relative z-10">
                <div className="w-28 h-44 overflow-hidden rounded-full shrink-0 shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=400" 
                    alt="Botella de esmalte de lujo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-serif mb-1 leading-none text-left">Puro Color</h2>
                  <p className="text-3xl font-serif italic opacity-60 mb-8 tracking-tight text-left">Cero Tóxicos</p>
                  <ul className="space-y-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-300 text-left">
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-white/30 rounded-full"></span> Color intenso
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-white/30 rounded-full"></span> Pigmentos de Larga Duración
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 bg-white/30 rounded-full"></span> Secado Rápido UV/LED
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Testimonio */}
        <div className="text-center max-w-3xl mx-auto mb-32 flex flex-col items-center">
          <div className="flex gap-2 mb-10">
             <div className="w-14 h-18 bg-white p-1.5 rounded-sm shadow-xl border border-gray-100 -rotate-6">
                <img src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover grayscale opacity-80" />
             </div>
             <div className="w-14 h-18 bg-white p-1.5 rounded-sm shadow-xl border border-gray-100 rotate-6 -ml-4 mt-2">
                <img src="https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover grayscale opacity-80" />
             </div>
          </div>
          <blockquote className="text-3xl md:text-[40px] font-serif leading-[1.2] mb-10 tracking-tight text-[#1A1A1A]">
            "Es la primera vez que siento que mis uñas están realmente cuidadas. No es solo el resultado, es toda la experiencia."
          </blockquote>
          <div className="flex text-yellow-600 gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
          </div>
          <cite className="not-italic">
            <span className="block font-bold text-sm tracking-widest uppercase">Valeria M.</span>
            <span className="block text-gray-400 text-[10px] mt-1.5 uppercase tracking-widest font-bold">Cliente Satisfecha</span>
          </cite>
        </div>

        {/* Sección de Productos/Servicios con Piedras */}
        <div className="relative py-20 flex flex-col items-center mb-32">
          <div className="relative z-10 flex flex-col md:flex-row items-end justify-center gap-12 md:gap-4">
            
            {/* Aceite de Cutícula */}
            <div className="relative group translate-y-8">
              <img 
                src="../src/assets/images/cristales.jpeg" 
                alt="Aceite revitalizante de cutícula" 
                className="w-56 md:w-64 object-contain rounded-full shadow-2xl"
              />
              <div className="absolute top-1/2 -left-16 transform -translate-y-1/2 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 bg-[#F0F0F0] rounded-lg overflow-hidden shrink-0">
                  <img src="../src/assets/images/cristales.jpeg" />
                </div>
                <div className="text-[11px] leading-tight">
                  <p className="text-gray-400 font-bold mb-1 tracking-tight">Cuidado</p>
                  <p className="font-black text-xs flex items-center gap-2 mb-1">Serum Revitalizante <ArrowRight size={14} className="text-gray-300" /></p>
                  <p className="text-gray-500 font-medium">$18.50</p>
                </div>
              </div>
            </div>

            {/* Esmalte Signature */}
            <div className="relative group z-20">
              <img 
                src="https://images.unsplash.com/photo-1602585578130-c9076e09330d?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Esmalte tono tierra" 
                className="w-64 md:w-72 object-contain"
              />
              <div className="absolute top-1/4 -right-16 transform -translate-y-1/2 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-100 flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 bg-[#F0F0F0] rounded-lg overflow-hidden shrink-0">
                   <img src="https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&q=80&w=60" className="w-full h-full object-cover" />
                </div>
                <div className="text-[11px] leading-tight">
                  <p className="text-gray-400 font-bold mb-1 tracking-tight">Esmaltado</p>
                  <p className="font-black text-xs flex items-center gap-2 mb-1">Tono 'Slow Earth' <ArrowRight size={14} className="text-gray-300" /></p>
                  <p className="text-gray-500 font-medium">$14.90</p>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/4 w-40 h-28 bg-[#D1D1CB] rounded-[50%_50%_60%_40%] opacity-60 blur-[1px] -z-0"></div>
          <div className="absolute bottom-4 right-1/4 w-56 h-36 bg-[#B5B5AF] rounded-[40%_60%_30%_70%] opacity-50 blur-[2px] -z-0"></div>
        </div>

        {/* Sección de Preguntas Frecuentes (FAQ) */}
        <section className="max-w-4xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 italic">Dudas Comunes</h2>
            <p className="text-gray-400 text-sm tracking-widest uppercase font-bold">Todo sobre tu próxima cita</p>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#EAE8E1] pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            {/* Logo y Bio */}
            <div className="md:col-span-1">
              <h2 className="text-3xl font-serif mb-6 tracking-tighter italic">Nail Studio.</h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                Fusionamos el arte de la manicura con el bienestar orgánico para manos y pies que inspiran.
              </p>
              <div className="flex gap-4">
                <Instagram size={18} className="text-gray-400 hover:text-[#4A5D4E] cursor-pointer transition-colors" />
                <Facebook size={18} className="text-gray-400 hover:text-[#4A5D4E] cursor-pointer transition-colors" />
                <Twitter size={18} className="text-gray-400 hover:text-[#4A5D4E] cursor-pointer transition-colors" />
              </div>
            </div>

            {/* Menú de Servicios */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Servicios</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li className="hover:text-[#2D2D2D] cursor-pointer transition-colors">Manicura Premium</li>
                <li className="hover:text-[#2D2D2D] cursor-pointer transition-colors">Pedicura SPA</li>
                <li className="hover:text-[#2D2D2D] cursor-pointer transition-colors">Nail Art</li>
                <li className="hover:text-[#2D2D2D] cursor-pointer transition-colors">Uñas de Gel</li>
              </ul>
            </div>

            {/* Studio */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6">El Studio</h4>
              <ul className="space-y-4 text-sm text-gray-500 font-medium">
                <li className="hover:text-[#2D2D2D] cursor-pointer transition-colors">Nuestro Equipo</li>
                <li className="hover:text-[#2D2D2D] cursor-pointer transition-colors">Filosofía Clean</li>
                <li className="hover:text-[#2D2D2D] cursor-pointer transition-colors">Ubicaciones</li>
                <li className="hover:text-[#2D2D2D] cursor-pointer transition-colors">Franquicias</li>
              </ul>
            </div>

            {/* Suscripción */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest mb-6">Novedades</h4>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">Suscríbete para recibir consejos de cuidado y promociones exclusivas.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Tu correo" 
                  className="bg-transparent border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-[#4A5D4E] flex-1"
                />
                <button className="bg-[#4A5D4E] text-white p-2 rounded-full hover:opacity-90 transition-opacity">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-10 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              © 2024 Nail Studio & SPA. Todos los derechos reservados.
            </p>
            <div className="flex gap-8 text-[10px] text-gray-400 uppercase tracking-widest font-bold">
              <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacidad</span>
              <span className="hover:text-gray-600 cursor-pointer transition-colors">Condiciones</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;