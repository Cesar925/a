import { Context } from 'hono'
import { CatalogoRepository } from '../repositories/CatalogoRepository'
import { Bindings } from '../types'

export class CatalogoController {
  // GET /catalogos/procesos
  static async getProcesos(c: Context<{ Bindings: Bindings }>) {
    const { DB } = c.env
    const repository = new CatalogoRepository(DB)

    try {
      const data = await repository.getProcesos()
      return c.json(data)
    } catch (error) {
      return c.json({ error: 'Error al obtener procesos' }, 500)
    }
  }

  // GET /catalogos/provincias
  static async getProvincias(c: Context<{ Bindings: Bindings }>) {
    const { DB } = c.env
    const repository = new CatalogoRepository(DB)

    try {
      const data = await repository.getProvincias()
      return c.json(data)
    } catch (error) {
      return c.json({ error: 'Error al obtener provincias' }, 500)
    }
  }

  // GET /catalogos/zonas
  static async getZonas(c: Context<{ Bindings: Bindings }>) {
    const { DB } = c.env
    const repository = new CatalogoRepository(DB)
    const provincia_id = c.req.query('provincia_id')

    try {
      const data = await repository.getZonas(provincia_id ? parseInt(provincia_id) : undefined)
      return c.json(data)
    } catch (error) {
      return c.json({ error: 'Error al obtener zonas' }, 500)
    }
  }

  // GET /catalogos/tipos-cliente
  static async getTiposCliente(c: Context<{ Bindings: Bindings }>) {
    const { DB } = c.env
    const repository = new CatalogoRepository(DB)

    try {
      const data = await repository.getTiposCliente()
      return c.json(data)
    } catch (error) {
      return c.json({ error: 'Error al obtener tipos de cliente' }, 500)
    }
  }

  // GET /catalogos/compras-grs
  static async getComprasGRS(c: Context<{ Bindings: Bindings }>) {
    const { DB } = c.env
    const repository = new CatalogoRepository(DB)

    try {
      const data = await repository.getComprasGRS()
      return c.json(data)
    } catch (error) {
      return c.json({ error: 'Error al obtener compras GRS' }, 500)
    }
  }

  // GET /catalogos/clientes
  static async getClientes(c: Context<{ Bindings: Bindings }>) {
    const { DB } = c.env
    const repository = new CatalogoRepository(DB)

    try {
      const data = await repository.getClientes()
      return c.json(data)
    } catch (error) {
      return c.json({ error: 'Error al obtener clientes' }, 500)
    }
  }

  // POST /catalogos/clientes
  static async createCliente(c: Context<{ Bindings: Bindings }>) {
    const { DB } = c.env
    const repository = new CatalogoRepository(DB)

    try {
      const body = await c.req.json<{ nombre: string; tipo_cliente_id?: number; provincia_id?: number }>()
      const id = await repository.createCliente(body)
      return c.json({ success: true, id }, 201)
    } catch (error) {
      return c.json({ error: 'Error al crear cliente' }, 400)
    }
  }
}
