import { Request, Response } from 'express';
import { pool } from '../db/connection';
import { ServiceStatus, ServiceType, ClinicType } from '../types';

// In-memory active dataset fallback initialized with rich Zulia seed data
let inMemoryClinics: any[] = [
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
      photoUrl: '/mpps-personal-medico.jpg',
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
        clinicId: 1,
        imageUrl: '/mpps-fachada-corito1.jpg',
        caption: 'Fachada e Instalaciones Principales Ambulatorio Corito 1',
        isPrimary: true,
      },
      {
        id: 102,
        clinicId: 1,
        imageUrl: '/mpps-consultorio-medico.jpg',
        caption: 'Consultorio Médico de Atención Primaria e Integral',
      },
      {
        id: 103,
        clinicId: 1,
        imageUrl: '/mpps-odontologia-laboratorio.jpg',
        caption: 'Área de Odontología y Exámenes Clínicos Especializados',
      },
      {
        id: 104,
        clinicId: 1,
        imageUrl: '/mpps-farmacia-insumos.jpg',
        caption: 'Despacho de Farmacia e Insumos Sanitarios de la Red Popular',
      },
      {
        id: 105,
        clinicId: 1,
        imageUrl: '/mpps-personal-medico.jpg',
        caption: 'Personal Médico y Equipo de Enfermería Activo en Planta',
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
      photoUrl: '/mpps-director-medico-2.jpg',
    },
    staff: { activeDoctors: 16, activeNurses: 28 },
    services: {
      [ServiceType.LABORATORY]: ServiceStatus.AVAILABLE,
      [ServiceType.X_RAY]: ServiceStatus.AVAILABLE,
      [ServiceType.PHARMACY]: ServiceStatus.AVAILABLE,
      [ServiceType.DENTISTRY]: ServiceStatus.AVAILABLE,
      [ServiceType.EMERGENCY]: ServiceStatus.AVAILABLE,
    },
    images: [
      {
        id: 201,
        clinicId: 2,
        imageUrl: '/mpps-ambulatorio-la-victoria.jpg',
        caption: 'Fachada e Instalaciones Médicas Ambulatorio La Victoria',
        isPrimary: true,
      },
      {
        id: 202,
        clinicId: 2,
        imageUrl: '/mpps-emergencia-evaluacion.jpg',
        caption: 'Área de Admisión, Evaluación y Cuidados de Emergencia',
      },
    ],
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
      photoUrl: '/mpps-operativo-salud-zulia.jpg',
    },
    staff: { activeDoctors: 24, activeNurses: 45 },
    services: {
      [ServiceType.LABORATORY]: ServiceStatus.AVAILABLE,
      [ServiceType.X_RAY]: ServiceStatus.AVAILABLE,
      [ServiceType.PHARMACY]: ServiceStatus.AVAILABLE,
      [ServiceType.DENTISTRY]: ServiceStatus.AVAILABLE,
      [ServiceType.EMERGENCY]: ServiceStatus.AVAILABLE,
    },
    images: [
      {
        id: 301,
        clinicId: 3,
        imageUrl: '/mpps-ambulatorio-gomez-padron.jpg',
        caption: 'Infraestructura General Ambulatorio Urbano III Gómez Padrón',
        isPrimary: true,
      },
      {
        id: 302,
        clinicId: 3,
        imageUrl: '/mpps-laboratorio-clinico.jpg',
        caption: 'Laboratorio Clínico y Módulo de Atención Especializada',
      },
    ],
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
      photoUrl: '/mpps-director-medico-4.jpg',
    },
    staff: { activeDoctors: 12, activeNurses: 20 },
    services: {
      [ServiceType.LABORATORY]: ServiceStatus.AVAILABLE,
      [ServiceType.X_RAY]: ServiceStatus.UNAVAILABLE,
      [ServiceType.PHARMACY]: ServiceStatus.AVAILABLE,
      [ServiceType.DENTISTRY]: ServiceStatus.AVAILABLE,
      [ServiceType.EMERGENCY]: ServiceStatus.AVAILABLE,
    },
    images: [
      {
        id: 401,
        clinicId: 4,
        imageUrl: '/mpps-ambulatorio-san-francisco.jpg',
        caption: 'Fachada Ambulatorio San Francisco La Coromoto',
        isPrimary: true,
      },
    ],
  },
];

const announcementsList = [
  {
    id: 1,
    title: 'Compromiso de Solidaridad Institucional',
    content: 'Desde el Estado Zulia ratificamos el apoyo y solidaridad con el pueblo hermano de Caracas y La Guaira ante contingencias climáticas. El sistema de salud zuliano activo y desplegado.',
    bannerType: 'SOLIDARITY',
    isActive: true,
  },
];

export const getClinics = async (req: Request, res: Response) => {
  try {
    const { search, municipality, type, service, parish } = req.query;

    let combinedList: any[] = [...inMemoryClinics];

    try {
      // Intentar consulta a MySQL DB
      const [rows]: any = await pool.query(`
        SELECT c.*, 
          d.full_name as director_name, d.title as director_title, d.photo_url as director_photo,
          s.active_doctors, s.active_nurses
        FROM clinics c
        LEFT JOIN clinic_directors d ON c.id = d.clinic_id
        LEFT JOIN clinic_staff s ON c.id = s.clinic_id
      `);

      if (rows && rows.length > 0) {
        const dbResult = await Promise.all(
          rows.map(async (row: any) => {
            const [servRows]: any = await pool.query(
              'SELECT service_type, status FROM clinic_services WHERE clinic_id = ?',
              [row.id]
            );
            const services: Record<string, string> = {
              [ServiceType.LABORATORY]: ServiceStatus.NOT_PROVIDED,
              [ServiceType.X_RAY]: ServiceStatus.NOT_PROVIDED,
              [ServiceType.PHARMACY]: ServiceStatus.NOT_PROVIDED,
              [ServiceType.DENTISTRY]: ServiceStatus.NOT_PROVIDED,
              [ServiceType.EMERGENCY]: ServiceStatus.NOT_PROVIDED,
            };

            const memClinic = inMemoryClinics.find((m) => m.id === row.id);

            if (servRows && servRows.length > 0) {
              servRows.forEach((s: any) => {
                services[s.service_type] = s.status;
              });
            } else if (memClinic?.services) {
              Object.assign(services, memClinic.services);
            } else {
              services[ServiceType.LABORATORY] = ServiceStatus.AVAILABLE;
              services[ServiceType.PHARMACY] = ServiceStatus.AVAILABLE;
              services[ServiceType.DENTISTRY] = ServiceStatus.AVAILABLE;
              services[ServiceType.EMERGENCY] = ServiceStatus.AVAILABLE;
            }

            const activeStatus = memClinic
              ? memClinic.isActive
              : row.is_active === undefined || row.is_active === null
              ? true
              : Boolean(row.is_active);

            return {
              id: row.id,
              name: row.name,
              type: row.type,
              municipality: row.municipality,
              parish: row.parish,
              address: row.address,
              latitude: Number(row.latitude),
              longitude: Number(row.longitude),
              googleMapsUrl: row.google_maps_url,
              schedule: row.schedule,
              dailyQuotaTotal: row.daily_quota_total,
              dailyQuotaAvailable: row.daily_quota_available,
              isActive: activeStatus,
              director: row.director_name
                ? {
                    fullName: row.director_name,
                    title: row.director_title,
                    photoUrl: row.director_photo,
                  }
                : memClinic?.director,
              staff: {
                activeDoctors: row.active_doctors || memClinic?.staff?.activeDoctors || 6,
                activeNurses: row.active_nurses || memClinic?.staff?.activeNurses || 12,
              },
              services: { ...services, ...memClinic?.services },
              images: memClinic?.images || [],
            };
          })
        );

        // Combine DB clinics + newly created in-memory clinics that are not yet in DB
        const dbIds = new Set(dbResult.map((c) => c.id));
        const extraMemClinics = inMemoryClinics.filter((m) => !dbIds.has(m.id));
        combinedList = [...dbResult, ...extraMemClinics];
      }
    } catch (dbErr: any) {
      console.warn('⚠️ [MYSQL READ WARN - getClinics]: MySQL offline o modo demo activo:', dbErr?.message || dbErr);
      combinedList = [...inMemoryClinics];
    }

    // Apply filters
    let filtered = combinedList;
    if (search) {
      const q = String(search).toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q) ||
          c.parish.toLowerCase().includes(q)
      );
    }
    if (municipality && municipality !== 'ALL') {
      filtered = filtered.filter((c) => c.municipality === municipality);
    }
    if (parish && parish !== 'ALL') {
      filtered = filtered.filter((c) => c.parish === parish);
    }
    if (type && type !== 'ALL') {
      filtered = filtered.filter((c) => c.type === type);
    }
    if (service && service !== 'ALL') {
      filtered = filtered.filter((c) => c.services?.[service as ServiceType] === ServiceStatus.AVAILABLE);
    }

    return res.json(filtered);
  } catch (error: any) {
    console.error('❌ [API ERROR - getClinics]:', error);
    res.status(500).json({ error: 'Failed to fetch clinics' });
  }
};

export const getClinicById = async (req: Request, res: Response) => {
  const clinicId = Number(req.params.id);
  const clinic = inMemoryClinics.find((c) => c.id === clinicId);
  if (!clinic) {
    return res.status(404).json({ error: 'Clinic not found' });
  }
  res.json(clinic);
};

export const updateClinicService = async (req: Request, res: Response) => {
  const clinicId = Number(req.params.id);
  const { serviceType, status } = req.body;

  const clinic = inMemoryClinics.find((c) => c.id === clinicId);
  if (clinic && serviceType && status) {
    clinic.services[serviceType as ServiceType] = status as ServiceStatus;
  }

  try {
    await pool.query(
      `INSERT INTO clinic_services (clinic_id, service_type, status) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE status = ?`,
      [clinicId, serviceType, status, status]
    );
  } catch (e: any) {
    console.warn('⚠️ [MYSQL WRITE WARN - updateClinicService]:', e?.message || e);
  }

  res.json({ message: 'Service status updated successfully', clinic });
};

export const updateClinicStaff = async (req: Request, res: Response) => {
  const clinicId = Number(req.params.id);
  const { activeDoctors, activeNurses } = req.body;

  const clinic = inMemoryClinics.find((c) => c.id === clinicId);
  if (clinic) {
    clinic.staff = {
      activeDoctors: Number(activeDoctors),
      activeNurses: Number(activeNurses),
    };
  }

  try {
    await pool.query(
      `INSERT INTO clinic_staff (clinic_id, active_doctors, active_nurses)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE active_doctors = ?, active_nurses = ?`,
      [clinicId, activeDoctors, activeNurses, activeDoctors, activeNurses]
    );
  } catch (e: any) {
    console.warn('⚠️ [MYSQL WRITE WARN - updateClinicStaff]:', e?.message || e);
  }

  res.json({ message: 'Staff count updated successfully', clinic });
};

export const getAnnouncements = async (_req: Request, res: Response) => {
  res.json(announcementsList);
};

export const createClinic = async (req: Request, res: Response) => {
  const { name, type, municipality, parish, address, schedule, directorName, activeDoctors, activeNurses } = req.body;

  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'El nombre del ambulatorio es requerido' });
  }

  const nameVal = String(name).trim();
  const typeVal = type || ClinicType.TYPE_1;
  const muniVal = municipality && String(municipality).trim() ? String(municipality).trim() : 'Maracaibo';
  const parishVal = parish && String(parish).trim() ? String(parish).trim() : 'Central';
  const addressVal = String(address || `Sector ${parishVal}, ${muniVal}, Zulia`).trim();
  const scheduleVal = schedule || '7:00 AM - 1:00 PM';
  const googleMapsUrlVal = `https://maps.google.com/?q=10.650000,-71.650000`;
  const doctorsVal = activeDoctors ? Number(activeDoctors) : 6;
  const nursesVal = activeNurses ? Number(activeNurses) : 12;

  let assignedId = 0;

  // Streamlined AUTO_INCREMENT execution in MySQL
  try {
    const [result]: any = await pool.query(
      `INSERT INTO clinics (name, type, municipality, parish, address, latitude, longitude, google_maps_url, schedule, daily_quota_total, daily_quota_available) 
       VALUES (?, ?, ?, ?, ?, 10.65, -71.65, ?, ?, 50, 50)`,
      [nameVal, typeVal, muniVal, parishVal, addressVal, googleMapsUrlVal, scheduleVal]
    );

    if (result && result.insertId) {
      assignedId = Number(result.insertId);
    }
  } catch (e: any) {
    console.warn('⚠️ [MYSQL INSERT WARN - createClinic]:', e?.message || e);
  }

  if (!assignedId) {
    const memMax = inMemoryClinics.length ? Math.max(...inMemoryClinics.map((c: any) => Number(c.id))) : 0;
    assignedId = memMax + 1;
  }

  const newClinic = {
    id: assignedId,
    name: nameVal,
    type: typeVal,
    municipality: muniVal,
    parish: parishVal,
    address: addressVal,
    latitude: 10.65,
    longitude: -71.65,
    googleMapsUrl: googleMapsUrlVal,
    schedule: scheduleVal,
    dailyQuotaTotal: 50,
    dailyQuotaAvailable: 50,
    isActive: true,
    director: {
      fullName: directorName || 'Director(a) Médico Asignado',
      title: 'Director(a) Médico Especialista',
      photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    },
    staff: {
      activeDoctors: doctorsVal,
      activeNurses: nursesVal,
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
        id: assignedId * 100 + 1,
        clinicId: assignedId,
        imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
        caption: `Fachada ${nameVal}`,
        isPrimary: true,
      },
    ],
  };

  inMemoryClinics.push(newClinic);

  try {
    await pool.query(
      `INSERT INTO clinic_staff (clinic_id, active_doctors, active_nurses) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE active_doctors = ?, active_nurses = ?`,
      [assignedId, doctorsVal, nursesVal, doctorsVal, nursesVal]
    );

    for (const [sKey, sStatus] of Object.entries(newClinic.services)) {
      await pool.query(
        `INSERT INTO clinic_services (clinic_id, service_type, status) VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE status = ?`,
        [assignedId, sKey, sStatus, sStatus]
      );
    }
  } catch (e: any) {
    console.warn('⚠️ [MYSQL WRITE WARN - createClinic details]:', e?.message || e);
  }

  res.status(201).json({ message: 'Ambulatorio creado exitosamente', clinic: newClinic });
};

export const toggleClinicActive = async (req: Request, res: Response) => {
  const clinicId = Number(req.params.id);
  const { isActive } = req.body;

  const clinic = inMemoryClinics.find((c: any) => c.id === clinicId);
  if (clinic) {
    (clinic as any).isActive = Boolean(isActive);
  }

  try {
    await pool.query('UPDATE clinics SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, clinicId]);
  } catch (e: any) {
    console.warn('⚠️ [MYSQL WRITE WARN - toggleClinicActive]:', e?.message || e);
  }

  res.json({ message: `Estado del ambulatorio actualizado a ${isActive ? 'ACTIVO' : 'INACTIVO'}`, clinic });
};

export const deleteClinic = async (req: Request, res: Response) => {
  const clinicId = Number(req.params.id);

  if (clinicId === 1) {
    return res.status(400).json({ error: 'No se puede eliminar el Ambulatorio Corito 1 (Caso de Prueba Principal)' });
  }

  inMemoryClinics = inMemoryClinics.filter((c) => c.id !== clinicId);

  try {
    await pool.query('DELETE FROM clinics WHERE id = ?', [clinicId]);
  } catch (e: any) {
    console.warn('⚠️ [MYSQL WRITE WARN - deleteClinic]:', e?.message || e);
  }

  res.json({ message: 'Ambulatorio eliminado exitosamente' });
};
