# 📦 Archivos Nuevos - Integración PHP + MySQL

## 📁 Estructura de Archivos Creados

```
webapp/
├── api-php/                              # 🆕 Backend PHP completo
│   ├── config.php                        # Configuración de DB y CORS
│   ├── registros.php                     # CRUD de registros (GET, POST, PUT, DELETE)
│   ├── filtros.php                       # Endpoint para opciones de filtros
│   ├── estadisticas.php                  # Endpoint para estadísticas
│   ├── importar.php                      # Endpoint para importación masiva
│   ├── test.php                          # Página de diagnóstico
│   ├── .htaccess                         # Configuración Apache (CORS, rewrites)
│   ├── estructura_tablas.sql             # Script SQL con estructura de tablas
│   └── README_API.md                     # Documentación técnica de la API
│
├── public/static/                        # 🆕 Scripts frontend para API
│   ├── api-config.js                     # Configuración de URL y modo
│   └── api-adapter.js                    # Adapter de compatibilidad
│
├── INSTALAR_API_PHP.bat                  # 🆕 Instalador automático (Windows)
├── CONFIGURAR_API.bat                    # 🆕 Configurador interactivo (Windows)
├── GUIA_INSTALACION_PHP_API.md           # 🆕 Guía completa paso a paso
├── LEEME_RAPIDO.txt                      # 🆕 Guía rápida en 6 pasos
├── ARCHIVOS_NUEVOS_PHP_API.md            # 🆕 Este archivo (índice)
└── README.md                             # ✏️ Actualizado con información PHP

Modificados:
├── src/index.tsx                         # ✏️ Agregadas 2 líneas para cargar scripts
```

---

## 📄 Descripción de Archivos

### 🔧 Backend PHP (`api-php/`)

#### **config.php** (1.9 KB)
- Configuración de conexión a MySQL
- Headers CORS
- Funciones helper: `getDBConnection()`, `sendJSON()`, `sendError()`
- Variables configurables: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`

#### **registros.php** (9.1 KB)
- **GET /registros.php/vivo**: Obtener registros vivo con filtros
- **GET /registros.php/beneficiado**: Obtener registros beneficiado con filtros
- **POST /registros.php/vivo**: Crear nuevo registro vivo
- **POST /registros.php/beneficiado**: Crear nuevo registro beneficiado
- **PUT /registros.php/vivo/{id}**: Actualizar registro vivo
- **DELETE /registros.php/vivo/{id}**: Eliminar registro vivo
- Soporte para todos los campos de las tablas MySQL

#### **filtros.php** (2.3 KB)
- **GET /filtros.php?tipo=vivo**: Obtener opciones de filtros para vivo
- **GET /filtros.php?tipo=beneficiado**: Obtener opciones para beneficiado
- Retorna: años, meses, tipos de proceso, provincias, zonas

#### **estadisticas.php** (2.5 KB)
- **GET /estadisticas.php?tipo=vivo**: Estadísticas de vivo
- **GET /estadisticas.php?tipo=beneficiado**: Estadísticas de beneficiado
- Retorna: total registros, total GRS, datos por año/mes/provincia, top clientes

#### **importar.php** (3.5 KB)
- **POST /importar.php**: Importación masiva desde Excel
- Body: `{ "tipo": "vivo", "registros": [...] }`
- Transacción SQL para integridad
- Retorna cantidad de insertados y errores

#### **test.php** (4.1 KB)
- Página de diagnóstico web
- Muestra: versión PHP, conexión MySQL, tablas disponibles, conteo de registros
- Útil para troubleshooting
- Acceso: `http://localhost/api-php/test.php`

#### **.htaccess** (458 bytes)
- Configuración Apache
- Headers CORS
- Manejo de preflight requests
- Error display para desarrollo

#### **estructura_tablas.sql** (4.5 KB)
- Script SQL completo
- Estructura de `captura_pantalla_vivo` (24 columnas)
- Estructura de `captura_pantalla_beneficiado` (28 columnas)
- Índices optimizados
- Datos de ejemplo (opcional)

#### **README_API.md** (7.9 KB)
- Documentación técnica completa
- Descripción de endpoints
- Ejemplos de requests/responses
- Configuración y troubleshooting

---

### 🎨 Frontend (`public/static/`)

#### **api-config.js** (5.8 KB)
- Configuración global de la API
- Variable `API_CONFIG.baseURL`: URL del backend PHP
- Variable `API_CONFIG.mode`: 'php-api' o 'cloudflare-d1'
- Clase `APIClient`: Cliente HTTP con fetch
- Funciones exportadas:
  - `RegistrosAPI`: CRUD de registros
  - `FiltrosAPI`: Obtener filtros
  - `EstadisticasAPI`: Obtener estadísticas
  - `ImportarAPI`: Importar desde Excel
  - `testAPIConnection()`: Probar conexión

#### **api-adapter.js** (9.6 KB)
- Adapter de compatibilidad
- Convierte llamadas del frontend a formato API PHP
- Mapeo de campos: `anio↔ano`, `cliente↔nombre`, `cantidad_grs↔grs`
- Conversión de meses: texto ↔ número
- Funciones exportadas (compatibles con código existente):
  - `API.getVivoAll()`
  - `API.getVivoArequipa()`
  - `API.getVivoProvincia()`
  - `API.crearVivo()`
  - `API.actualizarVivo()`
  - `API.borrarVivo()`
  - (Y equivalentes para beneficiado)

---

### 📜 Scripts de Instalación (Windows)

#### **INSTALAR_API_PHP.bat** (1.8 KB)
- Detecta automáticamente XAMPP o WAMP
- Copia carpeta `api-php/` a `htdocs/` o `www/`
- Muestra instrucciones de próximos pasos
- Uso: Doble clic en el archivo

#### **CONFIGURAR_API.bat** (3.8 KB)
- Configurador interactivo de base de datos
- Pregunta: host, nombre BD, usuario, contraseña
- Genera `config.php` automáticamente
- Crea backup del archivo original
- Abre navegador en `test.php` al finalizar
- Uso: Doble clic en el archivo

---

### 📖 Documentación

#### **GUIA_INSTALACION_PHP_API.md** (10.3 KB)
- Guía completa paso a paso (8 pasos)
- Capturas de pantalla sugeridas
- Instalación de XAMPP/WAMP
- Creación de base de datos en phpMyAdmin
- Configuración de API PHP
- Configuración de frontend
- Troubleshooting detallado (6 problemas comunes)
- Checklist final

#### **LEEME_RAPIDO.txt** (1.3 KB)
- Versión simplificada en 6 pasos
- Formato de texto plano
- Ideal para imprimir o copiar
- Enlaces directos

#### **ARCHIVOS_NUEVOS_PHP_API.md** (Este archivo)
- Índice de todos los archivos creados
- Descripción breve de cada archivo
- Tamaños y funciones principales

---

## 🔧 Modificaciones en Archivos Existentes

### **src/index.tsx**
**Líneas agregadas (después de línea 527):**
```javascript
<!-- API Configuration for PHP Backend -->
<script src="/static/api-config.js"></script>
<script src="/static/api-adapter.js"></script>
```

**Cambio:** Carga de 2 scripts adicionales para soporte de API PHP

---

### **README.md**
**Secciones modificadas:**
1. **Arquitectura de Datos**: Agregada sección "Doble Modo de Base de Datos"
2. **Documentación Adicional**: Agregados 3 nuevos documentos
3. **Stack Tecnológico**: Separado en "Modo Cloudflare" y "Modo PHP+MySQL"
4. **Comandos de Desarrollo**: Agregada sección "Modo PHP + MySQL"
5. **Última actualización**: Cambiado de v1.4.0 a v1.5.0
6. **Cambios Recientes**: Agregada sección v1.5.0 con 5 subsecciones

---

## 📊 Estadísticas de Archivos

| Tipo | Cantidad | Tamaño Total |
|------|----------|--------------|
| **Archivos PHP** | 7 | ~33.7 KB |
| **JavaScript Frontend** | 2 | ~15.4 KB |
| **Scripts Windows (.bat)** | 2 | ~5.7 KB |
| **Documentación (.md, .txt)** | 4 | ~23.5 KB |
| **SQL** | 1 | ~4.5 KB |
| **Total Nuevos** | 16 | **~82.8 KB** |

---

## ✅ Verificación de Instalación

Para verificar que todos los archivos están en su lugar:

### 1. Backend PHP
```bash
C:\xampp\htdocs\api-php\
├── ✓ config.php
├── ✓ registros.php
├── ✓ filtros.php
├── ✓ estadisticas.php
├── ✓ importar.php
├── ✓ test.php
├── ✓ .htaccess
├── ✓ estructura_tablas.sql
└── ✓ README_API.md
```

### 2. Frontend
```bash
webapp\public\static\
├── ✓ api-config.js
└── ✓ api-adapter.js
```

### 3. Raíz del proyecto
```bash
webapp\
├── ✓ api-php\
├── ✓ INSTALAR_API_PHP.bat
├── ✓ CONFIGURAR_API.bat
├── ✓ GUIA_INSTALACION_PHP_API.md
├── ✓ LEEME_RAPIDO.txt
└── ✓ ARCHIVOS_NUEVOS_PHP_API.md
```

---

## 🎯 Flujo de Uso

```
1. Ejecutar: INSTALAR_API_PHP.bat
   ↓
2. Ejecutar: CONFIGURAR_API.bat
   ↓
3. Importar SQL en phpMyAdmin
   ↓
4. Abrir: http://localhost/api-php/test.php
   ↓
5. Editar: public/static/api-config.js (verificar URL)
   ↓
6. npm run build
   ↓
7. ejecutar.bat
   ↓
8. Abrir: http://localhost:8080
   ↓
9. ✅ Sistema funcionando con MySQL
```

---

## 🔗 Enlaces Rápidos

- **Documentación Principal**: [GUIA_INSTALACION_PHP_API.md](./GUIA_INSTALACION_PHP_API.md)
- **Guía Rápida**: [LEEME_RAPIDO.txt](./LEEME_RAPIDO.txt)
- **API Técnica**: [api-php/README_API.md](./api-php/README_API.md)
- **Test de API**: http://localhost/api-php/test.php
- **phpMyAdmin**: http://localhost/phpmyadmin

---

## 💡 Notas Importantes

1. **Sin cambios en lógica del frontend**: El adapter se encarga de la compatibilidad
2. **Configuración en un solo lugar**: `api-config.js` controla todo
3. **Modo intercambiable**: Cambiar entre D1 y MySQL es solo cambiar `mode: 'php-api'`
4. **Sin dependencias nuevas**: Usa fetch nativo del navegador
5. **CORS preconfigurado**: Funciona out-of-the-box

---

**Fecha de creación**: 2025-01-27
**Versión**: 1.5.0
**Total de archivos**: 16 nuevos + 2 modificados
