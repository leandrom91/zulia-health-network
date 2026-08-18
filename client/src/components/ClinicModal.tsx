import React, { useState, useEffect } from 'react';
import { Clinic, ServiceType } from '../types';
import { ServiceBadge, SERVICE_NAMES } from './ServiceBadge';
import {
  X,
  MapPin,
  Navigation,
  UserCheck,
  Stethoscope,
  HeartHandshake,
  Clock,
  Calendar,
  Image as ImageIcon,
  Sparkles,
  Activity,
  Printer,
  CheckCircle2,
  Phone,
  Share2,
  FileText,
  User,
  ShieldCheck,
  ChevronRight,
  Maximize2
} from 'lucide-react';

interface ClinicModalProps {
  clinic: Clinic | null;
  onClose: () => void;
}

const SPECIALTIES = [
  { id: 'LABORATORY', name: 'Laboratorio Clínico', icon: '🔬', desc: 'Exámenes de sangre, orina y perfiles de rutina' },
  { id: 'DENTISTRY', name: 'Odontología', icon: '🦷', desc: 'Evaluación bucal, limpieza y odontología general' },
  { id: 'GENERAL_MEDICINE', name: 'Medicina General', icon: '🩺', desc: 'Consulta médica preventiva y diagnóstico primario' },
  { id: 'INTERNAL_MEDICINE', name: 'Medicina Interna', icon: '📋', desc: 'Atención especializada para adultos y patologías crónicas' },
];

export const ClinicModal: React.FC<ClinicModalProps> = ({ clinic, onClose }) => {
  // Listen for Escape Key to Close Modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Lock background body scroll while modal is open
  useEffect(() => {
    if (clinic) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [clinic]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [containFit, setContainFit] = useState(false);

  // Appointment Form State
  const [selectedSpecialty, setSelectedSpecialty] = useState('GENERAL_MEDICINE');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [appointmentShift, setAppointmentShift] = useState<'MAÑANA' | 'TARDE'>('MAÑANA');
  const [patientName, setPatientName] = useState('');
  const [patientCedula, setPatientCedula] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  if (!clinic) return null;

  const images = clinic.images && clinic.images.length > 0 ? clinic.images : [
    {
      id: 101,
      imageUrl: '/mpps-fachada-corito1.jpg',
      caption: 'Fachada e Instalaciones Principales Ambulatorio Corito 1',
      isPrimary: true
    },
    {
      id: 102,
      imageUrl: '/mpps-consultorio-medico.jpg',
      caption: 'Consultorio Médico de Atención Primaria e Integral con Autoridades Sanitarias',
      isPrimary: false
    },
    {
      id: 103,
      imageUrl: '/mpps-odontologia-laboratorio.jpg',
      caption: 'Área de Odontología y Exámenes Clínicos Especializados',
      isPrimary: false
    },
    {
      id: 104,
      imageUrl: '/mpps-farmacia-insumos.jpg',
      caption: 'Despacho de Farmacia e Insumos Sanitarios de la Red Popular',
      isPrimary: false
    },
    {
      id: 105,
      imageUrl: '/mpps-personal-medico.jpg',
      caption: 'Personal Médico y Equipo de Enfermería Activo en Planta',
      isPrimary: false
    }
  ];

  const isCorito = clinic.id === 1;

  const handlePrint = () => {
    window.print();
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientCedula.trim() || !patientPhone.trim()) {
      alert('Por favor complete todos los datos del paciente para generar su cita médica.');
      return;
    }

    const randomTicket = `MPPS-ZUL-${clinic.id}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketNumber(randomTicket);
    setBookingConfirmed(true);
  };

  const selectedSpecialtyObj = SPECIALTIES.find((s) => s.id === selectedSpecialty) || SPECIALTIES[2];

  const getWhatsAppMessageUrl = () => {
    const text = `🏥 *SOLICITUD DE CITA MÉDICA - RED DE SALUD ZULIA*\n\n` +
      `📌 *Centro:* ${clinic.name}\n` +
      `🎫 *Ticket N°:* ${ticketNumber}\n` +
      `🩺 *Especialidad:* ${selectedSpecialtyObj.name}\n` +
      `📅 *Fecha:* ${appointmentDate}\n` +
      `⏰ *Turno:* ${appointmentShift === 'MAÑANA' ? 'Mañana (7:00 AM - 12:00 PM)' : 'Tarde (1:00 PM - 5:00 PM)'}\n` +
      `👤 *Paciente:* ${patientName}\n` +
      `🆔 *Cédula:* ${patientCedula}\n` +
      `📞 *Teléfono:* ${patientPhone}\n\n` +
      `_Comprobante emitido por el Sistema Integrado MPPS Zulia._`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 animate-in fade-in zoom-in duration-200 print:shadow-none print:border-none print:m-0 print:max-w-none flex flex-col max-h-[92vh]"
      >
        
        {/* Header Bar */}
        <div className="zulia-gradient-bg px-6 py-4 text-white flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
              <Stethoscope className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Ficha Técnica Oficial MPPS Zulia
                </span>
                {isCorito && (
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" /> Caso de Prueba Principal
                  </span>
                )}
              </div>
              <h2 className="text-lg md:text-2xl font-extrabold tracking-tight mt-0.5">
                {clinic.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-white/90 hover:text-white bg-white/15 hover:bg-white/25 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold px-3 print:hidden"
              title="Imprimir Ficha / Guardar como PDF"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Imprimir Ficha / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors print:hidden"
              title="Cerrar Ficha"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-5 md:p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Gallery Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-sans">
                <ImageIcon className="w-4 h-4 text-blue-600" /> Galería de Infraestructura & Registro Visual
              </h3>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setContainFit(!containFit)}
                  className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-md border border-blue-200"
                  title="Cambiar modo de ajuste de imagen"
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>{containFit ? 'Modo Relleno' : 'Modo Completo'}</span>
                </button>
                <span className="text-xs text-slate-500 font-bold">
                  {activeImageIndex + 1} de {images.length} fotos
                </span>
              </div>
            </div>

            {/* Main Picture Frame with Optimized Focal Point (Header visible) */}
            <div className="relative h-64 md:h-88 rounded-2xl overflow-hidden bg-slate-950 shadow-lg border border-slate-200 flex items-center justify-center">
              <img
                src={images[activeImageIndex].imageUrl}
                alt={images[activeImageIndex].caption}
                className={`w-full h-full transition-all duration-300 ${
                  containFit ? 'object-contain' : 'object-cover'
                }`}
                style={{
                  objectPosition: activeImageIndex === 1 ? 'center 15%' : 'center center'
                }}
              />
              
              {/* Caption Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent p-4 text-white">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs sm:text-sm font-bold text-slate-100">
                    {images[activeImageIndex].caption}
                  </p>
                  <span className="text-[10px] uppercase font-mono tracking-wider bg-white/20 px-2 py-0.5 rounded text-amber-300 shrink-0">
                    Foto {activeImageIndex + 1}/{images.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1.5 pt-0.5">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 sm:w-24 h-14 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      idx === activeImageIndex
                        ? 'border-blue-600 ring-4 ring-blue-600/30 scale-105 shadow-md'
                        : 'border-slate-200 opacity-60 hover:opacity-100 hover:border-blue-300'
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ objectPosition: idx === 1 ? 'center 15%' : 'center center' }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid Layout: Column 1 (Directiva, Personal, MÓDULO AGENDAR CITA) | Column 2 (Semáforo, Horarios) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            
            {/* ─── Left Column: Directiva + Personal Médico + MÓDULO AGENDAR CITA ─── */}
            <div className="space-y-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-sans">
                <UserCheck className="w-4 h-4 text-blue-600" /> Personal Directivo & Planta Médica
              </h3>

              {/* Director Card */}
              {clinic.director ? (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 shadow-xs">
                  <img
                    src={clinic.director.photoUrl}
                    alt={clinic.director.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-900 uppercase tracking-wider bg-blue-200/80 px-2.5 py-0.5 rounded-full">
                      {clinic.director.title}
                    </span>
                    <h4 className="font-extrabold text-slate-900 text-base mt-1">
                      {clinic.director.fullName}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold">Encargado(a) del Centro de Salud</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                  Dirección médica asignada por la Coordinación Regional de Salud Zulia.
                </div>
              )}

              {/* Active Medical Staff Metrics (10 Médicos Activos / 14 Enfermeras Planta) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50/90 border border-emerald-300 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-800 mb-1">
                    <Stethoscope className="w-4 h-4" />
                    <span className="text-xs font-extrabold uppercase tracking-wide">Médicos Activos</span>
                  </div>
                  <div className="text-3xl font-black text-emerald-950 font-sans">
                    {clinic.staff?.activeDoctors || 10}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-bold">Generales y Especialistas</span>
                </div>

                <div className="bg-blue-50/90 border border-blue-300 p-4 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-2 text-blue-800 mb-1">
                    <HeartHandshake className="w-4 h-4" />
                    <span className="text-xs font-extrabold uppercase tracking-wide">Enfermeras Planta</span>
                  </div>
                  <div className="text-3xl font-black text-blue-950 font-sans">
                    {clinic.staff?.activeNurses || 14}
                  </div>
                  <span className="text-[11px] text-blue-700 font-bold">Asistencia médica activa</span>
                </div>
              </div>

              {/* ─── NUEVO MÓDULO: AGENDAR CITA / SOLICITUD DE TURNO (En el espacio en blanco) ─── */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-blue-950 text-white p-5 rounded-2xl border border-blue-900/60 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-400/20 text-amber-400 rounded-lg border border-amber-400/30">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-tight font-sans">
                        Agendar Cita / Turno de Atención
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        Servicio digital sin costo • Red de Atención Primaria
                      </p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    En Línea
                  </span>
                </div>

                {!bookingConfirmed ? (
                  <form onSubmit={handleBookAppointment} className="space-y-3.5 text-xs">
                    {/* Specialty Selector */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        1. Seleccione Especialidad Médica:
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {SPECIALTIES.map((spec) => (
                          <button
                            key={spec.id}
                            type="button"
                            onClick={() => setSelectedSpecialty(spec.id)}
                            className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2 ${
                              selectedSpecialty === spec.id
                                ? 'bg-blue-600 border-blue-400 text-white shadow-md ring-2 ring-blue-400/40'
                                : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-slate-300'
                            }`}
                          >
                            <span className="text-base">{spec.icon}</span>
                            <div>
                              <div className="font-extrabold text-[11px] leading-tight">{spec.name}</div>
                              <div className="text-[9px] text-slate-400 line-clamp-1 mt-0.5 opacity-90">{spec.desc}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date & Shift */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                          2. Fecha:
                        </label>
                        <input
                          type="date"
                          value={appointmentDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setAppointmentDate(e.target.value)}
                          className="w-full p-2 text-xs font-bold bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                          3. Turno:
                        </label>
                        <select
                          value={appointmentShift}
                          onChange={(e) => setAppointmentShift(e.target.value as 'MAÑANA' | 'TARDE')}
                          className="w-full p-2 text-xs font-bold bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-amber-400 focus:outline-none"
                        >
                          <option value="MAÑANA">Mañana (7:00 AM - 12:00 PM)</option>
                          <option value="TARDE">Tarde (1:00 PM - 5:00 PM)</option>
                        </select>
                      </div>
                    </div>

                    {/* Patient Details */}
                    <div className="space-y-2 pt-1 border-t border-slate-800">
                      <div>
                        <input
                          type="text"
                          placeholder="Nombre y Apellido del Paciente"
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          className="w-full p-2 text-xs font-medium bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Cédula (Ej: V-18.456.789)"
                          value={patientCedula}
                          onChange={(e) => setPatientCedula(e.target.value)}
                          className="w-full p-2 text-xs font-medium bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                          required
                        />
                        <input
                          type="tel"
                          placeholder="Teléfono / WhatsApp"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          className="w-full p-2 text-xs font-medium bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-amber-400 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 text-xs font-black uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-slate-950" />
                      <span>Confirmar y Generar Turno Digital</span>
                    </button>
                  </form>
                ) : (
                  /* Confirmation Ticket View */
                  <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/50 space-y-3 animate-in fade-in">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                      <div>
                        <div className="font-black text-xs uppercase tracking-wider">¡Cita Agendada con Éxito!</div>
                        <div className="text-[10px] text-slate-400">Comprobante oficial de turno médico</div>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1 font-mono">
                      <div className="flex justify-between text-amber-300 font-bold">
                        <span>Ticket:</span>
                        <span>{ticketNumber}</span>
                      </div>
                      <div className="flex justify-between text-slate-200">
                        <span>Especialidad:</span>
                        <span className="font-sans font-bold">{selectedSpecialtyObj.name}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Fecha / Turno:</span>
                        <span>{appointmentDate} ({appointmentShift})</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Paciente:</span>
                        <span className="font-sans font-medium">{patientName} (CI: {patientCedula})</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={getWhatsAppMessageUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-[11px] font-black uppercase text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingConfirmed(false);
                          setPatientName('');
                          setPatientCedula('');
                        }}
                        className="p-2 text-[11px] font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
                      >
                        Nueva Cita
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ─── Right Column: Semáforo de Servicios + Horarios + Cupos ─── */}
            <div className="space-y-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 font-sans">
                <Activity className="w-4 h-4 text-blue-600" /> Semáforo de Servicios (Estatus en Tiempo Real)
              </h3>

              <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/90 shadow-xs">
                {(Object.keys(clinic.services || {}) as ServiceType[]).map((serviceKey) => {
                  const status = clinic.services?.[serviceKey];
                  return (
                    <div
                      key={serviceKey}
                      className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-xs"
                    >
                      <span className="text-xs font-extrabold text-slate-800">
                        {SERVICE_NAMES[serviceKey]}
                      </span>
                      <ServiceBadge type={serviceKey} status={status} />
                    </div>
                  );
                })}
              </div>

              {/* Schedules & Quota Details (Horario 7:00 AM - 5:00 PM) */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300 space-y-2.5 text-xs shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-950 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-700 shrink-0" /> Horario de Atención Oficial:
                  </span>
                  <span className="font-black text-slate-900 bg-amber-200/70 px-2.5 py-1 rounded-lg border border-amber-300">
                    {clinic.schedule}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-amber-950 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-700 shrink-0" /> Cupos Disponibles Hoy:
                  </span>
                  <span className="font-black text-emerald-900 bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-300">
                    {clinic.dailyQuotaAvailable} de {clinic.dailyQuotaTotal} cupos
                  </span>
                </div>
              </div>

              {/* Quick Info Callout */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" /> Atención Médica Integral y Gratuita
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Las consultas y despachos de farmacia están garantizados por el Ministerio del Poder Popular para la Salud y la Gobernación del Estado Zulia.
                </p>
              </div>
            </div>

          </div>

          {/* Location & Navigation Bar (Optimized Google Maps Directions Route) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30 shrink-0">
                <MapPin className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-100">{clinic.address}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Municipio {clinic.municipality} • Parroquia {clinic.parish} • Coordenadas: {clinic.latitude.toFixed(4)}, {clinic.longitude.toFixed(4)}
                </p>
              </div>
            </div>

            <a
              href={clinic.googleMapsUrl || `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl transition-all shadow-lg shrink-0 uppercase tracking-wider"
              title={`Iniciar ruta GPS en Google Maps hacia ${clinic.name}`}
            >
              <Navigation className="w-4 h-4 text-slate-950 shrink-0" />
              <span>Cómo llegar (Ruta Google Maps)</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
