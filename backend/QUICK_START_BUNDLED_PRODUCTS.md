# Quick Start: Bundled Products

## 🚀 Opción Recomendada: Railway CLI

### Paso 1: Ejecutar el script automatizado

Abre PowerShell en el directorio `backend/` y ejecuta:

```powershell
.\scripts\railway-generate-migrations.ps1
```

Este script:
- ✅ Verifica e instala Railway CLI si es necesario
- ✅ Te autentica en Railway
- ✅ Vincula tu proyecto
- ✅ Genera las migraciones
- ✅ Te muestra los próximos pasos

### Paso 2: Commitear y desplegar

```bash
git add .
git commit -m "Add bundled products feature"
git push origin main
```

¡Listo! Railway ejecutará las migraciones automáticamente.

---

## 🐳 Alternativa: Docker Local

Si prefieres no usar Railway CLI, ejecuta:

```bash
# Windows
.\scripts\generate-migrations-local.bat

# Linux/Mac
chmod +x scripts/generate-migrations-local.sh
./scripts/generate-migrations-local.sh
```

Luego commitea y despliega como en el Paso 2.

---

## 📋 ¿Qué se ha implementado?

### Backend ✅

- **Módulo Bundled Product**: Modelos Bundle y BundleItem
- **Links**: Bundle ↔ Product, BundleItem ↔ Product
- **Workflows**: Crear, agregar al carrito, remover del carrito
- **API Routes**:
  - `POST /admin/bundled-products` - Crear bundle
  - `GET /admin/bundled-products` - Listar bundles
  - `GET /store/bundle-products/:id` - Obtener bundle
  - `POST /store/carts/:id/line-item-bundles` - Agregar al carrito
  - `DELETE /store/carts/:id/line-item-bundles/:bundle_id` - Remover

### Pendiente 🔨

- **Admin UI**: Widgets para gestionar bundles en el dashboard
- **Storefront UI**: Páginas y componentes para mostrar bundles
- **Lógica de precios**: Personalizar precios de bundles
- **Inventario**: Gestión de stock de bundles

---

## 📚 Documentación

- `BUNDLED_PRODUCTS_IMPLEMENTATION.md` - Resumen completo de la implementación
- `BUNDLED_PRODUCTS_SETUP.md` - Guía detallada de configuración
- `RAILWAY_CLI_SETUP.md` - Guía de Railway CLI
- `RAILWAY_GENERATE_MIGRATIONS.md` - Opciones para generar migraciones

---

## 🧪 Probar la API

Una vez desplegado, puedes probar los endpoints:

### Crear un Bundle (Admin)

```bash
curl -X POST https://tu-backend.railway.app/admin/bundled-products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "title": "Camera Bundle",
    "product": {
      "title": "Camera Bundle",
      "status": "published",
      "options": [{"title": "Default", "values": ["default"]}],
      "variants": [{
        "title": "Camera Bundle",
        "options": {"Default": "default"},
        "manage_inventory": false
      }]
    },
    "items": [
      {"product_id": "prod_xxx", "quantity": 1},
      {"product_id": "prod_yyy", "quantity": 1}
    ]
  }'
```

### Listar Bundles (Admin)

```bash
curl https://tu-backend.railway.app/admin/bundled-products \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### Obtener Bundle (Store)

```bash
curl https://tu-backend.railway.app/store/bundle-products/bundle_xxx
```

---

## ❓ Troubleshooting

### "railway: command not found"
Ejecuta el script de PowerShell, instalará Railway CLI automáticamente.

### "No project linked"
El script te guiará para vincular tu proyecto.

### "Error al generar migraciones"
Verifica que el módulo esté en `medusa-config.js` (ya está agregado).

### "Docker not found" (solo si usas la alternativa Docker)
Instala Docker Desktop: https://www.docker.com/products/docker-desktop

---

## 🎯 Próximos Pasos

1. ✅ Generar migraciones (este paso)
2. 🔨 Personalizar Admin Dashboard
3. 🔨 Personalizar Storefront
4. 🔨 Implementar lógica de precios personalizada
5. 🔨 Gestionar inventario de bundles

---

## 💡 Consejos

- Las migraciones solo necesitan generarse una vez
- Después de generar, commitea y despliega
- Railway ejecuta migraciones automáticamente en cada deploy
- Puedes ver los logs con: `railway logs --follow`
