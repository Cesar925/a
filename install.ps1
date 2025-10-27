# 🚀 Script de Instalación Automática para Windows
# Ejecutar con: .\install.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sistema de Gestión - Instalación" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "🔍 Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js no está instalado" -ForegroundColor Red
    Write-Host "   Descarga desde: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar npm
Write-Host "🔍 Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm instalado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm no está instalado" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
Write-Host "   (Esto puede tomar 2-3 minutos)" -ForegroundColor Gray
Write-Host ""

# Instalar dependencias
npm install --legacy-peer-deps

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Dependencias instaladas correctamente" -ForegroundColor Green
    Write-Host ""
    
    # Compilar proyecto
    Write-Host "🏗️  Compilando proyecto..." -ForegroundColor Yellow
    npm run build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✅ INSTALACIÓN COMPLETADA" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "🚀 Para ejecutar el proyecto:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "   npx wrangler pages dev dist --port 3000" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "📖 Luego abre en tu navegador:" -ForegroundColor Cyan
        Write-Host "   http://localhost:3000" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "📚 Más información en: INSTALACION_WINDOWS.md" -ForegroundColor Gray
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Error al compilar el proyecto" -ForegroundColor Red
        Write-Host "   Revisa los errores arriba" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host ""
    Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Intenta manualmente:" -ForegroundColor Yellow
    Write-Host "   npm install --legacy-peer-deps" -ForegroundColor Gray
    Write-Host ""
    exit 1
}
