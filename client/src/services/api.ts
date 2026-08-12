import axios from 'axios';
import { Clinic, Announcement, ServiceType, ServiceStatus, ClinicType } from '../types';

const API_BASE = 'https://zulia-health-api.onrender.com/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

let DEFAULT_FALLBACK_CLINICS: Clinic[] = [
  {
    id: 1,
    name: 'Ambulatorio Urbano I Corito 1',
    type: ClinicType.TYPE_1,
    municipality: 'Maracaibo',
    parish: 'Cristo de Aranza',
    address: 'Sector Corito 1, Av. 19B con Calle 108, Maracaibo, Zulia',
    latitude: 10.608333,
    longitude: -71.6375,
    googleMapsUrl: 'https://maps.google.com/?q=10.608333,-71.637500',
    schedule: '7:00 AM - 1:00 PM',
    dailyQuotaTotal: 60,
    dailyQuotaAvailable: 42,
    isActive: true,
    director: {
      fullName: 'Dra. María Elena Gutiérrez',
      title: 'Directora Médica Especialista',
      photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    },
    staff: {
      activeDoctors: 8,
      activeNurses: 14,
    },
    services: {
      [ServiceType.LABORATORY]: ServiceStatus.AVAILABLE,
      [ServiceType.X_RAY]: ServiceStatus.UNAVAILABLE,
      [ServiceType.PHARMACY]: ServiceStatus.AVAILABLE,
      [ServiceType.DENTISTRY]: ServiceStatus.AVAILABLE,
      [ServiceType.EMERGENCY]: ServiceStatus.AVAILABLE,
    },
    images: [
      {
        id: 101,
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
        caption: 'Fachada Principal Ambulatorio Corito 1',
        isPrimary: true,
      },
    ],
  },
  {
    id: 2,
    name: 'Ambulatorio Urbano II La Victoria',
    type: ClinicType.TYPE_2,
    municipality: 'Maracaibo',
    parish: 'Caracciolo Parra Pérez',
    address: 'Urb. La Victoria, 2da Etapa, Av. 62, Maracaibo, Zulia',
    latitude: 10.669,
    longitude: -71.662,
    googleMapsUrl: 'https://maps.google.com/?q=10.669000,-71.662000',
    schedule: '24 Horas',
    dailyQuotaTotal: 100,
    dailyQuotaAvailable: 75,
    isActive: true,
    director: {
      fullName: 'Dr. Carlos Eduardo Mendoza',
      title: 'Director Médico General',
      photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    },
    staff: { activeDoctors: 16, activeNurses: 28 },
    services: {
      [ServiceType.LABORATORY]: ServiceStatus.AVAILABLE,
      [ServiceType.X_RAY]: ServiceStatus.AVAILABLE,
      [ServiceType.PHARMACY]: ServiceStatus.AVAILABLE,
      [ServiceType.DENTISTRY]: ServiceStatus.AVAILABLE,
      [ServiceType.EMERGENCY]: ServiceStatus.AVAILABLE,
    },
    images: [],
  },
  {
    id: 3,
    name: 'Ambulatorio Urbano III Francisco Gómez Padrón',
    type: ClinicType.TYPE_3,
    municipality: 'Maracaibo',
    parish: 'Manuel Dagnino',
    address: 'Av. 100 Sabaneta, cerca de estación Metro, Maracaibo, Zulia',
    latitude: 10.63,
    longitude: -71.635,
    googleMapsUrl: 'https://maps.google.com/?q=10.630000,-71.635000',
    schedule: '24 Horas',
    dailyQuotaTotal: 150,
    dailyQuotaAvailable: 110,
    isActive: true,
    director: {
      fullName: 'Dra. Yasmín Coromoto Nava',
      title: 'Directora de Salud Pública',
      photoUrl: 'https://images.unsplash.com/photo-1594824813566-88855375b866?auto=format&fit=crop&w=400&q=80',
    },
    staff: { activeDoctors: 24, activeNurses: 45 },
    services: {
      [ServiceType.LABORATORY]: ServiceStatus.AVAILABLE,
      [ServiceType.X_RAY]: ServiceStatus.AVAILABLE,
      [ServiceType.PHARMACY]: ServiceStatus.AVAILABLE,
      [ServiceType.DENTISTRY]: ServiceStatus.AVAILABLE,
      [ServiceType.EMERGENCY]: ServiceStatus.AVAILABLE,
    },
    images: [],
  },
  {
    id: 4,
    name: 'Ambulatorio Urbano II San Francisco',
    type: ClinicType.TYPE_2,
    municipality: 'San Francisco',
    parish: 'San Francisco',
    address: 'Urb. La Coromoto, Calle 15, San Francisco, Zulia',
    latitude: 10.583,
    longitude: -71.651,
    googleMapsUrl: 'https://maps.google.com/?q=10.583000,-71.651000',
    schedule: '7:00 AM - 6:00 PM',
    dailyQuotaTotal: 80,
    dailyQuotaAvailable: 50,
    isActive: true,
    director: {
      fullName: 'Dr. Roberto Antonio Briceño',
      title: 'Director Médico Coordinador',
      photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    },
    staff: { activeDoctors: 12, activeNurses: 20 },
    services: {
      [ServiceType.LABORATORY]: ServiceStatus.AVAILABLE,
      [ServiceType.X_RAY]: ServiceStatus.UNAVAILABLE,
      [ServiceType.PHARMACY]: ServiceStatus.AVAILABLE,
      [ServiceType.DENTISTRY]: ServiceStatus.AVAILABLE,
      [ServiceType.EMERGENCY]: ServiceStatus.AVAILABLE,
    },
    images: [],
  },
];

export const fetchClinics = async (filters?: {
  search?: string;
  municipality?: string;
  parish?: string;
  type?: string;
  service?: string;
}): Promise<Clinic[]> => {
  try {
    const response = await api.get<Clinic[]>('/clinics', { params: filters });
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    console.warn('Backend API connection pending, displaying loaded dataset.');
  }

  // Fallback filtering
  let result = [...DEFAULT_FALLBACK_CLINICS];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(c => c.name.toLowerCase().includes(q) || c.address.toLowerCase().includes(q));
  }
  if (filters?.municipality && filters.municipality !== 'ALL') {
    result = result.filter(c => c.municipality === filters.municipality);
  }
  if (filters?.type && filters.type !== 'ALL') {
    result = result.filter(c => c.type === filters.type);
  }
  if (filters?.service && filters.service !== 'ALL') {
    result = result.filter(c => c.services[filters.service as ServiceType] === ServiceStatus.AVAILABLE);
  }

  return result;
};

export const fetchClinicById = async (id: number): Promise<Clinic | null> => {
  try {
    const response = await api.get<Clinic>(`/clinics/${id}`);
    if (response.data && typeof response.data === 'object' && 'id' in response.data) {
      return response.data;
    }
  } catch (error) {
    // fallback below
  }
  return DEFAULT_FALLBACK_CLINICS.find(c => c.id === id) || null;
};

export const updateClinicServiceStatus = async (
  clinicId: number,
  serviceType: ServiceType,
  status: ServiceStatus
) => {
  try {
    const response = await api.put(`/clinics/${clinicId}/services`, {
      serviceType,
      status,
    });
    return response.data;
  } catch (e) {
    const local = DEFAULT_FALLBACK_CLINICS.find(c => c.id === clinicId);
    if (local) {
      local.services[serviceType] = status;
    }
    return { clinic: local };
  }
};

export const updateClinicStaffCount = async (
  clinicId: number,
  activeDoctors: number,
  activeNurses: number
) => {
  try {
    const response = await api.put(`/clinics/${clinicId}/staff`, {
      activeDoctors,
      activeNurses,
    });
    return response.data;
  } catch (e) {
    const local = DEFAULT_FALLBACK_CLINICS.find(c => c.id === clinicId);
    if (local) {
      local.staff = { activeDoctors, activeNurses };
    }
    return { clinic: local };
  }
};

export const fetchAnnouncements = async (): Promise<Announcement[]> => {
  try {
    const response = await api.get<Announcement[]>('/announcements');
    if (Array.isArray(response.data)) {
      return response.data;
    }
  } catch (error) {
    // fallback below
  }
  return [
    {
      id: 1,
      title: 'Compromiso de Solidaridad Institucional',
      content: 'Desde el Estado Zulia ratificamos el apoyo y solidaridad con el pueblo hermano de Caracas y La Guaira ante contingencias climáticas. El sistema de salud zuliano activo y desplegado.',
      bannerType: 'SOLIDARITY',
      isActive: true,
    },
  ];
};
