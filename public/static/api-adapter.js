/**
 * API Adapter
 * 
 * Este archivo adapta las llamadas del frontend existente
 * para funcionar con la nueva API PHP
 */

/**
 * Mapeo de meses en español a números
 */
const MESES_MAP = {
  'Enero': 1, 'Febrero': 2, 'Marzo': 3, 'Abril': 4,
  'Mayo': 5, 'Junio': 6, 'Julio': 7, 'Agosto': 8,
  'Septiembre': 9, 'Octubre': 10, 'Noviembre': 11, 'Diciembre': 12
};

const MESES_REVERSE = {
  1: 'Enero', 2: 'Febrero', 3: 'Marzo', 4: 'Abril',
  5: 'Mayo', 6: 'Junio', 7: 'Julio', 8: 'Agosto',
  9: 'Septiembre', 10: 'Octubre', 11: 'Noviembre', 12: 'Diciembre'
};

/**
 * Convertir registro de formato D1 a formato MySQL
 */
function registroToMySQL(registro) {
  const mysql = { ...registro };
  
  // Convertir mes de número a texto si es necesario
  if (typeof mysql.mes === 'number') {
    mysql.mes = MESES_REVERSE[mysql.mes] || mysql.mes;
  }
  
  // Mapear campos si es necesario
  if (mysql.anio) mysql.ano = mysql.anio;
  if (mysql.cantidad_grs) mysql.grs = mysql.cantidad_grs;
  if (mysql.cliente) mysql.nombre = mysql.cliente;
  
  return mysql;
}

/**
 * Convertir registro de formato MySQL a formato D1
 */
function registroFromMySQL(registro) {
  const d1 = { ...registro };
  
  // Convertir mes de texto a número
  if (typeof d1.mes === 'string' && MESES_MAP[d1.mes]) {
    d1.mes = MESES_MAP[d1.mes];
  }
  
  // Mapear campos
  if (d1.ano) d1.anio = d1.ano;
  if (d1.grs) d1.cantidad_grs = d1.grs;
  if (d1.nombre) d1.cliente = d1.nombre;
  
  return d1;
}

/**
 * Adapter para las funciones del frontend
 */
window.API = {
  /**
   * VIVO - Obtener todos
   */
  async getVivoAll(filtros = {}) {
    try {
      const filters = { ...filtros };
      if (filters.anio) filters.ano = filters.anio;
      
      const response = await RegistrosAPI.getAll('vivo', filters);
      
      if (response.success) {
        return response.data.map(registroFromMySQL);
      }
      throw new Error('Error al obtener registros vivo');
    } catch (error) {
      console.error('Error en getVivoAll:', error);
      throw error;
    }
  },
  
  /**
   * VIVO - Obtener Arequipa
   */
  async getVivoArequipa(filtros = {}) {
    try {
      const filters = { ...filtros, provincia: 'Arequipa' };
      if (filters.anio) filters.ano = filters.anio;
      
      const response = await RegistrosAPI.getAll('vivo', filters);
      
      if (response.success) {
        return response.data.map(registroFromMySQL);
      }
      throw new Error('Error al obtener registros vivo Arequipa');
    } catch (error) {
      console.error('Error en getVivoArequipa:', error);
      throw error;
    }
  },
  
  /**
   * VIVO - Obtener Provincia
   */
  async getVivoProvincia(filtros = {}) {
    try {
      const filters = { ...filtros };
      if (filters.anio) filters.ano = filters.anio;
      
      // Obtener todos y filtrar los que NO son Arequipa
      const response = await RegistrosAPI.getAll('vivo', filters);
      
      if (response.success) {
        const registros = response.data
          .filter(r => r.provincia && r.provincia !== 'Arequipa')
          .map(registroFromMySQL);
        return registros;
      }
      throw new Error('Error al obtener registros vivo Provincia');
    } catch (error) {
      console.error('Error en getVivoProvincia:', error);
      throw error;
    }
  },
  
  /**
   * VIVO - Crear
   */
  async crearVivo(datos) {
    try {
      const mysql = registroToMySQL(datos);
      const response = await RegistrosAPI.crear('vivo', mysql);
      
      if (response.success) {
        return { success: true, id: response.id };
      }
      throw new Error(response.error || 'Error al crear registro');
    } catch (error) {
      console.error('Error en crearVivo:', error);
      throw error;
    }
  },
  
  /**
   * VIVO - Actualizar
   */
  async actualizarVivo(id, datos) {
    try {
      const mysql = registroToMySQL(datos);
      const response = await RegistrosAPI.actualizar('vivo', id, mysql);
      
      if (response.success) {
        return { success: true };
      }
      throw new Error(response.error || 'Error al actualizar registro');
    } catch (error) {
      console.error('Error en actualizarVivo:', error);
      throw error;
    }
  },
  
  /**
   * VIVO - Borrar
   */
  async borrarVivo(id) {
    try {
      const response = await RegistrosAPI.borrar('vivo', id);
      
      if (response.success) {
        return { success: true };
      }
      throw new Error(response.error || 'Error al eliminar registro');
    } catch (error) {
      console.error('Error en borrarVivo:', error);
      throw error;
    }
  },
  
  /**
   * BENEFICIADO - Obtener todos
   */
  async getBeneficiadoAll(filtros = {}) {
    try {
      const filters = { ...filtros };
      if (filters.anio) filters.ano = filters.anio;
      
      const response = await RegistrosAPI.getAll('beneficiado', filters);
      
      if (response.success) {
        return response.data.map(registroFromMySQL);
      }
      throw new Error('Error al obtener registros beneficiado');
    } catch (error) {
      console.error('Error en getBeneficiadoAll:', error);
      throw error;
    }
  },
  
  /**
   * BENEFICIADO - Obtener Arequipa
   */
  async getBeneficiadoArequipa(filtros = {}) {
    try {
      const filters = { ...filtros, provincia: 'Arequipa' };
      if (filters.anio) filters.ano = filters.anio;
      
      const response = await RegistrosAPI.getAll('beneficiado', filters);
      
      if (response.success) {
        return response.data.map(registroFromMySQL);
      }
      throw new Error('Error al obtener registros beneficiado Arequipa');
    } catch (error) {
      console.error('Error en getBeneficiadoArequipa:', error);
      throw error;
    }
  },
  
  /**
   * BENEFICIADO - Obtener Provincia
   */
  async getBeneficiadoProvincia(filtros = {}) {
    try {
      const filters = { ...filtros };
      if (filters.anio) filters.ano = filters.anio;
      
      // Obtener todos y filtrar los que NO son Arequipa
      const response = await RegistrosAPI.getAll('beneficiado', filters);
      
      if (response.success) {
        const registros = response.data
          .filter(r => r.provincia && r.provincia !== 'Arequipa')
          .map(registroFromMySQL);
        return registros;
      }
      throw new Error('Error al obtener registros beneficiado Provincia');
    } catch (error) {
      console.error('Error en getBeneficiadoProvincia:', error);
      throw error;
    }
  },
  
  /**
   * BENEFICIADO - Crear
   */
  async crearBeneficiado(datos) {
    try {
      const mysql = registroToMySQL(datos);
      const response = await RegistrosAPI.crear('beneficiado', mysql);
      
      if (response.success) {
        return { success: true, id: response.id };
      }
      throw new Error(response.error || 'Error al crear registro');
    } catch (error) {
      console.error('Error en crearBeneficiado:', error);
      throw error;
    }
  },
  
  /**
   * BENEFICIADO - Actualizar
   */
  async actualizarBeneficiado(id, datos) {
    try {
      const mysql = registroToMySQL(datos);
      const response = await RegistrosAPI.actualizar('beneficiado', id, mysql);
      
      if (response.success) {
        return { success: true };
      }
      throw new Error(response.error || 'Error al actualizar registro');
    } catch (error) {
      console.error('Error en actualizarBeneficiado:', error);
      throw error;
    }
  },
  
  /**
   * BENEFICIADO - Borrar
   */
  async borrarBeneficiado(id) {
    try {
      const response = await RegistrosAPI.borrar('beneficiado', id);
      
      if (response.success) {
        return { success: true };
      }
      throw new Error(response.error || 'Error al eliminar registro');
    } catch (error) {
      console.error('Error en borrarBeneficiado:', error);
      throw error;
    }
  },
  
  /**
   * FILTROS - Obtener opciones
   */
  async getFiltros(tipo) {
    try {
      const response = await FiltrosAPI.getOpciones(tipo);
      
      if (response.success) {
        // Convertir meses de texto a números
        const data = response.data;
        if (data.meses) {
          data.meses = data.meses.map(m => MESES_MAP[m] || m);
        }
        // Renombrar 'anios' a 'años'
        if (data.anios) {
          data.años = data.anios;
        }
        return data;
      }
      throw new Error('Error al obtener filtros');
    } catch (error) {
      console.error('Error en getFiltros:', error);
      throw error;
    }
  },
  
  /**
   * ESTADÍSTICAS - Obtener
   */
  async getEstadisticas(tipo) {
    try {
      const response = await EstadisticasAPI.getEstadisticas(tipo);
      
      if (response.success) {
        return response.data;
      }
      throw new Error('Error al obtener estadísticas');
    } catch (error) {
      console.error('Error en getEstadisticas:', error);
      throw error;
    }
  },
  
  /**
   * IMPORTAR - Desde Excel
   */
  async importarExcel(tipo, registros) {
    try {
      // Convertir registros a formato MySQL
      const mysqlRegistros = registros.map(registroToMySQL);
      
      const response = await ImportarAPI.importar(tipo, mysqlRegistros);
      
      if (response.success) {
        return {
          success: true,
          insertados: response.insertados,
          total: response.total,
          errores: response.errores
        };
      }
      throw new Error('Error al importar registros');
    } catch (error) {
      console.error('Error en importarExcel:', error);
      throw error;
    }
  }
};

console.log('✅ API Adapter cargado');
