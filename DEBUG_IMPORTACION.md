# 🐛 Guía de Depuración - Importación Excel

## 🎯 Problema Actual

**Síntoma**: Solo se importan algunos registros, no todos:
- ✅ Vivo Arequipa: Se importan registros
- ⚠️ Vivo Provincias: Solo se importan algunos (11 de 324)
- ❌ Beneficiado Arequipa: No se importa nada (0 de 223)
- ❌ Beneficiado Provincia: No se importa nada (0 de 21)

**Causa**: Errores silenciosos durante la importación que se capturan pero no se muestran al usuario.

---

## 🔍 Cómo Depurar la Importación

### Paso 1: Abrir la Consola del Navegador

1. Abre la aplicación: https://3000-io76xoehoh5oiv2cq3g44-583b4d74.sandbox.novita.ai
2. Presiona **F12** (o clic derecho → Inspeccionar)
3. Ve a la pestaña **"Console"**

### Paso 2: Cargar el Excel y Ver Errores

1. **Mantén abierta la consola**
2. Haz clic en **"CARGAR EXCEL"**
3. Selecciona tu archivo `a.xlsx`
4. **Observa la consola** mientras se importa

### Paso 3: Identificar Errores

La consola mostrará mensajes como:

```
❌ Error fila 5 ["AREQUIPA BENEF"]: Error: ...
Datos de la fila: { clienteNombre: "Soto quispe", registro: {...} }
Respuesta del servidor: { error: "..." }
```

---

## 🔧 Errores Comunes y Soluciones

### Error 1: "cliente_id is required"
**Causa**: No se encontró ni se pudo crear el cliente

**Solución**:
```javascript
// El nombre del cliente está vacío o tiene caracteres especiales
// Verificar columna "NOMBRES" en el Excel
```

### Error 2: "provincia_id not found"
**Causa**: La provincia no existe en el catálogo

**Solución**:
```sql
-- Verificar provincias existentes
SELECT * FROM provincias;

-- La provincia debe coincidir EXACTAMENTE con el catálogo
```

### Error 3: "Invalid mes value"
**Causa**: El mes no se pudo convertir

**Solución**:
```javascript
// Verificar que el mes sea:
// - Número: 1-12
// - Texto: ENERO, FEBRERO, MARZO, etc.
// - NO otros formatos
```

### Error 4: "Network Error" o "500 Internal Server Error"
**Causa**: Error en el servidor backend

**Solución**:
```bash
# Ver logs del servidor
pm2 logs webapp --nostream --lines 50
```

---

## 🧪 Prueba Manual de la API

Para verificar que la API funciona correctamente:

### Probar creación de Beneficiado Arequipa:

```bash
curl -X POST http://localhost:3000/beneficiado/crear \
  -H "Content-Type: application/json" \
  -d '{
    "proceso_id": 3,
    "cliente_id": 1,
    "anio": 2024,
    "mes": 5,
    "provincia_id": 1,
    "cantidad_grs": 100,
    "cantidad_rp": 50,
    "potencial_minimo": 80,
    "potencial_maximo": 120,
    "observaciones": "Prueba manual"
  }'
```

**Respuesta esperada**:
```json
{
  "success": true,
  "data": { "id": 73 },
  "message": "Registro creado exitosamente"
}
```

### Verificar que se creó:

```bash
curl http://localhost:3000/beneficiado/arequipa | jq '.'
```

---

## 📊 Verificar Base de Datos

### Ver registros por proceso:

```bash
cd /home/user/webapp
npx wrangler d1 execute webapp-production --local --command="
  SELECT proceso_id, COUNT(*) as total 
  FROM registros 
  GROUP BY proceso_id 
  ORDER BY proceso_id;
"
```

### Ver últimos registros creados:

```bash
npx wrangler d1 execute webapp-production --local --command="
  SELECT r.id, r.proceso_id, cl.nombre as cliente, r.anio, r.mes, r.created_at
  FROM registros r
  LEFT JOIN clientes cl ON r.cliente_id = cl.id
  ORDER BY r.created_at DESC
  LIMIT 10;
"
```

### Ver clientes creados:

```bash
npx wrangler d1 execute webapp-production --local --command="
  SELECT id, nombre, tipo 
  FROM clientes 
  ORDER BY id DESC 
  LIMIT 20;
"
```

---

## 🔄 Limpiar Base de Datos y Reintentar

Si quieres empezar desde cero:

```bash
cd /home/user/webapp

# Eliminar todos los registros
npx wrangler d1 execute webapp-production --local --command="DELETE FROM registros;"

# Eliminar clientes creados durante importación (opcional)
npx wrangler d1 execute webapp-production --local --command="DELETE FROM clientes WHERE id > 10;"

# Verificar que está limpio
npx wrangler d1 execute webapp-production --local --command="SELECT COUNT(*) FROM registros;"
```

Luego:
1. Recarga la aplicación (F5)
2. Intenta cargar el Excel nuevamente
3. Observa la consola para ver errores específicos

---

## 📝 Formato de Registro Esperado

Para que un registro se importe correctamente, debe tener:

```javascript
{
  proceso_id: 3 o 4,              // 3=Beneficiado Arequipa, 4=Beneficiado Provincia
  cliente_id: <número>,           // ID del cliente (se crea automáticamente)
  anio: 2024,                     // Año numérico
  mes: 5,                         // Mes numérico 1-12
  provincia_id: <número o null>,  // ID de provincia existente o null
  cantidad_grs: 100,              // Número (puede ser 0)
  cantidad_rp: 50,                // Número (puede ser 0)
  potencial_minimo: 80,           // Número
  potencial_maximo: 120,          // Número
  observaciones: "texto"          // Texto (puede estar vacío)
}
```

---

## 🎯 Próximos Pasos

1. **Abre la consola** y carga el Excel
2. **Captura los errores** que aparecen
3. **Comparte los errores** para que pueda ayudarte a solucionarlos
4. **Verifica el formato** del Excel según los errores encontrados

---

## 💡 Tips

- **Los errores más comunes** son provincias que no existen o nombres de clientes vacíos
- **La importación continúa** aunque haya errores en filas individuales
- **Solo se cuentan** los registros importados exitosamente
- **Revisa la consola** inmediatamente después de importar para ver todos los errores

---

## 🆘 Si Sigues Teniendo Problemas

Comparte conmigo:
1. **Screenshot de la consola** con los errores
2. **Primeras 5 filas** del Excel de la hoja que falla
3. **Mensaje de error específico** que aparece

Así podré ayudarte a solucionar el problema específico.
