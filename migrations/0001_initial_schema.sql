-- Tabla de procesos (TIPO)
CREATE TABLE IF NOT EXISTS procesos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de provincias
CREATE TABLE IF NOT EXISTS provincias (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de zonas
CREATE TABLE IF NOT EXISTS zonas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  provincia_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (provincia_id) REFERENCES provincias(id)
);

-- Tabla de compras GRS
CREATE TABLE IF NOT EXISTS compras_grs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tipos de cliente
CREATE TABLE IF NOT EXISTS tipos_cliente (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  codigo TEXT NOT NULL UNIQUE,
  nombre TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de clientes/beneficiarios
CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  tipo_cliente_id INTEGER,
  provincia_id INTEGER,
  zona_id INTEGER,
  compra_grs_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tipo_cliente_id) REFERENCES tipos_cliente(id),
  FOREIGN KEY (provincia_id) REFERENCES provincias(id),
  FOREIGN KEY (zona_id) REFERENCES zonas(id),
  FOREIGN KEY (compra_grs_id) REFERENCES compras_grs(id)
);

-- Tabla de registros de ventas/datos
CREATE TABLE IF NOT EXISTS registros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  proceso_id INTEGER NOT NULL,
  cliente_id INTEGER NOT NULL,
  anio INTEGER NOT NULL,
  mes INTEGER NOT NULL,
  provincia_id INTEGER,
  zona_id INTEGER,
  compra_grs_id INTEGER,
  cantidad_grs REAL DEFAULT 0,
  cantidad_rp REAL DEFAULT 0,
  potencial_minimo REAL DEFAULT 0,
  potencial_maximo REAL DEFAULT 0,
  observaciones TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (proceso_id) REFERENCES procesos(id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id),
  FOREIGN KEY (provincia_id) REFERENCES provincias(id),
  FOREIGN KEY (zona_id) REFERENCES zonas(id),
  FOREIGN KEY (compra_grs_id) REFERENCES compras_grs(id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_clientes_tipo ON clientes(tipo_cliente_id);
CREATE INDEX IF NOT EXISTS idx_clientes_provincia ON clientes(provincia_id);
CREATE INDEX IF NOT EXISTS idx_clientes_zona ON clientes(zona_id);
CREATE INDEX IF NOT EXISTS idx_registros_proceso ON registros(proceso_id);
CREATE INDEX IF NOT EXISTS idx_registros_cliente ON registros(cliente_id);
CREATE INDEX IF NOT EXISTS idx_registros_anio_mes ON registros(anio, mes);
CREATE INDEX IF NOT EXISTS idx_zonas_provincia ON zonas(provincia_id);
