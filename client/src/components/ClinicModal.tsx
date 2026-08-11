import React, { useState, useEffect } from 'react';
import { Clinic, ServiceType } from '../types';
import { ServiceBadge, SERVICE_NAMES } from './ServiceBadge';
import { X, MapPin, Navigation, UserCheck, Stethoscope, HeartHandshake, Clock, Calendar, Image as ImageIcon, Sparkles, Activity, Printer } from 'lucide-react';

interface ClinicModalProps {
  clinic: Clinic | null;
  onClose: () => void;
}

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

  if (!clinic) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = clinic.images && clinic.images.length > 0 ? clinic.images : [
    {
      id: 999,
      imageUrl: '/WhatsApp Image 2026-07-30 at 18.50.10.jpeg',
      caption: 'Instalaciones del Centro Medico',
      isPrimary: true
    }
  ];

  const isCorito = clinic.id === 1;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200 animate-in fade-in zoom-in duration-200 print:shadow-none print:border-none print:m-0 print:max-w-none"
      >
        
        {/* Header Bar */}
        <div className="zulia-gradient-bg px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
              <Stethoscope className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                  Ficha Técnica Oficial MPPS Zulia
                </span>
                {isCorito && (
                  <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" /> Tesis Caso Estelar
                  </span>
                )}
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight mt-0.5">
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

        {/* Modal Body */}
        <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto space-y-8">
          
          {/* Gallery Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-blue-600" /> Galería de Infraestructura & Registro Visual
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {activeImageIndex + 1} de {images.length} fotos
              </span>
            </div>

            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden bg-slate-900 shadow-md">
              <img
                src={images[activeImageIndex].imageUrl}
                alt={images[activeImageIndex].caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 text-white">
                <p className="text-sm font-semibold">{images[activeImageIndex].caption}</p>
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      idx === activeImageIndex ? 'border-blue-600 ring-2 ring-blue-600/30' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Grid Layout for Director / Staff & Services Semaphore */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Directiva & Personal Activo */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" /> Personal Directivo & Planta Médica
              </h3>

              {/* Director Card */}
              {clinic.director ? (
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                  <img
                    src={clinic.director.photoUrl}
                    alt={clinic.director.fullName}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider bg-blue-200/60 px-2 py-0.5 rounded-full">
                      {clinic.director.title}
                    </span>
                    <h4 className="font-bold text-slate-900 text-base mt-1">
                      {clinic.director.fullName}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">Encargado(a) del Centro</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500">
                  Dirección médica asignada por la Coordinación Regional de Salud Zulia.
                </div>
              )}

              {/* Active Medical Staff Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-emerald-800 mb-1">
                    <Stethoscope className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Médicos Activos</span>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-900">
                    {clinic.staff?.activeDoctors || 0}
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium">En turno de consulta</span>
                </div>

                <div className="bg-blue-50/80 border border-blue-200 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 text-blue-800 mb-1">
                    <HeartHandshake className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Enfermeras Planta</span>
                  </div>
                  <div className="text-2xl font-extrabold text-blue-900">
                    {clinic.staff?.activeNurses || 0}
                  </div>
                  <span className="text-[10px] text-blue-700 font-medium">Asistencia médica activa</span>
                </div>
              </div>
            </div>

            {/* Right Column: Semáforo de Servicios en Tiempo Real */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" /> Semáforo de Servicios (Estatus en Tiempo Real)
              </h3>

              <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {(Object.keys(clinic.services || {}) as ServiceType[]).map((serviceKey) => {
                  const status = clinic.services?.[serviceKey];
                  return (
                    <div
                      key={serviceKey}
                      className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
                    >
                      <span className="text-xs font-bold text-slate-800">
                        {SERVICE_NAMES[serviceKey]}
                      </span>
                      <ServiceBadge type={serviceKey} status={status} />
                    </div>
                  );
                })}
              </div>

              {/* Schedules & Quota Details */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-700" /> Horario de Atención:
                  </span>
                  <span className="font-extrabold text-slate-800">{clinic.schedule}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-700" /> Cupos Disponibles Hoy:
                  </span>
                  <span className="font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    {clinic.dailyQuotaAvailable} de {clinic.dailyQuotaTotal} cupos
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Location & Navigation Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-600/20 text-red-400 rounded-xl border border-red-500/30">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-100">{clinic.address}</h4>
                <p className="text-xs text-slate-400">
                  Municipio {clinic.municipality} • Parroquia {clinic.parish} • Coord: {clinic.latitude.toFixed(4)}, {clinic.longitude.toFixed(4)}
                </p>
              </div>
            </div>

            <a
              href={clinic.googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-extrabold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-lg shrink-0"
            >
              <Navigation className="w-4 h-4" />
              <span>Iniciar Ruta en Google Maps</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
