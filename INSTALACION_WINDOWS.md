# 🪟 Guía de Instalación en Windows

## 📋 Requisitos Previos

Antes de empezar, necesitas tener instalado:

1. **Node.js** (versión 18 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica instalación: `node --version`

2. **Git** (opcional, para clonar el repositorio)
   - Descarga desde: https://git-scm.com/
   - Verifica instalación: `git --version`

---

## 🚀 Instalación Paso a Paso

### Paso 1: Clonar o Descargar el Proyecto

**Opción A: Con Git**
```powershell
git clone https://github.com/Cesar925/a.git
cd a
```

**Opción B: Descargar ZIP**
1. Ve a: https://github.com/Cesar925/a
2. Click en "Code" → "Download ZIP"
3. Descomprime el archivo
4. Abre PowerShell en la carpeta del proyecto

### Paso 2: Instalar Dependencias

```powershell
npm install
```

**Si hay errores**, intenta:
```powershell
npm install --legacy-peer-deps
```

**Tiempo estimado**: 2-3 minutos

### Paso 3: Verificar Instalación

```powershell
# Verificar que vite está instalado
npx vite --version

# Verificar que wrangler está instalado
npx wrangler --version
```

---

## 🏗️ Compilar el Proyecto

```powershell
npm run build
```

**Resultado esperado**:
```
✓ 47 modules transformed.
dist/_worker.js  128.26 kB
✓ built in 450ms
```

---

## 🌐 Ejecutar en Desarrollo (Cloudflare Pages)

### Opción 1: Desarrollo con Wrangler (Recomendado para Windows)

```powershell
# Compilar primero
npm run build

# Ejecutar servidor de desarrollo
npx wrangler pages dev dist --port 3000
```

Abre tu navegador en: http://localhost:3000

### Opción 2: Con Base de Datos Local

```powershell
# Compilar
npm run build

# Ejecutar con D1 local
npx wrangler pages dev dist --d1=webapp-production --local --port 3000
```

---

## 🗄️ Configurar Base de Datos Local

### 1. Crear Base de Datos D1

```powershell
npx wrangler d1 create webapp-production
```

**Copiar el `database_id`** que aparece en la salida.

### 2. Actualizar `wrangler.jsonc`

Edita el archivo `wrangler.jsonc` y reemplaza `your-database-id`:

```jsonc
{
  "name": "webapp",
  "compatibility_date": "2024-01-01",
  "pages_build_output_dir": "./dist",
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "webapp-production",
      "database_id": "TU-DATABASE-ID-AQUI"
    }
  ]
}
```

### 3. Aplicar Migraciones

```powershell
npx wrangler d1 migrations apply webapp-production --local
```

---

## 📦 Scripts Disponibles

### Desarrollo
```powershell
# Compilar el proyecto
npm run build

# Vista previa local
npm run preview

# Desarrollo con Vite (alternativa)
npm run dev
```

### Base de Datos
```powershell
# Aplicar migraciones locales
npm run db:migrate:local

# Aplicar migraciones en producción
npm run db:migrate:prod

# Consultar base de datos local
npx wrangler d1 execute webapp-production --local --command="SELECT * FROM procesos;"
```

### Despliegue
```powershell
# Desplegar a Cloudflare Pages
npm run deploy
```

---

## 🐛 Solución de Problemas

### Error: "vite no se reconoce"

**Causa**: Las dependencias no están instaladas.

**Solución**:
```powershell
# Eliminar node_modules y reinstalar
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Error: "Cannot find module 'hono'"

**Causa**: Dependencias incompletas.

**Solución**:
```powershell
npm install hono @hono/vite-cloudflare-pages vite wrangler --save
```

### Error: "Port 3000 already in use"

**Causa**: Ya hay algo corriendo en el puerto 3000.

**Solución Windows**:
```powershell
# Encontrar proceso usando puerto 3000
netstat -ano | findstr :3000

# Matar proceso (reemplaza PID con el número que aparece)
taskkill /PID <PID> /F

# O usa otro puerto
npx wrangler pages dev dist --port 8080
```

### Error al compilar TypeScript

**Causa**: Archivos TypeScript en `src/controllers/` o `src/repositories/`.

**Solución**: Asegúrate de tener TypeScript instalado:
```powershell
npm install --save-dev typescript @cloudflare/workers-types
```

---

## 📁 Estructura del Proyecto

```
a/
├── src/
│   ├── index.tsx          # Frontend principal
│   ├── controllers/       # Controladores backend
│   ├── repositories/      # Acceso a base de datos
│   ├── services/          # Lógica de negocio
│   └── types/            # Tipos TypeScript
├── public/               # Archivos estáticos
├── dist/                 # Build generado (después de npm run build)
├── migrations/           # Migraciones de base de datos
├── node_modules/         # Dependencias (después de npm install)
├── package.json          # Configuración del proyecto
├── wrangler.jsonc        # Configuración de Cloudflare
├── tsconfig.json         # Configuración de TypeScript
└── vite.config.ts        # Configuración de Vite
```

---

## 🌍 Desplegar a Producción

### 1. Autenticarse con Cloudflare

```powershell
npx wrangler login
```

Se abrirá tu navegador para autorizar.

### 2. Crear Proyecto en Cloudflare Pages

```powershell
npx wrangler pages project create webapp --production-branch main
```

### 3. Desplegar

```powershell
npm run build
npx wrangler pages deploy dist --project-name webapp
```

---

## 📱 URLs Útiles

- **Repositorio GitHub**: https://github.com/Cesar925/a
- **Cloudflare Dashboard**: https://dash.cloudflare.com/
- **Documentación Hono**: https://hono.dev/
- **Documentación Wrangler**: https://developers.cloudflare.com/workers/wrangler/

---

## 💡 Consejos para Windows

1. **Usa PowerShell** (no CMD) para mejores resultados
2. **Ejecuta como Administrador** si hay problemas de permisos
3. **Desactiva antivirus temporalmente** si `npm install` es muy lento
4. **Usa Git Bash** si prefieres comandos tipo Linux
5. **VSCode** es el editor recomendado con extensiones:
   - Hono
   - Cloudflare Workers
   - TypeScript

---

## 🆘 ¿Necesitas Ayuda?

Si sigues teniendo problemas:

1. **Verifica versiones**:
   ```powershell
   node --version    # Debe ser >= 18
   npm --version     # Debe ser >= 8
   ```

2. **Limpia caché de npm**:
   ```powershell
   npm cache clean --force
   ```

3. **Reinstala Node.js** desde: https://nodejs.org/

4. **Revisa los logs** en:
   - `.wrangler/logs/` (si usas wrangler)
   - Consola del navegador (F12)

---

¡Listo para desarrollar! 🚀
