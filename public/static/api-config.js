/**
 * Configuración de API
 * 
 * IMPORTANTE: Configura la URL de tu API PHP local aquí
 */

const API_CONFIG = {
  // URL base de tu API PHP local
  // Cambiar según tu configuración:
  // - XAMPP: http://localhost/api-php
  // - WAMP: http://localhost/api-php
  // - MAMP: http://localhost:8888/api-php
  // - Servidor personalizado: http://localhost:8080/api-php
  baseURL: 'http://localhost/api-php',
  
  // Modo de la aplicación
  // 'php-api': Usar API PHP con MySQL
  // 'cloudflare-d1': Usar Cloudflare D1 (modo anterior)
  mode: 'php-api',
  
  // Timeout para requests (milisegundos)
  timeout: 30000,
  
  // Headers personalizados
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

/**
 * Cliente API para conectarse con PHP Backend
 */
class APIClient {
  constructor(config) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout;
    this.headers = config.headers;
  }
  
  /**
   * Realizar request HTTP
   */
  async request(method, endpoint, data = null, params = null) {
    const url = new URL(endpoint, this.baseURL);
    
    // Agregar query parameters
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== null && value !== undefined) {
          if (typeof value === 'object') {
            url.searchParams.append(key, JSON.stringify(value));
          } else {
            url.searchParams.append(key, value);
          }
        }
      });
    }
    
    const options = {
      method: method,
      headers: { ...this.headers },
      mode: 'cors'
    };
    
    // Agregar body para POST/PUT
    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url.toString(), options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }
  
  // Métodos de conveniencia
  async get(endpoint, params = null) {
    return this.request('GET', endpoint, null, params);
  }
  
  async post(endpoint, data) {
    return this.request('POST', endpoint, data);
  }
  
  async put(endpoint, data) {
    return this.request('PUT', endpoint, data);
  }
  
  async delete(endpoint) {
    return this.request('DELETE', endpoint);
  }
}

// Crear instancia global del cliente API
const apiClient = new APIClient(API_CONFIG);

/**
 * Funciones de API para Registros
 */
const RegistrosAPI = {
  /**
   * Obtener todos los registros con filtros
   */
  async getAll(tipo, filters = {}) {
    return await apiClient.get(`/registros.php/${tipo}`, { filters });
  },
  
  /**
   * Obtener registros de Arequipa
   */
  async getArequipa(tipo, filters = {}) {
    const allFilters = { ...filters, provincia: 'Arequipa' };
    return await apiClient.get(`/registros.php/${tipo}`, { filters: allFilters });
  },
  
  /**
   * Obtener registros de Provincia (no Arequipa)
   */
  async getProvincia(tipo, filters = {}) {
    // Nota: Necesitarás modificar el backend PHP para excluir Arequipa
    return await apiClient.get(`/registros.php/${tipo}`, { filters });
  },
  
  /**
   * Crear nuevo registro
   */
  async crear(tipo, data) {
    return await apiClient.post(`/registros.php/${tipo}`, data);
  },
  
  /**
   * Actualizar registro
   */
  async actualizar(tipo, id, data) {
    return await apiClient.put(`/registros.php/${tipo}/${id}`, data);
  },
  
  /**
   * Eliminar registro
   */
  async borrar(tipo, id) {
    return await apiClient.delete(`/registros.php/${tipo}/${id}`);
  }
};

/**
 * Funciones de API para Filtros
 */
const FiltrosAPI = {
  /**
   * Obtener opciones de filtros
   */
  async getOpciones(tipo) {
    return await apiClient.get('/filtros.php', { tipo });
  }
};

/**
 * Funciones de API para Estadísticas
 */
const EstadisticasAPI = {
  /**
   * Obtener estadísticas
   */
  async getEstadisticas(tipo) {
    return await apiClient.get('/estadisticas.php', { tipo });
  }
};

/**
 * Funciones de API para Importación
 */
const ImportarAPI = {
  /**
   * Importar registros desde Excel
   */
  async importar(tipo, registros) {
    return await apiClient.post('/importar.php', { tipo, registros });
  }
};

/**
 * Función para probar conexión con API
 */
async function testAPIConnection() {
  try {
    console.log('🔄 Probando conexión con API PHP...');
    console.log('📡 URL Base:', API_CONFIG.baseURL);
    
    const response = await fetch(`${API_CONFIG.baseURL}/test.php`);
    
    if (response.ok) {
      console.log('✅ Conexión exitosa con API PHP');
      return true;
    } else {
      console.error('❌ Error al conectar con API PHP:', response.status);
      return false;
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    console.log('💡 Verifica que:');
    console.log('   1. XAMPP/WAMP esté corriendo');
    console.log('   2. La carpeta api-php esté en htdocs');
    console.log('   3. La URL en API_CONFIG.baseURL sea correcta');
    return false;
  }
}

// Exportar para uso global
window.API_CONFIG = API_CONFIG;
window.apiClient = apiClient;
window.RegistrosAPI = RegistrosAPI;
window.FiltrosAPI = FiltrosAPI;
window.EstadisticasAPI = EstadisticasAPI;
window.ImportarAPI = ImportarAPI;
window.testAPIConnection = testAPIConnection;

// Probar conexión al cargar
document.addEventListener('DOMContentLoaded', () => {
  if (API_CONFIG.mode === 'php-api') {
    testAPIConnection();
  }
});

console.log('✅ API Config cargado - Modo:', API_CONFIG.mode);
