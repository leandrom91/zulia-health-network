-- Seed Data for Red de Clínicas Populares del Estado Zulia
USE zulia_health_db;

-- Clear existing data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE clinic_images;
TRUNCATE TABLE clinic_services;
TRUNCATE TABLE clinic_staff;
TRUNCATE TABLE clinic_directors;
TRUNCATE TABLE users;
TRUNCATE TABLE announcements;
TRUNCATE TABLE clinics;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Hero Announcement Banner
INSERT INTO announcements (id, title, content, banner_type, is_active) VALUES
(1, 'Compromiso de Solidaridad Institucional', 'Desde el Estado Zulia ratificamos el apoyo y solidaridad con el pueblo hermano de Caracas y La Guaira ante contingencias climáticas. El sistema de salud zuliano activo y desplegado.', 'SOLIDARITY', 1);

-- 2. Insert Main Clinics (Special detail for Ambulatorio Urbano I Corito 1 + Network across Zulia)

-- Clinic #1: ESTRELLA CASE: Ambulatorio Urbano I Corito 1
INSERT INTO clinics (id, name, type, municipality, parish, address, latitude, longitude, google_maps_url, schedule, daily_quota_total, daily_quota_available) VALUES
(1, 'Ambulatorio Urbano I Corito 1', 'TYPE_1', 'Maracaibo', 'Cristo de Aranza', 'Sector Corito 1, Av. 19B con Calle 108, Maracaibo, Zulia', 10.608333, -71.637500, 'https://maps.google.com/?q=10.608333,-71.637500', '7:00 AM - 1:00 PM', 60, 42);

-- Clinic #2: Ambulatorio Urbano II La Victoria
INSERT INTO clinics (id, name, type, municipality, parish, address, latitude, longitude, google_maps_url, schedule, daily_quota_total, daily_quota_available) VALUES
(2, 'Ambulatorio Urbano II La Victoria', 'TYPE_2', 'Maracaibo', 'Caroní / Caracciolo Parra Pérez', 'Urb. La Victoria, 2da Etapa, Av. 62, Maracaibo, Zulia', 10.669000, -71.662000, 'https://maps.google.com/?q=10.669000,-71.662000', '24 Horas', 100, 75);

-- Clinic #3: Ambulatorio Urbano III Francisco Gómez Padrón (Sabaneta)
INSERT INTO clinics (id, name, type, municipality, parish, address, latitude, longitude, google_maps_url, schedule, daily_quota_total, daily_quota_available) VALUES
(3, 'Ambulatorio Urbano III Francisco Gómez Padrón', 'TYPE_3', 'Maracaibo', 'Manuel Dagnino', 'Av. 100 Sabaneta, cerca de estación Metro, Maracaibo, Zulia', 10.630000, -71.635000, 'https://maps.google.com/?q=10.630000,-71.635000', '24 Horas', 150, 110);

-- Clinic #4: Ambulatorio Urbano II San Francisco
INSERT INTO clinics (id, name, type, municipality, parish, address, latitude, longitude, google_maps_url, schedule, daily_quota_total, daily_quota_available) VALUES
(4, 'Ambulatorio Urbano II San Francisco', 'TYPE_2', 'San Francisco', 'San Francisco', 'Urb. La Coromoto, Calle 15, San Francisco, Zulia', 10.583000, -71.651000, 'https://maps.google.com/?q=10.583000,-71.651000', '7:00 AM - 6:00 PM', 80, 50);

-- Clinic #5: Ambulatorio Urbano I El Bajo
INSERT INTO clinics (id, name, type, municipality, parish, address, latitude, longitude, google_maps_url, schedule, daily_quota_total, daily_quota_available) VALUES
(5, 'Ambulatorio Urbano I El Bajo', 'TYPE_1', 'San Francisco', 'El Bajo', 'Sector El Bajo, Carretera Vía La Cañada, San Francisco, Zulia', 10.512000, -71.670000, 'https://maps.google.com/?q=10.512000,-71.670000', '7:00 AM - 1:00 PM', 40, 28);

-- Clinic #6: Ambulatorio Urbano II Ambrosio (Cabimas)
INSERT INTO clinics (id, name, type, municipality, parish, address, latitude, longitude, google_maps_url, schedule, daily_quota_total, daily_quota_available) VALUES
(6, 'Ambulatorio Urbano II Ambrosio', 'TYPE_2', 'Cabimas', 'Ambrosio', 'Av. Andrés Bello, Sector Ambrosio, Cabimas, Zulia', 10.412000, -71.463000, 'https://maps.google.com/?q=10.412000,-71.463000', '7:00 AM - 4:00 PM', 75, 45);

-- Clinic #7: Ambulatorio Rural II Santa Cruz de Mara
INSERT INTO clinics (id, name, type, municipality, parish, address, latitude, longitude, google_maps_url, schedule, daily_quota_total, daily_quota_available) VALUES
(7, 'Ambulatorio Rural II Santa Cruz de Mara', 'TYPE_2', 'Mara', 'Ricaurte', 'Poblado de Santa Cruz de Mara, Municipio Mara, Zulia', 10.963000, -71.745000, 'https://maps.google.com/?q=10.963000,-71.745000', '24 Horas', 90, 60);

-- Clinic #8: Ambulatorio Urbano I Ojeda
INSERT INTO clinics (id, name, type, municipality, parish, address, latitude, longitude, google_maps_url, schedule, daily_quota_total, daily_quota_available) VALUES
(8, 'Ambulatorio Urbano I Ciudad Ojeda', 'TYPE_1', 'Lagunillas', 'Alonso de Ojeda', 'Av. Intercomunal, Sector Las Morochas, Ciudad Ojeda, Zulia', 10.201000, -71.312000, 'https://maps.google.com/?q=10.201000,-71.312000', '7:00 AM - 1:00 PM', 50, 35);

-- Clinic #9: Ambulatorio Rural II Sinamaica
INSERT INTO clinics (id, name, type, municipality, parish, address, latitude, longitude, google_maps_url, schedule, daily_quota_total, daily_quota_available) VALUES
(9, 'Ambulatorio Rural II Sinamaica', 'TYPE_2', 'Guajira', 'Sinamaica', 'Av. Principal de Sinamaica, Municipio Guajira, Zulia', 11.083000, -71.850000, 'https://maps.google.com/?q=11.083000,-71.850000', '24 Horas', 80, 52);

-- Clinic #10: Ambulatorio Urbano I Machiques
INSERT INTO clinics (id, name, type, municipality, parish, address, latitude, longitude, google_maps_url, schedule, daily_quota_total, daily_quota_available) VALUES
(10, 'Ambulatorio Urbano I Machiques Central', 'TYPE_1', 'Machiques de Perijá', 'Libertad', 'Calle Santa Teresa, Machiques, Zulia', 10.062000, -72.551000, 'https://maps.google.com/?q=10.062000,-72.551000', '7:00 AM - 1:00 PM', 45, 30);

-- Directors Data
INSERT INTO clinic_directors (clinic_id, full_name, title, photo_url) VALUES
(1, 'Dra. María Elena Gutiérrez', 'Directora Médica Especualista', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80'),
(2, 'Dr. Carlos Eduardo Mendoza', 'Director Médico General', 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'),
(3, 'Dra. Yasmín Coromoto Nava', 'Directora de Salud Pública', 'https://images.unsplash.com/photo-1594824813566-88855375b866?auto=format&fit=crop&w=400&q=80'),
(4, 'Dr. Roberto Antonio Briceño', 'Director Médico Coor.', 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80');

-- Staff Count Data
INSERT INTO clinic_staff (clinic_id, active_doctors, active_nurses) VALUES
(1, 8, 14),
(2, 16, 28),
(3, 24, 45),
(4, 12, 20),
(5, 5, 8),
(6, 10, 18),
(7, 9, 15),
(8, 6, 11),
(9, 7, 12),
(10, 5, 9);

-- Services Status Data (Semáforo de Servicios)
-- Clinic 1: Corito 1
INSERT INTO clinic_services (clinic_id, service_type, status, notes) VALUES
(1, 'LABORATORY', 'AVAILABLE', 'Exámenes de rutina y biometría activa'),
(1, 'X_RAY', 'UNAVAILABLE', 'Equipo en mantenimiento preventivo'),
(1, 'PHARMACY', 'AVAILABLE', 'Despacho de insumos esenciales y antibióticos'),
(1, 'DENTISTRY', 'AVAILABLE', 'Consultas y curaciones en turno mañana'),
(1, 'EMERGENCY', 'AVAILABLE', 'Atención primaria inmediata');

-- Clinic 2: La Victoria
INSERT INTO clinic_services (clinic_id, service_type, status, notes) VALUES
(2, 'LABORATORY', 'AVAILABLE', 'Servicio 24 horas'),
(2, 'X_RAY', 'AVAILABLE', 'Digitalizador activo'),
(2, 'PHARMACY', 'AVAILABLE', 'Insumos completos'),
(2, 'DENTISTRY', 'AVAILABLE', 'Atención odontológica integral'),
(2, 'EMERGENCY', 'AVAILABLE', 'Triaje y trauma shock básico');

-- Clinic 3: Sabaneta
INSERT INTO clinic_services (clinic_id, service_type, status, notes) VALUES
(3, 'LABORATORY', 'AVAILABLE', 'Operaciones 24/7'),
(3, 'X_RAY', 'AVAILABLE', 'Rayos X e ecografía'),
(3, 'PHARMACY', 'AVAILABLE', 'Farmacia comunitaria activa'),
(3, 'DENTISTRY', 'AVAILABLE', 'Especialidades activas'),
(3, 'EMERGENCY', 'AVAILABLE', 'Emergencia de alta demanda');

-- Clinic 4: San Francisco
INSERT INTO clinic_services (clinic_id, service_type, status, notes) VALUES
(4, 'LABORATORY', 'AVAILABLE', 'Toma de muestras 7-11 AM'),
(4, 'X_RAY', 'UNAVAILABLE', 'Sin reactivos digitalizadores'),
(4, 'PHARMACY', 'AVAILABLE', 'Insumos básicos'),
(4, 'DENTISTRY', 'AVAILABLE', 'Odontología preventiva'),
(4, 'EMERGENCY', 'AVAILABLE', 'Emergencia diurna');

-- Images Data (using real MPPS Zulia photos)
INSERT INTO clinic_images (clinic_id, image_url, caption, is_primary) VALUES
(1, '/mpps-fachada-corito1.jpg', 'Fachada e Instalaciones Principales Ambulatorio Corito 1', 1),
(1, '/mpps-consultorio-medico.jpg', 'Consultorio Médico de Atención Primaria e Integral', 0),
(1, '/mpps-odontologia-laboratorio.jpg', 'Área de Odontología y Exámenes Clínicos Especializados', 0),
(1, '/mpps-farmacia-insumos.jpg', 'Despacho de Farmacia e Insumos Sanitarios', 0),
(1, '/mpps-personal-medico.jpg', 'Personal Médico y Equipo de Enfermería Activo en Planta', 0),
(2, '/mpps-ambulatorio-la-victoria.jpg', 'Fachada e Instalaciones Médicas Ambulatorio La Victoria', 1),
(2, '/mpps-emergencia-evaluacion.jpg', 'Área de Admisión, Evaluación y Cuidados de Emergencia', 0),
(3, '/mpps-ambulatorio-gomez-padron.jpg', 'Infraestructura General Ambulatorio Urbano III Gómez Padrón', 1),
(3, '/mpps-laboratorio-clinico.jpg', 'Laboratorio Clínico y Módulo de Atención Especializada', 0),
(4, '/mpps-ambulatorio-san-francisco.jpg', 'Fachada Ambulatorio San Francisco La Coromoto', 1);

-- 8. Users Data (Initial Admin & Coordinators for Zulia Network)
-- Password for admin: Admin321! (SHA256: e7b960b73c242096f9260c6d32eb34d193d56b00045e7f12e105e114a822bcbb)
-- Password for coordinators: admin123 (SHA256: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9)
INSERT INTO users (id, username, password_hash, full_name, role, clinic_id) VALUES
(1, 'admin', 'e7b960b73c242096f9260c6d32eb34d193d56b00045e7f12e105e114a822bcbb', 'Administrador General MPPS Zulia', 'ADMIN', NULL),
(2, 'corito_coord', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Dra. María Elena Gutiérrez', 'COORDINATOR', 1),
(3, 'santarosa_coord', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Dr. Carlos Eduardo Mendoza', 'COORDINATOR', 2),
(4, 'sabaneta_coord', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Dra. Yasmín Coromoto Nava', 'COORDINATOR', 3),
(5, 'sanfrancisco_coord', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Dr. Roberto Antonio Briceño', 'COORDINATOR', 4);
