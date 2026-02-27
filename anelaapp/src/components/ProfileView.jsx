import React from 'react';
import { Calendar as CalendarIcon, Edit3, Save, Mail, Phone, Heart, Clock, CheckCircle, RefreshCw, LogOut, Check } from 'lucide-react';

const ProfileView = ({ user, setUser, setStep, isEditingProfile, setIsEditingProfile, editForm, setEditForm, handleSaveProfile, appointments, startReschedule, cancelAppointment, AVATARS }) => (
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
);

export default ProfileView;