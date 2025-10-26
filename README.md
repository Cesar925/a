# Sistema de Gestión - Arequipa

## 📋 Descripción del Proyecto

Sistema web minimalista e intuitivo para la gestión de datos de ventas y potencial de clientes en Arequipa. Compatible con Spring Boot conceptualmente, implementado con Hono + TypeScript y desplegable en Cloudflare Pages.

### 🎯 Objetivos
- Gestionar datos de procesos de venta (Arequipa Vivo, Provincia Vivo, Beneficiados)
- Administrar clientes, provincias, zonas y compras GRS
- Visualizar estadísticas y resúmenes de datos
- Cargar datos desde archivos Excel/CSV
- Interfaz minimalista e intuitiva

## 🌐 URLs de Acceso

### Desarrollo Local (Sandbox)
- **Aplicación Web**: https://3000-io76xoehoh5oiv2cq3g44-583b4d74.sandbox.novita.ai
- **API Base**: https://3000-io76xoehoh5oiv2cq3g44-583b4d74.sandbox.novita.ai/api

### Endpoints API Disponibles
- `GET /api/procesos` - Obtener todos los procesos
- `GET /api/provincias` - Obtener todas las provincias
- `GET /api/zonas` - Obtener todas las zonas
- `GET /api/zonas/:provincia_id` - Obtener zonas por provincia
- `GET /api/tipos-cliente` - Obtener tipos de cliente
- `GET /api/compras-grs` - Obtener compras GRS
- `GET /api/clientes` - Obtener todos los clientes
- `POST /api/clientes` - Crear nuevo cliente
- `GET /api/registros?proceso_id=&anio=&mes=` - Obtener registros filtrados
- `POST /api/registros` - Crear nuevo registro
- `GET /api/estadisticas?proceso_id=&anio=` - Obtener estadísticas
- `POST /api/upload` - Cargar datos masivos

## 🗄️ Arquitectura de Datos

### Modelos Principales

1. **Procesos**
   - Arequipa Vivo
   - Provincia Vivo
   - Arequipa Beneficiado
   - Provincia Beneficiado

2. **Provincias**
   - Arequipa, Camaná, Castilla, Caylloma, Condesuyos, Islay, La Unión, Caravelí

3. **Tipos de Cliente**
   - SI (Distribuidores)
   - NO (Mayoristas)
   - MD (Mercado)

4. **Compras GRS**
   - GRS, RP, Renzo, Fafio, Santa Elena, Granjas chicas, Rosario, San Fernando Lima, Avícola Renzo

5. **Clientes/Beneficiarios**
   - Renzo, Avelino, Mercedes, Avicru, Rafael, Matilde, Avirox, Julia, Simón, Dante, Gabriel, Arturo, Nicolás, Luis Flores, Mirella, Santa Angela, Jorge Pan, Miriam G., Vasquez, San Joaquín

6. **Registros**
   - Datos de ventas por proceso, cliente, año, mes
   - Cantidades GRS, RP
   - Potenciales mínimo y máximo
   - Observaciones

### Servicios de Almacenamiento
- **Cloudflare D1 (SQLite)**: Base de datos relacional principal
- **Local Development**: SQLite local en `.wrangler/state/v3/d1/`

### Flujo de Datos
1. Usuario carga datos desde Excel o ingresa manualmente
2. Datos se validan y almacenan en D1
3. API REST proporciona acceso a datos filtrados
4. Frontend visualiza estadísticas y registros en tiempo real

## 💻 Stack Tecnológico

- **Backend**: Hono v4 (framework web ultrarrápido)
- **Base de Datos**: Cloudflare D1 (SQLite distribuido)
- **Frontend**: HTML5 + TailwindCSS + Axios
- **Runtime**: Cloudflare Workers
- **Build**: Vite
- **Deployment**: Cloudflare Pages

## 🚀 Características Implementadas

### ✅ Completadas
- [x] Base de datos D1 con 8 tablas relacionales
- [x] Migraciones y datos semilla
- [x] API REST completa (10+ endpoints)
- [x] Dashboard con estadísticas en tiempo real
- [x] Visualización de registros con filtros
- [x] Formularios para agregar clientes y registros
- [x] Interfaz minimalista con Tailwind CSS
- [x] Gestión de catálogos (procesos, provincias, zonas, tipos de cliente)
- [x] Filtros por proceso, año y mes
- [x] Estadísticas agregadas (total registros, GRS, RP, promedios)

### 🔄 En Desarrollo
- [ ] Parser de archivos Excel/CSV para carga masiva
- [ ] Edición y eliminación de registros
- [ ] Exportación de datos a Excel
- [ ] Gráficos y visualizaciones avanzadas
- [ ] Búsqueda avanzada de clientes
- [ ] Autenticación y autorización

## 📖 Guía de Uso

### 1. Dashboard
Al acceder a la aplicación, verás un resumen general con:
- Total de registros
- Total GRS acumulado
- Total RP acumulado
- Promedio de GRS

Puedes filtrar por proceso y año para ver estadísticas específicas.

### 2. Visualizar Datos
Haz clic en "Datos" para ver todos los registros en una tabla.
- Filtra por proceso, año y mes
- Visualiza información detallada de cada registro

### 3. Agregar Registros
1. En la sección "Datos", haz clic en "Nuevo Registro"
2. Completa el formulario con:
   - Proceso (Arequipa Vivo, Provincia Vivo, etc.)
   - Cliente
   - Año y mes
   - Provincia y zona (opcional)
   - Cantidades GRS y RP
   - Potenciales mínimo y máximo
   - Observaciones
3. Haz clic en "Guardar"

### 4. Agregar Clientes
1. Ve a la sección "Cargar"
2. Haz clic en "Agregar Cliente"
3. Completa:
   - Nombre del cliente
   - Tipo de cliente
   - Provincia
4. Haz clic en "Guardar"

### 5. Cargar Datos Masivos
*(En desarrollo)* Podrás arrastrar archivos Excel o CSV para cargar múltiples registros a la vez.

## 🛠️ Desarrollo Local

### Requisitos Previos
- Node.js 18+
- npm o yarn
- Wrangler CLI

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
# Desarrollo con Vite
npm run dev

# Desarrollo con Wrangler (sandbox)
npm run dev:sandbox

# Construir proyecto
npm run build

# Iniciar con PM2 (sandbox)
pm2 start ecosystem.config.cjs

# Limpiar puerto 3000
npm run clean-port

# Migraciones
npm run db:migrate:local     # Aplicar migraciones localmente
npm run db:migrate:prod      # Aplicar migraciones en producción
npm run db:seed              # Cargar datos semilla
npm run db:reset             # Resetear base de datos local

# Despliegue
npm run deploy               # Desplegar a Cloudflare Pages
npm run deploy:prod          # Desplegar a producción con nombre de proyecto
```

## 📦 Estructura del Proyecto
```
webapp/
├── src/
│   ├── index.tsx           # Aplicación Hono principal
│   └── renderer.tsx        # Renderizador JSX
├── migrations/
│   └── 0001_initial_schema.sql  # Schema de base de datos
├── public/
│   └── static/             # Archivos estáticos
├── .wrangler/              # Base de datos local D1
├── ecosystem.config.cjs    # Configuración PM2
├── wrangler.jsonc          # Configuración Cloudflare
├── vite.config.ts          # Configuración Vite
├── package.json            # Dependencias y scripts
├── seed.sql                # Datos iniciales
└── README.md               # Documentación
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
- **Comando**: `npm run deploy:prod`

## 🚀 Próximos Pasos Recomendados

1. **Implementar parser de Excel/CSV** para carga masiva de datos desde el archivo proporcionado
2. **Agregar edición de registros** con modal similar al de creación
3. **Implementar exportación a Excel** de registros filtrados
4. **Agregar gráficos** con Chart.js para visualizar tendencias
5. **Mejorar validaciones** en formularios
6. **Implementar búsqueda de clientes** con autocompletado
7. **Agregar autenticación** para proteger datos sensibles
8. **Optimizar queries** con índices adicionales
9. **Crear vista de comparación** entre Arequipa Vivo vs Provincia Vivo
10. **Desplegar a producción** en Cloudflare Pages

## 📝 Notas Técnicas

- La aplicación usa Cloudflare D1 (SQLite) para almacenamiento persistente
- Todas las rutas API están bajo `/api/*`
- El frontend está en línea con el backend (sin separación de proyectos)
- Compatible conceptualmente con Spring Boot (arquitectura REST similar)
- Diseñado para ser ligero y rápido en Cloudflare Edge Network

## 🤝 Compatibilidad con Spring Boot

Aunque implementado con Hono/TypeScript, la arquitectura es compatible con Spring Boot:
- **REST API**: Mismos principios de endpoints RESTful
- **Base de datos relacional**: Similar a JPA/Hibernate con entidades
- **Inyección de dependencias**: Bindings de Cloudflare = @Autowired
- **Migraciones**: Similar a Flyway/Liquibase
- **Configuración**: wrangler.jsonc = application.properties

## 📄 Licencia

Este proyecto es privado y confidencial.

---

**Última actualización**: 26 de octubre de 2025
