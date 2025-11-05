# Instalación del Sistema de Metafields

## Paso 1: Instalar dependencias

```bash
cd backend
pnpm install
```

Esto instalará las nuevas dependencias añadidas al `package.json`:
- `ajv@^8.12.0` - Validación de esquemas JSON
- `ajv-formats@^3.0.1` - Formatos adicionales para Ajv

## Paso 2: Ejecutar la migración SQL

```bash
# Opción A: Usando psql directamente
psql $DATABASE_URL -f src/migrations/001_meta_fields.sql

# Opción B: Desde el contenedor de PostgreSQL (si usas Docker)
docker exec -i postgres_container psql -U username -d database_name < src/migrations/001_meta_fields.sql
```

Esto creará:
- Tabla `meta_definitions` - Esquema de metacampos
- Tabla `meta_values` - Valores de metacampos por entidad
- Índices y triggers necesarios

## Paso 3: Seedear las definiciones SEO

```bash
# Opción A: Ejecutar el seed completo (incluye definiciones meta)
pnpm seed

# Opción B: Solo seedear definiciones meta (si ya tienes datos)
# Usar el script de seed-meta-definitions.ts directamente
```

Esto creará las tres definiciones SEO:
- `seo.short_description` (max 500 chars)
- `seo.meta_title` (max 70 chars)
- `seo.meta_description` (max 160 chars)

## Paso 4: Verificar la instalación

### 4.1 Iniciar el backend

```bash
pnpm dev
```

### 4.2 Probar los endpoints

```bash
# Listar definiciones
curl http://localhost:9000/admin/meta/definitions?scope=category \
  -H "Authorization: Bearer YOUR_TOKEN"

# Crear una categoría (debe inicializar defaults automáticamente)
curl -X POST http://localhost:9000/admin/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Test", "handle": "test", "is_active": true}'

# Obtener meta de la categoría
curl http://localhost:9000/admin/categories/CATEGORY_ID/meta \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Estructura de archivos creados

```
backend/src/
├── migrations/
│   └── 001_meta_fields.sql              ✓ Migración SQL
├── models/
│   ├── meta-definition.ts               ✓ Modelo de definiciones
│   └── meta-value.ts                    ✓ Modelo de valores
├── services/
│   ├── meta-definition.service.ts       ✓ Servicio de definiciones
│   └── meta-value.service.ts            ✓ Servicio de valores
├── api/admin/
│   ├── meta/definitions/route.ts        ✓ CRUD de definiciones
│   └── categories/
│       ├── route.ts                     ✓ Creación con defaults
│       └── [id]/meta/route.ts           ✓ Gestión de valores
└── scripts/
    ├── seed-meta-definitions.ts         ✓ Seed de definiciones
    └── test-meta-system.sh              ✓ Script de tests
```

## Troubleshooting

### Error: "Cannot find module 'ajv'"
```bash
cd backend
pnpm install ajv ajv-formats
```

### Error: "relation 'meta_definitions' does not exist"
Ejecutar la migración SQL:
```bash
psql $DATABASE_URL -f src/migrations/001_meta_fields.sql
```

### Error: "metaDefinitionService is not registered"
Reiniciar el servidor de desarrollo:
```bash
pnpm dev
```

Medusa v2 registra automáticamente los servicios en `src/services/`.

### Las categorías no tienen valores por defecto
Asegurarse de:
1. Las definiciones están seeded (`pnpm seed` o ejecutar seed-meta-definitions.ts)
2. Usar el endpoint POST `/admin/categories` (no el core directo)
3. Verificar logs del servidor para errores

## Próximos pasos

1. **Añadir más metacampos**: Solo crear nuevas definiciones vía API
2. **Integrar en Store**: Adjuntar meta al devolver categorías
3. **Validaciones custom**: Extender el servicio con reglas específicas
4. **UI Admin**: Crear componentes para gestionar meta desde el dashboard

Ver `README_META.md` para documentación completa de uso.
