import React, { useMemo } from 'react';
import { Calendar as CalendarIcon, RefreshCw, X, Check, AlertTriangle } from 'lucide-react';

const formatDate = (date) => date || '---';

const AppointmentCard = ({ appt, onReschedule, onCancel, onTogglePaid }) => {
  // Verificación extrema por si la cita es nula
  if (!appt) return null;

  const isPaid = (appt.paid ?? (appt.status?.toLowerCase().includes('confirm') || appt.status?.toLowerCase().includes('pagado')));
  const statusLabel = appt.status || 'Pendiente';

  return (
    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4 w-full">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-glow">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-primary">{formatDate(appt.date)}</h4>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{appt.time}</p>
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}> 
          {isPaid ? 'Pagado' : 'Pendiente'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="text-xs text-gray-600">
          <p className="font-black text-gray-800">Cliente</p>
          <p className="break-words">{appt.profiles?.email || appt.user_email || appt.user?.email || 'N/A'}</p>
        </div>
        <div className="text-xs text-gray-600">
          <p className="font-black text-gray-800">Estado</p>
          <p>{statusLabel}</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Servicios</p>
        <div className="space-y-2">
          {(() => {
            let services = appt.services;
            if (typeof services === 'string') {
              try {
                services = JSON.parse(services);
              } catch {
                services = null;
              }
            }
            if (Array.isArray(services) && services.length > 0) {
              return services.map(srv => (
                <div key={srv?.id ?? srv?.name ?? JSON.stringify(srv)} className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-gray-600">{srv?.name || srv || '—'}</span>
                  <span className="text-[10px] font-medium text-gray-400">{srv?.time || ''}</span>
                </div>
              ));
            }
            return <p className="text-[10px] text-gray-400">Sin servicios</p>;
          })()}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onReschedule(appt)}
          className="flex-1 min-w-[120px] py-3 bg-gray-50 text-primary rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 hover:bg-gray-100 active:scale-95 transition-all uppercase tracking-widest"
        >
          <RefreshCw size={12} /> Reagendar
        </button>
        <button
          onClick={() => onTogglePaid(appt)}
          className={`flex-1 min-w-[120px] py-3 rounded-2xl text-[10px] font-black flex items-center justify-center gap-2 active:scale-95 transition-all uppercase tracking-widest ${isPaid ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
        >
          <Check size={12} /> marcar {isPaid ? 'No pagado' : 'Pagado'}
        </button>
        <button
          onClick={() => onCancel(appt.id)}
          className="w-12 h-12 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center hover:bg-red-100 active:scale-95 transition-all"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

const AdminView = ({
  appointments = [],
  setStep,
  startReschedule,
  cancelAppointment,
  togglePaidStatus,
}) => {
  const groupedByDate = useMemo(() => {
    const groups = {};
    
    // --- AQUÍ ESTÁ EL ARREGLO PRINCIPAL ---
    (appointments || []).forEach(appt => {
      // Si la cita por alguna razón es nula o indefinida, la ignoramos y no se rompe la app
      if (!appt) return; 
      
      const key = appt.date || 'Sin fecha';
      groups[key] = groups[key] || [];
      groups[key].push(appt);
    });
    
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      return a.localeCompare(b);
    });
    return sortedKeys.reduce((acc, key) => ({ ...acc, [key]: groups[key] }), {});
  }, [appointments]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-primary">Panel de Administración</h2>
          <p className="text-sm text-gray-500">Gestiona citas, reprograma, cancela y marca pagos.</p>
        </div>
        <button
          onClick={() => setStep('home')}
          className="px-6 py-2.5 bg-white text-primary rounded-xl font-bold text-xs shadow-lg border border-gray-200"
        >
          Volver al usuario
        </button>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
          <p className="text-gray-500 font-bold">No hay citas registradas todavía.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByDate).map(([date, items]) => (
            <section key={date} className="space-y-4">
              <h3 className="text-lg font-bold text-primary">{date}</h3>
              <div className="grid gap-4">
                {items.map(appt => (
                  // Añadimos otra capa de seguridad aquí por si las moscas
                  appt && (
                    <AppointmentCard
                      key={appt.id}
                      appt={appt}
                      onReschedule={startReschedule}
                      onCancel={cancelAppointment}
                      onTogglePaid={togglePaidStatus}
                    />
                  )
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminView;