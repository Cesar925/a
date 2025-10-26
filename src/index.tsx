import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

type Bindings = {
  DB: D1Database;
}

const app = new Hono<{ Bindings: Bindings }>()

// Enable CORS
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './' }))

// ==================== API ROUTES ====================

// Obtener todos los procesos
app.get('/api/procesos', async (c) => {
  const { DB } = c.env
  const { results } = await DB.prepare('SELECT * FROM procesos ORDER BY nombre').all()
  return c.json(results)
})

// Obtener todas las provincias
app.get('/api/provincias', async (c) => {
  const { DB } = c.env
  const { results } = await DB.prepare('SELECT * FROM provincias ORDER BY nombre').all()
  return c.json(results)
})

// Obtener zonas por provincia
app.get('/api/zonas/:provincia_id', async (c) => {
  const { DB } = c.env
  const provincia_id = c.req.param('provincia_id')
  const { results } = await DB.prepare('SELECT * FROM zonas WHERE provincia_id = ? ORDER BY nombre')
    .bind(provincia_id)
    .all()
  return c.json(results)
})

// Obtener todas las zonas
app.get('/api/zonas', async (c) => {
  const { DB } = c.env
  const { results } = await DB.prepare('SELECT z.*, p.nombre as provincia_nombre FROM zonas z LEFT JOIN provincias p ON z.provincia_id = p.id ORDER BY z.nombre').all()
  return c.json(results)
})

// Obtener tipos de cliente
app.get('/api/tipos-cliente', async (c) => {
  const { DB } = c.env
  const { results } = await DB.prepare('SELECT * FROM tipos_cliente ORDER BY nombre').all()
  return c.json(results)
})

// Obtener compras GRS
app.get('/api/compras-grs', async (c) => {
  const { DB } = c.env
  const { results } = await DB.prepare('SELECT * FROM compras_grs ORDER BY nombre').all()
  return c.json(results)
})

// Obtener todos los clientes
app.get('/api/clientes', async (c) => {
  const { DB } = c.env
  const { results } = await DB.prepare(`
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
  return c.json(results)
})

// Crear cliente
app.post('/api/clientes', async (c) => {
  const { DB } = c.env
  const { nombre, tipo_cliente_id, provincia_id, zona_id, compra_grs_id } = await c.req.json()
  
  const result = await DB.prepare(`
    INSERT INTO clientes (nombre, tipo_cliente_id, provincia_id, zona_id, compra_grs_id)
    VALUES (?, ?, ?, ?, ?)
  `).bind(nombre, tipo_cliente_id, provincia_id, zona_id, compra_grs_id).run()
  
  return c.json({ id: result.meta.last_row_id, success: true })
})

// Obtener registros con filtros
app.get('/api/registros', async (c) => {
  const { DB } = c.env
  const proceso_id = c.req.query('proceso_id')
  const anio = c.req.query('anio')
  const mes = c.req.query('mes')
  
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
    WHERE 1=1
  `
  
  const bindings = []
  if (proceso_id) {
    query += ' AND r.proceso_id = ?'
    bindings.push(proceso_id)
  }
  if (anio) {
    query += ' AND r.anio = ?'
    bindings.push(anio)
  }
  if (mes) {
    query += ' AND r.mes = ?'
    bindings.push(mes)
  }
  
  query += ' ORDER BY r.created_at DESC LIMIT 100'
  
  const { results } = await DB.prepare(query).bind(...bindings).all()
  return c.json(results)
})

// Crear registro
app.post('/api/registros', async (c) => {
  const { DB } = c.env
  const { 
    proceso_id, cliente_id, anio, mes, provincia_id, zona_id, 
    compra_grs_id, cantidad_grs, cantidad_rp, potencial_minimo, 
    potencial_maximo, observaciones 
  } = await c.req.json()
  
  const result = await DB.prepare(`
    INSERT INTO registros (
      proceso_id, cliente_id, anio, mes, provincia_id, zona_id,
      compra_grs_id, cantidad_grs, cantidad_rp, potencial_minimo,
      potencial_maximo, observaciones
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    proceso_id, cliente_id, anio, mes, provincia_id, zona_id,
    compra_grs_id, cantidad_grs || 0, cantidad_rp || 0, 
    potencial_minimo || 0, potencial_maximo || 0, observaciones
  ).run()
  
  return c.json({ id: result.meta.last_row_id, success: true })
})

// Obtener resumen estadístico
app.get('/api/estadisticas', async (c) => {
  const { DB } = c.env
  const proceso_id = c.req.query('proceso_id')
  const anio = c.req.query('anio')
  
  let query = `
    SELECT 
      COUNT(*) as total_registros,
      SUM(cantidad_grs) as total_grs,
      SUM(cantidad_rp) as total_rp,
      AVG(cantidad_grs) as promedio_grs,
      AVG(cantidad_rp) as promedio_rp
    FROM registros
    WHERE 1=1
  `
  
  const bindings = []
  if (proceso_id) {
    query += ' AND proceso_id = ?'
    bindings.push(proceso_id)
  }
  if (anio) {
    query += ' AND anio = ?'
    bindings.push(anio)
  }
  
  const { results } = await DB.prepare(query).bind(...bindings).all()
  return c.json(results[0])
})

// Cargar datos desde CSV/Excel (simulación)
app.post('/api/upload', async (c) => {
  const { DB } = c.env
  const { data } = await c.req.json()
  
  let insertedCount = 0
  
  for (const row of data) {
    try {
      await DB.prepare(`
        INSERT INTO registros (
          proceso_id, cliente_id, anio, mes, provincia_id, zona_id,
          compra_grs_id, cantidad_grs, cantidad_rp, potencial_minimo,
          potencial_maximo, observaciones
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        row.proceso_id, row.cliente_id, row.anio, row.mes, 
        row.provincia_id, row.zona_id, row.compra_grs_id,
        row.cantidad_grs || 0, row.cantidad_rp || 0,
        row.potencial_minimo || 0, row.potencial_maximo || 0,
        row.observaciones || ''
      ).run()
      
      insertedCount++
    } catch (error) {
      console.error('Error inserting row:', error)
    }
  }
  
  return c.json({ success: true, insertedCount })
})

// ==================== FRONTEND ====================

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sistema de Gestión - Arequipa</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .card { @apply bg-white rounded-lg shadow-md p-6 mb-4; }
          .btn { @apply px-4 py-2 rounded-lg font-medium transition-all; }
          .btn-primary { @apply bg-blue-600 text-white hover:bg-blue-700; }
          .btn-success { @apply bg-green-600 text-white hover:bg-green-700; }
          .btn-secondary { @apply bg-gray-600 text-white hover:bg-gray-700; }
          .input { @apply w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent; }
          .select { @apply w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent; }
          .table { @apply min-w-full divide-y divide-gray-200; }
          .table th { @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50; }
          .table td { @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900; }
        </style>
    </head>
    <body class="bg-gray-50">
        <nav class="bg-blue-600 text-white shadow-lg">
            <div class="max-w-7xl mx-auto px-4 py-4">
                <div class="flex items-center justify-between">
                    <h1 class="text-2xl font-bold">
                        <i class="fas fa-database mr-2"></i>
                        Sistema de Gestión - Arequipa
                    </h1>
                    <div class="flex gap-4">
                        <button onclick="showSection('dashboard')" class="btn btn-secondary">
                            <i class="fas fa-chart-line mr-2"></i>Dashboard
                        </button>
                        <button onclick="showSection('data')" class="btn btn-secondary">
                            <i class="fas fa-table mr-2"></i>Datos
                        </button>
                        <button onclick="showSection('upload')" class="btn btn-secondary">
                            <i class="fas fa-upload mr-2"></i>Cargar
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        <div class="max-w-7xl mx-auto px-4 py-8">
            <!-- Dashboard Section -->
            <div id="dashboard-section" class="section">
                <div class="card">
                    <h2 class="text-2xl font-bold mb-4">
                        <i class="fas fa-chart-pie mr-2"></i>Resumen General
                    </h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div class="bg-blue-100 p-4 rounded-lg">
                            <div class="text-blue-600 text-sm font-medium">Total Registros</div>
                            <div class="text-3xl font-bold" id="stat-total">0</div>
                        </div>
                        <div class="bg-green-100 p-4 rounded-lg">
                            <div class="text-green-600 text-sm font-medium">Total GRS</div>
                            <div class="text-3xl font-bold" id="stat-grs">0</div>
                        </div>
                        <div class="bg-purple-100 p-4 rounded-lg">
                            <div class="text-purple-600 text-sm font-medium">Total RP</div>
                            <div class="text-3xl font-bold" id="stat-rp">0</div>
                        </div>
                        <div class="bg-orange-100 p-4 rounded-lg">
                            <div class="text-orange-600 text-sm font-medium">Promedio GRS</div>
                            <div class="text-3xl font-bold" id="stat-avg">0</div>
                        </div>
                    </div>

                    <div class="flex gap-4 mb-4">
                        <select id="filter-proceso" class="select" onchange="loadStats()">
                            <option value="">Todos los Procesos</option>
                        </select>
                        <select id="filter-anio" class="select" onchange="loadStats()">
                            <option value="">Todos los Años</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Data Section -->
            <div id="data-section" class="section hidden">
                <div class="card">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-2xl font-bold">
                            <i class="fas fa-table mr-2"></i>Registros
                        </h2>
                        <button onclick="showAddModal()" class="btn btn-primary">
                            <i class="fas fa-plus mr-2"></i>Nuevo Registro
                        </button>
                    </div>

                    <div class="flex gap-4 mb-4">
                        <select id="data-filter-proceso" class="select" onchange="loadRegistros()">
                            <option value="">Todos los Procesos</option>
                        </select>
                        <select id="data-filter-anio" class="select" onchange="loadRegistros()">
                            <option value="">Todos los Años</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                        <select id="data-filter-mes" class="select" onchange="loadRegistros()">
                            <option value="">Todos los Meses</option>
                            <option value="1">Enero</option>
                            <option value="2">Febrero</option>
                            <option value="3">Marzo</option>
                            <option value="4">Abril</option>
                            <option value="5">Mayo</option>
                            <option value="6">Junio</option>
                            <option value="7">Julio</option>
                            <option value="8">Agosto</option>
                            <option value="9">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Proceso</th>
                                    <th>Cliente</th>
                                    <th>Año/Mes</th>
                                    <th>Provincia</th>
                                    <th>Zona</th>
                                    <th>GRS</th>
                                    <th>RP</th>
                                    <th>Pot. Min</th>
                                    <th>Pot. Max</th>
                                </tr>
                            </thead>
                            <tbody id="registros-tbody">
                                <tr><td colspan="10" class="text-center py-8 text-gray-500">Cargando datos...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Upload Section -->
            <div id="upload-section" class="section hidden">
                <div class="card">
                    <h2 class="text-2xl font-bold mb-4">
                        <i class="fas fa-upload mr-2"></i>Cargar Datos
                    </h2>
                    
                    <div class="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                        <i class="fas fa-file-excel text-6xl text-gray-400 mb-4"></i>
                        <h3 class="text-xl font-semibold mb-2">Cargar archivo Excel o CSV</h3>
                        <p class="text-gray-600 mb-4">Arrastra tu archivo aquí o haz clic para seleccionar</p>
                        <input type="file" id="file-input" accept=".xlsx,.xls,.csv" class="hidden" onchange="handleFileUpload(event)">
                        <button onclick="document.getElementById('file-input').click()" class="btn btn-primary">
                            <i class="fas fa-folder-open mr-2"></i>Seleccionar Archivo
                        </button>
                    </div>

                    <div id="upload-result" class="mt-4 hidden">
                        <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            <i class="fas fa-check-circle mr-2"></i>
                            <span id="upload-message"></span>
                        </div>
                    </div>
                </div>

                <div class="card">
                    <h3 class="text-xl font-bold mb-4">Gestión de Catálogos</h3>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 class="font-semibold mb-2">Clientes</h4>
                            <button onclick="showClienteModal()" class="btn btn-success w-full">
                                <i class="fas fa-user-plus mr-2"></i>Agregar Cliente
                            </button>
                        </div>
                        <div>
                            <h4 class="font-semibold mb-2">Provincias</h4>
                            <select class="select" id="provincias-list">
                                <option value="">Seleccionar provincia...</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal para agregar registro -->
        <div id="add-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center">
            <div class="bg-white rounded-lg p-8 max-w-2xl w-full max-h-screen overflow-y-auto">
                <h3 class="text-2xl font-bold mb-4">Nuevo Registro</h3>
                
                <form id="add-form" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Proceso</label>
                            <select id="add-proceso" class="select" required>
                                <option value="">Seleccionar...</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Cliente</label>
                            <select id="add-cliente" class="select" required>
                                <option value="">Seleccionar...</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Año</label>
                            <input type="number" id="add-anio" class="input" value="2024" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Mes</label>
                            <select id="add-mes" class="select" required>
                                <option value="1">Enero</option>
                                <option value="2">Febrero</option>
                                <option value="3">Marzo</option>
                                <option value="4">Abril</option>
                                <option value="5">Mayo</option>
                                <option value="6">Junio</option>
                                <option value="7">Julio</option>
                                <option value="8">Agosto</option>
                                <option value="9">Septiembre</option>
                                <option value="10">Octubre</option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Provincia</label>
                            <select id="add-provincia" class="select">
                                <option value="">Seleccionar...</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Zona</label>
                            <select id="add-zona" class="select">
                                <option value="">Seleccionar...</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Cantidad GRS</label>
                            <input type="number" id="add-grs" class="input" step="0.01" value="0">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Cantidad RP</label>
                            <input type="number" id="add-rp" class="input" step="0.01" value="0">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Potencial Mínimo</label>
                            <input type="number" id="add-pot-min" class="input" step="0.01" value="0">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Potencial Máximo</label>
                            <input type="number" id="add-pot-max" class="input" step="0.01" value="0">
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Observaciones</label>
                        <textarea id="add-obs" class="input" rows="3"></textarea>
                    </div>
                    
                    <div class="flex gap-4 justify-end">
                        <button type="button" onclick="closeAddModal()" class="btn btn-secondary">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal para agregar cliente -->
        <div id="cliente-modal" class="fixed inset-0 bg-black bg-opacity-50 hidden flex items-center justify-center">
            <div class="bg-white rounded-lg p-8 max-w-md w-full">
                <h3 class="text-2xl font-bold mb-4">Nuevo Cliente</h3>
                
                <form id="cliente-form" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-1">Nombre</label>
                        <input type="text" id="cliente-nombre" class="input" required>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Tipo de Cliente</label>
                        <select id="cliente-tipo" class="select" required>
                            <option value="">Seleccionar...</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium mb-1">Provincia</label>
                        <select id="cliente-provincia" class="select">
                            <option value="">Seleccionar...</option>
                        </select>
                    </div>
                    
                    <div class="flex gap-4 justify-end">
                        <button type="button" onclick="closeClienteModal()" class="btn btn-secondary">Cancelar</button>
                        <button type="submit" class="btn btn-success">Guardar</button>
                    </div>
                </form>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
          // Estado global
          let procesos = [];
          let clientes = [];
          let provincias = [];
          let zonas = [];
          let tiposCliente = [];

          // Mostrar sección
          function showSection(section) {
            document.querySelectorAll('.section').forEach(el => el.classList.add('hidden'));
            document.getElementById(section + '-section').classList.remove('hidden');
            
            if (section === 'dashboard') loadStats();
            if (section === 'data') loadRegistros();
          }

          // Cargar datos iniciales
          async function loadInitialData() {
            try {
              const [procesosRes, clientesRes, provinciasRes, zonasRes, tiposRes] = await Promise.all([
                axios.get('/api/procesos'),
                axios.get('/api/clientes'),
                axios.get('/api/provincias'),
                axios.get('/api/zonas'),
                axios.get('/api/tipos-cliente')
              ]);

              procesos = procesosRes.data;
              clientes = clientesRes.data;
              provincias = provinciasRes.data;
              zonas = zonasRes.data;
              tiposCliente = tiposRes.data;

              // Llenar selects
              fillSelect('filter-proceso', procesos, 'id', 'nombre');
              fillSelect('data-filter-proceso', procesos, 'id', 'nombre');
              fillSelect('add-proceso', procesos, 'id', 'nombre');
              fillSelect('add-cliente', clientes, 'id', 'nombre');
              fillSelect('add-provincia', provincias, 'id', 'nombre');
              fillSelect('cliente-tipo', tiposCliente, 'id', 'nombre');
              fillSelect('cliente-provincia', provincias, 'id', 'nombre');
              fillSelect('provincias-list', provincias, 'id', 'nombre');

              loadStats();
            } catch (error) {
              console.error('Error loading initial data:', error);
            }
          }

          // Llenar select
          function fillSelect(id, data, valueKey, textKey) {
            const select = document.getElementById(id);
            const currentValue = select.value;
            const firstOption = select.querySelector('option').outerHTML;
            select.innerHTML = firstOption;
            
            data.forEach(item => {
              const option = document.createElement('option');
              option.value = item[valueKey];
              option.textContent = item[textKey];
              select.appendChild(option);
            });
            
            select.value = currentValue;
          }

          // Cargar estadísticas
          async function loadStats() {
            try {
              const procesoId = document.getElementById('filter-proceso').value;
              const anio = document.getElementById('filter-anio').value;
              
              let url = '/api/estadisticas?';
              if (procesoId) url += 'proceso_id=' + procesoId + '&';
              if (anio) url += 'anio=' + anio;
              
              const { data } = await axios.get(url);
              
              document.getElementById('stat-total').textContent = data.total_registros || 0;
              document.getElementById('stat-grs').textContent = Math.round(data.total_grs || 0);
              document.getElementById('stat-rp').textContent = Math.round(data.total_rp || 0);
              document.getElementById('stat-avg').textContent = Math.round(data.promedio_grs || 0);
            } catch (error) {
              console.error('Error loading stats:', error);
            }
          }

          // Cargar registros
          async function loadRegistros() {
            try {
              const procesoId = document.getElementById('data-filter-proceso').value;
              const anio = document.getElementById('data-filter-anio').value;
              const mes = document.getElementById('data-filter-mes').value;
              
              let url = '/api/registros?';
              if (procesoId) url += 'proceso_id=' + procesoId + '&';
              if (anio) url += 'anio=' + anio + '&';
              if (mes) url += 'mes=' + mes;
              
              const { data } = await axios.get(url);
              
              const tbody = document.getElementById('registros-tbody');
              if (data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="10" class="text-center py-8 text-gray-500">No hay registros</td></tr>';
                return;
              }
              
              tbody.innerHTML = data.map(r => \`
                <tr class="hover:bg-gray-50">
                  <td>\${r.id}</td>
                  <td>\${r.proceso_nombre || '-'}</td>
                  <td>\${r.cliente_nombre || '-'}</td>
                  <td>\${r.anio}/\${r.mes}</td>
                  <td>\${r.provincia_nombre || '-'}</td>
                  <td>\${r.zona_nombre || '-'}</td>
                  <td>\${r.cantidad_grs || 0}</td>
                  <td>\${r.cantidad_rp || 0}</td>
                  <td>\${r.potencial_minimo || 0}</td>
                  <td>\${r.potencial_maximo || 0}</td>
                </tr>
              \`).join('');
            } catch (error) {
              console.error('Error loading registros:', error);
            }
          }

          // Mostrar modal de agregar
          function showAddModal() {
            document.getElementById('add-modal').classList.remove('hidden');
          }

          function closeAddModal() {
            document.getElementById('add-modal').classList.add('hidden');
            document.getElementById('add-form').reset();
          }

          // Mostrar modal de cliente
          function showClienteModal() {
            document.getElementById('cliente-modal').classList.remove('hidden');
          }

          function closeClienteModal() {
            document.getElementById('cliente-modal').classList.add('hidden');
            document.getElementById('cliente-form').reset();
          }

          // Enviar formulario de registro
          document.getElementById('add-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
              proceso_id: document.getElementById('add-proceso').value,
              cliente_id: document.getElementById('add-cliente').value,
              anio: document.getElementById('add-anio').value,
              mes: document.getElementById('add-mes').value,
              provincia_id: document.getElementById('add-provincia').value || null,
              zona_id: document.getElementById('add-zona').value || null,
              cantidad_grs: parseFloat(document.getElementById('add-grs').value) || 0,
              cantidad_rp: parseFloat(document.getElementById('add-rp').value) || 0,
              potencial_minimo: parseFloat(document.getElementById('add-pot-min').value) || 0,
              potencial_maximo: parseFloat(document.getElementById('add-pot-max').value) || 0,
              observaciones: document.getElementById('add-obs').value
            };
            
            try {
              await axios.post('/api/registros', data);
              alert('Registro creado exitosamente');
              closeAddModal();
              loadRegistros();
              loadStats();
            } catch (error) {
              console.error('Error creating registro:', error);
              alert('Error al crear el registro');
            }
          });

          // Enviar formulario de cliente
          document.getElementById('cliente-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
              nombre: document.getElementById('cliente-nombre').value,
              tipo_cliente_id: document.getElementById('cliente-tipo').value,
              provincia_id: document.getElementById('cliente-provincia').value || null
            };
            
            try {
              await axios.post('/api/clientes', data);
              alert('Cliente creado exitosamente');
              closeClienteModal();
              loadInitialData();
            } catch (error) {
              console.error('Error creating cliente:', error);
              alert('Error al crear el cliente');
            }
          });

          // Manejar carga de archivo
          function handleFileUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
              // Aquí iría el parser de Excel/CSV
              alert('Funcionalidad de carga de archivos próximamente. Por ahora, usa el formulario manual.');
            };
            reader.readAsArrayBuffer(file);
          }

          // Inicializar
          loadInitialData();
        </script>
    </body>
    </html>
  `)
})

export default app
