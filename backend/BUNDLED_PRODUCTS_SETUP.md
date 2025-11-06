# Configuración de Bundled Products

## Paso 1: Configurar Base de Datos Local

Para generar las migraciones necesitas una base de datos PostgreSQL local. Tienes dos opciones:

### Opción A: PostgreSQL Local

1. Instala PostgreSQL en tu máquina si no lo tienes
2. Crea una base de datos local:
```bash
createdb medusa_dev
```

3. Crea un archivo `.env` en `backend/` con esta configuración:
```env
NODE_ENV=development
ADMIN_CORS=http://localhost:9000
STORE_CORS=http://localhost:8000
AUTH_CORS=http://localhost:9000
JWT_SECRET=24rnhl8586zsss4ilu5ymatewudv27jb
COOKIE_SECRET=qsorh0fz4xvo1ysifc61fr1pjd6052tn
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medusa_dev

MEDUSA_ADMIN_EMAIL=admin@test.com
MEDUSA_ADMIN_PASSWORD=supersecret
```

### Opción B: Docker PostgreSQL

Si tienes Docker instalado:

```bash
docker run -d \
  --name medusa-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=medusa_dev \
  -p 5432:5432 \
  postgres:16
```

Luego usa el mismo `.env` de la Opción A.

## Paso 2: Generar Migraciones

Una vez que tengas la base de datos local configurada:

```bash
cd backend
npx medusa db:generate bundledProduct
```

Esto creará las migraciones en `backend/src/modules/bundled-product/migrations/`

## Paso 3: Ejecutar Migraciones

```bash
pnpm migrate
```

O si prefieres:

```bash
npx medusa db:migrate
```

## Paso 4: Iniciar el Servidor de Desarrollo

```bash
pnpm dev
```

El servidor estará disponible en:
- Admin: http://localhost:9000/app
- API: http://localhost:9000

## Estructura de Archivos Creados

```
backend/
├── src/
│   ├── modules/
│   │   └── bundled-product/
│   │       ├── index.ts                    # Definición del módulo
│   │       ├── service.ts                  # Servicio del módulo
│   │       ├── models/
│   │       │   ├── bundle.ts              # Modelo Bundle
│   │       │   └── bundle-item.ts         # Modelo BundleItem
│   │       └── migrations/                # Migraciones (generadas)
│   ├── links/
│   │   ├── bundle-product.ts              # Link Bundle <> Product
│   │   └── bundle-item-product.ts         # Link BundleItem <> Product
│   ├── workflows/
│   │   ├── create-bundled-product.ts      # Workflow crear bundle
│   │   ├── add-bundle-to-cart.ts          # Workflow agregar al carrito
│   │   ├── remove-bundle-from-cart.ts     # Workflow remover del carrito
│   │   └── steps/
│   │       ├── create-bundle.ts           # Step crear bundle
│   │       ├── create-bundle-items.ts     # Step crear items
│   │       └── prepare-bundle-cart-data.ts # Step preparar datos
│   └── api/
│       ├── middlewares.ts                 # Validaciones
│       ├── admin/
│       │   └── bundled-products/
│       │       └── route.ts               # CRUD admin bundles
│       └── store/
│           ├── bundle-products/
│           │   └── [id]/
│           │       └── route.ts           # GET bundle details
│           └── carts/
│               └── [id]/
│                   └── line-item-bundles/
│                       ├── route.ts       # POST add bundle
│                       └── [bundle_id]/
│                           └── route.ts   # DELETE remove bundle
```

## Próximos Pasos

1. **Personalizar el Admin**: Crear widgets personalizados para gestionar bundles
2. **Personalizar el Storefront**: Agregar UI para mostrar y comprar bundles
3. **Lógica de Precios**: Implementar precios personalizados para bundles
4. **Inventario**: Gestionar inventario de bundles basado en items

## API Endpoints Disponibles

### Admin API

- `POST /admin/bundled-products` - Crear bundle
- `GET /admin/bundled-products` - Listar bundles

### Store API

- `GET /store/bundle-products/:id` - Obtener detalles de bundle
- `POST /store/carts/:id/line-item-bundles` - Agregar bundle al carrito
- `DELETE /store/carts/:id/line-item-bundles/:bundle_id` - Remover bundle del carrito

## Ejemplo de Uso

### Crear un Bundle (Admin)

```bash
curl -X POST http://localhost:9000/admin/bundled-products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
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
      {"product_id": "prod_camera", "quantity": 1},
      {"product_id": "prod_bag", "quantity": 1}
    ]
  }'
```

### Agregar Bundle al Carrito (Store)

```bash
curl -X POST http://localhost:9000/store/carts/cart_123/line-item-bundles \
  -H "Content-Type: application/json" \
  -d '{
    "bundle_id": "bundle_123",
    "quantity": 1,
    "items": [
      {"item_id": "item_1", "variant_id": "variant_camera"},
      {"item_id": "item_2", "variant_id": "variant_bag"}
    ]
  }'
```

## Troubleshooting

### Error: "ENOTFOUND postgres.railway.internal"

Esto significa que estás intentando conectarte a Railway desde local. Usa una base de datos local como se indica arriba.

### Error: "Command db:generate not found"

Usa `npx medusa db:generate bundledProduct` en lugar de `pnpm db:generate`

### Error: "Module not found"

Asegúrate de haber ejecutado `pnpm install` después de crear los archivos.
