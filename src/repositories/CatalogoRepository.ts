import { Proceso, Provincia, Zona, TipoCliente, CompraGRS, Cliente } from '../types'

export class CatalogoRepository {
  constructor(private db: D1Database) {}

  // Procesos
  async getProcesos(): Promise<Proceso[]> {
    const { results } = await this.db.prepare('SELECT * FROM procesos ORDER BY nombre').all()
    return results as Proceso[]
  }

  // Provincias
  async getProvincias(): Promise<Provincia[]> {
    const { results } = await this.db.prepare('SELECT * FROM provincias ORDER BY nombre').all()
    return results as Provincia[]
  }

  // Zonas
  async getZonas(provincia_id?: number): Promise<Zona[]> {
    let query = `
      SELECT z.*, p.nombre as provincia_nombre 
      FROM zonas z 
      LEFT JOIN provincias p ON z.provincia_id = p.id
    `
    
    if (provincia_id) {
      query += ' WHERE z.provincia_id = ?'
      const { results } = await this.db.prepare(query).bind(provincia_id).all()
      return results as Zona[]
    } else {
      query += ' ORDER BY z.nombre'
      const { results } = await this.db.prepare(query).all()
      return results as Zona[]
    }
  }

  // Tipos de Cliente
  async getTiposCliente(): Promise<TipoCliente[]> {
    const { results } = await this.db.prepare('SELECT * FROM tipos_cliente ORDER BY nombre').all()
    return results as TipoCliente[]
  }

  // Compras GRS
  async getComprasGRS(): Promise<CompraGRS[]> {
    const { results } = await this.db.prepare('SELECT * FROM compras_grs ORDER BY nombre').all()
    return results as CompraGRS[]
  }

  // Clientes
  async getClientes(): Promise<Cliente[]> {
    const { results } = await this.db.prepare(`
      SELECT c.*, 
             tc.nombre as tipo_cliente_nombre,
             p.nombre as provincia_nombre,
             z.nombre as zona_nombre,
             cg.nombre as compra_grs_nombre
      FROM clientes c
      LEFT JOIN tipos_cliente tc ON c.tipo_cliente_id = tc.id
      LEFT JOIN provincias p ON c.provincia_id = p.id
      LEFT JOIN zonas z ON c.zona_id = z.id
      LEFT JOIN compras_grs cg ON c.compra_grs_id = cg.id
      ORDER BY c.nombre
    `).all()
    return results as Cliente[]
  }

  async createCliente(data: { nombre: string; tipo_cliente_id?: number; provincia_id?: number }): Promise<number> {
    const result = await this.db.prepare(`
      INSERT INTO clientes (nombre, tipo_cliente_id, provincia_id)
      VALUES (?, ?, ?)
    `).bind(data.nombre, data.tipo_cliente_id || null, data.provincia_id || null).run()
    
    return result.meta.last_row_id as number
  }
}
