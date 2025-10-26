import { Context } from 'hono'
import { VivoService } from '../services/VivoService'
import { VivoRepository } from '../repositories/VivoRepository'
import { CreateRegistroDTO, UpdateRegistroDTO, Bindings } from '../types'

export class VivoController {
  // GET /vivo/all
  static async getAll(c: Context<{ Bindings: Bindings }>) {
    const { DB } = c.env
    const repository = new VivoRepository(DB)
    const service = new VivoService(repository)

    const filters = {
      anio: c.req.query('anio'),
      mes: c.req.query('mes'),
      provincia_id: c.req.query('provincia_id')
    }

    const result = await service.getAll(filters)
    
    if (result.success) {
      return c.json(result.data)
    } else {
      return c.json({ error: result.error }, 400)
    }
  }

  // GET /vivo/arequipa
  static async getArequipa(c: Context<{ Bindings: Bindings }>) {
    const { DB } = c.env
    const repository = new VivoRepository(DB)
    const service = new VivoService(repository)

    const filters = {
      anio: c.req.query('anio'),
      mes: c.req.query('mes')
    }

    const result = await service.getArequipa(filters)
    
    if (result.success) {
      return c.json(result.data)
    } else {
      return c.json({ error: result.error }, 400)
    }
  }

  // GET /vivo/provincia
  static async getProvincia(c: Context<{ Bindings: Bindings }>) {
    const { DB } = c.env
    const repository = new VivoRepository(DB)
    const service = new VivoService(repository)

    const filters = {
      anio: c.req.query('anio'),
      mes: c.req.query('mes'),
      provincia_id: c.req.query('provincia_id')
    }

    const result = await service.getProvincia(filters)
    
    if (result.success) {
      return c.json(result.data)
    } else {
      return c.json({ error: result.error }, 400)
    }
  }

  // POST /vivo/crear
  static async crear(c: Context<{ Bindings: Bindings }>) {
    const { DB } = c.env
    const repository = new VivoRepository(DB)
    const service = new VivoService(repository)

    try {
      const body = await c.req.json<CreateRegistroDTO>()
      const result = await service.create(body)
      
      if (result.success) {
        return c.json(result, 201)
      } else {
        return c.json({ error: result.error }, 400)
      }
    } catch (error) {
      return c.json({ error: 'Datos inválidos' }, 400)
    }
  }

  // PUT /vivo/actualizar
  static async actualizar(c: Context<{ Bindings: Bindings }>) {
    const { DB } = c.env
    const repository = new VivoRepository(DB)
    const service = new VivoService(repository)

    try {
      const body = await c.req.json<UpdateRegistroDTO>()
      const result = await service.update(body)
      
      if (result.success) {
        return c.json(result)
      } else {
        return c.json({ error: result.error }, 400)
      }
    } catch (error) {
      return c.json({ error: 'Datos inválidos' }, 400)
    }
  }

  // DELETE /vivo/borrar/{id}
  static async borrar(c: Context<{ Bindings: Bindings }>) {
    const { DB } = c.env
    const repository = new VivoRepository(DB)
    const service = new VivoService(repository)

    const id = parseInt(c.req.param('id'))
    
    if (isNaN(id)) {
      return c.json({ error: 'ID inválido' }, 400)
    }

    const result = await service.delete(id)
    
    if (result.success) {
      return c.json(result)
    } else {
      return c.json({ error: result.error }, 404)
    }
  }

  // GET /vivo/estadisticas
  static async getEstadisticas(c: Context<{ Bindings: Bindings }>) {
    const { DB } = c.env
    const repository = new VivoRepository(DB)
    const service = new VivoService(repository)

    const filters = {
      proceso_id: c.req.query('proceso_id'),
      anio: c.req.query('anio')
    }

    const result = await service.getEstadisticas(filters)
    
    if (result.success) {
      return c.json(result.data)
    } else {
      return c.json({ error: result.error }, 400)
    }
  }
}
