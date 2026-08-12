import React, { useState, useEffect } from 'react';
import { Clinic, ServiceType, ServiceStatus, AuthUser, ClinicType } from '../types';
import { SERVICE_NAMES } from './ServiceBadge';
import { updateClinicServiceStatus, updateClinicStaffCount, api } from '../services/api';
import {
  Lock,
  ShieldCheck,
  RefreshCw,
  User,
  Key,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Building2,
  CheckCircle2,
  LogOut,
  Activity,
  Award,
  UserPlus,
  Users,
  Trash2,
  Sliders,
  Search,
  PlusCircle,
  UserCheck,
  Edit,
  Check,
  Save
} from 'lucide-react';

interface AdminPageProps {
  clinics: Clinic[];
  onRefreshData: () => void;
  onGoHome: () => void;
}

interface UserItem {
  id: number;
  username: string;
  fullName: string;
  role: string;
  clinicId: number | null;
  createdAt: string;
}

const MUNICIPALITIES = [
  'Maracaibo',
  'San Francisco',
  'Cabimas',
  'Lagunillas',
  'Mara',
  'Guajira',
  'Machiques de Perijá',
  'Colón',
  'Baralt',
  'La Cañada de Urdaneta',
  'Rosario de Perijá',
  'Santa Rita',
  'Miranda',
  'Valmore Rodríguez',
  'Simón Bolívar',
  'Sucre',
  'Francisco Javier Pulgar',
  'Catatumbo',
  'Jesús María Semprún',
  'Jesús Enrique Lossada'
];

export const AdminPage: React.FC<AdminPageProps> = ({ clinics, onRefreshData, onGoHome }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('zulia_cms_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Local state for unfiltered Admin Clinics list
  const [adminClinics, setAdminClinics] = useState<Clinic[]>(clinics);

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'clinics'>('clinics');
  
  // Clinics Management & Filter Search State
  const [clinicSearchFilter, setClinicSearchFilter] = useState('');
  const [selectedClinicId, setSelectedClinicId] = useState<number>(1);
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Controlled Staff State for Selected Clinic
  const [editDoctors, setEditDoctors] = useState<number>(6);
  const [editNurses, setEditNurses] = useState<number>(12);

  // New Clinic Modal State
  const [showAddClinicModal, setShowAddClinicModal] = useState(false);
  const [newClinicName, setNewClinicName] = useState('');
  const [newClinicType, setNewClinicType] = useState<ClinicType>(ClinicType.TYPE_1);
  const [newClinicMunicipality, setNewClinicMunicipality] = useState('Maracaibo');
  const [newClinicParish, setNewClinicParish] = useState('');
  const [newClinicAddress, setNewClinicAddress] = useState('');
  const [newClinicSchedule, setNewClinicSchedule] = useState('7:00 AM - 1:00 PM');
  const [newClinicDirector, setNewClinicDirector] = useState('');
  const [newClinicDoctors, setNewClinicDoctors] = useState(6);
  const [newClinicNurses, setNewClinicNurses] = useState(12);

  // Users CRUD State
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('COORDINATOR');
  const [newClinicId, setNewClinicId] = useState<string>('1');

  // Reload admin clinics directly from API
  const reloadAdminClinics = async () => {
    try {
      const res = await axios.get('/api/clinics');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setAdminClinics(res.data);
      }
    } catch (e: any) {
      console.error('Error fetching admin clinics:', e);
      setErrorMessage('No se pudo sincronizar la lista de ambulatorios con el servidor.');
    }
    onRefreshData();
  };

  useEffect(() => {
    reloadAdminClinics();
  }, []);

  // Listen for Escape Key to Close Modals in CMS Admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAddClinicModal(false);
        setShowAddUserModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock background body scroll when any modal is open in CMS Admin
  useEffect(() => {
    if (showAddClinicModal || showAddUserModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showAddClinicModal, showAddUserModal]);

  // Sync if prop clinics updates
  useEffect(() => {
    if (clinics && clinics.length > 0) {
      setAdminClinics((prev) => {
        const prevIds = new Set(prev.map((c) => c.id));
        const missingFromProps = clinics.filter((c) => !prevIds.has(c.id));
        if (missingFromProps.length > 0) {
          return [...prev, ...missingFromProps];
        }
        return prev;
      });
    }
  }, [clinics]);

  // Filtered Clinics List based on Search Box
  const filteredClinics = adminClinics.filter((c) => {
    const q = clinicSearchFilter.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.municipality.toLowerCase().includes(q) ||
      c.parish.toLowerCase().includes(q)
    );
  });

  const displaySelectClinics = clinicSearchFilter.trim() ? filteredClinics : adminClinics;

  const currentClinic = adminClinics.find((c) => c.id === selectedClinicId) || displaySelectClinics[0] || adminClinics[0];

  // Sync Staff Controlled Inputs when selected clinic changes
  useEffect(() => {
    if (currentClinic) {
      setEditDoctors(currentClinic.staff?.activeDoctors || 0);
      setEditNurses(currentClinic.staff?.activeNurses || 0);
    }
  }, [currentClinic?.id]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      setUsersList(response.data);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setErrorMessage('Error al consultar el directorio de usuarios.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await api.post('/auth/login', { username, password });
      setUser(response.data.user);
      localStorage.setItem('zulia_cms_user', JSON.stringify(response.data.user));
      if (response.data.token) {
        localStorage.setItem('zulia_cms_token', response.data.token);
      }
    } catch (err: any) {
      setLoginError('Credenciales inválidas. Verifique su usuario y contraseña encriptada (admin / Admin321!).');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zulia_cms_user');
    localStorage.removeItem('zulia_cms_token');
    setUser(null);
  };

  const handleToggleClinicActive = async (clinicId: number, currentActiveState?: boolean) => {
    const newState = !(currentActiveState !== false);
    setIsUpdating(true);

    // Instant local state mutation
    setAdminClinics((prev) =>
      prev.map((c) => (c.id === clinicId ? { ...c, isActive: newState } : c))
    );

    try {
      await api.put(`/clinics/${clinicId}/status`, { isActive: newState });
      setSuccessMessage(`Estado de ambulatorio cambiado a ${newState ? '🟢 ACTIVO' : '🔴 INACTIVO'}.`);
      onRefreshData();
      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (err: any) {
      console.error('Error toggling clinic status:', err);
      setErrorMessage(err.response?.data?.error || 'Error al cambiar estado del ambulatorio.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleService = async (serviceType: ServiceType, newStatus: ServiceStatus) => {
    if (!currentClinic) return;
    setIsUpdating(true);

    // Instant local state mutation
    setAdminClinics((prev) =>
      prev.map((c) =>
        c.id === currentClinic.id
          ? { ...c, services: { ...c.services, [serviceType]: newStatus } }
          : c
      )
    );

    try {
      await updateClinicServiceStatus(currentClinic.id, serviceType, newStatus);
      setSuccessMessage(`Servicio ${SERVICE_NAMES[serviceType]} actualizado a ${newStatus} en la base de datos.`);
      onRefreshData();
      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (error: any) {
      console.error('Error updating service status:', error);
      setErrorMessage(error.response?.data?.error || 'Error al actualizar estado del servicio.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateStaff = async (doctors: number, nurses: number) => {
    if (!currentClinic) return;
    setIsUpdating(true);

    // Instant local state mutation
    setAdminClinics((prev) =>
      prev.map((c) =>
        c.id === currentClinic.id
          ? { ...c, staff: { activeDoctors: doctors, activeNurses: nurses } }
          : c
      )
    );

    try {
      await updateClinicStaffCount(currentClinic.id, doctors, nurses);
      setSuccessMessage(`Personal médico de "${currentClinic.name}" actualizado a ${doctors} médicos y ${nurses} enfermeras.`);
      onRefreshData();
      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (error: any) {
      console.error('Error updating staff count:', error);
      setErrorMessage(error.response?.data?.error || 'Error al guardar personal médico.');
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCreateClinic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClinicName || !newClinicName.trim()) {
      setErrorMessage('Por favor ingrese el nombre del ambulatorio.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    const parishVal = newClinicParish && newClinicParish.trim() ? newClinicParish.trim() : 'Central';

    try {
      const response = await api.post('/clinics', {
        name: newClinicName.trim(),
        type: newClinicType,
        municipality: newClinicMunicipality,
        parish: parishVal,
        address: newClinicAddress && newClinicAddress.trim() ? newClinicAddress.trim() : `Sector ${parishVal}, ${newClinicMunicipality}, Zulia`,
        schedule: newClinicSchedule || '7:00 AM - 1:00 PM',
        directorName: newClinicDirector || 'Director(a) Médico Asignado',
        activeDoctors: newClinicDoctors || 6,
        activeNurses: newClinicNurses || 12,
      });

      const createdClinic = response.data?.clinic;

      if (createdClinic) {
        // Instant local state mutation
        setAdminClinics((prev) => {
          const exists = prev.some((c) => c.id === createdClinic.id);
          if (exists) return prev.map((c) => (c.id === createdClinic.id ? createdClinic : c));
          return [...prev, createdClinic];
        });
        setSelectedClinicId(createdClinic.id);
      }

      setClinicSearchFilter('');
      setSuccessMessage(`Ambulatorio "${newClinicName}" registrado e insertado exitosamente.`);
      setShowAddClinicModal(false);
      setNewClinicName('');
      setNewClinicParish('');
      setNewClinicAddress('');
      setNewClinicDirector('');
      
      onRefreshData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      console.error('Error creating clinic:', err);
      const msg = err.response?.data?.error || 'Error al crear el ambulatorio.';
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(''), 6000);
    }
  };

  const handleDeleteClinic = async (id: number, name: string) => {
    if (id === 1) {
      alert('No se puede eliminar el Ambulatorio Corito 1 (Caso de Prueba Principal).');
      return;
    }
    if (window.confirm(`¿Está seguro de eliminar el ambulatorio "${name}" de la red de salud del Zulia?`)) {
      // Instant local state mutation
      setAdminClinics((prev) => prev.filter((c) => c.id !== id));
      if (selectedClinicId === id) {
        setSelectedClinicId(1);
      }

      try {
        await api.delete(`/clinics/${id}`);
        setSuccessMessage(`Ambulatorio "${name}" eliminado exitosamente.`);
        onRefreshData();
        setTimeout(() => setSuccessMessage(''), 4000);
      } catch (err: any) {
        console.error('Error deleting clinic:', err);
        setErrorMessage(err.response?.data?.error || 'Error al eliminar ambulatorio.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newUsername || !newPassword) return;

    try {
      await api.post('/auth/users', {
        fullName: newFullName,
        username: newUsername,
        password: newPassword,
        role: newRole,
        clinicId: newRole === 'ADMIN' ? null : Number(newClinicId),
      });

      setSuccessMessage(`Coordinador @${newUsername} creado exitosamente con contraseña encriptada.`);
      setShowAddUserModal(false);
      setNewFullName('');
      setNewUsername('');
      setNewPassword('');
      fetchUsers();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err: any) {
      console.error('Error creating user:', err);
      setErrorMessage(err.response?.data?.error || 'Error al crear usuario.');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleDeleteUser = async (id: number, uname: string) => {
    if (id === 1) {
      alert('No se puede eliminar el administrador principal.');
      return;
    }
    if (window.confirm(`¿Está seguro de revocar el acceso a @${uname}?`)) {
      try {
        await api.delete(`/auth/users/${id}`);
        setSuccessMessage(`Acceso de @${uname} revocado exitosamente.`);
        fetchUsers();
        setTimeout(() => setSuccessMessage(''), 4000);
      } catch (err: any) {
        console.error('Error deleting user:', err);
        setErrorMessage(err.response?.data?.error || 'Error al revocar acceso.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      
      {/* Top CMS Header Navigation Bar */}
      <header className="bg-slate-950 border-b border-slate-800 py-4 px-6 sticky top-0 z-50 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onGoHome}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center gap-2 text-xs font-bold"
              title="Volver al Portal Público"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver a la Web</span>
            </button>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="bg-[#8B0000] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                MPPS CMS
              </span>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white font-sans">
                Panel Administrativo & Back-Office
              </h1>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sesión: <strong>{user.fullName}</strong> ({user.role})</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-bold border border-red-800 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Salir</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main CMS Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {!user ? (
          /* Full Page Login Screen for /admin */
          <div className="max-w-md mx-auto my-12 bg-slate-950 p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-red-900/40 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-800/50 shadow-inner">
                <Lock className="w-7 h-7 text-amber-400" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight">Acceso Administrativo CMS</h2>
              <p className="text-xs text-slate-400 font-medium">
                Ingrese sus credenciales de administrador para gestionar usuarios y la red de ambulatorios en tiempo real.
              </p>
            </div>

            {loginError && (
              <div className="bg-red-950/90 text-red-200 border border-red-800 text-xs p-3.5 rounded-2xl flex items-center gap-2 font-semibold">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Usuario Administrador
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-900 border border-slate-800 text-white rounded-xl font-medium focus:ring-2 focus:ring-red-600 focus:outline-none"
                    placeholder="admin"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Contraseña Encriptada
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-900 border border-slate-800 text-white rounded-xl font-medium focus:ring-2 focus:ring-red-600 focus:outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-red-800 via-red-700 to-amber-600 rounded-xl shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Ingresar al Panel /admin</span>
              </button>
            </form>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Credenciales Oficiales de Administración:
              </span>
              <p className="font-mono text-slate-300">
                • Usuario: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">admin</code>
              </p>
              <p className="font-mono text-slate-300">
                • Clave Encriptada: <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300">Admin321!</code>
              </p>
            </div>
          </div>
        ) : (
          /* Full CMS Admin Dashboard */
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Success Alert */}
            {successMessage && (
              <div className="bg-emerald-950/80 text-emerald-200 border border-emerald-800 text-xs p-4 rounded-2xl flex items-center gap-2 font-bold shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Alert */}
            {errorMessage && (
              <div className="bg-red-950/90 text-red-200 border border-red-800 text-xs p-4 rounded-2xl flex items-center gap-2 font-bold shadow-lg animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Navigation Tabs Bar */}
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <button
                onClick={() => setActiveTab('clinics')}
                className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === 'clinics'
                    ? 'bg-blue-700 text-white shadow-lg'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>CRUD de Ambulatorios & Semáforo ({adminClinics.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('users')}
                className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 ${
                  activeTab === 'users'
                    ? 'bg-[#8B0000] text-white shadow-lg'
                    : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Gestión de Usuarios & Coordinadores ({usersList.length})</span>
              </button>
            </div>

            {/* TAB 1: GESTIÓN DE AMBULATORIOS (CRUD COMPLETO CON BUSCADOR) */}
            {activeTab === 'clinics' && (
              <div className="space-y-8">
                
                {/* Header & Create Clinic Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
                  <div>
                    <span className="text-xs font-black uppercase text-amber-400 tracking-widest block">
                      RED REGIONAL DE SALUD DEL ESTADO ZULIA
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1">
                      Directorio de Ambulatorios & Semáforo en Tiempo Real
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      Actualmente hay <strong className="text-amber-300 font-bold">{adminClinics.length} centros de salud</strong> registrados en la plataforma.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddClinicModal(true)}
                    className="px-5 py-3 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 shrink-0 hover:scale-105"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-300" />
                    <span>+ Registrar Nuevo Ambulatorio</span>
                  </button>
                </div>

                {/* Main Clinic Editor Card */}
                <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                  
                  {/* Clinic Selector & Quick Search Filter */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                    
                    {/* Quick Search Input inside Select */}
                    <div className="md:col-span-5 space-y-1.5">
                      <label className="block text-xs font-black uppercase text-slate-400 tracking-wider">
                        Buscador Rápido de Ambulatorios
                      </label>
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={clinicSearchFilter}
                          onChange={(e) => setClinicSearchFilter(e.target.value)}
                          placeholder="Filtrar por nombre o municipio..."
                          className="w-full pl-10 pr-4 py-3 text-xs bg-slate-900 border border-slate-700 text-white rounded-2xl font-bold focus:ring-2 focus:ring-blue-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Ambulatorios Dropdown Select */}
                    <div className="md:col-span-7 space-y-1.5">
                      <label className="block text-xs font-black uppercase text-amber-400 tracking-wider">
                        Seleccionar Ambulatorio Activo ({displaySelectClinics.length} centros)
                      </label>
                      <select
                        value={selectedClinicId}
                        onChange={(e) => setSelectedClinicId(Number(e.target.value))}
                        className="w-full p-3.5 text-xs sm:text-sm font-bold bg-slate-900 text-white border border-slate-700 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:outline-none cursor-pointer"
                      >
                        {displaySelectClinics.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.isActive === false ? '🔴 [INACTIVO] ' : '🟢 '}
                            {c.name} — {c.municipality} ({c.parish}) {c.id === 1 ? '★ CASO DE PRUEBA' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Active Clinic Details & Live Control Panel */}
                  {currentClinic && (
                    <div className="space-y-6 pt-4 border-t border-slate-800">
                      
                      {/* Clinic Card Header Info */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-blue-950 text-blue-300 text-[10px] font-black uppercase rounded-md border border-blue-800">
                              {currentClinic.type}
                            </span>
                            <span className="text-xs font-bold text-amber-400">
                              📍 {currentClinic.municipality} — Parroquia {currentClinic.parish}
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-white">{currentClinic.name}</h3>
                          <p className="text-xs text-slate-400">{currentClinic.address}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <button
                            onClick={() => handleToggleClinicActive(currentClinic.id, currentClinic.isActive)}
                            disabled={isUpdating}
                            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all flex items-center gap-2 border ${
                              currentClinic.isActive !== false
                                ? 'bg-emerald-950 text-emerald-200 border-emerald-700 hover:bg-emerald-900'
                                : 'bg-red-950 text-red-200 border-red-800 hover:bg-red-900'
                            }`}
                            title="Alternar entre ACTIVO e INACTIVO para visibilidad pública"
                          >
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                currentClinic.isActive !== false ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'
                              }`}
                            />
                            <span>
                              {currentClinic.isActive !== false ? '🟢 ACTIVO (Visible en la Web)' : '🔴 INACTIVO (Oculto)'}
                            </span>
                          </button>

                          {currentClinic.id !== 1 && (
                            <button
                              onClick={() => handleDeleteClinic(currentClinic.id, currentClinic.name)}
                              className="px-3.5 py-2 bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-bold rounded-xl border border-red-800 transition-colors flex items-center gap-1.5 shrink-0"
                              title="Eliminar este ambulatorio"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                              <span>Eliminar</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* Left Column: Live Service Semaphore Controller */}
                        <div className="lg:col-span-7 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-black text-white flex items-center gap-2">
                              <RefreshCw className={`w-4 h-4 text-blue-400 ${isUpdating ? 'animate-spin' : ''}`} />
                              Semáforo de Servicios en Tiempo Real
                            </h3>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">
                              DISPONIBLE / NO DISPONIBLE
                            </span>
                          </div>

                          <div className="space-y-3">
                            {(Object.keys(currentClinic.services || {}) as ServiceType[]).map((serviceKey) => {
                              const currentStatus = currentClinic.services?.[serviceKey];
                              const isAvail = currentStatus === ServiceStatus.AVAILABLE;

                              return (
                                <div
                                  key={serviceKey}
                                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                                >
                                  <div>
                                    <span className="text-sm font-bold text-white block">
                                      {SERVICE_NAMES[serviceKey]}
                                    </span>
                                    <span className="text-[11px] font-mono text-slate-400">
                                      Estado actual: {currentStatus}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => handleToggleService(serviceKey, ServiceStatus.AVAILABLE)}
                                      disabled={isUpdating}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                                        isAvail
                                          ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                                          : 'bg-slate-800 text-slate-400 hover:bg-emerald-950 hover:text-emerald-300'
                                      }`}
                                    >
                                      ✓ Disponible
                                    </button>

                                    <button
                                      onClick={() => handleToggleService(serviceKey, ServiceStatus.UNAVAILABLE)}
                                      disabled={isUpdating}
                                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                                        !isAvail
                                          ? 'bg-red-700 text-white shadow-md ring-2 ring-red-400'
                                          : 'bg-slate-800 text-slate-400 hover:bg-red-950 hover:text-red-300'
                                      }`}
                                    >
                                      ✕ No Disponible
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Right Column: Active Doctors & Nurses Counter */}
                        <div className="lg:col-span-5 space-y-6 bg-slate-900 p-6 rounded-2xl border border-slate-800">
                          <h3 className="text-base font-black text-white flex items-center gap-2">
                            <User className="w-5 h-5 text-amber-400" />
                            Personal Médico Activo en Planta
                          </h3>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-400 mb-1">
                                Médicos Activos:
                              </label>
                              <input
                                type="number"
                                value={editDoctors}
                                onChange={(e) => setEditDoctors(Number(e.target.value))}
                                className="w-full p-3 text-sm bg-slate-950 border border-slate-800 text-white rounded-xl font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-400 mb-1">
                                Enfermeras Activas:
                              </label>
                              <input
                                type="number"
                                value={editNurses}
                                onChange={(e) => setEditNurses(Number(e.target.value))}
                                className="w-full p-3 text-sm bg-slate-950 border border-slate-800 text-white rounded-xl font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                              />
                            </div>

                            <button
                              onClick={() => handleUpdateStaff(editDoctors, editNurses)}
                              disabled={isUpdating}
                              className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black uppercase text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                              <Save className="w-4 h-4" />
                              <span>Guardar Cantidad de Personal</span>
                            </button>

                            <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-[11px] text-amber-300">
                              💡 Modifique el número de médicos o enfermeras y presione "Guardar Cantidad de Personal".
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                </div>

                {/* Direct Visual Grid List of All Registered Clinics */}
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-400" />
                      Directorio General de Ambulatorios Registrados ({adminClinics.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {adminClinics.map((c) => {
                      const isSel = c.id === selectedClinicId;
                      const isAct = c.isActive !== false;

                      return (
                        <div
                          key={c.id}
                          className={`p-5 rounded-2xl border transition-all ${
                            isSel
                              ? 'bg-blue-950/40 border-blue-500 shadow-lg ring-1 ring-blue-500'
                              : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300">
                              {c.type}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isAct
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : 'bg-red-950 text-red-300 border border-red-800'
                              }`}
                            >
                              {isAct ? '🟢 ACTIVO' : '🔴 INACTIVO'}
                            </span>
                          </div>

                          <h4 className="font-bold text-white text-sm line-clamp-1">{c.name}</h4>
                          <p className="text-xs text-slate-400 font-medium mb-3">
                            📍 {c.municipality} ({c.parish})
                          </p>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-900 text-xs">
                            <span className="text-[11px] text-slate-400">
                              👥 {c.staff?.activeDoctors || 0} M. / {c.staff?.activeNurses || 0} E.
                            </span>

                            <button
                              onClick={() => setSelectedClinicId(c.id)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                                isSel
                                  ? 'bg-amber-400 text-slate-950 font-black'
                                  : 'bg-slate-800 hover:bg-slate-700 text-white'
                              }`}
                            >
                              {isSel ? <Check className="w-3.5 h-3.5" /> : <Edit className="w-3.5 h-3.5" />}
                              <span>{isSel ? 'Editando' : 'Editar'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Modal para Registrar Nuevo Ambulatorio */}
                {showAddClinicModal && (
                  <div
                    onClick={() => setShowAddClinicModal(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="bg-slate-950 w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2 text-blue-400">
                          <PlusCircle className="w-5 h-5" />
                          <h3 className="text-lg font-black text-white">Registrar Nuevo Ambulatorio</h3>
                        </div>
                        <button
                          onClick={() => setShowAddClinicModal(false)}
                          className="text-slate-400 hover:text-white p-1 rounded-lg"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleCreateClinic} className="space-y-4 text-xs">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Nombre Oficial del Ambulatorio / Centro</label>
                          <input
                            type="text"
                            required
                            value={newClinicName}
                            onChange={(e) => setNewClinicName(e.target.value)}
                            placeholder="Ej: Ambulatorio Urbano II Santa Rosa"
                            className="w-full p-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Tipo de Centro</label>
                            <select
                              value={newClinicType}
                              onChange={(e) => setNewClinicType(e.target.value as ClinicType)}
                              className="w-full p-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                            >
                              <option value={ClinicType.TYPE_1}>Ambulatorio Urbano I</option>
                              <option value={ClinicType.TYPE_2}>Ambulatorio Urbano II</option>
                              <option value={ClinicType.TYPE_3}>Ambulatorio Urbano III</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Municipio (Zulia)</label>
                            <select
                              value={newClinicMunicipality}
                              onChange={(e) => setNewClinicMunicipality(e.target.value)}
                              className="w-full p-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                            >
                              {MUNICIPALITIES.map((muni) => (
                                <option key={muni} value={muni}>
                                  {muni}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Parroquia</label>
                            <input
                              type="text"
                              value={newClinicParish}
                              onChange={(e) => setNewClinicParish(e.target.value)}
                              placeholder="Ej: Coquivacoa (Opcional)"
                              className="w-full p-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Horario de Atención</label>
                            <input
                              type="text"
                              value={newClinicSchedule}
                              onChange={(e) => setNewClinicSchedule(e.target.value)}
                              placeholder="7:00 AM - 1:00 PM"
                              className="w-full p-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Dirección Exacta</label>
                          <input
                            type="text"
                            value={newClinicAddress}
                            onChange={(e) => setNewClinicAddress(e.target.value)}
                            placeholder="Ej: Av. 2 con Calle 42, Santa Rosa de Agua, Maracaibo, Zulia"
                            className="w-full p-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Director(a) Médico</label>
                            <input
                              type="text"
                              value={newClinicDirector}
                              onChange={(e) => setNewClinicDirector(e.target.value)}
                              placeholder="Dra. Ana López"
                              className="w-full p-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Médicos Activos</label>
                            <input
                              type="number"
                              value={newClinicDoctors}
                              onChange={(e) => setNewClinicDoctors(Number(e.target.value))}
                              className="w-full p-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Enfermeras Activas</label>
                            <input
                              type="number"
                              value={newClinicNurses}
                              onChange={(e) => setNewClinicNurses(Number(e.target.value))}
                              className="w-full p-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => setShowAddClinicModal(false)}
                            className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black uppercase tracking-wider shadow-lg"
                          >
                            Guardar Ambulatorio
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 2: GESTIÓN DE USUARIOS Y COORDINADORES (CRUD COMPLETO) */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                
                {/* Header & Create User Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 p-6 rounded-3xl border border-slate-800">
                  <div>
                    <span className="text-xs font-black uppercase text-amber-400 tracking-widest block">
                      SISTEMA DE CONTROL DE ACCESO
                    </span>
                    <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mt-1">
                      Directorio de Coordinadores Sanitarios
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      Cree y gestione los permisos de acceso para los coordinadores de cada ambulatorio.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Crear Nuevo Coordinador</span>
                  </button>
                </div>

                {/* Users Table */}
                <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider border-b border-slate-800 font-bold">
                        <tr>
                          <th className="py-4 px-6">Coordinador / Usuario</th>
                          <th className="py-4 px-6">Rol de Acceso</th>
                          <th className="py-4 px-6">Ambulatorio Asignado</th>
                          <th className="py-4 px-6 text-center">Encriptación</th>
                          <th className="py-4 px-6 text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                        {usersList.map((u) => {
                          const assignedClinic = adminClinics.find((c) => c.id === u.clinicId);
                          return (
                            <tr key={u.id} className="hover:bg-slate-900/60 transition-colors">
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center font-bold">
                                    <UserCheck className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <span className="font-bold text-white text-sm block">
                                      {u.fullName}
                                    </span>
                                    <span className="text-amber-300 font-mono text-[11px]">
                                      @{u.username}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-4 px-6">
                                <span
                                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                    u.role === 'ADMIN'
                                      ? 'bg-red-950 text-red-300 border border-red-800'
                                      : 'bg-blue-950 text-blue-300 border border-blue-800'
                                  }`}
                                >
                                  {u.role === 'ADMIN' ? '🛡️ Super Admin' : '🏥 Coordinador'}
                                </span>
                              </td>

                              <td className="py-4 px-6 font-semibold">
                                {assignedClinic ? (
                                  <span className="text-slate-200">
                                    {assignedClinic.name} ({assignedClinic.municipality})
                                  </span>
                                ) : (
                                  <span className="text-slate-500 italic">Todos los Ambulatorios (Global)</span>
                                )}
                              </td>

                              <td className="py-4 px-6 text-center">
                                <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 text-[10px] font-mono px-2.5 py-1 rounded-full border border-emerald-800">
                                  <ShieldCheck className="w-3 h-3" /> SHA256 OK
                                </span>
                              </td>

                              <td className="py-4 px-6 text-right">
                                {u.id !== 1 && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id, u.username)}
                                    className="p-2 bg-red-950/80 hover:bg-red-900 text-red-200 rounded-xl transition-colors border border-red-800"
                                    title="Revocar Acceso"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Modal para Crear Nuevo Coordinador */}
                {showAddUserModal && (
                  <div
                    onClick={() => setShowAddUserModal(false)}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
                  >
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="bg-slate-950 w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2 text-emerald-400">
                          <UserPlus className="w-5 h-5" />
                          <h3 className="text-lg font-black text-white">Crear Nuevo Coordinador</h3>
                        </div>
                        <button
                          onClick={() => setShowAddUserModal(false)}
                          className="text-slate-400 hover:text-white p-1 rounded-lg"
                        >
                          ✕
                        </button>
                      </div>

                      <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Nombre Completo del Médico / Coordinador</label>
                          <input
                            type="text"
                            required
                            value={newFullName}
                            onChange={(e) => setNewFullName(e.target.value)}
                            placeholder="Ej: Dra. Rosa Paredes"
                            className="w-full p-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Nombre de Usuario para Login</label>
                          <input
                            type="text"
                            required
                            value={newUsername}
                            onChange={(e) => setNewUsername(e.target.value)}
                            placeholder="Ej: rosap_coord"
                            className="w-full p-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-300 mb-1">Contraseña (Se guardará encriptada SHA256)</label>
                          <input
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Rol de Sistema</label>
                            <select
                              value={newRole}
                              onChange={(e) => setNewRole(e.target.value)}
                              className="w-full p-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer"
                            >
                              <option value="COORDINATOR">Coordinador de Ambulatorio</option>
                              <option value="ADMIN">Administrador General</option>
                            </select>
                          </div>

                          <div>
                            <label className="block font-bold text-slate-300 mb-1">Ambulatorio Asignado</label>
                            <select
                              value={newClinicId}
                              onChange={(e) => setNewClinicId(e.target.value)}
                              disabled={newRole === 'ADMIN'}
                              className="w-full p-3 bg-slate-900 border border-slate-800 text-white rounded-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none cursor-pointer disabled:opacity-50"
                            >
                              {adminClinics.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setShowAddUserModal(false)}
                            className="px-4 py-2.5 bg-slate-800 text-slate-300 rounded-xl font-bold hover:bg-slate-700"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black uppercase tracking-wider shadow-lg"
                          >
                            Guardar Coordinador
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        )}
      </main>

    </div>
  );
};
