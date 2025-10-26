# Sistema de Gestión - Arequipa

## 📋 Descripción del Proyecto

Sistema web minimalista e intuitivo para la gestión de datos de ventas y potencial de clientes en Arequipa. **Implementado con arquitectura por capas profesional** (Controllers, Services, Repositories), compatible conceptualmente con Spring Boot, usando Hono + TypeScript y desplegable en Cloudflare Pages.

### 🎯 Objetivos
- Gestionar 4 procesos: Vivo Arequipa, Vivo Provincias, Beneficiado Arequipa, Beneficiado Provincia
- CRUD completo: NUEVO, MODIFICA, ELIMINA, REPORTE
- Administrar clientes, provincias, zonas y compras GRS
- Visualizar estadísticas y resúmenes de datos
- Interfaz minimalista e intuitiva

## 🌐 URLs de Acceso

### Desarrollo Local (Sandbox)
- **Aplicación Web**: https://3000-io76xoehoh5oiv2cq3g44-583b4d74.sandbox.novita.ai
- **Menú Principal**: 4 tarjetas con gradientes de colores para cada proceso

## 🏗️ Arquitectura por Capas

El proyecto sigue una **arquitectura por capas profesional**, similar a Spring Boot:

```
src/
├── controllers/          # Controladores (REST Endpoints)
│   ├── VivoController.ts
│   ├── BeneficiadoController.ts
│   └── CatalogoController.ts
├── services/             # Lógica de negocio
│   ├── VivoService.ts
│   └── BeneficiadoService.ts
├── repositories/         # Acceso a datos (Data Access Layer)
│   ├── VivoRepository.ts
│   ├── BeneficiadoRepository.ts
│   └── CatalogoRepository.ts
├── types/                # Tipos TypeScript
│   └── index.ts
├── models/               # Modelos de dominio
├── middleware/           # Middleware personalizado
└── utils/                # Utilidades
```

### Capas del Sistema

#### 1. **Controllers** (Capa de Presentación)
Maneja las peticiones HTTP y respuestas. Cada controlador está dedicado a un módulo específico:
- `VivoController`: Endpoints para procesos Vivo (Arequipa y Provincias)
- `BeneficiadoController`: Endpoints para procesos Beneficiado
- `CatalogoController`: Endpoints para catálogos (clientes, provincias, etc.)

#### 2. **Services** (Capa de Lógica de Negocio)
Contiene la lógica de negocio y validaciones:
- `VivoService`: Validaciones y operaciones de negocio para Vivo
- `BeneficiadoService`: Validaciones y operaciones de negocio para Beneficiado

#### 3. **Repositories** (Capa de Acceso a Datos)
Maneja todas las operaciones con la base de datos:
- `VivoRepository`: Queries y operaciones CRUD para Vivo
- `BeneficiadoRepository`: Queries y operaciones CRUD para Beneficiado
- `CatalogoRepository`: Queries para catálogos

### Endpoints API Implementados

#### VIVO (Arequipa y Provincias)
- `GET /vivo/all` - Obtener todos los registros Vivo
- `GET /vivo/arequipa` - Obtener registros de Arequipa Vivo
- `GET /vivo/provincia` - Obtener registros de Provincia Vivo
- `POST /vivo/crear` - Crear nuevo registro
- `PUT /vivo/actualizar` - Actualizar registro existente
- `DELETE /vivo/borrar/{id}` - Eliminar registro por ID
- `GET /vivo/estadisticas` - Obtener estadísticas agregadas

#### BENEFICIADO (Arequipa y Provincias)
- `GET /beneficiado/all` - Obtener todos los registros Beneficiado
- `GET /beneficiado/arequipa` - Obtener registros de Arequipa Beneficiado
- `GET /beneficiado/provincia` - Obtener registros de Provincia Beneficiado
- `POST /beneficiado/crear` - Crear nuevo registro
- `PUT /beneficiado/actualizar` - Actualizar registro existente
- `DELETE /beneficiado/borrar/{id}` - Eliminar registro por ID
- `GET /beneficiado/estadisticas` - Obtener estadísticas agregadas

#### CATÁLOGOS
- `GET /catalogos/procesos` - Obtener todos los procesos
- `GET /catalogos/provincias` - Obtener todas las provincias
- `GET /catalogos/zonas` - Obtener todas las zonas
- `GET /catalogos/tipos-cliente` - Obtener tipos de cliente
- `GET /catalogos/compras-grs` - Obtener compras GRS
- `GET /catalogos/clientes` - Obtener todos los clientes
- `POST /catalogos/clientes` - Crear nuevo cliente

## 🎨 Interfaz de Usuario

### Menú Principal
**4 tarjetas con gradientes de colores**:

1. **Vivo Arequipa** (Azul) - Proceso 1
   - Icono: Ciudad
   - Color: Gradiente azul (from-blue-500 to-blue-700)

2. **Vivo Provincias** (Verde) - Proceso 2
   - Icono: Mapa
   - Color: Gradiente verde (from-green-500 to-green-700)

3. **Beneficiado Arequipa** (Morado) - Proceso 3
   - Icono: Edificio
   - Color: Gradiente morado (from-purple-500 to-purple-700)

4. **Beneficiado Provincia** (Naranja) - Proceso 4
   - Icono: Globo
   - Color: Gradiente naranja (from-orange-500 to-orange-700)

### Funcionalidades por Proceso
Cada proceso tiene 4 botones principales:

- **NUEVO** (Verde) - Crear nuevo registro
- **MODIFICA** (Azul) - Modificar registro seleccionado
- **ELIMINA** (Rojo) - Eliminar registros seleccionados
- **REPORTE** (Gris) - Generar reporte (en desarrollo)

### Tabla de Registros
- Checkbox para selección múltiple
- Columnas: ID, Cliente, Año/Mes, Provincia, GRS, RP, Pot. Min, Pot. Max, Acciones
- Filtros: Año, Mes, Provincia (solo para procesos de provincia)
- Acciones rápidas: Editar y Eliminar individual

## 🗄️ Arquitectura de Datos

### Modelos Principales

1. **Procesos** (4 tipos)
   - Arequipa Vivo (ID: 1)
   - Provincia Vivo (ID: 2)
   - Arequipa Beneficiado (ID: 3)
   - Provincia Beneficiado (ID: 4)

2. **Provincias** (8 provincias)
   - Arequipa, Camaná, Castilla, Caylloma, Condesuyos, Islay, La Unión, Caravelí

3. **Tipos de Cliente**
   - SI (Distribuidores)
   - NO (Mayoristas)
   - MD (Mercado)

4. **Clientes** (20+ pre-cargados)
   - Renzo, Avelino, Mercedes, Avicru, Rafael, Matilde, etc.

### Servicios de Almacenamiento
- **Cloudflare D1 (SQLite)**: Base de datos relacional principal
- **Local Development**: SQLite local en `.wrangler/state/v3/d1/`

## 💻 Stack Tecnológico

- **Backend**: Hono v4 (framework web ultrarrápido)
- **Arquitectura**: Por capas (Controllers → Services → Repositories)
- **Base de Datos**: Cloudflare D1 (SQLite distribuido)
- **Frontend**: HTML5 + TailwindCSS + Axios
- **Runtime**: Cloudflare Workers
- **Build**: Vite
- **Deployment**: Cloudflare Pages
- **Lenguaje**: TypeScript

## 🚀 Características Implementadas

### ✅ Completadas
- [x] **Arquitectura por capas completa** (Controllers, Services, Repositories)
- [x] **Menú principal con 4 procesos** (tarjetas con gradientes)
- [x] **Endpoints específicos** (/vivo/all, /vivo/arequipa, /vivo/provincia, etc.)
- [x] **CRUD completo**: Crear, Leer, Actualizar, Eliminar
- [x] **Base de datos D1** con 8 tablas relacionales
- [x] **Migraciones y datos semilla**
- [x] **Interfaz minimalista** con Tailwind CSS
- [x] **Formularios modales** para NUEVO y MODIFICA
- [x] **Selección múltiple** para ELIMINA
- [x] **Filtros dinámicos** por año, mes y provincia
- [x] **Validaciones** en servicios
- [x] **Gestión de catálogos** (clientes, provincias, zonas)
- [x] **Tabla responsive** con acciones rápidas
- [x] **Botón "Volver al Menú"**

### 🔄 En Desarrollo
- [ ] Parser de archivos Excel/CSV para carga masiva
- [ ] Función REPORTE (exportar a Excel)
- [ ] Gráficos y visualizaciones avanzadas
- [ ] Búsqueda avanzada de clientes
- [ ] Autenticación y autorización

## 📖 Guía de Uso

### 1. Menú Principal
Al acceder a la aplicación, verás 4 tarjetas grandes con gradientes de colores. Haz clic en cualquiera para entrar a ese proceso.

### 2. Gestión de Registros

#### NUEVO
1. Haz clic en el botón **NUEVO** (verde)
2. Completa el formulario modal:
   - Cliente (requerido)
   - Año y mes (requerido)
   - Provincia, zona (opcional)
   - Cantidades GRS, RP
   - Potenciales mínimo y máximo
   - Observaciones
3. Haz clic en **Guardar**

#### MODIFICA
1. **Opción 1**: Selecciona un checkbox en la tabla y haz clic en **MODIFICA** (azul)
2. **Opción 2**: Haz clic en el icono de editar (lápiz) en la columna Acciones
3. Modifica los campos necesarios
4. Haz clic en **Guardar**

#### ELIMINA
1. **Opción 1**: Selecciona uno o varios checkboxes y haz clic en **ELIMINA** (rojo)
2. **Opción 2**: Haz clic en el icono de eliminar (basura) en la columna Acciones
3. Confirma la eliminación

#### REPORTE
*(En desarrollo)* Generará un reporte Excel con los registros filtrados.

### 3. Filtros
- **Año**: Filtra registros por año
- **Mes**: Filtra registros por mes
- **Provincia**: Solo visible en procesos de provincia

### 4. Volver al Menú
Haz clic en el botón **"Volver al Menú"** en la esquina superior derecha para regresar al menú principal.

## 🛠️ Desarrollo Local

### Instalación
```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/webapp.git
cd webapp

# Instalar dependencias
npm install

# Configurar base de datos local
npm run db:migrate:local
npm run db:seed
```

### Comandos Disponibles
```bash
# Desarrollo
npm run dev                  # Vite dev server
npm run dev:sandbox          # Wrangler pages dev

# Build
npm run build                # Construir proyecto

# Base de datos
npm run db:migrate:local     # Aplicar migraciones localmente
npm run db:seed              # Cargar datos semilla
npm run db:reset             # Resetear base de datos

# PM2 (Sandbox)
pm2 start ecosystem.config.cjs
pm2 list
pm2 logs webapp --nostream
pm2 restart webapp
pm2 delete webapp

# Limpieza
npm run clean-port           # Limpiar puerto 3000
```

## 📦 Estructura del Proyecto
```
webapp/
├── src/
│   ├── controllers/        # Controladores REST
│   │   ├── VivoController.ts
│   │   ├── BeneficiadoController.ts
│   │   └── CatalogoController.ts
│   ├── services/           # Lógica de negocio
│   │   ├── VivoService.ts
│   │   └── BeneficiadoService.ts
│   ├── repositories/       # Acceso a datos
│   │   ├── VivoRepository.ts
│   │   ├── BeneficiadoRepository.ts
│   │   └── CatalogoRepository.ts
│   ├── types/              # Tipos TypeScript
│   │   └── index.ts
│   ├── models/             # Modelos de dominio
│   ├── middleware/         # Middleware
│   ├── utils/              # Utilidades
│   └── index.tsx           # Aplicación Hono principal
├── migrations/
│   └── 0001_initial_schema.sql
├── public/
│   └── static/
├── .wrangler/              # Base de datos local D1
├── ecosystem.config.cjs    # Configuración PM2
├── wrangler.jsonc          # Configuración Cloudflare
├── vite.config.ts          # Configuración Vite
├── package.json
├── seed.sql
└── README.md
```

## 🔐 Estado del Despliegue

### Local Development
- **Estado**: ✅ Activo
- **URL**: https://3000-io76xoehoh5oiv2cq3g44-583b4d74.sandbox.novita.ai
- **Base de Datos**: SQLite local (.wrangler/state/v3/d1/)
- **Última Actualización**: 26/10/2025

### Producción (Cloudflare Pages)
- **Estado**: ❌ Pendiente
- **Requisito**: Configurar CLOUDFLARE_API_TOKEN

## 🚀 Próximos Pasos Recomendados

1. **Implementar parser de Excel/CSV** para carga masiva
2. **Función REPORTE** - Exportar a Excel con filtros aplicados
3. **Gráficos con Chart.js** para visualizar tendencias por proceso
4. **Búsqueda avanzada** con autocompletado
5. **Autenticación** para proteger datos
6. **Comparativas** entre procesos (Vivo vs Beneficiado)
7. **Notificaciones** de éxito/error más elegantes
8. **Paginación** para tablas con muchos registros
9. **Auditoría** de cambios (quién modificó qué)
10. **Desplegar a producción** en Cloudflare Pages

## 🤝 Compatibilidad con Spring Boot

La arquitectura por capas implementada es **100% compatible** con Spring Boot:

| Spring Boot | Esta App |
|-------------|----------|
| @RestController | Controllers (VivoController, etc.) |
| @Service | Services (VivoService, etc.) |
| @Repository | Repositories (VivoRepository, etc.) |
| @Entity | Types (Registro, Cliente, etc.) |
| JPA/Hibernate | D1 Database Queries |
| @RequestMapping | app.get(), app.post(), etc. |
| @Autowired | Constructor injection |
| application.properties | wrangler.jsonc |
| Flyway/Liquibase | Migrations directory |

## 📄 Licencia

Este proyecto es privado y confidencial.

---

**Última actualización**: 26 de octubre de 2025
**Versión**: 2.0.0 - Arquitectura por Capas
