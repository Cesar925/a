// Tipos base
export interface Bindings {
  DB: D1Database;
}

// Modelos de datos
export interface Proceso {
  id?: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
}

export interface Provincia {
  id?: number;
  nombre: string;
  created_at?: string;
}

export interface Zona {
  id?: number;
  nombre: string;
  provincia_id?: number;
  provincia_nombre?: string;
  created_at?: string;
}

export interface TipoCliente {
  id?: number;
  codigo: string;
  nombre: string;
  created_at?: string;
}

export interface CompraGRS {
  id?: number;
  nombre: string;
  descripcion?: string;
  created_at?: string;
}

export interface Cliente {
  id?: number;
  nombre: string;
  tipo_cliente_id?: number;
  tipo_cliente_nombre?: string;
  provincia_id?: number;
  provincia_nombre?: string;
  zona_id?: number;
  zona_nombre?: string;
  compra_grs_id?: number;
  compra_grs_nombre?: string;
  created_at?: string;
}

export interface Registro {
  id?: number;
  proceso_id: number;
  proceso_nombre?: string;
  cliente_id: number;
  cliente_nombre?: string;
  anio: number;
  mes: number;
  provincia_id?: number;
  provincia_nombre?: string;
  zona_id?: number;
  zona_nombre?: string;
  compra_grs_id?: number;
  compra_grs_nombre?: string;
  cantidad_grs?: number;
  cantidad_rp?: number;
  potencial_minimo?: number;
  potencial_maximo?: number;
  observaciones?: string;
  created_at?: string;
}

// DTOs para operaciones CRUD
export interface CreateRegistroDTO {
  proceso_id: number;
  cliente_id: number;
  anio: number;
  mes: number;
  provincia_id?: number;
  zona_id?: number;
  compra_grs_id?: number;
  cantidad_grs?: number;
  cantidad_rp?: number;
  potencial_minimo?: number;
  potencial_maximo?: number;
  observaciones?: string;
}

export interface UpdateRegistroDTO extends CreateRegistroDTO {
  id: number;
}

export interface QueryFilters {
  proceso_id?: string;
  anio?: string;
  mes?: string;
  provincia_id?: string;
  zona_id?: string;
}

export interface Estadisticas {
  total_registros: number;
  total_grs: number;
  total_rp: number;
  promedio_grs: number;
  promedio_rp: number;
}

// Respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
