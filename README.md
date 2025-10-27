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

3. **🆕 Visualizador de Excel Hoja por Hoja**
   - ✅ **Ver datos completos del Excel sin importar**
   - ✅ Selector de hojas (dropdown)
   - ✅ Navegación entre hojas instantánea
   - ✅ Muestra estructura original del Excel
   - ✅ Tabla dinámica con todos los datos
   - ✅ Formato de números con separadores
   - ✅ 3 opciones: Ver, Importar, o Ambos

4. **Carga Masiva de Datos desde Excel**
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

### 🆕 Doble Modo de Base de Datos

El sistema ahora soporta **DOS modos de operación**:

1. **Modo Cloudflare D1** (Original)
   - Base de datos SQLite distribuida en la nube
   - Deployment en Cloudflare Pages/Workers
   - Ideal para producción escalable

2. **🆕 Modo PHP + MySQL** (Nuevo)
   - Conexión a base de datos MySQL local (phpMyAdmin)
   - Backend PHP con endpoints REST
   - Ideal para desarrollo local y control total de datos

**Para usar el modo PHP + MySQL, ver:** [GUIA_INSTALACION_PHP_API.md](./GUIA_INSTALACION_PHP_API.md)

---

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

### 2. 🆕 Visualizador de Excel (Hoja por Hoja)

**Cuando quieras ver los datos del Excel sin modificar la base de datos:**

1. Click en **"CARGAR EXCEL"** (botón morado, inferior izquierda)
2. Seleccionar archivo Excel
3. Elegir **Opción 1**: "Ver datos del Excel hoja por hoja"
4. Aparecerá:
   - Selector de hojas (dropdown) en la parte superior
   - Tabla con datos completos de la hoja seleccionada
   - Botón "Cerrar vista Excel" para volver
5. Cambiar entre hojas usando el selector
6. Ver todos los datos con formato original
7. Click en "Cerrar vista Excel" cuando termines

**Ventajas:**
- ✅ No modifica la base de datos
- ✅ Visualización rápida y completa
- ✅ Ideal para revisar datos antes de importar
- ✅ Navegación fácil entre hojas

### 3. 🚀 Importación Automática desde Excel (NUEVO)

**Importación 100% automática sin opciones:**

1. Click en **"CARGAR EXCEL"**
2. Seleccionar archivo Excel
3. ✅ **¡Listo!** El sistema automáticamente:
   - Detecta el tipo de proceso por el nombre de la hoja
   - Identifica las columnas por sus nombres (no por posición)
   - Crea nuevos clientes si no existen
   - Importa todos los registros a la base de datos
   - Muestra mensaje con total de registros importados
   - Recarga los datos en la vista actual

**📊 Formato del Excel:**

**Nombres de Hojas** (detecta automáticamente):
- Hojas que contengan **"VIVO" + "AREQUIPA"** → Vivo Arequipa
- Hojas que contengan **"VIVO" + "PROVINCIA"** → Vivo Provincias  
- Hojas que contengan **"BENEF" + "AREQUIPA"** → Beneficiado Arequipa
- Hojas que contengan **"BENEF" + "PROVINCIA"** → Beneficiado Provincia

**Columnas Requeridas** (el sistema las detecta por nombre):
- **AÑO** o **ANIO**: Año del registro (ej: 2024)
- **MES**: Nombre o número del mes (ej: "Septiembre" o 9)
- **CLIENTE**: Nombre del cliente
- **TIPO CLIENTE**: Tipo (DISTRIBUIDOR, MAYORISTA, etc.)
- **PROVINCIA**: Nombre de la provincia
- **GRS** o **CANTIDAD GRS**: Cantidad en GRS
- **RP** o **CANTIDAD RP**: Cantidad en RP
- **POTENCIAL MINIMO**: Potencial mínimo
- **POTENCIAL MAXIMO**: Potencial máximo

**Columnas Opcionales:**
- **ZONA**: Zona geográfica
- **DISTRITO**: Distrito
- **OBSERVACIONES**: Notas adicionales

**✨ Ventajas del Nuevo Sistema:**
- ✅ **Sin opciones**: No pregunta qué hacer, importa automáticamente
- ✅ **Flexible**: Las columnas pueden estar en cualquier orden
- ✅ **Inteligente**: Detecta columnas por palabras clave
- ✅ **Completo**: Maneja múltiples hojas en un solo archivo
- ✅ **Robusto**: Continúa importando aunque haya errores en filas individuales

📖 **Ver [FORMATO_EXCEL.md](./FORMATO_EXCEL.md) para detalles completos**

### 4. Generar Reportes

1. **Filtrar Datos** (opcional): Usa los filtros para seleccionar datos específicos
2. **Click en "REPORTE"**: Botón gris en la esquina inferior derecha
3. **Descargar**: Se descargará automáticamente un archivo Excel con:
   - Hoja 1: Datos detallados de los registros
   - Hoja 2: Resumen con estadísticas generales

### 5. Ver Dashboard Gráfico

- Se muestra automáticamente después de cargar un Excel con hoja de resumen
- Contiene:
  - 4 Cards con métricas clave
  - Gráfico de barras comparativo
  - Gráfico circular de distribución
  - Tabla detallada por provincia
- Para cerrar: Click en ✕ en la esquina superior derecha

---

## 📖 Documentación Adicional

- **[GUIA_VISUALIZADOR_EXCEL.md](./GUIA_VISUALIZADOR_EXCEL.md)**: Guía completa del visualizador de Excel con casos de uso y ejemplos
- **[ENDPOINTS_EXPORTACION.md](./ENDPOINTS_EXPORTACION.md)**: Documentación de endpoints de exportación Excel
- **🆕 [GUIA_INSTALACION_PHP_API.md](./GUIA_INSTALACION_PHP_API.md)**: Guía completa para conectar a MySQL/phpMyAdmin
- **🆕 [LEEME_RAPIDO.txt](./LEEME_RAPIDO.txt)**: Instalación rápida en 6 pasos
- **🆕 [api-php/README_API.md](./api-php/README_API.md)**: Documentación técnica de la API PHP

## 🛠️ Stack Tecnológico

### Modo Cloudflare (Original)
- **Backend**: Hono (Edge Framework)
- **Frontend**: HTML5 + Tailwind CSS + Vanilla JavaScript
- **Base de Datos**: Cloudflare D1 (SQLite)
- **Deployment**: Cloudflare Pages + Workers

### 🆕 Modo PHP + MySQL (Nuevo)
- **Backend**: PHP 7.4+ con PDO
- **API**: REST endpoints con JSON
- **Base de Datos**: MySQL 5.7+ / MariaDB (phpMyAdmin)
- **Servidor**: Apache (XAMPP/WAMP)
- **Frontend**: HTML5 + Tailwind CSS + JavaScript (sin cambios)

### Común a Ambos Modos
- **Gráficos**: Chart.js 4.4.0
- **Excel**: SheetJS (xlsx) 0.18.5
- **Iconos**: Font Awesome 6.4.0

## 📊 Estado del Proyecto

### ✅ Completado
- Sistema CRUD completo
- 🆕 **Visualizador de Excel hoja por hoja** (sin importar a BD)
- Carga masiva desde Excel con importación a BD
- Generación de reportes Excel profesionales
- Dashboard visual con gráficos interactivos
- Diseño responsive y modal mejorado
- Sistema de filtros avanzado
- Selector de hojas con navegación instantánea

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

### Modo Cloudflare D1 (Original)

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

# Desplegar a producción
npm run deploy
```

### 🆕 Modo PHP + MySQL (Nuevo)

```bash
# 1. Instalar API PHP en XAMPP/WAMP
INSTALAR_API_PHP.bat

# 2. Configurar base de datos
CONFIGURAR_API.bat

# 3. Construir frontend
npm run build

# 4. Ejecutar frontend
ejecutar.bat

# 5. Probar API (navegador)
http://localhost/api-php/test.php
```

**📖 Ver guía completa:** [GUIA_INSTALACION_PHP_API.md](./GUIA_INSTALACION_PHP_API.md)

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

**Última actualización**: 2025-01-27
**Versión**: 1.5.0
**Estado**: ✅ Producción lista + 🆕 Modo PHP+MySQL

---

## 🎯 Cambios Recientes (v1.5.0)

### 🆕 Integración con MySQL/phpMyAdmin (NUEVO)

1. **Backend PHP con API REST**
   - ✅ 7 archivos PHP para endpoints completos
   - ✅ Conexión nativa a MySQL/MariaDB
   - ✅ CRUD completo: Create, Read, Update, Delete
   - ✅ Endpoints para filtros y estadísticas
   - ✅ Importación masiva desde Excel
   - ✅ CORS configurado para frontend

2. **Scripts de Instalación Automática**
   - ✅ `INSTALAR_API_PHP.bat`: Copia automática a XAMPP/WAMP
   - ✅ `CONFIGURAR_API.bat`: Configurador interactivo de base de datos
   - ✅ Detección automática de XAMPP/WAMP
   - ✅ Backup automático de configuración

3. **Documentación Completa**
   - ✅ `GUIA_INSTALACION_PHP_API.md`: Guía paso a paso con capturas
   - ✅ `LEEME_RAPIDO.txt`: Instalación en 6 pasos
   - ✅ `api-php/README_API.md`: Documentación técnica de endpoints
   - ✅ `api-php/test.php`: Página de diagnóstico

4. **Adaptador de API para Frontend**
   - ✅ `api-config.js`: Configuración de URL y modo
   - ✅ `api-adapter.js`: Wrapper para compatibilidad
   - ✅ Sin cambios en código del frontend existente
   - ✅ Conversión automática de formatos (D1 ↔ MySQL)

5. **Estructura de Tablas MySQL**
   - ✅ `captura_pantalla_vivo`: Tabla para datos vivo
   - ✅ `captura_pantalla_beneficiado`: Tabla para datos beneficiado
   - ✅ Script SQL incluido: `estructura_tablas.sql`
   - ✅ Índices optimizados para consultas rápidas

**Arquitectura:**
```
Frontend (Navegador) → API PHP (localhost) → MySQL (phpMyAdmin)
```

**Ventajas del Modo PHP+MySQL:**
- ✅ Control total sobre los datos
- ✅ Acceso directo vía phpMyAdmin
- ✅ Backups fáciles de la base de datos
- ✅ Sin límites de Cloudflare
- ✅ Ideal para desarrollo local

---

## 🎯 Cambios Anteriores (v1.4.0)

### 🚀 Importación Automática de Excel (NUEVO)

1. **Importación 100% Automática**
   - ✅ Sin menús ni opciones: Solo cargar y listo
   - ✅ Detecta automáticamente el tipo de proceso por nombre de hoja
   - ✅ Identifica columnas por palabras clave (no por posición)
   - ✅ Importa todos los datos directamente a la base de datos

2. **Mapeo Inteligente de Columnas**
   - ✅ Las columnas pueden estar en cualquier orden
   - ✅ Detecta por palabras clave: "AÑO", "MES", "CLIENTE", "GRS", "RP", etc.
   - ✅ Flexible con variaciones: "ANIO"/"AÑO", "MINIMO"/"MÍNIMO", etc.

3. **Selección de Filas por Clic**
   - ✅ Eliminados checkboxes de selección
   - ✅ Clic en cualquier fila para seleccionar/deseleccionar
   - ✅ Feedback visual inmediato (fondo azul)
   - ✅ Soporte para selección múltiple

4. **Campo Provincia en Modal**
   - ✅ Agregado campo Provincia en formulario de Nuevo/Modificar
   - ✅ Carga automática de provincias disponibles

5. **Botones de Proceso Reubicados**
   - ✅ Movidos de sidebar derecho a debajo de filtros
   - ✅ Layout responsive: 2 columnas en móvil, 4 en desktop

---

## 🎯 Cambios Anteriores (v1.3.0)

### 🆕 Nuevas Funcionalidades

1. **Eliminada Columna de Acciones**
   - Tabla más limpia sin botones de editar/eliminar por fila
   - Uso de botones NUEVO, MODIFICA, ELIMINA en parte inferior
   - Mejor rendimiento en tablas grandes

2. **Endpoints de Exportación Excel**
   - **GET /vivo/arequipa/excel**: Exporta datos de Vivo Arequipa
   - **GET /vivo/provincia/excel**: Exporta datos de Vivo Provincia
   - **GET /beneficiado/arequipa/excel**: Exporta datos de Beneficiado Arequipa
   - **GET /beneficiado/provincia/excel**: Exporta datos de Beneficiado Provincia
   - Retornan datos en formato JSON desde la base de datos
   - Ver [ENDPOINTS_EXPORTACION.md](./ENDPOINTS_EXPORTACION.md) para más detalles

3. **Carga de Excel vía API**
   - Ahora los datos se envían al backend mediante endpoints
   - Mejor validación y control de errores
   - Creación automática de clientes si no existen
   - Mensajes de progreso durante la importación

4. **Reportes desde Backend**
   - Función `generarReporte()` ahora obtiene datos desde la base de datos
   - Datos siempre actualizados y completos
   - Sin límites de paginación en reportes

### 📖 Documentación Adicional

- **[ENDPOINTS_EXPORTACION.md](./ENDPOINTS_EXPORTACION.md)**: Documentación completa de endpoints de exportación
