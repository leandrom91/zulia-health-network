export enum ClinicType {
  TYPE_1 = 'TYPE_1',         // Ambulatorio Urbano / Rural Tipo 1
  TYPE_2 = 'TYPE_2',         // Ambulatorio Urbano Tipo 2
  TYPE_3 = 'TYPE_3',         // Ambulatorio Urbano Tipo 3
  AMBULATORIO_I = 'TYPE_1',  // Alias
  AMBULATORIO_II = 'TYPE_2', // Alias
  AMBULATORIO_III = 'TYPE_3',// Alias
  HOSPITAL = 'HOSPITAL',
  CDI = 'CDI'
}

export enum ServiceType {
  LABORATORY = 'LABORATORY',
  X_RAY = 'X_RAY',
  PHARMACY = 'PHARMACY',
  DENTISTRY = 'DENTISTRY',
  EMERGENCY = 'EMERGENCY'
}

export enum ServiceStatus {
  AVAILABLE = 'AVAILABLE',       // 🟢 Disponible
  UNAVAILABLE = 'UNAVAILABLE',   // 🔴 Inactivo / Temporalmente sin servicio
  NOT_PROVIDED = 'NOT_PROVIDED'  // ⚪ No posee el servicio
}

export enum UserRole {
  ADMIN = 'ADMIN',
  COORDINATOR = 'COORDINATOR'
}

export interface ClinicDirector {
  id?: number;
  clinicId?: number;
  fullName: string;
  title: string;
  photoUrl: string;
}

export interface ClinicStaff {
  activeDoctors: number;
  activeNurses: number;
}

export interface ClinicImage {
  id?: number;
  clinicId?: number;
  imageUrl: string;
  caption: string;
  isPrimary: boolean;
}

export interface Clinic {
  id: number;
  name: string;
  type: ClinicType;
  municipality: string;
  parish: string;
  address: string;
  latitude: number;
  longitude: number;
  googleMapsUrl: string;
  schedule: string;
  dailyQuotaTotal: number;
  dailyQuotaAvailable: number;
  isActive?: boolean;
  director?: ClinicDirector;
  staff?: ClinicStaff;
  services: Record<ServiceType, ServiceStatus>;
  images?: ClinicImage[];
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  bannerType: 'INFO' | 'SOLIDARITY' | 'URGENT';
  isActive: boolean;
}

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  role: UserRole;
  clinicId?: number | null;
}
