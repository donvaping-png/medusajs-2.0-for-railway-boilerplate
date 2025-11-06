@echo off
REM Script para generar migraciones localmente usando Docker en Windows

echo Generando migraciones para Bundled Products...
echo.

REM Verificar si Docker esta instalado
docker --version >nul 2>&1
if errorlevel 1 (
    echo Docker no esta instalado. Por favor instala Docker primero.
    echo Descarga: https://www.docker.com/products/docker-desktop
    exit /b 1
)

REM Verificar si el contenedor ya existe y eliminarlo
docker ps -a --format "{{.Names}}" | findstr /C:"medusa-postgres-temp" >nul 2>&1
if not errorlevel 1 (
    echo Contenedor existente encontrado. Eliminando...
    docker rm -f medusa-postgres-temp
)

REM Crear contenedor temporal de PostgreSQL
echo Creando contenedor temporal de PostgreSQL...
docker run -d --name medusa-postgres-temp -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=medusa_dev -p 5433:5432 postgres:16

REM Esperar a que PostgreSQL este listo
echo Esperando a que PostgreSQL este listo...
timeout /t 5 /nobreak >nul

REM Crear archivo .env temporal
echo Creando configuracion temporal...
(
echo NODE_ENV=development
echo DATABASE_URL=postgresql://postgres:postgres@localhost:5433/medusa_dev
echo ADMIN_CORS=http://localhost:9000
echo STORE_CORS=http://localhost:8000
echo AUTH_CORS=http://localhost:9000
echo JWT_SECRET=24rnhl8586zsss4ilu5ymatewudv27jb
echo COOKIE_SECRET=qsorh0fz4xvo1ysifc61fr1pjd6052tn
) > .env.temp

REM Respaldar .env si existe
if exist .env (
    echo Respaldando .env existente...
    move /y .env .env.backup >nul
)

REM Usar .env temporal
move /y .env.temp .env >nul

REM Generar migraciones
echo Generando migraciones...
npx medusa db:generate bundledProduct

REM Restaurar .env original
if exist .env.backup (
    echo Restaurando .env original...
    move /y .env.backup .env >nul
) else (
    del .env
)

REM Detener y eliminar contenedor
echo Limpiando contenedor temporal...
docker rm -f medusa-postgres-temp

echo.
echo Migraciones generadas exitosamente!
echo.
echo Las migraciones estan en: src/modules/bundled-product/migrations/
echo.
echo Proximos pasos:
echo    1. Revisa las migraciones generadas
echo    2. Commitea los archivos:
echo       git add .
echo       git commit -m "Add bundled products migrations"
echo       git push origin main
echo    3. Railway ejecutara las migraciones automaticamente
echo.

pause
