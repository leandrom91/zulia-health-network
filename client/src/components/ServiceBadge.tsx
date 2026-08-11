import React from 'react';
import { ServiceStatus, ServiceType } from '../types';
import { TestTube, Activity, Pill, Stethoscope, AlertTriangle } from 'lucide-react';

interface ServiceBadgeProps {
  type: ServiceType;
  status?: ServiceStatus;
  showText?: boolean;
}

export const SERVICE_NAMES: Record<ServiceType, string> = {
  [ServiceType.LABORATORY]: 'Laboratorio',
  [ServiceType.X_RAY]: 'Rayos X',
  [ServiceType.PHARMACY]: 'Farmacia',
  [ServiceType.DENTISTRY]: 'Odontología',
  [ServiceType.EMERGENCY]: 'Emergencia',
};

export const ServiceBadge: React.FC<ServiceBadgeProps> = ({ type, status = ServiceStatus.NOT_PROVIDED, showText = true }) => {
  const getIcon = () => {
    switch (type) {
      case ServiceType.LABORATORY:
        return <TestTube className="w-3.5 h-3.5" />;
      case ServiceType.X_RAY:
        return <Activity className="w-3.5 h-3.5" />;
      case ServiceType.PHARMACY:
        return <Pill className="w-3.5 h-3.5" />;
      case ServiceType.DENTISTRY:
        return <Stethoscope className="w-3.5 h-3.5" />;
      case ServiceType.EMERGENCY:
        return <AlertTriangle className="w-3.5 h-3.5" />;
    }
  };

  const getStatusStyles = () => {
    switch (status) {
      case ServiceStatus.AVAILABLE:
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500 animate-pulse',
          label: 'Activo',
        };
      case ServiceStatus.UNAVAILABLE:
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          label: 'Inactivo',
        };
      case ServiceStatus.NOT_PROVIDED:
      default:
        return {
          bg: 'bg-slate-100 text-slate-500 border-slate-200',
          dot: 'bg-slate-400',
          label: 'No posee',
        };
    }
  };

  const style = getStatusStyles();

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${style.bg}`}
      title={`${SERVICE_NAMES[type]}: ${style.label}`}
    >
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      <span className="flex items-center gap-1">
        {getIcon()}
        {showText && <span>{SERVICE_NAMES[type]}</span>}
      </span>
    </div>
  );
};
