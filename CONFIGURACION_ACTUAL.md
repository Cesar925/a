# 📋 Configuración Actual del Sistema

## ✅ Estado del Sistema

**Fecha**: 27 de Octubre, 2025  
**Versión**: 1.5.0  
**Estado**: ✅ Funcionando correctamente

---

## 🗄️ Base de Datos MySQL

### **Configuración de Conexión**

```
Host:       localhost
Puerto:     3306 (por defecto)
Base Datos: vivo
Usuario:    root
Contraseña: basia
```

### **Tablas Disponibles**

1. **captura_pantalla_vivo**
   - Campos: id, tipo_proc, ano, mes, provincia, zona, nombre, grs, rp, renzo, fafo, santa_angela, jorge_pan, y más...
   - Registros: Ver en phpMyAdmin

2. **captura_pantalla_beneficiado**
   - Campos: Similar a vivo + campos adicionales (santa_elena, granjas_chicas, avelino, peladores)
   - Registros: Ver en phpMyAdmin

---

## 🔧 Configuración de la API PHP

### **Ubicación de Archivos**

```
C:\xampp\htdocs\api-php\
├── config.php              # Configuración de DB
├── registros.php           # CRUD endpoints
├── filtros.php             # Filtros
├── estadisticas.php        # Estadísticas
├── importar.php            # Importación masiva
├── test.php                # Página de diagnóstico
└── ...
```

### **Archivo config.php**

```php
define('DB_HOST', 'localhost');
define('DB_NAME', 'vivo');
define('DB_USER', 'root');
define('DB_PASS', 'basia');
define('DB_CHARSET', 'utf8mb4');
```

### **URLs de la API**

- **Test/Diagnóstico**: http://localhost/api-php/test.php
- **Registros Vivo**: http://localhost/api-php/registros.php/vivo
- **Registros Beneficiado**: http://localhost/api-php/registros.php/beneficiado
- **Filtros**: http://localhost/api-php/filtros.php?tipo=vivo
- **Estadísticas**: http://localhost/api-php/estadisticas.php?tipo=vivo

---

## 🎨 Configuración del Frontend

### **Ubicación del Proyecto**

```
C:\Users\Cesar\Documents\GREANS\a\
```

### **Configuración API**

**Archivo**: `public/static/api-config.js`

```javascript
const API_CONFIG = {
  baseURL: 'http://localhost/api-php',
  mode: 'php-api',  // Modo activo
  timeout: 30000
};
```

### **URLs del Frontend**

- **Local Development**: http://localhost:8080
- **Producción**: (Pendiente de despliegue)

---

## 🚀 Comandos de Ejecución

### **Instalación Inicial (Una vez)**

```bash
cd C:\Users\Cesar\Documents\GREANS\a

# Opción 1: Instalador automático
instalar.bat

# Opción 2: Manual
npm install
npm run build
```

### **Configurar API PHP (Una vez)**

```bash
# Opción 1: Automático
INSTALAR_API_PHP.bat
CONFIGURAR_API.bat

# Opción 2: Manual
# Copiar api-php a C:\xampp\htdocs\
# Editar config.php con credenciales
```

### **Ejecutar Sistema**

```bash
cd C:\Users\Cesar\Documents\GREANS\a

# Iniciar frontend
npx wrangler pages dev dist --port 8080

# O usar el script
ejecutar.bat
```

---

## 🔍 Verificación del Sistema

### **1. Verificar Base de Datos**

- Abrir: http://localhost/phpmyadmin
- Verificar base de datos `vivo` existe
- Verificar tablas tienen datos

### **2. Verificar API PHP**

- Abrir: http://localhost/api-php/test.php
- Debe mostrar:
  - ✅ Conexión exitosa a MySQL
  - ✅ Tablas encontradas
  - Conteo de registros

### **3. Verificar Frontend**

- Abrir: http://localhost:8080
- Presionar F12 → Console
- Debe mostrar:
  ```
  ✅ API Config cargado - Modo: php-api
  ✅ API Adapter cargado
  ✅ Conexión exitosa con API PHP
  ```
- Seleccionar proceso (Vivo Arequipa)
- Datos deben cargar desde MySQL

---

## 📊 Flujo de Datos

```
┌─────────────────────────┐
│  Frontend (Navegador)   │
│  http://localhost:8080  │
└──────────┬──────────────┘
           │
           │ HTTP/JSON
           ▼
┌─────────────────────────┐
│  API PHP (Apache)       │
│  http://localhost/      │
│  api-php/               │
└──────────┬──────────────┘
           │
           │ SQL Queries
           ▼
┌─────────────────────────┐
│  MySQL Database         │
│  Database: vivo         │
│  User: root             │
└─────────────────────────┘
```

---

## 🔐 Seguridad

### **⚠️ IMPORTANTE - Para Producción**

1. **Cambiar contraseña de MySQL**:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'contraseña_segura';
   ```

2. **Actualizar config.php**:
   ```php
   define('DB_PASS', 'contraseña_segura');
   ```

3. **Configurar CORS específico**:
   ```php
   define('CORS_ORIGIN', 'https://tu-dominio.com');
   ```

4. **Deshabilitar errores en producción**:
   ```php
   ini_set('display_errors', 0);
   ```

---

## 📁 Estructura de Archivos Completa

```
C:\Users\Cesar\Documents\GREANS\a\
├── api-php/                      # Backend PHP
│   ├── config.php                # ← Configuración DB (vivo/root/basia)
│   ├── registros.php
│   ├── filtros.php
│   ├── estadisticas.php
│   ├── importar.php
│   ├── test.php
│   └── ...
│
├── public/static/
│   ├── api-config.js             # ← Configuración frontend (mode: php-api)
│   └── api-adapter.js
│
├── src/
│   └── index.tsx
│
├── instalar.bat                  # Script de instalación
├── ejecutar.bat                  # Script de ejecución
├── INSTALAR_API_PHP.bat          # Instalar API en XAMPP
├── CONFIGURAR_API.bat            # Configurar conexión DB
│
└── README.md                     # Documentación
```

---

## 🐛 Troubleshooting

### **Problema: "Error al cargar datos"**

1. Verificar que Apache y MySQL estén corriendo
2. Probar: http://localhost/api-php/test.php
3. Verificar credenciales en `config.php`

### **Problema: "CORS blocked"**

1. Verificar `.htaccess` en `C:\xampp\htdocs\api-php\`
2. Reiniciar Apache

### **Problema: "Cannot connect to database"**

1. Verificar MySQL esté corriendo
2. Verificar credenciales:
   - Base de datos: `vivo`
   - Usuario: `root`
   - Contraseña: `basia`
3. Probar conexión en phpMyAdmin

---

## 📞 Repositorio GitHub

- **URL**: https://github.com/Cesar925/a
- **Usuario**: Cesar925
- **Rama**: main

### **Clonar en otro PC**

```bash
git clone https://github.com/Cesar925/a.git
cd a
npm install
npm run build
```

---

## ✅ Checklist de Funcionamiento

- [x] XAMPP instalado y corriendo
- [x] MySQL con base de datos `vivo`
- [x] Tablas `captura_pantalla_vivo` y `captura_pantalla_beneficiado`
- [x] API PHP en `C:\xampp\htdocs\api-php\`
- [x] `config.php` configurado con credenciales correctas
- [x] http://localhost/api-php/test.php funciona
- [x] Frontend en `C:\Users\Cesar\Documents\GREANS\a\`
- [x] `api-config.js` con `mode: 'php-api'`
- [x] http://localhost:8080 funciona
- [x] Datos cargan desde MySQL correctamente

---

**Sistema completamente operativo** ✅

**Última actualización**: 27 de Octubre, 2025
