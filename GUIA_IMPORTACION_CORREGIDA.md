# 🎯 Guía de Importación Excel - Sistema Corregido

## ✅ Correcciones Aplicadas

### Problema Detectado:
El sistema no importaba correctamente porque:
1. ❌ No detectaba la columna **"NOMBRES"** (buscaba solo "CLIENTE")
2. ❌ Confundía **"POTENCIAL MINIMO/MAXIMO"** con **"CONDICIONES POTENCIAL"**
3. ❌ No filtraba columnas como "GRS VIVO" o "COMPRA GRS"

### Solución Implementada:
1. ✅ Ahora detecta **"NOMBRES"** como columna de cliente
2. ✅ Excluye columnas que contengan **"CONDIC"** para evitar confusión
3. ✅ Filtra correctamente **"GRS"** y **"RP"** excluyendo variantes

---

## 📊 Mapeo de Columnas Corregido

### Ejemplo: AREQUIPA VIVO

| Campo Sistema | Columna Excel | Índice | Valor Ejemplo |
|---------------|---------------|--------|---------------|
| **anio** | AÑO | [0] | 2024 |
| **mes** | MES | [1] | SETIEMBRE |
| **provincia** | PROVINCIA | [2] | AREQUIPA |
| **tipo_cliente** | TIPO DE CLIENTE | [5] | DISTRIBUIDORES |
| **cliente** | **NOMBRES** ✅ | [6] | JERSSON ACERO |
| **cantidad_grs** | GRS | [7] | 0 |
| **cantidad_rp** | RP | [8] | 0 |
| **potencial_minimo** | **POTENCIAL MINIMO** ✅ | [15] | 0 |
| **potencial_maximo** | **POTENCIAL MAXIMO** ✅ | [16] | 400 |

**Columnas Ignoradas:**
- ❌ [17] "CONDICIONES POTENCIAL MINIMO" → No se usa
- ❌ [18] "CONDICIONES POTENCIAL MAXIMO" → No se usa

---

## 🚀 Cómo Importar tu Excel

### Paso 1: Verificar Estructura
Tu Excel debe tener hojas con nombres que incluyan:
- **"AREQUIPA VIVO"** → Proceso 1 (Vivo Arequipa)
- **"PROVINCIAS VIVO"** → Proceso 2 (Vivo Provincias)
- **"AREQUIPA BENEF"** → Proceso 3 (Beneficiado Arequipa)
- **"PROVINCIAS BENEF"** → Proceso 4 (Beneficiado Provincia)

### Paso 2: Columnas Requeridas
Asegúrate de que tu Excel tenga estas columnas (primera fila):

**Columnas Esenciales:**
- ✅ **AÑO** (o ANIO)
- ✅ **MES** (nombre o número)
- ✅ **PROVINCIA**
- ✅ **TIPO DE CLIENTE**
- ✅ **NOMBRES** (nombre del cliente)
- ✅ **GRS** (cantidad GRS)
- ✅ **RP** (cantidad RP)
- ✅ **POTENCIAL MINIMO** (sin "CONDICIONES")
- ✅ **POTENCIAL MAXIMO** (sin "CONDICIONES")

**Columnas Opcionales:**
- ZONA
- DISTRITO
- OBSERVACIONES

### Paso 3: Importar

1. **Abre la aplicación**: https://3000-io76xoehoh5oiv2cq3g44-583b4d74.sandbox.novita.ai

2. **Clic en "CARGAR EXCEL"** (botón morado, esquina inferior izquierda)

3. **Selecciona tu archivo Excel**

4. **¡Automático!** El sistema:
   - ✅ Lee todas las hojas
   - ✅ Detecta el tipo de proceso por nombre
   - ✅ Mapea las columnas correctamente
   - ✅ Crea clientes nuevos si no existen
   - ✅ Importa todos los registros a la base de datos
   - ✅ Muestra mensaje: "✅ Importación completada: X registros importados"

### Paso 4: Verificar Importación

**Para Vivo Arequipa:**
- Cambia al proceso "Vivo Arequipa"
- Verás los registros en la tabla
- Puedes filtrar por Año, Mes, Cliente

**Para Vivo Provincias:**
- Cambia al proceso "Vivo Provincias"
- Verás los registros en la tabla
- Filtra por Provincia (CAMANÁ, CAYLLOMA, etc.)

**Para Beneficiado Arequipa:**
- Cambia al proceso "Beneficiado Arequipa"
- Verás los registros importados
- Filtra por Mes, Cliente

**Para Beneficiado Provincia:**
- Cambia al proceso "Beneficiado Provincia"
- Verás los registros de provincias
- Filtra por Provincia (JULIACA, CAMANÁ, etc.)

---

## 🔍 Tabla de Detección de Columnas

El sistema busca estas palabras clave (no importa el orden):

| Busca | Detecta | Ejemplo Válido |
|-------|---------|----------------|
| **AÑO** o **ANIO** | Año | "AÑO", "ANIO", "Año 2024" |
| **MES** | Mes | "MES", "Mes", "PERIODO" |
| **PROVINCIA** | Provincia | "PROVINCIA", "PROV" |
| **TIPO** + **CLIENTE** | Tipo Cliente | "TIPO DE CLIENTE", "TIPO CLIENTE" |
| **NOMBRES** | Cliente | "NOMBRES", "NOMBRE" |
| **GRS** (sin COMPRA/VIVO) | Cantidad GRS | "GRS", "GRS vendido" |
| **RP** (sin COMPRA) | Cantidad RP | "RP", "RP vendido" |
| **POTENCIAL** + **MIN** (sin CONDIC) | Potencial Min | "POTENCIAL MINIMO" |
| **POTENCIAL** + **MAX** (sin CONDIC) | Potencial Max | "POTENCIAL MAXIMO" |

---

## 📝 Ejemplo de Excel Válido

### Hoja: "AREQUIPA VIVO"

```
| AÑO  | MES       | PROVINCIA | TIPO DE CLIENTE | NOMBRES          | GRS | RP | POTENCIAL MINIMO | POTENCIAL MAXIMO |
|------|-----------|-----------|-----------------|------------------|-----|----| -----------------|------------------|
| 2024 | SETIEMBRE | AREQUIPA  | DISTRIBUIDORES  | JERSSON ACERO    | 0   | 0  | 0                | 400              |
| 2024 | SETIEMBRE | AREQUIPA  | DISTRIBUIDORES  | ROGER HUAMANTICA | 0   | 0  | 0                | 0                |
```

---

## ⚠️ Notas Importantes

1. **Primera Fila = Encabezados**: La primera fila debe contener los nombres de las columnas
2. **Orden Flexible**: Las columnas pueden estar en cualquier orden
3. **Detección por Palabras**: El sistema detecta por palabras clave, no por posición
4. **Clientes Nuevos**: Si un cliente no existe, se crea automáticamente
5. **Provincias**: Solo se asocian provincias que ya existen en el catálogo
6. **Errores por Fila**: Si una fila tiene error, se salta y continúa con las siguientes
7. **Múltiples Hojas**: Puedes tener todas las hojas en un solo archivo

---

## 🎯 Estadísticas de tu Excel

**Archivo Analizado**: `a.xlsx`

| Hoja | Filas con Datos | Proceso Detectado |
|------|----------------|-------------------|
| AREQUIPA VIVO | 95 | Vivo Arequipa (proceso_id=1) |
| PROVINCIAS VIVO | 324 | Vivo Provincias (proceso_id=2) |
| AREQUIPA BENEF | 223 | Beneficiado Arequipa (proceso_id=3) |
| PROVINCIAS BENEF | 21 | Beneficiado Provincia (proceso_id=4) |
| **TOTAL** | **663 registros** | |

---

## 🐛 Solución de Problemas

### "No se importó nada"
- ✅ Verifica que las hojas tengan los nombres correctos (VIVO/BENEF + AREQUIPA/PROVINCIA)
- ✅ Revisa que la primera fila tenga encabezados
- ✅ Asegúrate de que haya columnas "NOMBRES" y "POTENCIAL MINIMO/MAXIMO"

### "Algunos registros no se importaron"
- ✅ Verifica que las filas tengan datos en las columnas requeridas
- ✅ Revisa la consola del navegador (F12) para ver errores específicos
- ✅ Asegúrate de que los nombres de clientes no estén vacíos

### "Potencial Mínimo/Máximo está vacío"
- ✅ Verifica que las columnas se llamen exactamente "POTENCIAL MINIMO" y "POTENCIAL MAXIMO"
- ✅ Asegúrate de que NO contengan la palabra "CONDICIONES"
- ✅ Revisa que los valores sean números, no texto

---

## 🚀 ¡Listo para Importar!

Tu sistema está ahora configurado para importar correctamente el archivo Excel. 

**URL de la Aplicación:**
https://3000-io76xoehoh5oiv2cq3g44-583b4d74.sandbox.novita.ai

¡Solo carga tu archivo y verás los registros automáticamente! 🎉
