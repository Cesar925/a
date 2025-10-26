import { Registro, CreateRegistroDTO, UpdateRegistroDTO, QueryFilters, Estadisticas } from '../types'

export class VivoRepository {
  constructor(private db: D1Database) {}

  // Obtener todos los registros VIVO (Arequipa + Provincia)
  async findAll(filters: QueryFilters): Promise<Registro[]> {
    let query = `
      SELECT r.*, 
             p.nombre as proceso_nombre,
             cl.nombre as cliente_nombre,
             pr.nombre as provincia_nombre,
             z.nombre as zona_nombre,
             cg.nombre as compra_grs_nombre
      FROM registros r
      LEFT JOIN procesos p ON r.proceso_id = p.id
      LEFT JOIN clientes cl ON r.cliente_id = cl.id
      LEFT JOIN provincias pr ON r.provincia_id = pr.id
      LEFT JOIN zonas z ON r.zona_id = z.id
      LEFT JOIN compras_grs cg ON r.compra_grs_id = cg.id
      WHERE p.nombre IN ('Arequipa Vivo', 'Provincia Vivo')
    `
    
    const bindings: any[] = []
    
    if (filters.proceso_id) {
      query += ' AND r.proceso_id = ?'
      bindings.push(filters.proceso_id)
    }
    if (filters.anio) {
      query += ' AND r.anio = ?'
      bindings.push(filters.anio)
    }
    if (filters.mes) {
      query += ' AND r.mes = ?'
      bindings.push(filters.mes)
    }
    if (filters.provincia_id) {
      query += ' AND r.provincia_id = ?'
      bindings.push(filters.provincia_id)
    }
    
    query += ' ORDER BY r.created_at DESC LIMIT 100'
    
    const { results } = await this.db.prepare(query).bind(...bindings).all()
    return results as Registro[]
  }

  // Obtener registros de Arequipa Vivo
  async findArequipa(filters: QueryFilters): Promise<Registro[]> {
    let query = `
      SELECT r.*, 
             p.nombre as proceso_nombre,
             cl.nombre as cliente_nombre,
             pr.nombre as provincia_nombre,
             z.nombre as zona_nombre,
             cg.nombre as compra_grs_nombre
      FROM registros r
      LEFT JOIN procesos p ON r.proceso_id = p.id
      LEFT JOIN clientes cl ON r.cliente_id = cl.id
      LEFT JOIN provincias pr ON r.provincia_id = pr.id
      LEFT JOIN zonas z ON r.zona_id = z.id
      LEFT JOIN compras_grs cg ON r.compra_grs_id = cg.id
      WHERE p.nombre = 'Arequipa Vivo'
    `
    
    const bindings: any[] = []
    
    if (filters.anio) {
      query += ' AND r.anio = ?'
      bindings.push(filters.anio)
    }
    if (filters.mes) {
      query += ' AND r.mes = ?'
      bindings.push(filters.mes)
    }
    
    query += ' ORDER BY r.created_at DESC LIMIT 100'
    
    const { results } = await this.db.prepare(query).bind(...bindings).all()
    return results as Registro[]
  }

  // Obtener registros de Provincia Vivo
  async findProvincia(filters: QueryFilters): Promise<Registro[]> {
    let query = `
      SELECT r.*, 
             p.nombre as proceso_nombre,
             cl.nombre as cliente_nombre,
             pr.nombre as provincia_nombre,
             z.nombre as zona_nombre,
             cg.nombre as compra_grs_nombre
      FROM registros r
      LEFT JOIN procesos p ON r.proceso_id = p.id
      LEFT JOIN clientes cl ON r.cliente_id = cl.id
      LEFT JOIN provincias pr ON r.provincia_id = pr.id
      LEFT JOIN zonas z ON r.zona_id = z.id
      LEFT JOIN compras_grs cg ON r.compra_grs_id = cg.id
      WHERE p.nombre = 'Provincia Vivo'
    `
    
    const bindings: any[] = []
    
    if (filters.anio) {
      query += ' AND r.anio = ?'
      bindings.push(filters.anio)
    }
    if (filters.mes) {
      query += ' AND r.mes = ?'
      bindings.push(filters.mes)
    }
    if (filters.provincia_id) {
      query += ' AND r.provincia_id = ?'
      bindings.push(filters.provincia_id)
    }
    
    query += ' ORDER BY r.created_at DESC LIMIT 100'
    
    const { results } = await this.db.prepare(query).bind(...bindings).all()
    return results as Registro[]
  }

  // Crear nuevo registro
  async create(data: CreateRegistroDTO): Promise<number> {
    const result = await this.db.prepare(`
      INSERT INTO registros (
        proceso_id, cliente_id, anio, mes, provincia_id, zona_id,
        compra_grs_id, cantidad_grs, cantidad_rp, potencial_minimo,
        potencial_maximo, observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.proceso_id,
      data.cliente_id,
      data.anio,
      data.mes,
      data.provincia_id || null,
      data.zona_id || null,
      data.compra_grs_id || null,
      data.cantidad_grs || 0,
      data.cantidad_rp || 0,
      data.potencial_minimo || 0,
      data.potencial_maximo || 0,
      data.observaciones || null
    ).run()
    
    return result.meta.last_row_id as number
  }

  // Actualizar registro
  async update(data: UpdateRegistroDTO): Promise<boolean> {
    const result = await this.db.prepare(`
      UPDATE registros SET
        proceso_id = ?,
        cliente_id = ?,
        anio = ?,
        mes = ?,
        provincia_id = ?,
        zona_id = ?,
        compra_grs_id = ?,
        cantidad_grs = ?,
        cantidad_rp = ?,
        potencial_minimo = ?,
        potencial_maximo = ?,
        observaciones = ?
      WHERE id = ?
    `).bind(
      data.proceso_id,
      data.cliente_id,
      data.anio,
      data.mes,
      data.provincia_id || null,
      data.zona_id || null,
      data.compra_grs_id || null,
      data.cantidad_grs || 0,
      data.cantidad_rp || 0,
      data.potencial_minimo || 0,
      data.potencial_maximo || 0,
      data.observaciones || null,
      data.id
    ).run()
    
    return result.meta.changes > 0
  }

  // Eliminar registro
  async delete(id: number): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM registros WHERE id = ?')
      .bind(id)
      .run()
    
    return result.meta.changes > 0
  }

  // Obtener registro por ID
  async findById(id: number): Promise<Registro | null> {
    const { results } = await this.db.prepare(`
      SELECT r.*, 
             p.nombre as proceso_nombre,
             cl.nombre as cliente_nombre,
             pr.nombre as provincia_nombre,
             z.nombre as zona_nombre,
             cg.nombre as compra_grs_nombre
      FROM registros r
      LEFT JOIN procesos p ON r.proceso_id = p.id
      LEFT JOIN clientes cl ON r.cliente_id = cl.id
      LEFT JOIN provincias pr ON r.provincia_id = pr.id
      LEFT JOIN zonas z ON r.zona_id = z.id
      LEFT JOIN compras_grs cg ON r.compra_grs_id = cg.id
      WHERE r.id = ?
    `).bind(id).all()
    
    return results.length > 0 ? (results[0] as Registro) : null
  }

  // Obtener estadísticas
  async getEstadisticas(filters: QueryFilters): Promise<Estadisticas> {
    let query = `
      SELECT 
        COUNT(*) as total_registros,
        COALESCE(SUM(cantidad_grs), 0) as total_grs,
        COALESCE(SUM(cantidad_rp), 0) as total_rp,
        COALESCE(AVG(cantidad_grs), 0) as promedio_grs,
        COALESCE(AVG(cantidad_rp), 0) as promedio_rp
      FROM registros r
      LEFT JOIN procesos p ON r.proceso_id = p.id
      WHERE p.nombre IN ('Arequipa Vivo', 'Provincia Vivo')
    `
    
    const bindings: any[] = []
    
    if (filters.proceso_id) {
      query += ' AND r.proceso_id = ?'
      bindings.push(filters.proceso_id)
    }
    if (filters.anio) {
      query += ' AND r.anio = ?'
      bindings.push(filters.anio)
    }
    
    const { results } = await this.db.prepare(query).bind(...bindings).all()
    return results[0] as Estadisticas
  }
}
