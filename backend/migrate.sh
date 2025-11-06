#!/bin/bash
# Script para ejecutar migraciones en Railway

echo "🚀 Ejecutando migraciones de base de datos..."
npx medusa db:migrate

echo "✅ Migraciones completadas"
