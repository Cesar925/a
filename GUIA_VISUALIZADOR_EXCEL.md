# 📊 Guía del Visualizador de Excel

## 🎯 Nueva Funcionalidad: Visualización Completa de Hojas Excel

El sistema ahora permite **visualizar todos los datos del Excel hoja por hoja**, manteniendo la estructura original sin necesidad de importar a la base de datos.

---

## 🚀 Cómo Usar

### 1️⃣ **Cargar Archivo Excel**

1. Click en el botón **"CARGAR EXCEL"** (morado, esquina inferior izquierda)
2. Selecciona tu archivo Excel (.xlsx o .xls)

### 2️⃣ **Elegir Acción**

Aparecerá un diálogo con 3 opciones:

```
¿Qué desea hacer con el archivo Excel?

1. Ver datos del Excel hoja por hoja
2. Importar datos a la base de datos
3. Ambos (ver e importar)

Ingrese 1, 2 o 3:
```

#### **Opción 1: Ver datos del Excel hoja por hoja** 👁️
- **Ventaja**: Visualización rápida sin modificar la base de datos
- **Uso**: Revisar datos, validar información antes de importar
- **Resultado**: Muestra selector de hojas y tabla con datos completos

#### **Opción 2: Importar datos a la base de datos** 💾
- **Ventaja**: Procesa y almacena datos para análisis posterior
- **Uso**: Cargar datos permanentemente al sistema
- **Resultado**: Importa registros y muestra cantidad importada

#### **Opción 3: Ambos (ver e importar)** 🔄
- **Ventaja**: Importa Y visualiza simultáneamente
- **Uso**: Verificar datos mientras se importan
- **Resultado**: Ejecuta ambas acciones

---

## 📋 Visualizador de Hojas

### Interfaz del Visualizador

Cuando seleccionas **Opción 1 o 3**, verás:

```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Datos desde Excel cargado                                │
│ archivo.xlsx - 26/01/2025 15:30:00                          │
│                                                              │
│ Seleccionar Hoja: [▼ AREQUIPA VIVO  ] [✕ Cerrar vista]     │
└─────────────────────────────────────────────────────────────┘
```

### Características del Visualizador

✅ **Selector de Hojas**
- Dropdown con todas las hojas del Excel
- Cambio instantáneo entre hojas
- Nombres originales de las hojas

✅ **Tabla Dinámica**
- **Encabezados**: Primera fila del Excel
- **Datos completos**: Todas las filas de la hoja
- **Formato original**: Mantiene estructura del Excel
- **Números formateados**: Con separadores de miles
- **Scroll horizontal**: Para hojas con muchas columnas

✅ **Información Visual**
- Título actualizado: "📊 Visualizando: [Nombre de la Hoja]"
- Numeración de filas (#1, #2, #3...)
- Hover effects en filas
- Bordes y separadores visuales

---

## 🔄 Flujo de Trabajo

### Caso 1: Solo Visualizar (Sin importar)

```
1. Cargar Excel
2. Elegir Opción 1
3. Ver selector de hojas
4. Cambiar entre hojas con el dropdown
5. Cerrar vista cuando termine
```

**Ventajas:**
- No modifica la base de datos
- Rápido y ligero
- Ideal para verificar datos

### Caso 2: Solo Importar (Sin visualizar)

```
1. Cargar Excel
2. Elegir Opción 2
3. Esperar confirmación de importación
4. Ver datos en tabla normal con filtros
```

**Ventajas:**
- Proceso directo
- Datos disponibles para filtrado
- Integración con sistema existente

### Caso 3: Visualizar E Importar

```
1. Cargar Excel
2. Elegir Opción 3
3. Sistema importa datos primero
4. Luego muestra visualizador
5. Puedes revisar y navegar por hojas
```

**Ventajas:**
- Mejor de ambos mundos
- Verificación post-importación
- Datos guardados y visualizables

---

## 🎨 Diseño Responsive

### En Escritorio (Desktop)
- Selector de hojas visible en la parte superior
- Tabla con scroll horizontal
- Múltiples columnas visibles

### En Móvil (Mobile)
- Selector de hojas adaptado
- Tabla con scroll táctil
- Interfaz optimizada para pantallas pequeñas

---

## 📊 Estructura de Datos Mostrada

### Ejemplo de Visualización

#### Hoja: AREQUIPA VIVO

| # | AÑO  | MES       | PROVINCIA | ZONA     | NOMBRES           | GRS   | RP    | Pot. Min | Pot. Max |
|---|------|-----------|-----------|----------|-------------------|-------|-------|----------|----------|
| 1 | 2024 | SETIEMBRE | AREQUIPA  | AREQUIPA | JERSSON ACERO     | 0     | 0     | 0        | 400      |
| 2 | 2024 | SETIEMBRE | AREQUIPA  | AREQUIPA | ROGER HUAMANTICA  | 0     | 0     | 0        | 1,000    |
| 3 | 2024 | SETIEMBRE | AREQUIPA  | AREQUIPA | CHRISTIAN SALVADOR| 0     | 0     | 500      | 800      |

#### Hoja: PROVINCIAS VIVO

| # | AÑO  | MES       | PROVINCIA | ZONA   | NOMBRES              | GRS | Pot. Min | Pot. Max |
|---|------|-----------|-----------|--------|----------------------|-----|----------|----------|
| 1 | 2024 | SETIEMBRE | AREQUIPA  | CAMANA | Hilario Rojas        | 110 | 40       | 40       |
| 2 | 2024 | SETIEMBRE | AREQUIPA  | CAMANA | Quispe Gaspar        | 180 | 70       | 70       |

---

## 🔍 Detalles Técnicos

### Procesamiento de Hojas

```javascript
// Lee todas las hojas del Excel
excelCargado.SheetNames.forEach((sheetName) => {
  const sheet = excelCargado.Sheets[sheetName];
  const datos = XLSX.utils.sheet_to_json(sheet, { 
    header: 1,      // Mantiene arrays
    defval: ''      // Valores por defecto vacíos
  });
});
```

### Renderizado Dinámico

- **Encabezados**: Primera fila (index 0)
- **Datos**: Resto de filas (index 1+)
- **Filas vacías**: Automáticamente ignoradas
- **Formato números**: Separador de miles para números

---

## ⚙️ Botones y Controles

### Botón "Cerrar vista Excel"
- **Ubicación**: Parte superior derecha del selector
- **Función**: Vuelve a la vista normal de la base de datos
- **Efecto**: 
  - Oculta selector de hojas
  - Muestra filtros normales
  - Carga datos desde BD

### Selector de Hojas (Dropdown)
- **Ubicación**: Centro superior
- **Función**: Cambia entre hojas del Excel
- **Opciones**: Todas las hojas disponibles
- **Evento**: onChange instantáneo

---

## 🎯 Casos de Uso

### ✅ Revisar Datos Antes de Importar
```
1. Cargar Excel (Opción 1)
2. Revisar cada hoja
3. Validar estructura
4. Si todo correcto → Cerrar y cargar de nuevo con Opción 2
```

### ✅ Comparar Hojas Rápidamente
```
1. Cargar Excel (Opción 1)
2. Cambiar entre hojas con dropdown
3. Identificar diferencias
4. Tomar decisiones
```

### ✅ Auditoría de Datos
```
1. Cargar Excel (Opción 3)
2. Datos importados a BD
3. Visualizar hojas originales
4. Comparar con datos importados
```

---

## 🚨 Notas Importantes

### ⚠️ Modo Visualización
- No edita el Excel original
- Datos solo en memoria (no guardados hasta cerrar)
- Para guardar → usar Opción 2 o 3

### ⚠️ Rendimiento
- Archivos muy grandes (>1000 filas) pueden tardar
- Se recomienda visualizar por partes
- La importación a BD es más eficiente

### ⚠️ Formato
- Mantiene texto y números
- Fórmulas se muestran como valores calculados
- Formato visual básico (sin colores Excel)

---

## 📞 Soporte

Si encuentras problemas:
1. Verifica que el Excel tenga formato correcto
2. Asegúrate de tener conexión estable
3. Revisa la consola del navegador (F12)
4. Reporta errores al equipo de desarrollo

---

## 🆕 Próximas Mejoras Planificadas

- [ ] Exportar hoja específica a Excel
- [ ] Búsqueda y filtrado dentro de hojas
- [ ] Edición inline de datos
- [ ] Comparación lado a lado de hojas
- [ ] Vista previa antes de importar

---

**Última actualización**: 2025-01-26  
**Versión**: 1.2.0  
**Estado**: ✅ Funcional
