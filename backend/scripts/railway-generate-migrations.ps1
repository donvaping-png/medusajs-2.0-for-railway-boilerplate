# Script para generar migraciones usando Railway CLI
# Ejecutar desde el directorio backend/

Write-Host "🚀 Generando migraciones con Railway CLI..." -ForegroundColor Cyan
Write-Host ""

# Verificar si Railway CLI está instalado
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if (-not $railwayInstalled) {
    Write-Host "❌ Railway CLI no está instalado." -ForegroundColor Red
    Write-Host ""
    Write-Host "Instalando Railway CLI..." -ForegroundColor Yellow
    
    try {
        iwr https://railway.app/install.ps1 | iex
        Write-Host "✅ Railway CLI instalado exitosamente" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  Por favor, cierra y vuelve a abrir PowerShell, luego ejecuta este script nuevamente." -ForegroundColor Yellow
        exit 0
    } catch {
        Write-Host "❌ Error al instalar Railway CLI" -ForegroundColor Red
        Write-Host "Por favor, instala manualmente: npm install -g @railway/cli" -ForegroundColor Yellow
        exit 1
    }
}

Write-Host "✅ Railway CLI encontrado" -ForegroundColor Green

# Verificar si está autenticado
Write-Host "🔐 Verificando autenticación..." -ForegroundColor Cyan
$authCheck = railway whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ No estás autenticado en Railway" -ForegroundColor Red
    Write-Host "Iniciando login..." -ForegroundColor Yellow
    railway login
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al autenticar" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Autenticado como: $authCheck" -ForegroundColor Green

# Verificar si el proyecto está vinculado
Write-Host "🔗 Verificando vinculación del proyecto..." -ForegroundColor Cyan
$projectCheck = railway status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Proyecto no vinculado" -ForegroundColor Red
    Write-Host "Vinculando proyecto..." -ForegroundColor Yellow
    railway link
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al vincular proyecto" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Proyecto vinculado" -ForegroundColor Green
Write-Host ""

# Generar migraciones
Write-Host "🔨 Generando migraciones para bundledProduct..." -ForegroundColor Cyan
Write-Host "Esto puede tomar unos momentos..." -ForegroundColor Yellow
Write-Host ""

railway run npx medusa db:generate bundledProduct

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "❌ Error al generar migraciones" -ForegroundColor Red
    Write-Host ""
    Write-Host "Posibles soluciones:" -ForegroundColor Yellow
    Write-Host "1. Verifica que el módulo esté en medusa-config.js" -ForegroundColor White
    Write-Host "2. Verifica que la base de datos esté accesible" -ForegroundColor White
    Write-Host "3. Revisa los logs: railway logs" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "✅ ¡Migraciones generadas exitosamente!" -ForegroundColor Green
Write-Host ""

# Verificar que se crearon las migraciones
$migrationsPath = "src/modules/bundled-product/migrations"
if (Test-Path $migrationsPath) {
    $migrations = Get-ChildItem $migrationsPath -Filter "*.ts"
    if ($migrations.Count -gt 0) {
        Write-Host "📁 Migraciones encontradas:" -ForegroundColor Cyan
        foreach ($migration in $migrations) {
            Write-Host "   - $($migration.Name)" -ForegroundColor White
        }
        Write-Host ""
    }
}

# Mostrar próximos pasos
Write-Host "📤 Próximos pasos:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Revisa las migraciones generadas:" -ForegroundColor White
Write-Host "   ls src/modules/bundled-product/migrations/" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Commitea los cambios:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Add bundled products migrations'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Despliega a Railway:" -ForegroundColor White
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Verifica los logs en Railway:" -ForegroundColor White
Write-Host "   railway logs --follow" -ForegroundColor Gray
Write-Host ""

Write-Host "✨ ¡Listo! Las migraciones están listas para ser desplegadas." -ForegroundColor Green
