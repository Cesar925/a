# Sistema de Gestión - Arequipa

## 📋 Descripción del Proyecto

Sistema de gestión integral para el control de procesos de venta de pollo en Arequipa y provincias. Permite gestionar datos de clientes, ventas, potenciales y generar reportes en Excel.

## 🌐 URLs del Sistema

- **Sandbox (Desarrollo)**: https://3000-io76xoehoh5oiv2cq3g44-583b4d74.sandbox.novita.ai
- **Producción**: (Pendiente de despliegue)
- **GitHub**: (Pendiente de configuración)

## ✨ Características Principales

### ✅ Funcionalidades Completadas

1. **Gestión de Procesos**
   - Vivo Arequipa
   - Vivo Provincias
   - Beneficiado Arequipa
   - Beneficiado Provincia

2. **CRUD de Registros**
   - ✅ Crear nuevos registros (modal popup responsive)
   - ✅ Modificar registros existentes
   - ✅ Eliminar registros (individual y múltiple)
   - ✅ Visualización en tabla con scroll horizontal

3. **Carga Masiva de Datos desde Excel**
   - ✅ Botón "CARGAR EXCEL" (esquina inferior izquierda)
   - ✅ Procesa archivos .xlsx y .xls
   - ✅ Lee múltiples hojas: AREQUIPA VIVO, PROVINCIAS VIVO, AREQUIPA BENEF, PROVINCIAS BENEF
   - ✅ Crea automáticamente clientes si no existen
   - ✅ Importa datos a la base de datos D1
   - ✅ Muestra cantidad de registros importados

4. **Generación de Reportes Excel**
   - ✅ Botón "REPORTE" genera archivo Excel descargable
   - ✅ Incluye todos los registros filtrados en la tabla
   - ✅ Hoja de resumen con estadísticas generales
   - ✅ Hoja con detalle por provincia
   - ✅ Formato profesional con columnas ajustadas

5. **Dashboard Gráfico Visual**
   - ✅ Estadísticas principales en cards (Mercado, Ventas, Clientes, Participación)
   - ✅ Gráfico de barras: Potencial de Ventas por Región
   - ✅ Gráfico de dona: Distribución de Clientes
   - ✅ Tabla resumen por provincia
   - ✅ Responsive y con animaciones

6. **Sistema de Filtros**
   - ✅ Filtro por año (2024, 2025, 2026)
   - ✅ Filtro por mes (Enero - Diciembre)
   - ✅ Filtro por provincia (cuando aplica)
   - ✅ Filtro por cliente

7. **Diseño Responsive**
   - ✅ Modal de formulario adaptable a móviles
   - ✅ Tabla con scroll horizontal
   - ✅ Dashboard adaptable a diferentes pantallas

## 🗄️ Arquitectura de Datos

### Base de Datos: Cloudflare D1 (SQLite)

**Tablas Principales:**

1. **clientes**
   - `id` (INTEGER PRIMARY KEY)
   - `nombre` (TEXT)
   - `tipo` (TEXT)
   - `created_at` (DATETIME)

2. **provincias**
   - `id` (INTEGER PRIMARY KEY)
   - `nombre` (TEXT)

3. **procesos**
   - `id` (INTEGER PRIMARY KEY)
   - `nombre` (TEXT)
   - Valores: 1=Vivo Arequipa, 2=Vivo Provincias, 3=Beneficiado Arequipa, 4=Beneficiado Provincia

4. **registros_vivo**
   - `id` (INTEGER PRIMARY KEY)
   - `proceso_id` (INTEGER FK → procesos)
   - `cliente_id` (INTEGER FK → clientes)
   - `anio` (INTEGER)
   - `mes` (INTEGER)
   - `provincia_id` (INTEGER FK → provincias)
   - `cantidad_grs` (REAL)
   - `cantidad_rp` (REAL)
   - `potencial_minimo` (REAL)
   - `potencial_maximo` (REAL)
   - `observaciones` (TEXT)

5. **registros_beneficiado**
   - Misma estructura que `registros_vivo`

### Flujo de Datos

```
Excel → Carga Masiva → D1 Database → API Endpoints → Frontend
                                   ↓
                              Dashboard con Gráficos
```

## 🚀 Guía de Uso

### 1. Gestión Básica de Registros

1. **Cambiar de Proceso**: Haz clic en los botones de la derecha (Vivo Arequipa, Vivo Provincias, etc.)
2. **Filtrar Datos**: Usa los selectores de Año, Mes, Provincia y Cliente
3. **Crear Registro**: Click en botón verde "NUEVO" → Llenar formulario → Guardar
4. **Modificar Registro**: Selecciona checkbox → Click en "MODIFICA" → Editar → Guardar
5. **Eliminar Registro**: Selecciona checkbox(es) → Click en "ELIMINA" → Confirmar

### 2. Cargar Datos desde Excel

1. **Preparar Excel**: Debe tener hojas con nombres:
   - `AREQUIPA VIVO`
   - `PROVINCIAS VIVO`
   - `AREQUIPA BENEF`
   - `PROVINCIAS BENEF`

2. **Estructura de Columnas Excel**:
   ```
   Columna 0: AÑO (2024)
   Columna 1: MES (ENERO, FEBRERO, etc.)
   Columna 2: PROVINCIA (AREQUIPA, CAMANÁ, etc.)
   Columna 3: ZONA
   Columna 4: COMPRA GRS (SI/NO)
   Columna 5: TIPO DE CLIENTE
   Columna 6: NOMBRES (Cliente)
   Columna 7: GRS (cantidad)
   Columna 8: RP (cantidad)
   Columna 15/25: POTENCIAL MINIMO
   Columna 16/26: POTENCIAL MAXIMO
   Última columna: OBSERVACIONES
   ```

3. **Importar**:
   - Click en "CARGAR EXCEL" (botón morado, esquina inferior izquierda)
   - Seleccionar archivo .xlsx o .xls
   - Esperar mensaje de confirmación con cantidad de registros importados
   - Los datos aparecerán automáticamente en la tabla

### 3. Generar Reportes

1. **Filtrar Datos** (opcional): Usa los filtros para seleccionar datos específicos
2. **Click en "REPORTE"**: Botón gris en la esquina inferior derecha
3. **Descargar**: Se descargará automáticamente un archivo Excel con:
   - Hoja 1: Datos detallados de los registros
   - Hoja 2: Resumen con estadísticas generales

### 4. Ver Dashboard Gráfico

- Se muestra automáticamente después de cargar un Excel con hoja de resumen
- Contiene:
  - 4 Cards con métricas clave
  - Gráfico de barras comparativo
  - Gráfico circular de distribución
  - Tabla detallada por provincia
- Para cerrar: Click en ✕ en la esquina superior derecha

## 🛠️ Stack Tecnológico

- **Backend**: Hono (Edge Framework)
- **Frontend**: HTML5 + Tailwind CSS + Vanilla JavaScript
- **Base de Datos**: Cloudflare D1 (SQLite)
- **Gráficos**: Chart.js 4.4.0
- **Excel**: SheetJS (xlsx) 0.18.5
- **Iconos**: Font Awesome 6.4.0
- **Deployment**: Cloudflare Pages + Workers

## 📊 Estado del Proyecto

### ✅ Completado
- Sistema CRUD completo
- Carga masiva desde Excel con importación a BD
- Generación de reportes Excel profesionales
- Dashboard visual con gráficos interactivos
- Diseño responsive y modal mejorado
- Sistema de filtros avanzado

### 🔄 En Progreso
- Ninguno

### 📋 Próximos Pasos Recomendados
1. Desplegar a Cloudflare Pages (producción)
2. Configurar dominio personalizado
3. Agregar autenticación de usuarios
4. Implementar exportación de dashboard a PDF
5. Agregar más tipos de gráficos (líneas de tendencia, etc.)
6. Sistema de notificaciones por email

## 🔧 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Construir proyecto
npm run build

# Iniciar en sandbox (desarrollo)
pm2 start ecosystem.config.cjs

# Ver logs
pm2 logs webapp --nostream

# Reiniciar servicio
pm2 restart webapp

# Detener servicio
pm2 delete webapp

# Generar reporte
npm run deploy
```

## 📝 Notas Importantes

1. **Formato de Fechas**: Los meses en Excel deben estar en español (ENERO, FEBRERO, SETIEMBRE, etc.)
2. **Clientes Nuevos**: Si un cliente no existe, se crea automáticamente al importar Excel
3. **Provincias**: Deben coincidir con las registradas en la BD (AREQUIPA, CAMANÁ, CAYLLOMA, etc.)
4. **Tamaño de Archivo**: El Excel puede tener miles de registros, se procesan por lotes

## 🐛 Solución de Problemas

### Error al cargar Excel
- Verificar que las hojas tengan los nombres correctos
- Asegurarse de que la primera fila sea el encabezado
- Revisar que las columnas de año, mes y cliente tengan datos válidos

### No aparecen datos en la tabla
- Verificar los filtros activos (año, mes, cliente)
- Revisar en consola del navegador (F12) si hay errores
- Confirmar que la importación fue exitosa

### El dashboard no se muestra
- El dashboard solo se muestra si existe una hoja de "RESUMEN" en el Excel
- Alternativamente, los datos se pueden visualizar desde la tabla y generar reporte

## 📧 Contacto y Soporte

Para reportar problemas o sugerencias, contactar al equipo de desarrollo.

---

**Última actualización**: 2025-01-26
**Versión**: 1.1.0
**Estado**: ✅ Producción lista
