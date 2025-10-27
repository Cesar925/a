import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { VivoController } from './controllers/VivoController'
import { BeneficiadoController } from './controllers/BeneficiadoController'
import { CatalogoController } from './controllers/CatalogoController'
import { ExportController } from './controllers/ExportController'
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

// Exportar Excel Vivo
app.get('/vivo/arequipa/excel', ExportController.exportarArequipaVivoExcel)
app.get('/vivo/provincia/excel', ExportController.exportarProvinciaVivoExcel)

// ==================== RUTAS BENEFICIADO ====================
app.get('/beneficiado/all', BeneficiadoController.getAll)
app.get('/beneficiado/arequipa', BeneficiadoController.getArequipa)
app.get('/beneficiado/provincia', BeneficiadoController.getProvincia)
app.post('/beneficiado/crear', BeneficiadoController.crear)
app.put('/beneficiado/actualizar', BeneficiadoController.actualizar)
app.delete('/beneficiado/borrar/:id', BeneficiadoController.borrar)
app.get('/beneficiado/estadisticas', BeneficiadoController.getEstadisticas)

// Exportar Excel Beneficiado
app.get('/beneficiado/arequipa/excel', ExportController.exportarArequipaExcel)
app.get('/beneficiado/provincia/excel', ExportController.exportarProvinciaExcel)

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
        <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
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
          .modal { 
            @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4;
            backdrop-filter: blur(4px);
          }
          .modal-content { 
            @apply bg-white rounded-2xl p-4 md:p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl;
            animation: modalSlideIn 0.3s ease-out;
          }
          @keyframes modalSlideIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          @media (max-width: 768px) {
            .modal-content { @apply p-4 max-w-full; }
          }
          
          /* Estilos para filas seleccionables */
          .tabla-fila-seleccionable {
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .tabla-fila-seleccionable:hover {
            background-color: #EBF5FF !important;
          }
          .tabla-fila-seleccionada {
            background-color: #DBEAFE !important;
            border-left: 3px solid #3B82F6;
          }
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
                <div class="bg-white rounded-xl shadow-lg p-4 md:p-8">
                    <!-- Header responsive -->
                    <div class="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-6">
                        <!-- Sección izquierda: Título y Filtros -->
                        <div class="flex-1">
                            <h2 id="titulo-proceso" class="text-xl md:text-2xl font-bold text-gray-800 mb-4">Sistema de Gestión</h2>
                            
                            <!-- Filtros (ocultos cuando se visualiza Excel) -->
                            <div id="filtros-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
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
                            
                            <!-- Selector de Procesos (movido debajo de filtros) -->
                            <div id="selector-procesos-container" class="mt-4">
                                <label class="block text-xs font-medium mb-2 text-gray-600">Proceso Actual</label>
                                <div id="selector-procesos" class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    <button onclick="cambiarProceso('vivo-arequipa', 'Vivo Arequipa', 1)" 
                                            class="proceso-btn w-full px-3 py-2 text-xs md:text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg text-left font-medium transition">
                                        Vivo Arequipa
                                    </button>
                                    <button onclick="cambiarProceso('vivo-provincia', 'Vivo Provincias', 2)" 
                                            class="proceso-btn w-full px-3 py-2 text-xs md:text-sm bg-green-100 hover:bg-green-200 text-green-800 rounded-lg text-left font-medium transition">
                                        Vivo Provincias
                                    </button>
                                    <button onclick="cambiarProceso('beneficiado-arequipa', 'Beneficiado Arequipa', 3)" 
                                            class="proceso-btn w-full px-3 py-2 text-xs md:text-sm bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-left font-medium transition">
                                        Beneficiado Arequipa
                                    </button>
                                    <button onclick="cambiarProceso('beneficiado-provincia', 'Beneficiado Provincia', 4)" 
                                            class="proceso-btn w-full px-3 py-2 text-xs md:text-sm bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg text-left font-medium transition">
                                        Beneficiado Provincia
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Sección derecha: Selector Excel (cuando hay Excel cargado) -->
                        <div class="lg:ml-6 w-full lg:w-auto mt-4 lg:mt-0">
                            <!-- Selector de Hojas Excel (cuando hay Excel cargado) -->
                            <div id="selector-hoja-container" class="hidden">
                                <div class="bg-gradient-to-r from-purple-50 to-purple-100 border-2 border-purple-300 p-3 md:p-4 rounded-lg w-full">
                                    <div class="flex items-center gap-2 mb-2">
                                        <i class="fas fa-file-excel text-purple-600 text-lg md:text-xl"></i>
                                        <p class="font-semibold text-gray-800 text-xs md:text-sm">Excel Cargado</p>
                                    </div>
                                    <p id="info-archivo-tabla" class="text-xs text-gray-600 mb-3 break-words line-clamp-2">Sin archivo</p>
                                    
                                    <label class="block text-xs font-medium mb-1 text-gray-700">Seleccionar Hoja:</label>
                                    <select id="selector-hoja-excel" class="w-full px-3 py-2 text-xs md:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white mb-2" onchange="cambiarHojaExcel()">
                                        <option value="">Seleccionar hoja...</option>
                                    </select>
                                    
                                    <button onclick="cerrarVistaExcel()" class="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-xs md:text-sm font-medium transition">
                                        <i class="fas fa-times mr-1"></i>Cerrar Vista Excel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tabla de registros con diseño mejorado -->
                    <div class="overflow-x-auto border border-gray-300 rounded-lg" style="max-height: 500px; overflow-y: auto;">
                        <table class="min-w-full text-sm" style="table-layout: fixed; width: 1600px;">
                            <thead>
                                <tr class="bg-gray-100 border-b-2 border-gray-300">
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
                                    <th class="px-3 py-2 text-right text-xs font-semibold text-gray-700">Pot. Max</th>
                                </tr>
                            </thead>
                            <tbody id="tabla-registros" class="bg-white divide-y divide-gray-200">
                                <tr><td colspan="14" class="text-center py-8 text-gray-500">Cargando datos...</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Botones de acción (parte inferior) - Responsive -->
                    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-6">
                        <!-- Botón Cargar Excel (izquierda) -->
                        <div class="w-full sm:w-auto">
                            <input type="file" id="input-excel" accept=".xlsx,.xls" class="hidden" onchange="cargarExcel(event)">
                            <button onclick="document.getElementById('input-excel').click()" class="w-full sm:w-auto px-4 md:px-6 py-2 md:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition text-xs md:text-sm">
                                <i class="fas fa-file-excel mr-2"></i>CARGAR EXCEL
                            </button>
                        </div>
                        
                        <!-- Botones de acción (derecha) -->
                        <div class="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
                            <button onclick="mostrarFormulario('nuevo')" class="px-3 md:px-6 py-2 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition text-xs md:text-sm">
                                <i class="fas fa-plus-circle mr-1 md:mr-2"></i>NUEVO
                            </button>
                            <button onclick="mostrarFormulario('modifica')" class="px-3 md:px-6 py-2 md:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition text-xs md:text-sm">
                                <i class="fas fa-edit mr-1 md:mr-2"></i>MODIFICA
                            </button>
                            <button onclick="confirmarEliminar()" class="px-3 md:px-6 py-2 md:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition text-xs md:text-sm">
                                <i class="fas fa-trash-alt mr-1 md:mr-2"></i>ELIMINA
                            </button>
                            <button onclick="generarReporte()" class="px-3 md:px-6 py-2 md:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition text-xs md:text-sm">
                                <i class="fas fa-file-export mr-1 md:mr-2"></i>REPORTE
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- SECCIÓN DASHBOARD GRÁFICO - Responsive -->
            <div id="seccion-dashboard" class="mt-8 hidden">
                <div class="bg-white rounded-xl shadow-lg p-4 md:p-8">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h2 class="text-lg md:text-2xl font-bold text-gray-800">
                            <i class="fas fa-chart-pie mr-2 text-purple-600"></i>
                            Dashboard - Análisis del Excel
                        </h2>
                        <button onclick="cerrarDashboard()" class="text-gray-400 hover:text-gray-600">
                            <i class="fas fa-times text-xl md:text-2xl"></i>
                        </button>
                    </div>

                    <!-- Información del archivo -->
                    <div class="bg-purple-50 border-l-4 border-purple-600 p-3 md:p-4 mb-6">
                        <div class="flex items-center">
                            <i class="fas fa-info-circle text-purple-600 mr-2 md:mr-3 text-lg md:text-xl"></i>
                            <div>
                                <p class="font-semibold text-gray-800 text-sm md:text-base">Archivo cargado:</p>
                                <p id="info-archivo" class="text-xs md:text-sm text-gray-600">Ninguno</p>
                            </div>
                        </div>
                    </div>

                    <!-- Resumen General - Responsive Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                        <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm opacity-90 mb-1">Tamaño de Mercado</p>
                                    <p id="stat-mercado" class="text-3xl font-bold">0</p>
                                </div>
                                <i class="fas fa-globe text-4xl opacity-30"></i>
                            </div>
                        </div>
                        <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm opacity-90 mb-1">Potencial Ventas Max</p>
                                    <p id="stat-ventas-max" class="text-3xl font-bold">0</p>
                                </div>
                                <i class="fas fa-chart-line text-4xl opacity-30"></i>
                            </div>
                        </div>
                        <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm opacity-90 mb-1">Total Clientes</p>
                                    <p id="stat-clientes" class="text-3xl font-bold">0</p>
                                </div>
                                <i class="fas fa-users text-4xl opacity-30"></i>
                            </div>
                        </div>
                        <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm opacity-90 mb-1">Participación Max</p>
                                    <p id="stat-participacion" class="text-3xl font-bold">0%</p>
                                </div>
                                <i class="fas fa-percentage text-4xl opacity-30"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Gráficos -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <!-- Gráfico de Potencial de Ventas -->
                        <div class="bg-gray-50 rounded-lg p-6">
                            <h3 class="text-lg font-bold text-gray-800 mb-4">Potencial de Ventas por Región</h3>
                            <canvas id="chart-ventas"></canvas>
                        </div>

                        <!-- Gráfico de Número de Clientes -->
                        <div class="bg-gray-50 rounded-lg p-6">
                            <h3 class="text-lg font-bold text-gray-800 mb-4">Número de Clientes por Región</h3>
                            <canvas id="chart-clientes"></canvas>
                        </div>

                        <!-- Tabla Resumen por Provincia -->
                        <div class="bg-gray-50 rounded-lg p-6 md:col-span-2">
                            <h3 class="text-lg font-bold text-gray-800 mb-4">Resumen por Provincia</h3>
                            <div class="overflow-x-auto">
                                <table class="min-w-full">
                                    <thead>
                                        <tr class="bg-gray-200">
                                            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Provincia</th>
                                            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Potencial Máximo</th>
                                            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Potencial Mínimo</th>
                                            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Nro. Clientes Max</th>
                                            <th class="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Nro. Clientes Min</th>
                                        </tr>
                                    </thead>
                                    <tbody id="tabla-dashboard-resumen" class="bg-white divide-y divide-gray-200">
                                        <tr><td colspan="5" class="text-center py-4 text-gray-500">Sin datos</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Formulario -->
        <div id="modal-formulario" class="modal hidden">
            <div class="modal-content mx-auto">
                <!-- Header del modal -->
                <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                    <div class="flex items-center gap-2">
                        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <i class="fas fa-edit text-white text-sm"></i>
                        </div>
                        <h3 id="titulo-modal" class="text-lg md:text-xl font-bold text-gray-800"></h3>
                    </div>
                    <button onclick="cerrarModal()" class="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-100 rounded-lg">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <form id="formulario-registro" class="space-y-4">
                    <input type="hidden" id="form-id">
                    
                    <!-- Sección: Información Básica -->
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <i class="fas fa-info-circle mr-2 text-blue-600"></i>
                            Información Básica
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <div id="form-provincia-container">
                            <label class="block text-sm font-medium mb-1">Provincia</label>
                            <select id="form-provincia" class="select">
                                <option value="">Seleccionar...</option>
                            </select>
                        </div>
                        </div>
                    </div>
                    
                    <!-- Sección: Cantidades -->
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <i class="fas fa-calculator mr-2 text-green-600"></i>
                            Cantidades
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-1 text-gray-700">Cantidad GRS</label>
                                <input type="number" id="form-grs" class="input" step="0.01" value="0" placeholder="0.00">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1 text-gray-700">Cantidad RP</label>
                                <input type="number" id="form-rp" class="input" step="0.01" value="0" placeholder="0.00">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sección: Potenciales -->
                    <div class="bg-green-50 p-4 rounded-lg">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <i class="fas fa-chart-line mr-2 text-purple-600"></i>
                            Potenciales
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium mb-1 text-gray-700">Potencial Mínimo</label>
                                <input type="number" id="form-pot-min" class="input" step="0.01" value="0" placeholder="0.00">
                            </div>
                            <div>
                                <label class="block text-sm font-medium mb-1 text-gray-700">Potencial Máximo</label>
                                <input type="number" id="form-pot-max" class="input" step="0.01" value="0" placeholder="0.00">
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sección: Observaciones -->
                    <div class="bg-yellow-50 p-4 rounded-lg">
                        <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                            <i class="fas fa-sticky-note mr-2 text-yellow-600"></i>
                            Observaciones
                        </h4>
                        <textarea id="form-obs" class="input" rows="3" placeholder="Ingrese observaciones adicionales..."></textarea>
                    </div>

                    <!-- Botones de acción -->
                    <div class="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
                        <button type="button" onclick="cerrarModal()" class="btn btn-secondary order-2 sm:order-1">
                            <i class="fas fa-times mr-2"></i>Cancelar
                        </button>
                        <button type="submit" class="btn btn-success order-1 sm:order-2">
                            <i class="fas fa-save mr-2"></i>Guardar
                        </button>
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
            
            console.log('Cargando registros desde:', url, 'proceso:', procesoActual);
            
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
                '<tr><td colspan="14" class="text-center py-8 text-red-500">Error al cargar datos</td></tr>';
            }
          }
          
          // Renderizar tabla con diseño mejorado
          function renderizarTabla(registros) {
            const tbody = document.getElementById('tabla-registros');
            
            if (registros.length === 0) {
              tbody.innerHTML = '<tr><td colspan="14" class="text-center py-8 text-gray-500">No hay registros</td></tr>';
              return;
            }
            
            tbody.innerHTML = registros.map(r => {
              // Valores por cliente específico (simulado - en realidad deberías tener estos campos en tu BD)
              const renzo = r.compra_grs_nombre === 'Renzo' ? (r.cantidad_grs || 0) : 0;
              const fafio = r.compra_grs_nombre === 'Fafio' ? (r.cantidad_grs || 0) : 0;
              const santaAngela = r.compra_grs_nombre === 'Santa Angela' ? (r.cantidad_grs || 0) : 0;
              const jorgePan = r.compra_grs_nombre === 'Jorge Pan' ? (r.cantidad_grs || 0) : 0;
              
              return \`
                <tr class="tabla-fila-seleccionable border-b border-gray-200" data-id="\${r.id}" onclick="toggleFilaSeleccion(this, \${r.id})">
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
                  <td class="px-3 py-2 text-right text-gray-600">\${formatNumber(r.potencial_maximo)}</td>
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
          
          // Variable global para almacenar IDs de filas seleccionadas
          let filasSeleccionadas = [];
          
          // Seleccionar/deseleccionar fila haciendo clic
          function toggleFilaSeleccion(fila, id) {
            const index = filasSeleccionadas.indexOf(id);
            
            if (index > -1) {
              // Deseleccionar
              filasSeleccionadas.splice(index, 1);
              fila.classList.remove('tabla-fila-seleccionada');
            } else {
              // Seleccionar
              filasSeleccionadas.push(id);
              fila.classList.add('tabla-fila-seleccionada');
            }
          }
          
          // Limpiar selección de todas las filas
          function limpiarSeleccion() {
            document.querySelectorAll('.tabla-fila-seleccionada').forEach(fila => {
              fila.classList.remove('tabla-fila-seleccionada');
            });
            filasSeleccionadas = [];
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
              if (filasSeleccionadas.length === 0) {
                alert('Seleccione un registro para modificar haciendo clic sobre una fila');
                return;
              }
              if (filasSeleccionadas.length > 1) {
                alert('Seleccione solo un registro para modificar');
                return;
              }
              editarRegistro(filasSeleccionadas[0]);
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
            if (filasSeleccionadas.length === 0) {
              alert('Seleccione al menos un registro para eliminar haciendo clic sobre una fila');
              return;
            }
            
            if (confirm(\`¿Está seguro de eliminar \${filasSeleccionadas.length} registro(s)?\`)) {
              filasSeleccionadas.forEach(async id => {
                await eliminarRegistro(id);
              });
              limpiarSeleccion();
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
          
          // Generar reporte Excel (usa endpoint de exportación)
          async function generarReporte() {
            try {
              if (registrosActuales.length === 0) {
                alert('No hay datos para exportar');
                return;
              }
              
              // Determinar endpoint según proceso actual
              let urlExport = '';
              if (procesoActual.tipo === 'vivo-arequipa') {
                urlExport = '/vivo/arequipa/excel';
              } else if (procesoActual.tipo === 'vivo-provincia') {
                urlExport = '/vivo/provincia/excel';
              } else if (procesoActual.tipo === 'beneficiado-arequipa') {
                urlExport = '/beneficiado/arequipa/excel';
              } else if (procesoActual.tipo === 'beneficiado-provincia') {
                urlExport = '/beneficiado/provincia/excel';
              }
              
              // Obtener datos desde el backend
              let datosParaExcel = registrosActuales;
              if (urlExport) {
                try {
                  const response = await axios.get(urlExport);
                  if (response.data && response.data.length > 0) {
                    datosParaExcel = response.data;
                  }
                } catch (error) {
                  console.warn('No se pudo obtener datos del endpoint, usando datos locales:', error);
                }
              }
              
              // Crear libro de trabajo
              const wb = XLSX.utils.book_new();
              
              // Preparar datos para exportar
              const datosExportar = datosParaExcel.map(r => ({
                'ID': r.id,
                'Cliente': r.cliente_nombre || '-',
                'Año': r.anio,
                'Mes': getMesNombre(r.mes),
                'Provincia': r.provincia_nombre || '-',
                'Zona': r.zona_nombre || '-',
                'Cantidad GRS': r.cantidad_grs || 0,
                'Cantidad RP': r.cantidad_rp || 0,
                'Potencial Mínimo': r.potencial_minimo || 0,
                'Potencial Máximo': r.potencial_maximo || 0,
                'Observaciones': r.observaciones || ''
              }));
              
              // Crear hoja de cálculo
              const ws = XLSX.utils.json_to_sheet(datosExportar);
              
              // Ajustar ancho de columnas
              const colWidths = [
                { wch: 8 },  // ID
                { wch: 30 }, // Cliente
                { wch: 8 },  // Año
                { wch: 12 }, // Mes
                { wch: 20 }, // Provincia
                { wch: 20 }, // Zona
                { wch: 12 }, // GRS
                { wch: 12 }, // RP
                { wch: 15 }, // Pot Min
                { wch: 15 }, // Pot Max
                { wch: 40 }  // Observaciones
              ];
              ws['!cols'] = colWidths;
              
              // Agregar hoja al libro
              XLSX.utils.book_append_sheet(wb, ws, procesoActual.nombre.substring(0, 30));
              
              // Agregar hoja de resumen si existe
              if (datosExcel && datosExcel.provincias && datosExcel.provincias.length > 0) {
                const resumenData = [
                  ['RESUMEN GENERAL'],
                  [''],
                  ['Tamaño de Mercado', datosExcel.mercado],
                  ['Potencial Ventas Máximo', datosExcel.ventasMax],
                  ['Potencial Ventas Mínimo', datosExcel.ventasMin],
                  ['Total Clientes Máximo', datosExcel.clientesMax],
                  ['Total Clientes Mínimo', datosExcel.clientesMin],
                  ['Participación Máxima', datosExcel.participacionMax + '%'],
                  ['Participación Mínima', datosExcel.participacionMin + '%'],
                  [''],
                  ['RESUMEN POR PROVINCIA'],
                  ['Provincia', 'Ventas Max', 'Ventas Min', 'Clientes Max', 'Clientes Min'],
                  ...datosExcel.provincias.map(p => [
                    p.nombre,
                    p.ventasMax,
                    p.ventasMin,
                    p.clientesMax,
                    p.clientesMin
                  ])
                ];
                
                const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
                wsResumen['!cols'] = [
                  { wch: 30 },
                  { wch: 15 },
                  { wch: 15 },
                  { wch: 15 },
                  { wch: 15 }
                ];
                XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
              }
              
              // Generar archivo y descargar
              const nombreArchivo = \`Reporte_\${procesoActual.nombre.replace(/ /g, '_')}_\${new Date().toISOString().split('T')[0]}.xlsx\`;
              XLSX.writeFile(wb, nombreArchivo);
              
              alert('Reporte generado exitosamente');
            } catch (error) {
              console.error('Error generando reporte:', error);
              alert('Error al generar el reporte: ' + error.message);
            }
          }
          
          // ==================== FUNCIONES EXCEL Y DASHBOARD ====================
          let datosExcel = null;
          let chartVentas = null;
          let chartClientes = null;
          let excelCargado = null; // Workbook completo
          let hojaActualExcel = null; // Datos de la hoja actual
          let modoVistaExcel = false; // true cuando se visualiza Excel directo
          
          // Cargar archivo Excel
          async function cargarExcel(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            const btnCargar = event.target.previousElementSibling || event.target.parentElement.querySelector('button');
            const textoOriginal = btnCargar ? btnCargar.innerHTML : '';
            if (btnCargar) {
              btnCargar.disabled = true;
              btnCargar.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Importando...';
            }
            
            try {
              const data = await file.arrayBuffer();
              const workbook = XLSX.read(data, { type: 'array' });
              excelCargado = workbook;
              
              // Importar automáticamente a la base de datos
              let registrosCargados = 0;
              try {
                registrosCargados = await cargarDatosDesdeExcelAPI(workbook);
                await cargarRegistros();
                alert('✅ Importación completada exitosamente\\n\\n' + 
                      '📊 Total de registros importados: ' + registrosCargados + '\\n\\n' +
                      'Los datos ya están disponibles en todos los procesos.');
              } catch (error) {
                console.error('Error importando datos:', error);
                alert('❌ Error al importar datos: ' + error.message);
              }
              
              event.target.value = '';
            } catch (error) {
              console.error('Error:', error);
              alert('❌ Error al cargar Excel: ' + error.message);
            } finally {
              if (btnCargar) {
                btnCargar.disabled = false;
                btnCargar.innerHTML = textoOriginal;
              }
            }
          }
          
          function mostrarVisualizadorExcel(nombreArchivo) {
            if (!excelCargado) return;
            modoVistaExcel = true;
            
            // Mostrar selector de hojas y ocultar elementos normales
            document.getElementById('selector-hoja-container').classList.remove('hidden');
            document.getElementById('selector-procesos').classList.add('hidden');
            document.getElementById('filtros-container').classList.add('hidden');
            
            // Actualizar información del archivo
            document.getElementById('info-archivo-tabla').textContent = nombreArchivo + ' - ' + new Date().toLocaleString('es-PE');
            
            // Llenar selector con hojas
            const selector = document.getElementById('selector-hoja-excel');
            selector.innerHTML = '<option value="">Seleccionar hoja...</option>';
            excelCargado.SheetNames.forEach((sheetName, index) => {
              const option = document.createElement('option');
              option.value = index;
              option.textContent = sheetName;
              selector.appendChild(option);
            });
            
            // Seleccionar primera hoja
            if (excelCargado.SheetNames.length > 0) {
              selector.value = 0;
              cambiarHojaExcel();
            }
          }
          
          function cambiarHojaExcel() {
            const selector = document.getElementById('selector-hoja-excel');
            const indexHoja = parseInt(selector.value);
            if (isNaN(indexHoja) || !excelCargado) return;
            
            const sheetName = excelCargado.SheetNames[indexHoja];
            const sheet = excelCargado.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
            
            hojaActualExcel = { nombre: sheetName, datos: jsonData };
            renderizarTablaExcel(jsonData);
          }
          
          function renderizarTablaExcel(datos) {
            const tbody = document.getElementById('tabla-registros');
            const theadRow = document.querySelector('#seccion-proceso table thead tr');
            
            if (!datos || datos.length === 0) {
              tbody.innerHTML = '<tr><td colspan="20" class="text-center py-8 text-gray-500">Sin datos</td></tr>';
              return;
            }
            
            const encabezados = datos[0];
            const filasDatos = datos.slice(1);
            
            theadRow.innerHTML = '<th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300">#</th>';
            encabezados.forEach(header => {
              theadRow.innerHTML += '<th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 border-r border-gray-300 whitespace-nowrap">' + (header || '-') + '</th>';
            });
            
            tbody.innerHTML = filasDatos.map((fila, index) => {
              if (!fila || fila.every(cell => !cell)) return '';
              return '<tr class="hover:bg-blue-50 transition border-b border-gray-200"><td class="px-3 py-2 text-gray-600 border-r border-gray-200 font-medium">' + (index + 1) + '</td>' +
                fila.map(cell => {
                  let valor = cell || '';
                  if (typeof cell === 'number') valor = cell.toLocaleString('es-PE');
                  return '<td class="px-3 py-2 text-gray-800 border-r border-gray-200">' + valor + '</td>';
                }).join('') + '</tr>';
            }).filter(row => row).join('');
            
            document.getElementById('titulo-proceso').textContent = '📊 Visualizando: ' + hojaActualExcel.nombre;
          }
          
          function cerrarVistaExcel() {
            modoVistaExcel = false;
            excelCargado = null;
            hojaActualExcel = null;
            
            // Mostrar elementos normales y ocultar selector de hojas
            document.getElementById('selector-hoja-container').classList.add('hidden');
            document.getElementById('selector-procesos').classList.remove('hidden');
            document.getElementById('filtros-container').classList.remove('hidden');
            document.getElementById('titulo-proceso').textContent = 'Sistema de Gestión';
            
            // Recargar tabla normal
            cargarRegistros();
          }
          
          // Cargar datos desde Excel a la base de datos vía API
          async function cargarDatosDesdeExcelAPI(workbook) {
            const sheetNames = workbook.SheetNames;
            let registrosCargados = 0;
            
            for (const sheetName of sheetNames) {
              const sheet = workbook.Sheets[sheetName];
              const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
              
              // Saltar hojas sin datos o de resumen
              if (jsonData.length < 2 || sheetName.toUpperCase().includes('RESUMEN')) continue;
              
              // Determinar el tipo de proceso según el nombre de la hoja
              let proceso_id = 0;
              let url = '';
              
              const sheetUpper = sheetName.toUpperCase();
              if (sheetUpper.includes('VIVO') && sheetUpper.includes('AREQUIPA')) {
                proceso_id = 1;
                url = '/vivo/crear';
              } else if (sheetUpper.includes('VIVO') && sheetUpper.includes('PROVINCIA')) {
                proceso_id = 2;
                url = '/vivo/crear';
              } else if (sheetUpper.includes('BENEF') && sheetUpper.includes('AREQUIPA')) {
                proceso_id = 3;
                url = '/beneficiado/crear';
              } else if (sheetUpper.includes('BENEF') && sheetUpper.includes('PROVINCIA')) {
                proceso_id = 4;
                url = '/beneficiado/crear';
              }
              
              if (proceso_id === 0) continue;
              
              // Obtener encabezados y crear mapa de columnas
              const headers = jsonData[0].map(h => String(h || '').toUpperCase().trim());
              const colMap = {};
              headers.forEach((h, idx) => {
                if (h.includes('AÑO') || h.includes('ANIO')) colMap.anio = idx;
                else if (h.includes('MES')) colMap.mes = idx;
                else if (h.includes('PROVINCIA')) colMap.provincia = idx;
                else if (h.includes('ZONA')) colMap.zona = idx;
                else if (h.includes('DISTRITO')) colMap.distrito = idx;
                else if (h.includes('TIPO') && h.includes('CLIENTE')) colMap.tipo_cliente = idx;
                else if (h.includes('NOMBRES') || (h.includes('CLIENTE') && !h.includes('TIPO'))) colMap.cliente = idx;
                else if (h === 'GRS' || (h.includes('GRS') && !h.includes('COMPRA') && !h.includes('VIVO'))) colMap.cantidad_grs = idx;
                else if (h === 'RP' || (h.includes('RP') && !h.includes('COMPRA'))) colMap.cantidad_rp = idx;
                else if (h.includes('POTENCIAL') && (h.includes('MIN') || h.includes('MÍNIMO')) && !h.includes('CONDIC')) colMap.pot_min = idx;
                else if (h.includes('POTENCIAL') && (h.includes('MAX') || h.includes('MÁXIMO')) && !h.includes('CONDIC')) colMap.pot_max = idx;
                else if (h.includes('OBSERV')) colMap.observaciones = idx;
              });
              
              // Procesar filas de datos (saltar encabezado)
              for (let i = 1; i < jsonData.length; i++) {
                const row = jsonData[i];
                if (!row || row.every(cell => !cell)) continue; // Saltar filas completamente vacías
                
                try {
                  // Buscar o crear cliente
                  const clienteNombre = String(row[colMap.cliente] || '').trim();
                  if (!clienteNombre) continue;
                  
                  let cliente = catalogos.clientes.find(c => c.nombre.toUpperCase() === clienteNombre.toUpperCase());
                  if (!cliente) {
                    // Crear nuevo cliente
                    const tipo_cliente = String(row[colMap.tipo_cliente] || 'OTROS').toUpperCase();
                    const nuevoCliente = await axios.post('/catalogos/clientes', {
                      nombre: clienteNombre,
                      tipo: tipo_cliente
                    });
                    cliente = nuevoCliente.data;
                    catalogos.clientes.push(cliente);
                  }
                  
                  // Buscar provincia
                  const provinciaNombre = String(row[colMap.provincia] || '').trim().toUpperCase();
                  const provincia = catalogos.provincias.find(p => p.nombre.toUpperCase() === provinciaNombre);
                  
                  // Preparar datos del registro
                  const registro = {
                    proceso_id: proceso_id,
                    cliente_id: cliente.id,
                    anio: parseInt(row[colMap.anio]) || new Date().getFullYear(),
                    mes: obtenerNumeroMes(row[colMap.mes]),
                    provincia_id: provincia ? provincia.id : null,
                    cantidad_grs: parseFloat(row[colMap.cantidad_grs]) || 0,
                    cantidad_rp: parseFloat(row[colMap.cantidad_rp]) || 0,
                    potencial_minimo: parseFloat(row[colMap.pot_min]) || 0,
                    potencial_maximo: parseFloat(row[colMap.pot_max]) || 0,
                    observaciones: String(row[colMap.observaciones] || '')
                  };
                  
                  // Crear registro vía API
                  await axios.post(url, registro);
                  registrosCargados++;
                  
                } catch (error) {
                  console.error(\`Error procesando fila \${i + 1} de hoja "\${sheetName}":\`, error);
                }
              }
            }
            
            return registrosCargados;
          }
          
          // Obtener número de mes desde nombre
          function obtenerNumeroMes(mesTexto) {
            if (typeof mesTexto === 'number') return mesTexto;
            const meses = {
              'ENERO': 1, 'FEBRERO': 2, 'MARZO': 3, 'ABRIL': 4, 'MAYO': 5, 'JUNIO': 6,
              'JULIO': 7, 'AGOSTO': 8, 'SEPTIEMBRE': 9, 'SETIEMBRE': 9, 'OCTUBRE': 10, 'NOVIEMBRE': 11, 'DICIEMBRE': 12
            };
            return meses[String(mesTexto).toUpperCase()] || 1;
          }
          
          // Procesar hoja de resumen
          function procesarHojaResumen(data) {
            const resultado = {
              mercado: 0,
              ventasMax: 0,
              ventasMin: 0,
              clientesMax: 0,
              clientesMin: 0,
              participacionMax: 0,
              participacionMin: 0,
              provincias: []
            };
            
            // Buscar datos del tamaño de mercado
            for (let i = 0; i < data.length; i++) {
              const row = data[i];
              const cellText = String(row[0] || '').toUpperCase();
              
              if (cellText.includes('TAMAÑO') && cellText.includes('MERCADO')) {
                resultado.mercado = parseFloat(row[2]) || 0;
              }
              
              if (cellText.includes('POTENCIAL') && cellText.includes('VENTAS')) {
                const nextRow = data[i + 1];
                if (nextRow) {
                  resultado.ventasMax = parseFloat(nextRow[1]) || 0;
                  resultado.ventasMin = parseFloat(nextRow[2]) || 0;
                }
              }
              
              if (cellText.includes('PARTICIPACION') && cellText.includes('MERCADO')) {
                const nextRow = data[i + 1];
                if (nextRow) {
                  resultado.participacionMax = parseFloat(nextRow[1]) || 0;
                  resultado.participacionMin = parseFloat(nextRow[2]) || 0;
                }
              }
              
              // Buscar tabla de provincias
              if (cellText.includes('AREQUIPA') || cellText.includes('CAMANÁ') || cellText.includes('CAYLLOMA')) {
                const provincia = {
                  nombre: row[0],
                  ventasMax: parseFloat(row[1]) || 0,
                  ventasMin: parseFloat(row[2]) || 0,
                  clientesMax: parseFloat(row[1]) || 0,
                  clientesMin: parseFloat(row[2]) || 0
                };
                resultado.provincias.push(provincia);
              }
            }
            
            // Buscar tabla de número de clientes
            for (let i = 0; i < data.length; i++) {
              const row = data[i];
              const cellText = String(row[0] || '').toUpperCase();
              
              if (cellText.includes('NRO') && cellText.includes('CLIENTES')) {
                const nextRow = data[i + 1];
                if (nextRow) {
                  resultado.clientesMax = parseFloat(nextRow[1]) || 0;
                  resultado.clientesMin = parseFloat(nextRow[2]) || 0;
                }
                
                // Actualizar datos de provincias con clientes
                for (let j = i + 1; j < Math.min(i + 15, data.length); j++) {
                  const provRow = data[j];
                  const provNombre = String(provRow[0] || '').toUpperCase();
                  
                  if (provNombre.includes('TOTAL')) break;
                  
                  const provincia = resultado.provincias.find(p => 
                    p.nombre.toUpperCase().includes(provNombre) || 
                    provNombre.includes(p.nombre.toUpperCase())
                  );
                  
                  if (provincia) {
                    provincia.clientesMax = parseFloat(provRow[1]) || 0;
                    provincia.clientesMin = parseFloat(provRow[2]) || 0;
                  }
                }
                break;
              }
            }
            
            return resultado;
          }
          
          // Mostrar dashboard
          function mostrarDashboard() {
            if (!datosExcel) return;
            
            // Actualizar estadísticas
            document.getElementById('stat-mercado').textContent = formatNumber(datosExcel.mercado);
            document.getElementById('stat-ventas-max').textContent = formatNumber(datosExcel.ventasMax);
            document.getElementById('stat-clientes').textContent = formatNumber(datosExcel.clientesMax);
            document.getElementById('stat-participacion').textContent = \`\${datosExcel.participacionMax.toFixed(2)}%\`;
            
            // Renderizar tabla de resumen
            renderizarTablaResumen();
            
            // Crear gráficos
            crearGraficos();
            
            // Mostrar sección
            document.getElementById('seccion-dashboard').classList.remove('hidden');
            
            // Scroll suave al dashboard
            document.getElementById('seccion-dashboard').scrollIntoView({ behavior: 'smooth' });
          }
          
          // Cerrar dashboard
          function cerrarDashboard() {
            document.getElementById('seccion-dashboard').classList.add('hidden');
          }
          
          // Renderizar tabla resumen
          function renderizarTablaResumen() {
            const tbody = document.getElementById('tabla-dashboard-resumen');
            
            if (!datosExcel || datosExcel.provincias.length === 0) {
              tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">Sin datos</td></tr>';
              return;
            }
            
            tbody.innerHTML = datosExcel.provincias.map(prov => \`
              <tr class="hover:bg-gray-50">
                <td class="px-4 py-3 font-medium text-gray-800">\${prov.nombre}</td>
                <td class="px-4 py-3 text-right text-gray-700">\${formatNumber(prov.ventasMax)}</td>
                <td class="px-4 py-3 text-right text-gray-700">\${formatNumber(prov.ventasMin)}</td>
                <td class="px-4 py-3 text-right text-gray-700">\${formatNumber(prov.clientesMax)}</td>
                <td class="px-4 py-3 text-right text-gray-700">\${formatNumber(prov.clientesMin)}</td>
              </tr>
            \`).join('');
          }
          
          // Crear gráficos
          function crearGraficos() {
            if (!datosExcel) return;
            
            // Destruir gráficos anteriores si existen
            if (chartVentas) chartVentas.destroy();
            if (chartClientes) chartClientes.destroy();
            
            const provincias = datosExcel.provincias.map(p => p.nombre);
            const ventasMax = datosExcel.provincias.map(p => p.ventasMax);
            const ventasMin = datosExcel.provincias.map(p => p.ventasMin);
            const clientesMax = datosExcel.provincias.map(p => p.clientesMax);
            const clientesMin = datosExcel.provincias.map(p => p.clientesMin);
            
            // Gráfico de Ventas
            const ctxVentas = document.getElementById('chart-ventas').getContext('2d');
            chartVentas = new Chart(ctxVentas, {
              type: 'bar',
              data: {
                labels: provincias,
                datasets: [
                  {
                    label: 'Potencial Máximo',
                    data: ventasMax,
                    backgroundColor: 'rgba(59, 130, 246, 0.8)',
                    borderColor: 'rgb(59, 130, 246)',
                    borderWidth: 1
                  },
                  {
                    label: 'Potencial Mínimo',
                    data: ventasMin,
                    backgroundColor: 'rgba(16, 185, 129, 0.8)',
                    borderColor: 'rgb(16, 185, 129)',
                    borderWidth: 1
                  }
                ]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'bottom'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return formatNumber(value);
                      }
                    }
                  }
                }
              }
            });
            
            // Gráfico de Clientes
            const ctxClientes = document.getElementById('chart-clientes').getContext('2d');
            chartClientes = new Chart(ctxClientes, {
              type: 'doughnut',
              data: {
                labels: provincias,
                datasets: [{
                  label: 'Número de Clientes',
                  data: clientesMax,
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(234, 179, 8, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(6, 182, 212, 0.8)',
                    'rgba(168, 85, 247, 0.8)',
                    'rgba(34, 197, 94, 0.8)'
                  ],
                  borderWidth: 2,
                  borderColor: '#fff'
                }]
              },
              options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      font: {
                        size: 10
                      }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        return \`\${label}: \${formatNumber(value)} clientes\`;
                      }
                    }
                  }
                }
              }
            });
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
