# 📊 Formato de Excel para Importación Automática

## 🎯 Estructura General

El archivo Excel debe tener **hojas separadas** para cada tipo de proceso. El sistema detecta automáticamente el tipo de proceso por el **nombre de la hoja**.

---

## 📋 Nombres de Hojas (Case-Insensitive)

### Para procesos VIVO:
- **"Vivo Arequipa"** o cualquier combinación que contenga "VIVO" + "AREQUIPA"
- **"Vivo Provincias"** o cualquier combinación que contenga "VIVO" + "PROVINCIA"

### Para procesos BENEFICIADO:
- **"Beneficiado Arequipa"** o cualquier combinación que contenga "BENEF" + "AREQUIPA"
- **"Beneficiado Provincia"** o cualquier combinación que contenga "BENEF" + "PROVINCIA"

---

## 📊 Estructura de Columnas

El sistema detecta automáticamente las columnas por sus nombres. **No importa el orden**, solo que existan estas columnas:

### Columnas Requeridas:

| Nombre de Columna (Palabras Clave) | Tipo de Dato | Ejemplo | Descripción |
|-------------------------------------|--------------|---------|-------------|
| **AÑO** o **ANIO** | Número | 2024 | Año del registro |
| **MES** | Texto/Número | "Septiembre" o 9 | Mes (nombre o número) |
| **CLIENTE** | Texto | "ROGER HUAMANTICA" | Nombre del cliente |
| **TIPO CLIENTE** | Texto | "DISTRIBUIDOR" | Tipo de cliente |
| **PROVINCIA** | Texto | "AREQUIPA" | Nombre de la provincia |
| **GRS** o **CANTIDAD GRS** | Número | 1000 | Cantidad en GRS |
| **RP** o **CANTIDAD RP** | Número | 500 | Cantidad en RP |
| **POTENCIAL MINIMO** o **POTENCIAL MÍN** | Número | 800 | Potencial mínimo |
| **POTENCIAL MAXIMO** o **POTENCIAL MÁX** | Número | 1200 | Potencial máximo |

### Columnas Opcionales:

| Nombre de Columna | Descripción |
|-------------------|-------------|
| **ZONA** | Zona geográfica |
| **DISTRITO** | Distrito |
| **OBSERVACIONES** | Notas adicionales |

---

## 📝 Ejemplo de Estructura

### Hoja: "Beneficiado Arequipa"

| AÑO | MES | PROVINCIA | ZONA | TIPO CLIENTE | CLIENTE | CANTIDAD GRS | CANTIDAD RP | POTENCIAL MINIMO | POTENCIAL MAXIMO | OBSERVACIONES |
|-----|-----|-----------|------|--------------|---------|--------------|-------------|------------------|------------------|---------------|
| 2024 | Septiembre | AREQUIPA | - | DISTRIBUIDOR | ROGER HUAMANTICA | 0 | 0 | 0 | 0 | Datos de prueba |
| 2024 | Septiembre | AREQUIPA | - | MAYORISTA | CHRISTIAN SALVADOR | 0 | 0 | 0 | 0 | Datos de prueba |
| 2024 | Septiembre | AREQUIPA | - | MINORISTA | DAVID UMERES | 0 | 1000 | 0 | 0 | Datos de prueba |

### Hoja: "Beneficiado Provincia"

| AÑO | MES | PROVINCIA | ZONA | TIPO CLIENTE | CLIENTE | CANTIDAD GRS | CANTIDAD RP | POTENCIAL MINIMO | POTENCIAL MAXIMO | OBSERVACIONES |
|-----|-----|-----------|------|--------------|---------|--------------|-------------|------------------|------------------|---------------|
| 2024 | Octubre | CAMANÁ | Zona Sur | DISTRIBUIDOR | PEDRO LOPEZ | 500 | 300 | 400 | 600 | Datos de provincia |
| 2024 | Octubre | CAYLLOMA | Zona Norte | MAYORISTA | MARIA GARCIA | 800 | 400 | 600 | 1000 | Datos de provincia |

---

## 🚀 Proceso de Importación

1. **Cargar Excel**: Haz clic en el botón "CARGAR EXCEL"
2. **Seleccionar archivo**: Elige tu archivo .xlsx o .xls
3. **Importación automática**: El sistema:
   - ✅ Lee todas las hojas del Excel
   - ✅ Detecta automáticamente el tipo de proceso por el nombre de la hoja
   - ✅ Identifica las columnas por sus nombres (no por posición)
   - ✅ Crea automáticamente clientes nuevos si no existen
   - ✅ Asocia automáticamente provincias existentes
   - ✅ Importa todos los registros a la base de datos
4. **Confirmación**: Muestra mensaje con total de registros importados
5. **Visualización**: Los datos se cargan automáticamente en la vista actual

---

## ⚠️ Notas Importantes

- **No se necesita elegir opciones**: La importación es completamente automática
- **Detección inteligente**: Las columnas se detectan por palabras clave, no por posición
- **Clientes nuevos**: Si un cliente no existe, se crea automáticamente
- **Provincias existentes**: Solo se asocian provincias que ya existen en el catálogo
- **Meses**: Acepta tanto nombres ("Septiembre") como números (9)
- **Múltiples hojas**: Puedes tener todas las hojas en un solo archivo Excel
- **Hojas ignoradas**: Las hojas con "RESUMEN" en el nombre se ignoran automáticamente

---

## 🎯 Ventajas del Nuevo Sistema

✅ **Flexible**: No importa el orden de las columnas
✅ **Automático**: Sin preguntas ni opciones
✅ **Inteligente**: Detecta columnas por palabras clave
✅ **Robusto**: Maneja errores por fila sin detener el proceso completo
✅ **Completo**: Importa a todos los tipos de proceso (Vivo/Beneficiado, Arequipa/Provincia)

---

## 🔧 Formato de Descarga

Para ver exactamente el formato esperado, puedes:
1. Crear algunos registros manualmente en el sistema
2. Usar el botón "REPORTE" para descargar un Excel de ejemplo
3. Usar ese archivo como plantilla para tus nuevos datos
