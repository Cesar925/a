-- Datos iniciales de ejemplo

-- Procesos
INSERT OR IGNORE INTO procesos (id, nombre, descripcion) VALUES 
  (1, 'Arequipa Vivo', 'Proceso de Arequipa Vivo'),
  (2, 'Provincia Vivo', 'Proceso de Provincia Vivo'),
  (3, 'Arequipa Beneficiado', 'Proceso de Arequipa Beneficiado'),
  (4, 'Provincia Beneficiado', 'Proceso de Provincia Beneficiado');

-- Provincias
INSERT OR IGNORE INTO provincias (nombre) VALUES 
  ('AREQUIPA'),
  ('CAMANA'),
  ('CASTILLA'),
  ('CAYLLOMA'),
  ('CONDESUYOS'),
  ('ISLAY'),
  ('LA UNION'),
  ('CARAVELI');

-- Tipos de Cliente
INSERT OR IGNORE INTO tipos_cliente (codigo, nombre) VALUES 
  ('SI', 'DISTRIBUIDORES'),
  ('NO', 'MAYORISTAS'),
  ('MD', 'MERCADO');

-- Compras GRS
INSERT OR IGNORE INTO compras_grs (nombre, descripcion) VALUES 
  ('GRS', 'Compra GRS estándar'),
  ('RP', 'Compra RP'),
  ('Renzo', 'Cliente Renzo'),
  ('Fafio', 'Cliente Fafio'),
  ('Santa Elena', 'Cliente Santa Elena'),
  ('Granjas chicas', 'Granjas chicas'),
  ('Rosario', 'Cliente Rosario'),
  ('San Fernando Lima', 'San Fernando Lima'),
  ('Avicola Renzo', 'Avicola Renzo');

-- Zonas de Arequipa
INSERT OR IGNORE INTO zonas (nombre, provincia_id) VALUES 
  ('CENTRO', 1),
  ('NORTE', 1),
  ('SUR', 1),
  ('ESTE', 1),
  ('OESTE', 1);

-- Clientes de ejemplo
INSERT OR IGNORE INTO clientes (nombre, tipo_cliente_id, provincia_id) VALUES 
  ('RENZO', 1, 1),
  ('AVELINO', 1, 1),
  ('MERCEDES', 1, 1),
  ('AVICRU', 1, 1),
  ('RAFAEL', 1, 1),
  ('MATILDE', 1, 1),
  ('AVIROX', 1, 1),
  ('JULIA', 1, 1),
  ('SIMON', 1, 1),
  ('DANTE', 1, 1),
  ('GABRIEL', 1, 1),
  ('ARTURO', 1, 1),
  ('NICOLAS', 1, 1),
  ('LUIS FLORES', 1, 1),
  ('MIRELLA', 1, 1),
  ('Santa Angela', 1, 1),
  ('Jorge Pan', 1, 1),
  ('Miriam G.', 1, 1),
  ('Vasquez', 1, 1),
  ('San Joaquín', 1, 1);
