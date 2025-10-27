# 🚀 Guía Completa: Conectar Frontend a MySQL/phpMyAdmin

## 📋 Resumen

Esta guía te permitirá conectar el frontend del sistema (Cloudflare) con una base de datos MySQL local usando phpMyAdmin.

**Arquitectura:**
```
Frontend (Navegador) → API PHP (localhost) → MySQL (phpMyAdmin)
```

---

## 📦 Requisitos Previos

### 1. **Software Necesario**

- ✅ Windows 10/11
- ✅ XAMPP o WAMP (incluye Apache, MySQL y PHP)

### 2. **Descargar XAMPP (Recomendado)**

1. Ir a: https://www.apachefriends.org/
2. Descargar XAMPP para Windows
3. Instalar en `C:\xampp`
4. **IMPORTANTE**: Durante la instalación, asegurarse de instalar:
   - ✅ Apache
   - ✅ MySQL
   - ✅ PHP
   - ✅ phpMyAdmin

---

## 🔧 Instalación Paso a Paso

### **PASO 1: Instalar y Configurar XAMPP**

1. **Abrir XAMPP Control Panel** (como Administrador)
2. **Iniciar servicios**:
   - Click en "Start" para **Apache**
   - Click en "Start" para **MySQL**
3. Verificar que ambos muestren fondo verde

![XAMPP Panel](https://i.imgur.com/xampp-example.png)

---

### **PASO 2: Crear Base de Datos**

1. **Abrir phpMyAdmin**:
   ```
   http://localhost/phpmyadmin
   ```

2. **Crear nueva base de datos**:
   - Click en "Nueva" (New)
   - Nombre: `sistema_captura`
   - Cotejamiento: `utf8mb4_general_ci`
   - Click en "Crear"

3. **Importar tablas**:
   - Seleccionar la base de datos `sistema_captura`
   - Click en pestaña "Importar"
   - Click en "Seleccionar archivo"
   - Buscar el archivo SQL con las tablas:
     - `captura_pantalla_vivo`
     - `captura_pantalla_beneficiado`
   - Click en "Continuar"
   
4. **Verificar importación**:
   - Deberías ver 2 tablas en el panel izquierdo
   - Click en cada tabla y verificar que tengan datos

---

### **PASO 3: Instalar API PHP**

**Opción A: Instalación Automática (Recomendado)**

1. Abrir carpeta del proyecto `webapp`
2. Hacer doble clic en: `INSTALAR_API_PHP.bat`
3. El script automáticamente:
   - Detecta XAMPP/WAMP
   - Copia archivos a `htdocs/api-php`
   - Muestra instrucciones

**Opción B: Instalación Manual**

1. Copiar toda la carpeta `api-php` del proyecto
2. Pegarla en:
   - XAMPP: `C:\xampp\htdocs\api-php`
   - WAMP: `C:\wamp64\www\api-php`

---

### **PASO 4: Configurar Conexión a Base de Datos**

**Opción A: Configuración Automática**

1. Hacer doble clic en: `CONFIGURAR_API.bat`
2. Ingresar datos:
   ```
   Host: localhost
   Base de datos: sistema_captura
   Usuario: root
   Contraseña: (dejar vacío)
   ```
3. Confirmar con "S"

**Opción B: Configuración Manual**

1. Abrir en editor de texto:
   ```
   C:\xampp\htdocs\api-php\config.php
   ```

2. Modificar estas líneas:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'sistema_captura');  // Tu base de datos
   define('DB_USER', 'root');
   define('DB_PASS', '');  // Sin contraseña en XAMPP por defecto
   ```

3. Guardar archivo

---

### **PASO 5: Probar la API**

1. **Abrir en navegador**:
   ```
   http://localhost/api-php/test.php
   ```

2. **Verificar que muestre**:
   - ✅ Conexión exitosa a MySQL
   - ✅ Tabla 'captura_pantalla_vivo' encontrada
   - ✅ Tabla 'captura_pantalla_beneficiado' encontrada
   - ✅ Conteo de registros

3. **Si hay errores**:
   - Verificar que Apache y MySQL estén corriendo
   - Verificar que la base de datos exista
   - Verificar credenciales en `config.php`

---

### **PASO 6: Configurar Frontend**

1. **Abrir en editor**:
   ```
   webapp\public\static\api-config.js
   ```

2. **Modificar la URL base**:
   ```javascript
   const API_CONFIG = {
     // Cambiar según tu configuración
     baseURL: 'http://localhost/api-php',  // XAMPP
     // O para WAMP en puerto 8080:
     // baseURL: 'http://localhost:8080/api-php',
     
     mode: 'php-api',  // IMPORTANTE: Debe ser 'php-api'
   };
   ```

3. **Guardar archivo**

---

### **PASO 7: Ejecutar el Frontend**

1. **Abrir CMD en carpeta del proyecto**:
   ```cmd
   cd C:\ruta\a\webapp
   ```

2. **Construir el proyecto**:
   ```cmd
   npm run build
   ```

3. **Iniciar el servidor** (elegir uno):
   
   **Opción A: Con Wrangler (Recomendado)**
   ```cmd
   ejecutar.bat
   ```
   
   **Opción B: Con PM2**
   ```cmd
   npm run dev:sandbox
   ```

4. **Abrir en navegador**:
   ```
   http://localhost:8080
   ```

---

### **PASO 8: Verificar Conexión Completa**

1. **Abrir consola del navegador** (F12)
2. **Buscar mensajes**:
   ```
   ✅ API Config cargado - Modo: php-api
   ✅ API Adapter cargado
   🔄 Probando conexión con API PHP...
   ✅ Conexión exitosa con API PHP
   ```

3. **Probar funcionalidad**:
   - Seleccionar proceso (Vivo Arequipa)
   - Aplicar filtros
   - Ver que carguen datos de MySQL
   - Crear nuevo registro
   - Modificar registro
   - Eliminar registro

---

## 🔍 Endpoints Disponibles

Una vez configurado, tu API PHP responde a:

### **Registros**
```
GET    http://localhost/api-php/registros.php/vivo
GET    http://localhost/api-php/registros.php/beneficiado
POST   http://localhost/api-php/registros.php/vivo
PUT    http://localhost/api-php/registros.php/vivo/123
DELETE http://localhost/api-php/registros.php/vivo/123
```

### **Filtros**
```
GET http://localhost/api-php/filtros.php?tipo=vivo
GET http://localhost/api-php/filtros.php?tipo=beneficiado
```

### **Estadísticas**
```
GET http://localhost/api-php/estadisticas.php?tipo=vivo
GET http://localhost/api-php/estadisticas.php?tipo=beneficiado
```

### **Importar**
```
POST http://localhost/api-php/importar.php
```

---

## 🐛 Solución de Problemas

### **Problema 1: Apache no inicia**

**Error**: "Port 80 in use by..."

**Solución**:
1. Abrir XAMPP Config para Apache
2. Cambiar puerto de 80 a 8080
3. En `api-config.js` cambiar URL a:
   ```javascript
   baseURL: 'http://localhost:8080/api-php'
   ```

---

### **Problema 2: "No se puede conectar a la base de datos"**

**Solución**:
1. Verificar que MySQL esté corriendo (verde en XAMPP)
2. Abrir phpMyAdmin y verificar que la base de datos exista
3. Verificar credenciales en `config.php`:
   ```php
   define('DB_NAME', 'sistema_captura'); // Nombre correcto
   define('DB_USER', 'root');
   define('DB_PASS', ''); // Vacío para XAMPP
   ```

---

### **Problema 3: "Tabla no encontrada"**

**Solución**:
1. Abrir phpMyAdmin
2. Verificar que existan las tablas:
   - `captura_pantalla_vivo`
   - `captura_pantalla_beneficiado`
3. Si no existen, importar el SQL nuevamente

---

### **Problema 4: CORS Error en navegador**

**Error**: "Access to XMLHttpRequest blocked by CORS policy"

**Solución**:
1. Verificar archivo `.htaccess` en `api-php/`:
   ```apache
   Header set Access-Control-Allow-Origin "*"
   ```
2. Reiniciar Apache desde XAMPP

---

### **Problema 5: Frontend no se conecta a API**

**Solución**:
1. Abrir consola del navegador (F12)
2. Verificar mensajes de error
3. Verificar en `api-config.js`:
   ```javascript
   mode: 'php-api'  // Debe ser exactamente esto
   ```
4. Limpiar caché del navegador (Ctrl+Shift+Delete)
5. Recargar página (F5)

---

### **Problema 6: "404 Not Found" en endpoints**

**Solución**:
1. Verificar que `mod_rewrite` esté habilitado en Apache
2. En XAMPP Config → Apache → httpd.conf
3. Buscar y descomentar (quitar #):
   ```apache
   LoadModule rewrite_module modules/mod_rewrite.so
   ```
4. Reiniciar Apache

---

## 📊 Verificar Configuración Actual

### **Test Manual de API**

Probar cada endpoint en el navegador:

1. **Test de conexión**:
   ```
   http://localhost/api-php/test.php
   ```

2. **Obtener registros vivo**:
   ```
   http://localhost/api-php/registros.php/vivo
   ```

3. **Obtener filtros**:
   ```
   http://localhost/api-php/filtros.php?tipo=vivo
   ```

4. **Obtener estadísticas**:
   ```
   http://localhost/api-php/estadisticas.php?tipo=vivo
   ```

Todos deberían devolver JSON válido.

---

## 📁 Estructura Final de Archivos

```
C:\xampp\
├── htdocs\
│   └── api-php\
│       ├── config.php          ← Configuración de DB
│       ├── registros.php       ← CRUD endpoints
│       ├── filtros.php         ← Filtros
│       ├── estadisticas.php    ← Estadísticas
│       ├── importar.php        ← Importación
│       ├── test.php            ← Página de prueba
│       ├── .htaccess           ← Config Apache
│       └── README_API.md       ← Documentación

webapp\
├── api-php\                    ← Código fuente
├── public\
│   └── static\
│       ├── api-config.js       ← Config frontend
│       └── api-adapter.js      ← Adapter
├── INSTALAR_API_PHP.bat        ← Instalador automático
├── CONFIGURAR_API.bat          ← Configurador automático
└── GUIA_INSTALACION_PHP_API.md ← Esta guía
```

---

## ✅ Checklist Final

Antes de usar el sistema, verificar:

- [ ] XAMPP instalado y corriendo (Apache + MySQL verde)
- [ ] Base de datos `sistema_captura` creada
- [ ] Tablas importadas (vivo y beneficiado)
- [ ] Carpeta `api-php` copiada a `htdocs`
- [ ] `config.php` configurado con credenciales correctas
- [ ] `test.php` muestra conexión exitosa
- [ ] `api-config.js` con `mode: 'php-api'`
- [ ] Frontend construido (`npm run build`)
- [ ] Frontend corriendo en `localhost:8080`
- [ ] Consola del navegador muestra conexión exitosa
- [ ] Datos cargan correctamente en la tabla

---

## 🎯 Próximos Pasos

Una vez todo funcionando:

1. ✅ **Probar CRUD completo**:
   - Crear registros
   - Modificar registros
   - Eliminar registros
   - Aplicar filtros

2. ✅ **Probar importación Excel**:
   - Importar archivo Excel
   - Verificar que los datos lleguen a MySQL
   - Revisar en phpMyAdmin

3. ✅ **Configurar para producción**:
   - Cambiar `CORS_ORIGIN` en `config.php` a URL específica
   - Deshabilitar `display_errors` en producción
   - Configurar backups automáticos de MySQL

---

## 📞 Soporte

Si después de seguir todos los pasos aún tienes problemas:

1. **Revisar logs de Apache**:
   ```
   C:\xampp\apache\logs\error.log
   ```

2. **Revisar logs de PHP**:
   ```
   C:\xampp\php\logs\php_error_log
   ```

3. **Revisar consola del navegador** (F12) para errores JavaScript

4. **Probar con Postman o similar** para descartar problemas del frontend

---

## 🎉 ¡Listo!

Si llegaste hasta aquí y todo funciona correctamente:

- ✅ Tienes una API PHP funcionando
- ✅ Conectada a MySQL local
- ✅ Frontend comunicándose con la API
- ✅ Datos fluyendo correctamente

**¡Felicidades! El sistema está completamente integrado.**
