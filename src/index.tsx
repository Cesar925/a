import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { VivoController } from './controllers/VivoController'
import { BeneficiadoController } from './controllers/BeneficiadoController'
import { CatalogoController } from './controllers/CatalogoController'
import { Bindings } from './types'

const app = new Hono<{ Bindings: Bindings }>()

// Middleware CORS
app.use('/api/*', cors())
app.use('/vivo/*', cors())
app.use('/beneficiado/*', cors())
app.use('/catalogos/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './' }))

// ==================== RUTAS VIVO ====================
app.get('/vivo/all', VivoController.getAll)
app.get('/vivo/arequipa', VivoController.getArequipa)
app.get('/vivo/provincia', VivoController.getProvincia)
app.post('/vivo/crear', VivoController.crear)
app.put('/vivo/actualizar', VivoController.actualizar)
app.delete('/vivo/borrar/:id', VivoController.borrar)
app.get('/vivo/estadisticas', VivoController.getEstadisticas)

// ==================== RUTAS BENEFICIADO ====================
app.get('/beneficiado/all', BeneficiadoController.getAll)
app.get('/beneficiado/arequipa', BeneficiadoController.getArequipa)
app.get('/beneficiado/provincia', BeneficiadoController.getProvincia)
app.post('/beneficiado/crear', BeneficiadoController.crear)
app.put('/beneficiado/actualizar', BeneficiadoController.actualizar)
app.delete('/beneficiado/borrar/:id', BeneficiadoController.borrar)
app.get('/beneficiado/estadisticas', BeneficiadoController.getEstadisticas)

// ==================== RUTAS CATÁLOGOS ====================
app.get('/catalogos/procesos', CatalogoController.getProcesos)
app.get('/catalogos/provincias', CatalogoController.getProvincias)
app.get('/catalogos/zonas', CatalogoController.getZonas)
app.get('/catalogos/tipos-cliente', CatalogoController.getTiposCliente)
app.get('/catalogos/compras-grs', CatalogoController.getComprasGRS)
app.get('/catalogos/clientes', CatalogoController.getClientes)
app.post('/catalogos/clientes', CatalogoController.createCliente)

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
          body { font-family: 'Inter', system-ui, sans-serif; }
          .menu-card {
            @apply bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-2xl p-8 text-white cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-3xl;
          }
          .menu-card:hover {
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          .section-hidden { display: none; }
          .btn { @apply px-4 py-2 rounded-lg font-medium transition-all; }
          .btn-primary { @apply bg-blue-600 text-white hover:bg-blue-700; }
          .btn-success { @apply bg-green-600 text-white hover:bg-green-700; }
          .btn-danger { @apply bg-red-600 text-white hover:bg-red-700; }
          .btn-secondary { @apply bg-gray-600 text-white hover:bg-gray-700; }
          .input { @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent; }
          .select { @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent; }
          .table { @apply min-w-full divide-y divide-gray-200; }
          .table th { @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50; }
          .table td { @apply px-6 py-4 text-sm text-gray-900; }
          .modal { @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50; }
          .modal-content { @apply bg-white rounded-xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto shadow-2xl; }
        </style>
    </head>
    <body class="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <!-- Header -->
        <header class="bg-white shadow-lg border-b border-gray-200">
            <div class="max-w-7xl mx-auto px-6 py-5">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <i class="fas fa-database text-blue-600 text-3xl"></i>
                        <div>
                            <h1 class="text-2xl font-bold text-gray-800">Sistema de Gestión</h1>
                            <p class="text-sm text-gray-600">Arequipa - Control de Procesos</p>
                        </div>
                    </div>
                    <!-- Botón volver removido - inicio directo en proceso -->
                </div>
            </div>
        </header>

        <div class="max-w-7xl mx-auto px-6 py-10">
            <!-- SECCIÓN DE PROCESO -->
            <div id="seccion-proceso">
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <!-- Header con selector de procesos y filtros -->
                    <div class="flex justify-between items-start mb-6">
                        <div class="flex-1">
                            <h2 id="titulo-proceso" class="text-2xl font-bold text-gray-800 mb-4">Sistema de Gestión</h2>
                            
                            <!-- Filtros -->
                            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label class="block text-xs font-medium mb-1 text-gray-600">Año</label>
                                    <select id="filtro-anio" class="select text-sm" onchange="cargarRegistros()">
                                        <option value="">Todos</option>
                                        <option value="2024" selected>2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium mb-1 text-gray-600">Mes</label>
                                    <select id="filtro-mes" class="select text-sm" onchange="cargarRegistros()">
                                        <option value="">Todos</option>
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
                                <div id="filtro-provincia-container" class="hidden">
                                    <label class="block text-xs font-medium mb-1 text-gray-600">Provincia</label>
                                    <select id="filtro-provincia" class="select text-sm" onchange="cargarRegistros()">
                                        <option value="">Todas</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-medium mb-1 text-gray-600">Cliente</label>
                                    <select id="filtro-cliente" class="select text-sm" onchange="cargarRegistros()">
                                        <option value="">Todos</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- Selector de procesos (esquina superior derecha) -->
                        <div class="ml-6">
                            <label class="block text-xs font-medium mb-2 text-gray-600">Proceso Actual</label>
                            <div class="space-y-2">
                                <button onclick="cambiarProceso('vivo-arequipa', 'Vivo Arequipa', 1)" 
                                        class="proceso-btn w-48 px-4 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-left font-medium transition">
                                    Vivo Arequipa
                                </button>
                                <button onclick="cambiarProceso('vivo-provincia', 'Vivo Provincias', 2)" 
                                        class="proceso-btn w-48 px-4 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-left font-medium transition">
                                    Vivo Provincias
                                </button>
                                <button onclick="cambiarProceso('beneficiado-arequipa', 'Beneficiado Arequipa', 3)" 
                                        class="proceso-btn w-48 px-4 py-2 text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-left font-medium transition">
                                    Beneficiado Arequipa
                                </button>
                                <button onclick="cambiarProceso('beneficiado-provincia', 'Beneficiado Provincia', 4)" 
                                        class="proceso-btn w-48 px-4 py-2 text-sm bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg text-left font-medium transition">
                                    Beneficiado Provincia
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Tabla de registros con diseño mejorado -->
                    <div class="overflow-x-auto border border-gray-300 rounded-lg">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="bg-gray-100 border-b-2 border-gray-300">
                                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">
                                        <input type="checkbox" id="select-all" onchange="toggleSelectAll()">
                                    </th>
                                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">ID</th>
                                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">Cliente</th>
                                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">Año</th>
                                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">Mes</th>
                                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">Provincia</th>
                                    <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">Zona</th>
                                    <th class="px-3 py-2 text-right text-xs font-semibold text-gray-700 border-r border-gray-300">GRS</th>
                                    <th class="px-3 py-2 text-right text-xs font-semibold text-gray-700 border-r border-gray-300">RP</th>
                                    <th class="px-3 py-2 text-right text-xs font-semibold text-gray-700 border-r border-gray-300">Renzo</th>
                                    <th class="px-3 py-2 text-right text-xs font-semibold text-gray-700 border-r border-gray-300">Fafio</th>
                                    <th class="px-3 py-2 text-right text-xs font-semibold text-gray-700 border-r border-gray-300">Santa Angela</th>
                                    <th class="px-3 py-2 text-right text-xs font-semibold text-gray-700 border-r border-gray-300">Jorge Pan</th>
                                    <th class="px-3 py-2 text-right text-xs font-semibold text-gray-700 border-r border-gray-300">Pot. Min</th>
                                    <th class="px-3 py-2 text-right text-xs font-semibold text-gray-700 border-r border-gray-300">Pot. Max</th>
                                    <th class="px-3 py-2 text-center text-xs font-semibold text-gray-700">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-registros" class="bg-white divide-y divide-gray-200">
                                <tr><td colspan="16" class="text-center py-8 text-gray-500">Cargando datos...</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Botones de acción (parte inferior) -->
                    <div class="flex justify-end gap-3 mt-6">
                        <button onclick="mostrarFormulario('nuevo')" class="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition text-sm">
                            <i class="fas fa-plus-circle mr-2"></i>NUEVO
                        </button>
                        <button onclick="mostrarFormulario('modifica')" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-sm">
                            <i class="fas fa-edit mr-2"></i>MODIFICA
                        </button>
                        <button onclick="confirmarEliminar()" class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition text-sm">
                            <i class="fas fa-trash-alt mr-2"></i>ELIMINA
                        </button>
                        <button onclick="generarReporte()" class="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition text-sm">
                            <i class="fas fa-file-export mr-2"></i>REPORTE
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Formulario -->
        <div id="modal-formulario" class="modal hidden">
            <div class="modal-content">
                <div class="flex justify-between items-center mb-6">
                    <h3 id="titulo-modal" class="text-2xl font-bold"></h3>
                    <button onclick="cerrarModal()" class="text-gray-400 hover:text-gray-600">
                        <i class="fas fa-times text-2xl"></i>
                    </button>
                </div>

                <form id="formulario-registro" class="space-y-4">
                    <input type="hidden" id="form-id">
                    
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Cliente *</label>
                            <select id="form-cliente" class="select" required>
                                <option value="">Seleccionar...</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Año *</label>
                            <input type="number" id="form-anio" class="input" value="2024" required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Mes *</label>
                            <select id="form-mes" class="select" required>
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
                            <select id="form-provincia" class="select">
                                <option value="">Seleccionar...</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Cantidad GRS</label>
                            <input type="number" id="form-grs" class="input" step="0.01" value="0">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Cantidad RP</label>
                            <input type="number" id="form-rp" class="input" step="0.01" value="0">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Potencial Mínimo</label>
                            <input type="number" id="form-pot-min" class="input" step="0.01" value="0">
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-1">Potencial Máximo</label>
                            <input type="number" id="form-pot-max" class="input" step="0.01" value="0">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-1">Observaciones</label>
                        <textarea id="form-obs" class="input" rows="3"></textarea>
                    </div>

                    <div class="flex gap-4 justify-end pt-4">
                        <button type="button" onclick="cerrarModal()" class="btn btn-secondary">Cancelar</button>
                        <button type="submit" class="btn btn-success">Guardar</button>
                    </div>
                </form>
            </div>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script>
          // Estado global
          let procesoActual = {
            tipo: '', // 'vivo-arequipa', 'vivo-provincia', 'beneficiado-arequipa', 'beneficiado-provincia'
            nombre: '',
            proceso_id: 0
          };
          let registrosActuales = [];
          let catalogos = {
            clientes: [],
            provincias: []
          };
          let accionFormulario = 'nuevo'; // 'nuevo' o 'modifica'
          

          
          // Cambiar proceso sin volver al menú
          function cambiarProceso(tipo, nombre, proceso_id) {
            procesoActual = { tipo, nombre, proceso_id };
            
            // Resaltar botón activo
            document.querySelectorAll('.proceso-btn').forEach(btn => {
              btn.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-500');
            });
            event.target.classList.add('ring-2', 'ring-offset-2', 'ring-blue-500');
            
            // Mostrar/ocultar filtro de provincia
            if (tipo.includes('provincia')) {
              document.getElementById('filtro-provincia-container').classList.remove('hidden');
            } else {
              document.getElementById('filtro-provincia-container').classList.add('hidden');
            }
            
            cargarRegistros();
          }
          
          // Cargar catálogos
          async function cargarCatalogos() {
            try {
              const [clientesRes, provinciasRes] = await Promise.all([
                axios.get('/catalogos/clientes'),
                axios.get('/catalogos/provincias')
              ]);
              
              catalogos.clientes = clientesRes.data;
              catalogos.provincias = provinciasRes.data;
              
              // Llenar selects
              llenarSelect('form-cliente', catalogos.clientes, 'id', 'nombre');
              llenarSelect('form-provincia', catalogos.provincias, 'id', 'nombre');
              llenarSelect('filtro-provincia', catalogos.provincias, 'id', 'nombre');
              llenarSelect('filtro-cliente', catalogos.clientes, 'id', 'nombre');
            } catch (error) {
              console.error('Error cargando catálogos:', error);
            }
          }
          
          // Llenar select
          function llenarSelect(id, data, valueKey, textKey) {
            const select = document.getElementById(id);
            const firstOption = select.querySelector('option').outerHTML;
            select.innerHTML = firstOption;
            
            data.forEach(item => {
              const option = document.createElement('option');
              option.value = item[valueKey];
              option.textContent = item[textKey];
              select.appendChild(option);
            });
          }
          
          // Cargar registros
          async function cargarRegistros() {
            const anio = document.getElementById('filtro-anio').value;
            const mes = document.getElementById('filtro-mes').value;
            const provincia_id = document.getElementById('filtro-provincia').value;
            const cliente_id = document.getElementById('filtro-cliente').value;
            
            let url = '';
            let params = new URLSearchParams();
            
            if (anio) params.append('anio', anio);
            if (mes) params.append('mes', mes);
            if (provincia_id) params.append('provincia_id', provincia_id);
            
            // Determinar endpoint según el proceso
            if (procesoActual.tipo === 'vivo-arequipa') {
              url = '/vivo/arequipa';
            } else if (procesoActual.tipo === 'vivo-provincia') {
              url = '/vivo/provincia';
            } else if (procesoActual.tipo === 'beneficiado-arequipa') {
              url = '/beneficiado/arequipa';
            } else if (procesoActual.tipo === 'beneficiado-provincia') {
              url = '/beneficiado/provincia';
            }
            
            url += '?' + params.toString();
            
            try {
              let { data } = await axios.get(url);
              
              // Filtrar por cliente si está seleccionado
              if (cliente_id) {
                data = data.filter(r => r.cliente_id == cliente_id);
              }
              
              registrosActuales = data;
              renderizarTabla(data);
            } catch (error) {
              console.error('Error cargando registros:', error);
              document.getElementById('tabla-registros').innerHTML = 
                '<tr><td colspan="16" class="text-center py-8 text-red-500">Error al cargar datos</td></tr>';
            }
          }
          
          // Renderizar tabla con diseño mejorado
          function renderizarTabla(registros) {
            const tbody = document.getElementById('tabla-registros');
            
            if (registros.length === 0) {
              tbody.innerHTML = '<tr><td colspan="16" class="text-center py-8 text-gray-500">No hay registros</td></tr>';
              return;
            }
            
            tbody.innerHTML = registros.map(r => {
              // Valores por cliente específico (simulado - en realidad deberías tener estos campos en tu BD)
              const renzo = r.compra_grs_nombre === 'Renzo' ? (r.cantidad_grs || 0) : 0;
              const fafio = r.compra_grs_nombre === 'Fafio' ? (r.cantidad_grs || 0) : 0;
              const santaAngela = r.compra_grs_nombre === 'Santa Angela' ? (r.cantidad_grs || 0) : 0;
              const jorgePan = r.compra_grs_nombre === 'Jorge Pan' ? (r.cantidad_grs || 0) : 0;
              
              return \`
                <tr class="hover:bg-blue-50 transition border-b border-gray-200">
                  <td class="px-3 py-2 border-r border-gray-200">
                    <input type="checkbox" class="registro-check" value="\${r.id}">
                  </td>
                  <td class="px-3 py-2 text-gray-800 border-r border-gray-200">\${r.id}</td>
                  <td class="px-3 py-2 text-gray-800 font-medium border-r border-gray-200">\${r.cliente_nombre || '-'}</td>
                  <td class="px-3 py-2 text-gray-800 border-r border-gray-200">\${r.anio}</td>
                  <td class="px-3 py-2 text-gray-800 border-r border-gray-200">\${getMesNombre(r.mes)}</td>
                  <td class="px-3 py-2 text-gray-800 border-r border-gray-200">\${r.provincia_nombre || '-'}</td>
                  <td class="px-3 py-2 text-gray-800 border-r border-gray-200">\${r.zona_nombre || '-'}</td>
                  <td class="px-3 py-2 text-right text-gray-800 font-semibold border-r border-gray-200">\${formatNumber(r.cantidad_grs)}</td>
                  <td class="px-3 py-2 text-right text-gray-800 font-semibold border-r border-gray-200">\${formatNumber(r.cantidad_rp)}</td>
                  <td class="px-3 py-2 text-right text-blue-700 border-r border-gray-200">\${formatNumber(renzo)}</td>
                  <td class="px-3 py-2 text-right text-green-700 border-r border-gray-200">\${formatNumber(fafio)}</td>
                  <td class="px-3 py-2 text-right text-purple-700 border-r border-gray-200">\${formatNumber(santaAngela)}</td>
                  <td class="px-3 py-2 text-right text-orange-700 border-r border-gray-200">\${formatNumber(jorgePan)}</td>
                  <td class="px-3 py-2 text-right text-gray-600 border-r border-gray-200">\${formatNumber(r.potencial_minimo)}</td>
                  <td class="px-3 py-2 text-right text-gray-600 border-r border-gray-200">\${formatNumber(r.potencial_maximo)}</td>
                  <td class="px-3 py-2 text-center">
                    <button onclick="editarRegistro(\${r.id})" class="text-blue-600 hover:text-blue-800 mr-2" title="Editar">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="eliminarRegistro(\${r.id})" class="text-red-600 hover:text-red-800" title="Eliminar">
                      <i class="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              \`;
            }).join('');
          }
          
          // Formatear números
          function formatNumber(value) {
            if (!value || value === 0) return '0';
            return parseFloat(value).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
          }
          
          // Obtener nombre del mes
          function getMesNombre(mes) {
            const meses = ['', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            return meses[parseInt(mes)] || mes;
          }
          
          // Toggle select all
          function toggleSelectAll() {
            const checks = document.querySelectorAll('.registro-check');
            const selectAll = document.getElementById('select-all').checked;
            checks.forEach(check => check.checked = selectAll);
          }
          
          // Mostrar formulario
          function mostrarFormulario(accion) {
            accionFormulario = accion;
            
            if (accion === 'nuevo') {
              document.getElementById('titulo-modal').textContent = 'Nuevo Registro';
              document.getElementById('formulario-registro').reset();
              document.getElementById('form-id').value = '';
              document.getElementById('modal-formulario').classList.remove('hidden');
            } else if (accion === 'modifica') {
              const checks = document.querySelectorAll('.registro-check:checked');
              if (checks.length === 0) {
                alert('Seleccione un registro para modificar');
                return;
              }
              if (checks.length > 1) {
                alert('Seleccione solo un registro para modificar');
                return;
              }
              editarRegistro(parseInt(checks[0].value));
            }
          }
          
          // Editar registro
          async function editarRegistro(id) {
            const registro = registrosActuales.find(r => r.id === id);
            if (!registro) return;
            
            document.getElementById('titulo-modal').textContent = 'Modificar Registro';
            document.getElementById('form-id').value = registro.id;
            document.getElementById('form-cliente').value = registro.cliente_id;
            document.getElementById('form-anio').value = registro.anio;
            document.getElementById('form-mes').value = registro.mes;
            document.getElementById('form-provincia').value = registro.provincia_id || '';
            document.getElementById('form-grs').value = registro.cantidad_grs || 0;
            document.getElementById('form-rp').value = registro.cantidad_rp || 0;
            document.getElementById('form-pot-min').value = registro.potencial_minimo || 0;
            document.getElementById('form-pot-max').value = registro.potencial_maximo || 0;
            document.getElementById('form-obs').value = registro.observaciones || '';
            
            accionFormulario = 'modifica';
            document.getElementById('modal-formulario').classList.remove('hidden');
          }
          
          // Cerrar modal
          function cerrarModal() {
            document.getElementById('modal-formulario').classList.add('hidden');
            document.getElementById('formulario-registro').reset();
          }
          
          // Enviar formulario
          document.getElementById('formulario-registro').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const data = {
              proceso_id: procesoActual.proceso_id,
              cliente_id: parseInt(document.getElementById('form-cliente').value),
              anio: parseInt(document.getElementById('form-anio').value),
              mes: parseInt(document.getElementById('form-mes').value),
              provincia_id: document.getElementById('form-provincia').value ? parseInt(document.getElementById('form-provincia').value) : null,
              cantidad_grs: parseFloat(document.getElementById('form-grs').value) || 0,
              cantidad_rp: parseFloat(document.getElementById('form-rp').value) || 0,
              potencial_minimo: parseFloat(document.getElementById('form-pot-min').value) || 0,
              potencial_maximo: parseFloat(document.getElementById('form-pot-max').value) || 0,
              observaciones: document.getElementById('form-obs').value
            };
            
            try {
              let url = '';
              let method = 'post';
              
              if (accionFormulario === 'modifica') {
                const id = document.getElementById('form-id').value;
                data.id = parseInt(id);
                method = 'put';
                
                if (procesoActual.tipo.includes('vivo')) {
                  url = '/vivo/actualizar';
                } else {
                  url = '/beneficiado/actualizar';
                }
              } else {
                if (procesoActual.tipo.includes('vivo')) {
                  url = '/vivo/crear';
                } else {
                  url = '/beneficiado/crear';
                }
              }
              
              await axios[method](url, data);
              alert(\`Registro \${accionFormulario === 'nuevo' ? 'creado' : 'actualizado'} exitosamente\`);
              cerrarModal();
              cargarRegistros();
            } catch (error) {
              console.error('Error:', error);
              alert('Error al guardar el registro');
            }
          });
          
          // Confirmar eliminación
          function confirmarEliminar() {
            const checks = document.querySelectorAll('.registro-check:checked');
            if (checks.length === 0) {
              alert('Seleccione al menos un registro para eliminar');
              return;
            }
            
            if (confirm(\`¿Está seguro de eliminar \${checks.length} registro(s)?\`)) {
              checks.forEach(async check => {
                await eliminarRegistro(parseInt(check.value));
              });
            }
          }
          
          // Eliminar registro
          async function eliminarRegistro(id) {
            try {
              let url = '';
              if (procesoActual.tipo.includes('vivo')) {
                url = \`/vivo/borrar/\${id}\`;
              } else {
                url = \`/beneficiado/borrar/\${id}\`;
              }
              
              await axios.delete(url);
              cargarRegistros();
            } catch (error) {
              console.error('Error eliminando registro:', error);
              alert('Error al eliminar el registro');
            }
          }
          
          // Generar reporte
          function generarReporte() {
            alert('Funcionalidad de reporte en desarrollo');
          }
          
          // Inicialización automática al cargar la página
          window.addEventListener('DOMContentLoaded', () => {
            // Iniciar directamente en Beneficiado Provincia (proceso 4)
            procesoActual = {
              tipo: 'beneficiado-provincia',
              nombre: 'Beneficiado Provincia',
              proceso_id: 4
            };
            
            // Mostrar filtro de provincia
            document.getElementById('filtro-provincia-container').classList.remove('hidden');
            
            // Resaltar botón de Beneficiado Provincia como activo
            const botones = document.querySelectorAll('.proceso-btn');
            if (botones[3]) { // Cuarto botón (índice 3)
              botones[3].classList.add('ring-2', 'ring-offset-2', 'ring-orange-500');
            }
            
            // Cargar datos iniciales
            cargarCatalogos();
            cargarRegistros();
          });
        </script>
    </body>
    </html>
  `)
})

export default app
