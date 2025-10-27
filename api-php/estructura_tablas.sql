-- ========================================
-- Estructura de Tablas para Sistema de Captura
-- ========================================

-- Base de datos: sistema_captura
-- Cotejamiento: utf8mb4_general_ci

-- ========================================
-- Tabla: captura_pantalla_vivo
-- ========================================

CREATE TABLE IF NOT EXISTS `captura_pantalla_vivo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_proc` varchar(100) DEFAULT NULL,
  `ano` int(11) DEFAULT NULL,
  `mes` varchar(20) DEFAULT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `zona` varchar(100) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `grs` decimal(10,2) DEFAULT NULL,
  `rp` decimal(10,2) DEFAULT NULL,
  `renzo` decimal(10,2) DEFAULT NULL,
  `fafo` decimal(10,2) DEFAULT NULL,
  `santa_angela` decimal(10,2) DEFAULT NULL,
  `jorge_pan` decimal(10,2) DEFAULT NULL,
  `luis_calsin` decimal(10,2) DEFAULT NULL,
  `fredi_roque` decimal(10,2) DEFAULT NULL,
  `vidal_choque` decimal(10,2) DEFAULT NULL,
  `gregorio` decimal(10,2) DEFAULT NULL,
  `isaias` decimal(10,2) DEFAULT NULL,
  `juan_carlos` decimal(10,2) DEFAULT NULL,
  `pot_min` decimal(10,2) DEFAULT NULL,
  `pot_max` decimal(10,2) DEFAULT NULL,
  `cond_min` decimal(10,2) DEFAULT NULL,
  `cond_max` decimal(10,2) DEFAULT NULL,
  `unidad_compra` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ano_mes` (`ano`, `mes`),
  KEY `idx_provincia` (`provincia`),
  KEY `idx_zona` (`zona`),
  KEY `idx_tipo_proc` (`tipo_proc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================================
-- Tabla: captura_pantalla_beneficiado
-- ========================================

CREATE TABLE IF NOT EXISTS `captura_pantalla_beneficiado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_proc` varchar(100) DEFAULT NULL,
  `ano` int(11) DEFAULT NULL,
  `mes` varchar(20) DEFAULT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `zona` varchar(100) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `grs` decimal(10,2) DEFAULT NULL,
  `rp` decimal(10,2) DEFAULT NULL,
  `renzo` decimal(10,2) DEFAULT NULL,
  `fafo` decimal(10,2) DEFAULT NULL,
  `santa_angela` decimal(10,2) DEFAULT NULL,
  `jorge_pan` decimal(10,2) DEFAULT NULL,
  `luis_calsin` decimal(10,2) DEFAULT NULL,
  `fredi_roque` decimal(10,2) DEFAULT NULL,
  `vidal_choque` decimal(10,2) DEFAULT NULL,
  `gregorio` decimal(10,2) DEFAULT NULL,
  `isaias` decimal(10,2) DEFAULT NULL,
  `juan_carlos` decimal(10,2) DEFAULT NULL,
  `santa_elena` decimal(10,2) DEFAULT NULL,
  `granjas_chicas` decimal(10,2) DEFAULT NULL,
  `avelino` decimal(10,2) DEFAULT NULL,
  `peladores` decimal(10,2) DEFAULT NULL,
  `pot_min` decimal(10,2) DEFAULT NULL,
  `pot_max` decimal(10,2) DEFAULT NULL,
  `cond_min` decimal(10,2) DEFAULT NULL,
  `cond_max` decimal(10,2) DEFAULT NULL,
  `unidad_compra` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_ano_mes` (`ano`, `mes`),
  KEY `idx_provincia` (`provincia`),
  KEY `idx_zona` (`zona`),
  KEY `idx_tipo_proc` (`tipo_proc`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ========================================
-- Datos de Ejemplo (Opcional)
-- ========================================

-- Insertar algunos registros de ejemplo para vivo
INSERT INTO `captura_pantalla_vivo` 
(`tipo_proc`, `ano`, `mes`, `provincia`, `zona`, `nombre`, `grs`, `rp`, `renzo`, `fafo`, `santa_angela`) 
VALUES
('VIVO AREQUIPA', 2024, 'Enero', 'Arequipa', 'Zona 1', 'Cliente Ejemplo 1', 1500.00, 2.50, 100.00, 200.00, 150.00),
('VIVO AREQUIPA', 2024, 'Enero', 'Arequipa', 'Zona 2', 'Cliente Ejemplo 2', 2000.00, 2.80, 150.00, 250.00, 200.00),
('VIVO PROVINCIAS', 2024, 'Enero', 'Puno', 'Zona A', 'Cliente Ejemplo 3', 1800.00, 2.60, 120.00, 220.00, 180.00);

-- Insertar algunos registros de ejemplo para beneficiado
INSERT INTO `captura_pantalla_beneficiado` 
(`tipo_proc`, `ano`, `mes`, `provincia`, `zona`, `nombre`, `grs`, `rp`, `renzo`, `fafo`, `santa_elena`) 
VALUES
('BENEFICIADO AREQUIPA', 2024, 'Enero', 'Arequipa', 'Zona 1', 'Cliente Beneficiado 1', 3000.00, 3.50, 200.00, 300.00, 250.00),
('BENEFICIADO AREQUIPA', 2024, 'Enero', 'Arequipa', 'Zona 2', 'Cliente Beneficiado 2', 3500.00, 3.80, 250.00, 350.00, 300.00),
('BENEFICIADO PROVINCIAS', 2024, 'Enero', 'Cusco', 'Zona B', 'Cliente Beneficiado 3', 3200.00, 3.60, 220.00, 320.00, 270.00);

-- ========================================
-- NOTA: Si ya tienes datos, NO ejecutes los INSERT
--       Solo ejecuta los CREATE TABLE
-- ========================================
