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
                    <button id="btn-volver" class="btn btn-secondary hidden" onclick="volverMenu()">
                        <i class="fas fa-arrow-left mr-2"></i>Volver al Menú
                    </button>
                </div>
            </div>
        </header>

        <div class="max-w-7xl mx-auto px-6 py-10">
            <!-- MENÚ PRINCIPAL -->
            <div id="menu-principal" class="space-y-8">
                <div class="text-center mb-12">
                    <h2 class="text-4xl font-bold text-gray-800 mb-4">Seleccione un Proceso</h2>
                    <p class="text-lg text-gray-600">Elija el tipo de proceso que desea gestionar</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Vivo Arequipa -->
                    <div class="menu-card bg-gradient-to-br from-blue-500 to-blue-700" onclick="mostrarProceso('vivo-arequipa', 'Vivo Arequipa', 1)">
                        <div class="flex items-center justify-between mb-6">
                            <i class="fas fa-city text-6xl opacity-80"></i>
                            <span class="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">Proceso 1</span>
                        </div>
                        <h3 class="text-3xl font-bold mb-3">Vivo Arequipa</h3>
                        <p class="text-blue-100 text-lg">Gestión de registros de proceso Vivo para la ciudad de Arequipa</p>
                    </div>

                    <!-- Vivo Provincias -->
                    <div class="menu-card bg-gradient-to-br from-green-500 to-green-700" onclick="mostrarProceso('vivo-provincia', 'Vivo Provincias', 2)">
                        <div class="flex items-center justify-between mb-6">
                            <i class="fas fa-map-marked-alt text-6xl opacity-80"></i>
                            <span class="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">Proceso 2</span>
                        </div>
                        <h3 class="text-3xl font-bold mb-3">Vivo Provincias</h3>
                        <p class="text-green-100 text-lg">Gestión de registros de proceso Vivo para provincias</p>
                    </div>

                    <!-- Beneficiado Arequipa -->
                    <div class="menu-card bg-gradient-to-br from-purple-500 to-purple-700" onclick="mostrarProceso('beneficiado-arequipa', 'Beneficiado Arequipa', 3)">
                        <div class="flex items-center justify-between mb-6">
                            <i class="fas fa-building text-6xl opacity-80"></i>
                            <span class="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">Proceso 3</span>
                        </div>
                        <h3 class="text-3xl font-bold mb-3">Beneficiado Arequipa</h3>
                        <p class="text-purple-100 text-lg">Gestión de registros de proceso Beneficiado para Arequipa</p>
                    </div>

                    <!-- Beneficiado Provincia -->
                    <div class="menu-card bg-gradient-to-br from-orange-500 to-orange-700" onclick="mostrarProceso('beneficiado-provincia', 'Beneficiado Provincia', 4)">
                        <div class="flex items-center justify-between mb-6">
                            <i class="fas fa-globe text-6xl opacity-80"></i>
                            <span class="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold">Proceso 4</span>
                        </div>
                        <h3 class="text-3xl font-bold mb-3">Beneficiado Provincia</h3>
                        <p class="text-orange-100 text-lg">Gestión de registros de proceso Beneficiado para provincias</p>
                    </div>
                </div>
            </div>

            <!-- SECCIÓN DE PROCESO -->
            <div id="seccion-proceso" class="section-hidden">
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <div class="mb-8">
                        <h2 id="titulo-proceso" class="text-3xl font-bold text-gray-800 mb-2"></h2>
                        <p class="text-gray-600">Gestione los registros de este proceso</p>
                    </div>

                    <!-- Botones de acción -->
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <button onclick="mostrarFormulario('nuevo')" class="btn btn-success py-4 text-lg">
                            <i class="fas fa-plus-circle mr-2"></i>NUEVO
                        </button>
                        <button onclick="mostrarFormulario('modifica')" class="btn btn-primary py-4 text-lg">
                            <i class="fas fa-edit mr-2"></i>MODIFICA
                        </button>
                        <button onclick="confirmarEliminar()" class="btn btn-danger py-4 text-lg">
                            <i class="fas fa-trash-alt mr-2"></i>ELIMINA
                        </button>
                        <button onclick="generarReporte()" class="btn btn-secondary py-4 text-lg">
                            <i class="fas fa-file-export mr-2"></i>REPORTE
                        </button>
                    </div>

                    <!-- Filtros -->
                    <div class="bg-gray-50 rounded-lg p-6 mb-6">
                        <h3 class="text-lg font-semibold mb-4">Filtros de búsqueda</h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-2">Año</label>
                                <select id="filtro-anio" class="select" onchange="cargarRegistros()">
                                    <option value="">Todos</option>
                                    <option value="2024" selected>2024</option>
                                    <option value="2025">2025</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-2">Mes</label>
                                <select id="filtro-mes" class="select" onchange="cargarRegistros()">
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
                                <label class="block text-sm font-medium mb-2">Provincia</label>
                                <select id="filtro-provincia" class="select" onchange="cargarRegistros()">
                                    <option value="">Todas</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Tabla de registros -->
                    <div class="overflow-x-auto">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" id="select-all" onchange="toggleSelectAll()"></th>
                                    <th>ID</th>
                                    <th>Cliente</th>
                                    <th>Año/Mes</th>
                                    <th>Provincia</th>
                                    <th>GRS</th>
                                    <th>RP</th>
                                    <th>Pot. Min</th>
                                    <th>Pot. Max</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-registros">
                                <tr><td colspan="10" class="text-center py-8 text-gray-500">Cargando datos...</td></tr>
                            </tbody>
                        </table>
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
          
          // Mostrar proceso específico
          function mostrarProceso(tipo, nombre, proceso_id) {
            procesoActual = { tipo, nombre, proceso_id };
            document.getElementById('menu-principal').classList.add('section-hidden');
            document.getElementById('seccion-proceso').classList.remove('section-hidden');
            document.getElementById('btn-volver').classList.remove('hidden');
            document.getElementById('titulo-proceso').textContent = nombre;
            
            // Mostrar filtro de provincia solo para procesos de provincia
            if (tipo.includes('provincia')) {
              document.getElementById('filtro-provincia-container').classList.remove('hidden');
            } else {
              document.getElementById('filtro-provincia-container').classList.add('hidden');
            }
            
            cargarCatalogos();
            cargarRegistros();
          }
          
          // Volver al menú principal
          function volverMenu() {
            document.getElementById('seccion-proceso').classList.add('section-hidden');
            document.getElementById('menu-principal').classList.remove('section-hidden');
            document.getElementById('btn-volver').classList.add('hidden');
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
              const { data } = await axios.get(url);
              registrosActuales = data;
              renderizarTabla(data);
            } catch (error) {
              console.error('Error cargando registros:', error);
              document.getElementById('tabla-registros').innerHTML = 
                '<tr><td colspan="10" class="text-center py-8 text-red-500">Error al cargar datos</td></tr>';
            }
          }
          
          // Renderizar tabla
          function renderizarTabla(registros) {
            const tbody = document.getElementById('tabla-registros');
            
            if (registros.length === 0) {
              tbody.innerHTML = '<tr><td colspan="10" class="text-center py-8 text-gray-500">No hay registros</td></tr>';
              return;
            }
            
            tbody.innerHTML = registros.map(r => \`
              <tr class="hover:bg-gray-50">
                <td><input type="checkbox" class="registro-check" value="\${r.id}"></td>
                <td>\${r.id}</td>
                <td>\${r.cliente_nombre || '-'}</td>
                <td>\${r.anio}/\${r.mes}</td>
                <td>\${r.provincia_nombre || '-'}</td>
                <td>\${r.cantidad_grs || 0}</td>
                <td>\${r.cantidad_rp || 0}</td>
                <td>\${r.potencial_minimo || 0}</td>
                <td>\${r.potencial_maximo || 0}</td>
                <td>
                  <button onclick="editarRegistro(\${r.id})" class="text-blue-600 hover:text-blue-800 mr-2">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button onclick="eliminarRegistro(\${r.id})" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            \`).join('');
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
        </script>
    </body>
    </html>
  `)
})

export default app
