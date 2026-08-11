import React from 'react';
import { Clinic } from '../types';
import { AdminPage } from './AdminPage';

interface AdminCMSModalProps {
  clinics: Clinic[];
  onClose: () => void;
  onRefreshData: () => void;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({ clinics, onClose, onRefreshData }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950">
      <AdminPage
        clinics={clinics}
        onRefreshData={onRefreshData}
        onGoHome={onClose}
      />
    </div>
  );
};
