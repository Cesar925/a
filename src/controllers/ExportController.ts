import { Context } from 'hono'
import { Bindings } from '../types'

export class ExportController {
  /**
   * Exportar Arequipa Beneficiado a Excel
   * GET /beneficiado/arequipa/excel
   */
  static async exportarArequipaExcel(c: Context<{ Bindings: Bindings }>) {
    try {
      const { DB } = c.env
      
      const query = `
        SELECT 
          r.id,
          r.anio,
          r.mes,
          cl.nombre as cliente,
          pr.nombre as provincia,
          z.nombre as zona,
          r.cantidad_grs,
          r.cantidad_rp,
          r.potencial_minimo,
          r.potencial_maximo,
          r.observaciones
        FROM registros r
        LEFT JOIN clientes cl ON r.cliente_id = cl.id
        LEFT JOIN provincias pr ON r.provincia_id = pr.id
        LEFT JOIN zonas z ON r.zona_id = z.id
        LEFT JOIN procesos p ON r.proceso_id = p.id
        WHERE p.nombre = 'Arequipa Beneficiado'
        ORDER BY r.anio DESC, r.mes DESC, cl.nombre
      `
      
      const result = await DB.prepare(query).all()
      
      return c.json(result.results || [], 200, {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="beneficiado_arequipa.json"'
      })
    } catch (error: any) {
      console.error('Error exportando Arequipa Excel:', error)
      return c.json({ error: 'Error al exportar datos', details: error.message }, 500)
    }
  }

  /**
   * Exportar Provincia Beneficiado a Excel
   * GET /beneficiado/provincia/excel
   */
  static async exportarProvinciaExcel(c: Context<{ Bindings: Bindings }>) {
    try {
      const { DB } = c.env
      
      const query = `
        SELECT 
          r.id,
          r.anio,
          r.mes,
          cl.nombre as cliente,
          pr.nombre as provincia,
          z.nombre as zona,
          r.cantidad_grs,
          r.cantidad_rp,
          r.potencial_minimo,
          r.potencial_maximo,
          r.observaciones
        FROM registros r
        LEFT JOIN clientes cl ON r.cliente_id = cl.id
        LEFT JOIN provincias pr ON r.provincia_id = pr.id
        LEFT JOIN zonas z ON r.zona_id = z.id
        LEFT JOIN procesos p ON r.proceso_id = p.id
        WHERE p.nombre = 'Provincia Beneficiado'
        ORDER BY r.anio DESC, r.mes DESC, cl.nombre
      `
      
      const result = await DB.prepare(query).all()
      
      return c.json(result.results || [], 200, {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="beneficiado_provincia.json"'
      })
    } catch (error: any) {
      console.error('Error exportando Provincia Excel:', error)
      return c.json({ error: 'Error al exportar datos', details: error.message }, 500)
    }
  }

  /**
   * Exportar Arequipa Vivo a Excel
   * GET /vivo/arequipa/excel
   */
  static async exportarArequipaVivoExcel(c: Context<{ Bindings: Bindings }>) {
    try {
      const { DB } = c.env
      
      const query = `
        SELECT 
          r.id,
          r.anio,
          r.mes,
          cl.nombre as cliente,
          pr.nombre as provincia,
          z.nombre as zona,
          r.cantidad_grs,
          r.cantidad_rp,
          r.potencial_minimo,
          r.potencial_maximo,
          r.observaciones
        FROM registros r
        LEFT JOIN clientes cl ON r.cliente_id = cl.id
        LEFT JOIN provincias pr ON r.provincia_id = pr.id
        LEFT JOIN zonas z ON r.zona_id = z.id
        LEFT JOIN procesos p ON r.proceso_id = p.id
        WHERE p.nombre = 'Arequipa Vivo'
        ORDER BY r.anio DESC, r.mes DESC, cl.nombre
      `
      
      const result = await DB.prepare(query).all()
      
      return c.json(result.results || [], 200, {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="vivo_arequipa.json"'
      })
    } catch (error: any) {
      console.error('Error exportando Arequipa Vivo Excel:', error)
      return c.json({ error: 'Error al exportar datos', details: error.message }, 500)
    }
  }

  /**
   * Exportar Provincia Vivo a Excel
   * GET /vivo/provincia/excel
   */
  static async exportarProvinciaVivoExcel(c: Context<{ Bindings: Bindings }>) {
    try {
      const { DB } = c.env
      
      const query = `
        SELECT 
          r.id,
          r.anio,
          r.mes,
          cl.nombre as cliente,
          pr.nombre as provincia,
          z.nombre as zona,
          r.cantidad_grs,
          r.cantidad_rp,
          r.potencial_minimo,
          r.potencial_maximo,
          r.observaciones
        FROM registros r
        LEFT JOIN clientes cl ON r.cliente_id = cl.id
        LEFT JOIN provincias pr ON r.provincia_id = pr.id
        LEFT JOIN zonas z ON r.zona_id = z.id
        LEFT JOIN procesos p ON r.proceso_id = p.id
        WHERE p.nombre = 'Provincia Vivo'
        ORDER BY r.anio DESC, r.mes DESC, cl.nombre
      `
      
      const result = await DB.prepare(query).all()
      
      return c.json(result.results || [], 200, {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="vivo_provincia.json"'
      })
    } catch (error: any) {
      console.error('Error exportando Provincia Vivo Excel:', error)
      return c.json({ error: 'Error al exportar datos', details: error.message }, 500)
    }
  }
}
