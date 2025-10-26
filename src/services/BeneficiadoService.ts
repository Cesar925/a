import { BeneficiadoRepository } from '../repositories/BeneficiadoRepository'
import { Registro, CreateRegistroDTO, UpdateRegistroDTO, QueryFilters, Estadisticas, ApiResponse } from '../types'

export class BeneficiadoService {
  constructor(private repository: BeneficiadoRepository) {}

  async getAll(filters: QueryFilters): Promise<ApiResponse<Registro[]>> {
    try {
      const data = await this.repository.findAll(filters)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
    }
  }

  async getArequipa(filters: QueryFilters): Promise<ApiResponse<Registro[]>> {
    try {
      const data = await this.repository.findArequipa(filters)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
    }
  }

  async getProvincia(filters: QueryFilters): Promise<ApiResponse<Registro[]>> {
    try {
      const data = await this.repository.findProvincia(filters)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
    }
  }

  async create(data: CreateRegistroDTO): Promise<ApiResponse<{ id: number }>> {
    try {
      const id = await this.repository.create(data)
      return { success: true, data: { id }, message: 'Registro creado exitosamente' }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error al crear registro' }
    }
  }

  async update(data: UpdateRegistroDTO): Promise<ApiResponse<boolean>> {
    try {
      const exists = await this.repository.findById(data.id)
      if (!exists) {
        return { success: false, error: 'Registro no encontrado' }
      }

      const updated = await this.repository.update(data)
      if (updated) {
        return { success: true, data: true, message: 'Registro actualizado exitosamente' }
      } else {
        return { success: false, error: 'No se pudo actualizar el registro' }
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error al actualizar registro' }
    }
  }

  async delete(id: number): Promise<ApiResponse<boolean>> {
    try {
      const exists = await this.repository.findById(id)
      if (!exists) {
        return { success: false, error: 'Registro no encontrado' }
      }

      const deleted = await this.repository.delete(id)
      if (deleted) {
        return { success: true, data: true, message: 'Registro eliminado exitosamente' }
      } else {
        return { success: false, error: 'No se pudo eliminar el registro' }
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error al eliminar registro' }
    }
  }

  async getById(id: number): Promise<ApiResponse<Registro>> {
    try {
      const data = await this.repository.findById(id)
      if (!data) {
        return { success: false, error: 'Registro no encontrado' }
      }
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
    }
  }

  async getEstadisticas(filters: QueryFilters): Promise<ApiResponse<Estadisticas>> {
    try {
      const data = await this.repository.getEstadisticas(filters)
      return { success: true, data }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' }
    }
  }
}
