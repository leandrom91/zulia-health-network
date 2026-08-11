import React from 'react';
import { Clinic, ServiceType, ClinicType } from '../types';
import { ServiceBadge } from './ServiceBadge';
import { MapPin, Navigation, Clock, Users, ChevronRight, Award } from 'lucide-react';

interface ClinicCardProps {
  clinic: Clinic;
  onSelectClinic: (clinic: Clinic) => void;
}

export const ClinicCard: React.FC<ClinicCardProps> = ({ clinic, onSelectClinic }) => {
  const getClinicTypeLabel = (type: ClinicType) => {
    switch (type) {
      case ClinicType.TYPE_1:
        return 'Ambulatorio Tipo 1';
      case ClinicType.TYPE_2:
        return 'Ambulatorio Tipo 2';
      case ClinicType.TYPE_3:
        return 'Ambulatorio Tipo 3';
    }
  };

  const isCorito = clinic.id === 1;

  return (
    <div
      onClick={() => onSelectClinic(clinic)}
      className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden cursor-pointer ${
        isCorito
          ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
          : 'border-slate-200/80 shadow-sm'
      }`}
    >
      <div>
        {/* Card Header Header Tag */}
        <div className="p-5 pb-3 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {getClinicTypeLabel(clinic.type)}
            </span>
            {isCorito && (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Award className="w-3 h-3 text-amber-600" /> CASO DE PRUEBA
              </span>
            )}
          </div>
          <h3 className="font-bold text-slate-900 text-lg leading-snug tracking-tight">
            {clinic.name}
          </h3>
          <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <span className="font-semibold text-slate-700">{clinic.municipality}</span> • Parroquia {clinic.parish}
          </p>
        </div>

        {/* Info Content */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {clinic.address}
          </p>

          {/* Operational Quick Info */}
          <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Horario</div>
                <div className="font-bold text-slate-800">{clinic.schedule}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Cupos Hoy</div>
                <div className="font-bold text-emerald-700">
                  {clinic.dailyQuotaAvailable} / {clinic.dailyQuotaTotal}
                </div>
              </div>
            </div>
          </div>

          {/* Services Semaphore */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Semáforo de Servicios
            </div>
            <div className="flex flex-wrap gap-1.5">
              <ServiceBadge type={ServiceType.LABORATORY} status={clinic.services?.[ServiceType.LABORATORY]} />
              <ServiceBadge type={ServiceType.X_RAY} status={clinic.services?.[ServiceType.X_RAY]} />
              <ServiceBadge type={ServiceType.PHARMACY} status={clinic.services?.[ServiceType.PHARMACY]} />
              <ServiceBadge type={ServiceType.DENTISTRY} status={clinic.services?.[ServiceType.DENTISTRY]} />
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <div className="p-4 pt-0 flex items-center justify-between gap-2">
        <a
          href={clinic.googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors"
        >
          <Navigation className="w-3.5 h-3.5 text-blue-600" />
          <span>Iniciar Ruta</span>
        </a>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelectClinic(clinic);
          }}
          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-bold text-white zulia-gradient-bg hover:opacity-95 rounded-xl shadow-md transition-all"
        >
          <span>Ver Ficha</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
