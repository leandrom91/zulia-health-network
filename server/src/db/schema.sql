-- Database Schema for Red de Clínicas Populares del Estado Zulia
-- Engine: MySQL 8.0+

CREATE DATABASE IF NOT EXISTS zulia_health_db 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE zulia_health_db;

-- 1. Clinics Table
CREATE TABLE IF NOT EXISTS clinics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type ENUM('TYPE_1', 'TYPE_2', 'TYPE_3') NOT NULL DEFAULT 'TYPE_1',
  municipality VARCHAR(100) NOT NULL,
  parish VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  google_maps_url VARCHAR(500) NOT NULL,
  schedule VARCHAR(100) NOT NULL DEFAULT '7:00 AM - 1:00 PM',
  daily_quota_total INT NOT NULL DEFAULT 50,
  daily_quota_available INT NOT NULL DEFAULT 50,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_municipality (municipality),
  INDEX idx_parish (parish),
  INDEX idx_type (type)
) ENGINE=InnoDB;

-- 2. Clinic Directors Table
CREATE TABLE IF NOT EXISTS clinic_directors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clinic_id INT UNIQUE NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  title VARCHAR(100) NOT NULL DEFAULT 'Director(a) Médico',
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. Clinic Staff Count Table
CREATE TABLE IF NOT EXISTS clinic_staff (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clinic_id INT UNIQUE NOT NULL,
  active_doctors INT NOT NULL DEFAULT 0,
  active_nurses INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. Clinic Services Status Table (Semáforo de Servicios)
CREATE TABLE IF NOT EXISTS clinic_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clinic_id INT NOT NULL,
  service_type ENUM('LABORATORY', 'X_RAY', 'PHARMACY', 'DENTISTRY', 'EMERGENCY') NOT NULL,
  status ENUM('AVAILABLE', 'UNAVAILABLE', 'NOT_PROVIDED') NOT NULL DEFAULT 'AVAILABLE',
  notes VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_clinic_service (clinic_id, service_type),
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Clinic Images Table
CREATE TABLE IF NOT EXISTS clinic_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clinic_id INT NOT NULL,
  image_url TEXT NOT NULL,
  caption VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. System Announcements / Banners Table
CREATE TABLE IF NOT EXISTS announcements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  banner_type ENUM('INFO', 'SOLIDARITY', 'URGENT') NOT NULL DEFAULT 'INFO',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 7. System Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(150) NOT NULL,
  role ENUM('ADMIN', 'COORDINATOR') NOT NULL DEFAULT 'COORDINATOR',
  clinic_id INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clinic_id) REFERENCES clinics(id) ON DELETE SET NULL
) ENGINE=InnoDB;
