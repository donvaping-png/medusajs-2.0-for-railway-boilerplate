#!/bin/bash

# Script para generar migraciones localmente usando Docker
# Esto evita tener que instalar PostgreSQL en tu máquina

echo "🚀 Generando migraciones para Bundled Products..."
echo ""

# Verificar si Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker primero."
    echo "   Descarga: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Verificar si el contenedor ya existe
if docker ps -a --format '{{.Names}}' | grep -q "^medusa-postgres-temp$"; then
    echo "📦 Contenedor existente encontrado. Eliminando..."
    docker rm -f medusa-postgres-temp
fi

# Crear contenedor temporal de PostgreSQL
echo "📦 Creando contenedor temporal de PostgreSQL..."
docker run -d \
  --name medusa-postgres-temp \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=medusa_dev \
  -p 5433:5432 \
  postgres:16

# Esperar a que PostgreSQL esté listo
echo "⏳ Esperando a que PostgreSQL esté listo..."
sleep 5

# Crear archivo .env temporal
echo "📝 Creando configuración temporal..."
cat > .env.temp << EOF
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/medusa_dev
ADMIN_CORS=http://localhost:9000
STORE_CORS=http://localhost:8000
AUTH_CORS=http://localhost:9000
JWT_SECRET=24rnhl8586zsss4ilu5ymatewudv27jb
COOKIE_SECRET=qsorh0fz4xvo1ysifc61fr1pjd6052tn
EOF

# Renombrar .env si existe
if [ -f .env ]; then
    echo "💾 Respaldando .env existente..."
    mv .env .env.backup
fi

# Usar .env temporal
mv .env.temp .env

# Generar migraciones
echo "🔨 Generando migraciones..."
npx medusa db:generate bundledProduct

# Restaurar .env original
if [ -f .env.backup ]; then
    echo "♻️  Restaurando .env original..."
    mv .env.backup .env
else
    rm .env
fi

# Detener y eliminar contenedor
echo "🧹 Limpiando contenedor temporal..."
docker rm -f medusa-postgres-temp

echo ""
echo "✅ ¡Migraciones generadas exitosamente!"
echo ""
echo "📁 Las migraciones están en: src/modules/bundled-product/migrations/"
echo ""
echo "📤 Próximos pasos:"
echo "   1. Revisa las migraciones generadas"
echo "   2. Commitea los archivos:"
echo "      git add ."
echo "      git commit -m 'Add bundled products migrations'"
echo "      git push origin main"
echo "   3. Railway ejecutará las migraciones automáticamente"
echo ""
