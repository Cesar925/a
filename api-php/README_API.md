# API PHP para Sistema de Captura (phpMyAdmin/MySQL)

## 📋 Descripción

Backend PHP con endpoints REST para conectarse a base de datos MySQL local (phpMyAdmin). Esta API permite al frontend en Cloudflare conectarse a una base de datos MySQL local.

## 🏗️ Arquitectura

```
Frontend (Cloudflare)  ←→  API PHP (Local)  ←→  MySQL (phpMyAdmin)
```

## 📁 Estructura de Archivos

```
api-php/
├── config.php           # Configuración de base de datos
├── registros.php        # CRUD de registros
├── filtros.php          # Obtener opciones de filtros
├── estadisticas.php     # Estadísticas y reportes
├── importar.php         # Importación masiva
├── test.php             # Página de prueba
├── .htaccess            # Configuración Apache
└── README_API.md        # Este archivo
```

## ⚙️ Configuración Inicial

### 1. Editar `config.php`

Abrir el archivo `config.php` y configurar los datos de tu base de datos MySQL:

```php
define('DB_HOST', 'localhost');           // Servidor MySQL
define('DB_NAME', 'nombre_base_datos');   // Nombre de tu base de datos
define('DB_USER', 'root');                 // Usuario MySQL
define('DB_PASS', '');                     // Contraseña MySQL (vacío para XAMPP por defecto)
```

### 2. Importar Base de Datos

1. Abrir phpMyAdmin en tu navegador: `http://localhost/phpmyadmin`
2. Crear una nueva base de datos (Ej: `sistema_captura`)
3. Seleccionar la base de datos
4. Ir a la pestaña "Importar"
5. Seleccionar el archivo SQL con las tablas:
   - `captura_pantalla_vivo`
   - `captura_pantalla_beneficiado`
6. Hacer clic en "Continuar"

### 3. Instalar en Servidor Local

#### **Opción A: XAMPP (Recomendado para Windows)**

1. Descargar XAMPP desde: https://www.apachefriends.org/
2. Instalar XAMPP en `C:\xampp`
3. Copiar la carpeta `api-php` a `C:\xampp\htdocs\`
4. Iniciar Apache desde el Panel de Control de XAMPP
5. Verificar en: `http://localhost/api-php/test.php`

#### **Opción B: WAMP**

1. Descargar WAMP desde: http://www.wampserver.com/
2. Instalar WAMP
3. Copiar la carpeta `api-php` a `C:\wamp64\www\`
4. Iniciar servicios desde WAMP
5. Verificar en: `http://localhost/api-php/test.php`

#### **Opción C: MAMP (Mac)**

1. Descargar MAMP desde: https://www.mamp.info/
2. Instalar MAMP
3. Copiar la carpeta `api-php` a `/Applications/MAMP/htdocs/`
4. Iniciar servidores desde MAMP
5. Verificar en: `http://localhost:8888/api-php/test.php`

### 4. Verificar Instalación

Abrir en el navegador:
```
http://localhost/api-php/test.php
```

Deberías ver:
- ✓ Conexión exitosa a MySQL
- ✓ Tablas encontradas
- ✓ Conteo de registros

## 📡 Endpoints de la API

### **Base URL**
```
http://localhost/api-php/
```

### **1. Obtener Registros**

**GET** `/registros.php/vivo`
- Obtener todos los registros de vivo

**GET** `/registros.php/beneficiado`
- Obtener todos los registros de beneficiado

**Query Parameters (Filtros):**
```javascript
GET /registros.php/vivo?filters={"anio":2024,"mes":"Enero","provincia":"Arequipa"}
```

**Respuesta:**
```json
{
  "success": true,
  "count": 95,
  "data": [
    {
      "id": 1,
      "tipo_proc": "VIVO AREQUIPA",
      "ano": 2024,
      "mes": "Enero",
      "provincia": "Arequipa",
      "zona": "Zona 1",
      "nombre": "Cliente Ejemplo",
      "grs": 1500,
      "rp": 2.5,
      "renzo": 100,
      "fafo": 200,
      ...
    }
  ]
}
```

### **2. Crear Registro**

**POST** `/registros.php/vivo`

**Body (JSON):**
```json
{
  "tipo_proc": "VIVO AREQUIPA",
  "ano": 2024,
  "mes": "Enero",
  "provincia": "Arequipa",
  "zona": "Zona 1",
  "nombre": "Nuevo Cliente",
  "grs": 1500,
  "rp": 2.5,
  "renzo": 100,
  "fafo": 200
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Registro creado exitosamente",
  "id": 123
}
```

### **3. Actualizar Registro**

**PUT** `/registros.php/vivo/123`

**Body (JSON):**
```json
{
  "grs": 2000,
  "renzo": 150
}
```

### **4. Eliminar Registro**

**DELETE** `/registros.php/vivo/123`

### **5. Obtener Filtros**

**GET** `/filtros.php?tipo=vivo`

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "anios": [2024, 2023, 2022],
    "meses": ["Enero", "Febrero", "Marzo", ...],
    "tipos_proc": ["VIVO AREQUIPA", "VIVO PROVINCIAS"],
    "provincias": ["Arequipa", "Puno", "Cusco"],
    "zonas": ["Zona 1", "Zona 2", ...]
  }
}
```

### **6. Obtener Estadísticas**

**GET** `/estadisticas.php?tipo=vivo`

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total_registros": 419,
    "total_grs": 125000,
    "por_anio": [...],
    "por_mes": [...],
    "por_provincia": [...],
    "top_clientes": [...]
  }
}
```

### **7. Importar Desde Excel**

**POST** `/importar.php`

**Body (JSON):**
```json
{
  "tipo": "vivo",
  "registros": [
    {
      "tipo_proc": "VIVO AREQUIPA",
      "ano": 2024,
      "mes": "Enero",
      "nombre": "Cliente 1",
      "grs": 1500
    },
    {
      "tipo_proc": "VIVO AREQUIPA",
      "ano": 2024,
      "mes": "Febrero",
      "nombre": "Cliente 2",
      "grs": 2000
    }
  ]
}
```

## 🔧 Configuración CORS

La API ya incluye headers CORS configurados en `config.php` y `.htaccess`:

```php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

**⚠️ Para producción**, cambiar en `config.php`:
```php
define('CORS_ORIGIN', 'https://tu-dominio-cloudflare.pages.dev');
```

## 🐛 Solución de Problemas

### Error: "No se puede conectar a la base de datos"
- Verificar que MySQL esté corriendo (XAMPP/WAMP)
- Verificar credenciales en `config.php`
- Verificar que la base de datos exista

### Error: "Tabla no encontrada"
- Importar el dump SQL en phpMyAdmin
- Verificar nombres de tablas: `captura_pantalla_vivo` y `captura_pantalla_beneficiado`

### Error: "CORS blocked"
- Verificar que `.htaccess` esté en el directorio `api-php`
- Verificar que `mod_headers` y `mod_rewrite` estén habilitados en Apache

### Error: "404 Not Found" en endpoints
- Verificar que `mod_rewrite` esté habilitado
- Verificar archivo `.htaccess`
- Probar con URLs completas: `http://localhost/api-php/registros.php/vivo`

## 📊 Estructura de Tablas MySQL

### Tabla: `captura_pantalla_vivo`

```sql
CREATE TABLE `captura_pantalla_vivo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_proc` varchar(100) DEFAULT NULL,
  `ano` int(11) DEFAULT NULL,
  `mes` varchar(20) DEFAULT NULL,
  `provincia` varchar(100) DEFAULT NULL,
  `zona` varchar(100) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `grs` decimal(10,2) DEFAULT NULL,
  `rp` decimal(10,2) DEFAULT NULL,
  `renzo` decimal(10,2) DEFAULT NULL,
  `fafo` decimal(10,2) DEFAULT NULL,
  `santa_angela` decimal(10,2) DEFAULT NULL,
  `jorge_pan` decimal(10,2) DEFAULT NULL,
  `luis_calsin` decimal(10,2) DEFAULT NULL,
  `fredi_roque` decimal(10,2) DEFAULT NULL,
  `vidal_choque` decimal(10,2) DEFAULT NULL,
  `gregorio` decimal(10,2) DEFAULT NULL,
  `isaias` decimal(10,2) DEFAULT NULL,
  `juan_carlos` decimal(10,2) DEFAULT NULL,
  `pot_min` decimal(10,2) DEFAULT NULL,
  `pot_max` decimal(10,2) DEFAULT NULL,
  `cond_min` decimal(10,2) DEFAULT NULL,
  `cond_max` decimal(10,2) DEFAULT NULL,
  `unidad_compra` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Tabla: `captura_pantalla_beneficiado`

Similar a `vivo` pero incluye columnas adicionales:
- `santa_elena`
- `granjas_chicas`
- `avelino`
- `peladores`

## 🚀 Próximos Pasos

1. ✅ Instalar XAMPP/WAMP
2. ✅ Configurar `config.php`
3. ✅ Importar base de datos
4. ✅ Verificar con `test.php`
5. ⏳ Configurar frontend para usar esta API
6. ⏳ Probar conexión completa

## 📞 Soporte

Si tienes problemas, verifica primero `test.php`:
```
http://localhost/api-php/test.php
```

Este script mostrará información detallada sobre:
- Versión de PHP
- Conexión a MySQL
- Tablas disponibles
- Extensiones PHP
