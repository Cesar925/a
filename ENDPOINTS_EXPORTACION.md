# 📊 Endpoints de Exportación Excel

## Descripción

Estos endpoints permiten exportar datos desde la base de datos en formato JSON para ser procesados y convertidos a Excel en el frontend.

---

## 🔵 Endpoints Vivo

### 1. Exportar Arequipa Vivo a Excel

**Endpoint**: `GET /vivo/arequipa/excel`

**Descripción**: Exporta todos los registros del proceso "Arequipa Vivo"

**Respuesta**:
```json
[
  {
    "id": 1,
    "anio": 2024,
    "mes": 9,
    "cliente": "ROGER HUAMANTICA",
    "provincia": "AREQUIPA",
    "zona": null,
    "cantidad_grs": 0,
    "cantidad_rp": 0,
    "potencial_minimo": 0,
    "potencial_maximo": 1000,
    "observaciones": null
  }
]
```

**Ejemplo de uso**:
```javascript
const response = await axios.get('/vivo/arequipa/excel');
const datos = response.data;
```

---

### 2. Exportar Provincia Vivo a Excel

**Endpoint**: `GET /vivo/provincia/excel`

**Descripción**: Exporta todos los registros del proceso "Provincia Vivo"

**Respuesta**: Mismo formato que el anterior

**Ejemplo de uso**:
```javascript
const response = await axios.get('/vivo/provincia/excel');
const datos = response.data;
```

---

## 🟢 Endpoints Beneficiado

### 3. Exportar Arequipa Beneficiado a Excel

**Endpoint**: `GET /beneficiado/arequipa/excel`

**Descripción**: Exporta todos los registros del proceso "Arequipa Beneficiado"

**Respuesta**: Mismo formato

**Ejemplo de uso**:
```javascript
const response = await axios.get('/beneficiado/arequipa/excel');
const datos = response.data;
```

---

### 4. Exportar Provincia Beneficiado a Excel

**Endpoint**: `GET /beneficiado/provincia/excel`

**Descripción**: Exporta todos los registros del proceso "Provincia Beneficiado"

**Respuesta**: Mismo formato

**Ejemplo de uso**:
```javascript
const response = await axios.get('/beneficiado/provincia/excel');
const datos = response.data;
```

---

## 📥 Uso en Función generarReporte()

La función `generarReporte()` del frontend ahora utiliza estos endpoints automáticamente:

```javascript
async function generarReporte() {
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
  const response = await axios.get(urlExport);
  const datosParaExcel = response.data;
  
  // Crear archivo Excel con SheetJS
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(datosParaExcel);
  XLSX.utils.book_append_sheet(wb, ws, 'Datos');
  XLSX.writeFile(wb, 'reporte.xlsx');
}
```

---

## 🔧 Estructura de Query SQL

Todos los endpoints utilizan esta estructura de query:

```sql
SELECT 
  r.id,
  r.anio,
  r.mes,
  cl.nombre as cliente,
  pr.nombre as provincia,
  z.nombre as zona,
  r.cantidad_grs,
  r.cantidad_rp,
  r.potencial_minimo,
  r.potencial_maximo,
  r.observaciones
FROM registros r
LEFT JOIN clientes cl ON r.cliente_id = cl.id
LEFT JOIN provincias pr ON r.provincia_id = pr.id
LEFT JOIN zonas z ON r.zona_id = z.id
LEFT JOIN procesos p ON r.proceso_id = p.id
WHERE p.nombre = '[NOMBRE_PROCESO]'
ORDER BY r.anio DESC, r.mes DESC, cl.nombre
```

---

## 📂 Archivo del Controller

**Ubicación**: `/src/controllers/ExportController.ts`

**Métodos**:
- `exportarArequipaVivoExcel()`
- `exportarProvinciaVivoExcel()`
- `exportarArequipaExcel()`
- `exportarProvinciaExcel()`

---

## ✅ Ventajas

1. **Datos siempre actualizados**: Los reportes obtienen datos directamente desde la base de datos
2. **Sin límites de paginación**: Los endpoints devuelven todos los registros
3. **Formato consistente**: Estructura JSON estandarizada
4. **Fácil extensión**: Agregar filtros o campos adicionales es simple
5. **Separación de responsabilidades**: Backend maneja datos, frontend maneja presentación

---

## 🚀 Próximas Mejoras

- Agregar filtros por fecha (año/mes)
- Agregar paginación para grandes volúmenes
- Implementar formato Excel directo (sin pasar por JSON)
- Agregar compresión para archivos grandes
- Implementar cache para reportes frecuentes

---

**Documentación creada**: 2025-10-27  
**Versión**: 1.0  
**Autor**: Sistema de Gestión Arequipa
