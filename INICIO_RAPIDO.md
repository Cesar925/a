# ⚡ Inicio Rápido en Windows

## 🎯 Instalación en 3 Pasos

### 1️⃣ Clonar el Repositorio

```powershell
git clone https://github.com/Cesar925/a.git
cd a
```

### 2️⃣ Instalar Dependencias

```powershell
npm install
```

### 3️⃣ Compilar y Ejecutar

```powershell
npm run build
npx wrangler pages dev dist --port 3000
```

Abre: http://localhost:3000

---

## 🚀 Script Automático (Recomendado)

**Ejecuta una sola vez:**

```powershell
.\install.ps1
```

Este script:
- ✅ Verifica Node.js y npm
- ✅ Instala todas las dependencias
- ✅ Compila el proyecto
- ✅ Te dice cómo ejecutar

---

## 📦 Comandos Útiles

```powershell
# Compilar
npm run build

# Ejecutar en desarrollo
npx wrangler pages dev dist --port 3000

# Limpiar y reinstalar (si hay problemas)
Remove-Item -Recurse node_modules
npm install
```

---

## 🐛 ¿Problemas?

### "vite no se reconoce"
```powershell
npm install
npm run build
```

### "Puerto 3000 ocupado"
```powershell
npx wrangler pages dev dist --port 8080
```

### Otros errores
Ver guía completa: **INSTALACION_WINDOWS.md**

---

## 📚 Documentación

- 🪟 [Guía Completa Windows](./INSTALACION_WINDOWS.md)
- 📖 [README Principal](./README.md)
- 🐛 [Debug Importación](./DEBUG_IMPORTACION.md)
- 📊 [Formato Excel](./FORMATO_EXCEL.md)

---

¡Listo en 3 minutos! 🎉
