# 🧪 Prueba Rápida de la API PHP

## ⚡ Test en 5 Minutos

Esta guía te permite verificar que la API PHP está funcionando correctamente.

---

## ✅ Pre-requisitos

Antes de empezar, asegúrate de tener:

- [x] XAMPP/WAMP instalado y corriendo
- [x] Apache (verde) y MySQL (verde) activos
- [x] Carpeta `api-php` copiada a `htdocs`
- [x] Base de datos `sistema_captura` creada
- [x] Tablas importadas desde SQL
- [x] `config.php` configurado

Si falta algo, ejecuta: `INSTALAR_API_PHP.bat` y `CONFIGURAR_API.bat`

---

## 🔍 Test 1: Página de Diagnóstico

**Qué hace**: Verifica conexión a MySQL y existencia de tablas

**Cómo**:
1. Abrir navegador
2. Ir a: http://localhost/api-php/test.php

**Resultado esperado**:
```
✓ Conexión exitosa a MySQL
✓ Tabla 'captura_pantalla_vivo' encontrada
✓ Tabla 'captura_pantalla_beneficiado' encontrada
Registros en tabla vivo: X
Registros en tabla beneficiado: Y
```

**Si falla**:
- Verificar que MySQL esté corriendo (XAMPP panel)
- Revisar credenciales en `config.php`
- Verificar que la base de datos `sistema_captura` exista

---

## 🔍 Test 2: Endpoint de Registros Vivo

**Qué hace**: Obtiene todos los registros de vivo

**Cómo**:
1. Abrir navegador
2. Ir a: http://localhost/api-php/registros.php/vivo

**Resultado esperado** (JSON):
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
      "nombre": "Cliente 1",
      "grs": 1500.00,
      ...
    }
  ]
}
```

**Si falla**:
- Error 404: Verificar que `.htaccess` esté en `api-php/`
- Error 500: Revisar logs de PHP en `C:\xampp\php\logs\php_error_log`
- JSON vacío: Revisar que haya datos en la tabla

---

## 🔍 Test 3: Endpoint de Filtros

**Qué hace**: Obtiene opciones de filtros disponibles

**Cómo**:
1. Abrir navegador
2. Ir a: http://localhost/api-php/filtros.php?tipo=vivo

**Resultado esperado** (JSON):
```json
{
  "success": true,
  "data": {
    "anios": [2024, 2023],
    "meses": ["Enero", "Febrero", "Marzo", ...],
    "tipos_proc": ["VIVO AREQUIPA", "VIVO PROVINCIAS"],
    "provincias": ["Arequipa", "Puno", "Cusco"],
    "zonas": ["Zona 1", "Zona 2", ...]
  }
}
```

---

## 🔍 Test 4: Endpoint de Estadísticas

**Qué hace**: Calcula estadísticas de los datos

**Cómo**:
1. Abrir navegador
2. Ir a: http://localhost/api-php/estadisticas.php?tipo=vivo

**Resultado esperado** (JSON):
```json
{
  "success": true,
  "data": {
    "total_registros": 419,
    "total_grs": 125000.00,
    "por_anio": [...],
    "por_mes": [...],
    "por_provincia": [...],
    "top_clientes": [...]
  }
}
```

---

## 🔍 Test 5: Frontend con Consola

**Qué hace**: Verifica que el frontend se conecte a la API

**Cómo**:
1. Asegurarse que en `public/static/api-config.js`:
   ```javascript
   mode: 'php-api',
   baseURL: 'http://localhost/api-php'
   ```

2. Construir frontend:
   ```bash
   npm run build
   ```

3. Ejecutar frontend:
   ```bash
   ejecutar.bat
   ```

4. Abrir: http://localhost:8080

5. Abrir consola del navegador (F12) → Tab "Console"

**Resultado esperado en consola**:
```
✅ API Config cargado - Modo: php-api
✅ API Adapter cargado
🔄 Probando conexión con API PHP...
📡 URL Base: http://localhost/api-php
✅ Conexión exitosa con API PHP
```

**Si falla**:
- ❌ "Error de conexión": Verificar que Apache esté corriendo
- ❌ "CORS blocked": Verificar `.htaccess` en `api-php/`
- ❌ "404 Not Found": Verificar URL en `api-config.js`

---

## 🔍 Test 6: Funcionalidad Completa

**Qué hace**: Prueba CRUD completo desde el frontend

**Cómo**:
1. Con el frontend abierto (http://localhost:8080)
2. Seleccionar proceso: "Vivo Arequipa"
3. Aplicar filtros (Año 2024, Mes Enero)
4. Verificar que aparezcan datos en la tabla

**Probar CRUD**:

### ✅ CREATE (Crear)
1. Click en botón "NUEVO"
2. Llenar formulario:
   - Cliente: "Prueba API"
   - Año: 2024
   - Mes: Enero
   - GRS: 1000
   - RP: 2.5
3. Click en "Guardar"
4. Verificar que aparezca en la tabla
5. **Validar en phpMyAdmin**:
   - Ir a http://localhost/phpmyadmin
   - Abrir `sistema_captura` → `captura_pantalla_vivo`
   - Verificar que exista el registro "Prueba API"

### ✅ UPDATE (Modificar)
1. Click en la fila "Prueba API" (seleccionar)
2. Click en botón "MODIFICA"
3. Cambiar GRS a 1500
4. Click en "Guardar"
5. Verificar cambio en la tabla
6. **Validar en phpMyAdmin**: Ver que GRS = 1500

### ✅ DELETE (Eliminar)
1. Click en la fila "Prueba API" (seleccionar)
2. Click en botón "ELIMINA"
3. Confirmar eliminación
4. Verificar que desaparezca de la tabla
5. **Validar en phpMyAdmin**: Registro debe estar eliminado

---

## 🎯 Checklist de Pruebas

Marca cada test completado:

- [ ] Test 1: Página de diagnóstico (test.php) ✅
- [ ] Test 2: Endpoint registros.php/vivo ✅
- [ ] Test 3: Endpoint filtros.php ✅
- [ ] Test 4: Endpoint estadisticas.php ✅
- [ ] Test 5: Frontend + Consola (sin errores) ✅
- [ ] Test 6a: CREATE - Crear registro ✅
- [ ] Test 6b: UPDATE - Modificar registro ✅
- [ ] Test 6c: DELETE - Eliminar registro ✅

---

## 🐛 Troubleshooting Rápido

### Problema: Apache no inicia
```
Puerto 80 ocupado
```
**Solución**:
1. Cerrar Skype, IIS, otros servicios web
2. O cambiar puerto Apache de 80 a 8080
3. Actualizar URL en `api-config.js` a `http://localhost:8080/api-php`

---

### Problema: MySQL no inicia
```
Puerto 3306 ocupado
```
**Solución**:
1. Cerrar otros MySQL/MariaDB
2. Reiniciar XAMPP
3. Si persiste, cambiar puerto en XAMPP config

---

### Problema: "Cannot connect to database"
```
Error en config.php
```
**Solución**:
1. Abrir `C:\xampp\htdocs\api-php\config.php`
2. Verificar:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'sistema_captura'); // ← Nombre correcto?
   define('DB_USER', 'root');
   define('DB_PASS', ''); // ← Vacío para XAMPP
   ```
3. Guardar y refrescar test.php

---

### Problema: "Table not found"
```
Tablas no existen
```
**Solución**:
1. Abrir phpMyAdmin
2. Verificar que `sistema_captura` tenga las tablas:
   - `captura_pantalla_vivo`
   - `captura_pantalla_beneficiado`
3. Si no existen, importar `api-php/estructura_tablas.sql`

---

### Problema: CORS Error en navegador
```
Access blocked by CORS policy
```
**Solución**:
1. Verificar que `api-php/.htaccess` exista
2. Reiniciar Apache desde XAMPP
3. Limpiar caché del navegador (Ctrl+Shift+Delete)

---

### Problema: Frontend no carga datos
```
Tabla vacía pero API funciona
```
**Solución**:
1. Abrir consola del navegador (F12)
2. Verificar errores en rojo
3. Verificar en `api-config.js`:
   ```javascript
   mode: 'php-api',  // ← Debe ser exactamente esto
   ```
4. Reconstruir: `npm run build`
5. Reiniciar: `ejecutar.bat`

---

## ✅ Si Todos los Tests Pasan

**¡Felicidades!** Tu sistema está completamente funcional con:

- ✅ Backend PHP corriendo
- ✅ MySQL con datos
- ✅ API REST funcionando
- ✅ Frontend conectado
- ✅ CRUD completo operativo

**Próximos pasos**:
1. Importar datos reales desde Excel
2. Configurar backups automáticos de MySQL
3. Ajustar permisos para producción

---

## 📞 Si Aún Tienes Problemas

1. **Revisar logs**:
   - Apache: `C:\xampp\apache\logs\error.log`
   - PHP: `C:\xampp\php\logs\php_error_log`
   - MySQL: `C:\xampp\mysql\data\*.err`

2. **Documentación completa**:
   - [GUIA_INSTALACION_PHP_API.md](./GUIA_INSTALACION_PHP_API.md)
   - [api-php/README_API.md](./api-php/README_API.md)

3. **Probar con Postman**:
   - Descargar: https://www.postman.com/
   - Probar endpoints directamente
   - Aislar si el problema es frontend o backend

---

**Tiempo estimado de prueba**: 5-10 minutos
**Fecha de creación**: 2025-01-27
**Versión**: 1.0
