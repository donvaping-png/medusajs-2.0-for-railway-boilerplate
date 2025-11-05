# Sistema de Metafields Globales para Categorías

Sistema modular de metafields que permite definir campos personalizados para categorías con validación por esquema, valores por defecto y gestión completa vía API Admin.

## Características

- **Definiciones globales**: Define metacampos una vez, se aplican a todas las categorías
- **Validación por esquema**: Validación automática según tipo y reglas definidas
- **Valores por defecto**: Inicialización automática al crear categorías
- **Tipos soportados**: text, richtext, number, boolean, date, select, json, image
- **Sin modificar core**: Todo modular usando servicios y endpoints propios

## Estructura

```
backend/src/
├── migrations/
│   └── 001_meta_fields.sql          # Tablas meta_definitions y meta_values
├── models/
│   ├── meta-definition.ts           # Entidad para definiciones
│   └── meta-value.ts                # Entidad para valores
├── services/
│   ├── meta-definition.service.ts   # Gestión de definiciones
│   └── meta-value.service.ts        # Gestión de valores + validación
└── api/admin/
    ├── meta/definitions/route.ts    # CRUD de definiciones
    └── categories/
        ├── route.ts                 # Creación con defaults
        └── [id]/meta/route.ts       # Gestión de valores por categoría
```

## Instalación

### 1. Ejecutar migración

```bash
cd backend
psql $DATABASE_URL -f src/migrations/001_meta_fields.sql
```

### 2. Seedear definiciones SEO

Crear las tres definiciones SEO básicas:

```bash
# seo.short_description
curl -X POST http://localhost:9000/admin/meta/definitions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "scope": "category",
    "key": "seo.short_description",
    "label": "Short Description",
    "type": "text",
    "required": false,
    "default_value": "",
    "validations": {
      "maxLength": 500
    }
  }'

# seo.meta_title
curl -X POST http://localhost:9000/admin/meta/definitions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "scope": "category",
    "key": "seo.meta_title",
    "label": "Meta Title",
    "type": "text",
    "required": false,
    "default_value": "",
    "validations": {
      "maxLength": 70
    }
  }'

# seo.meta_description
curl -X POST http://localhost:9000/admin/meta/definitions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "scope": "category",
    "key": "seo.meta_description",
    "label": "Meta Description",
    "type": "text",
    "required": false,
    "default_value": "",
    "validations": {
      "maxLength": 160
    }
  }'
```

## API Endpoints

### Gestión de Definiciones

#### Listar definiciones
```bash
GET /admin/meta/definitions?scope=category
```

Respuesta:
```json
{
  "definitions": [
    {
      "id": "uuid",
      "scope": "category",
      "key": "seo.meta_title",
      "label": "Meta Title",
      "type": "text",
      "required": false,
      "default_value": "",
      "validations": { "maxLength": 70 }
    }
  ]
}
```

#### Crear/Actualizar definición
```bash
POST /admin/meta/definitions
Content-Type: application/json

{
  "scope": "category",
  "key": "featured_image",
  "label": "Featured Image URL",
  "type": "image",
  "required": false,
  "default_value": null,
  "validations": {
    "maxLength": 500
  }
}
```

#### Eliminar definición
```bash
DELETE /admin/meta/definitions?scope=category&key=featured_image
```

### Gestión de Valores por Categoría

#### Obtener meta de una categoría
```bash
GET /admin/categories/{category_id}/meta
```

Respuesta:
```json
{
  "meta": {
    "seo.short_description": "",
    "seo.meta_title": "",
    "seo.meta_description": "",
    "featured_image": null
  }
}
```

#### Actualizar meta de una categoría (bulk upsert)
```bash
POST /admin/categories/{category_id}/meta
Content-Type: application/json

{
  "seo.meta_title": "Stickers Personalizados | Mi Tienda",
  "seo.meta_description": "Descubre nuestra colección de stickers personalizados de alta calidad",
  "seo.short_description": "Stickers únicos para cada ocasión"
}
```

**Caso exitoso** (200):
```json
{
  "meta": {
    "seo.short_description": "Stickers únicos para cada ocasión",
    "seo.meta_title": "Stickers Personalizados | Mi Tienda",
    "seo.meta_description": "Descubre nuestra colección de stickers personalizados de alta calidad"
  }
}
```

**Caso error de validación** (422):
```json
{
  "message": "Validation failed",
  "errors": {
    "seo.meta_title": [" must NOT have more than 70 characters"]
  }
}
```

### Creación de Categoría con Defaults

```bash
POST /admin/categories
Content-Type: application/json

{
  "name": "Stickers",
  "handle": "stickers",
  "is_active": true
}
```

Al crear una categoría, automáticamente se inicializan todos los valores por defecto definidos en las definiciones.

## Tipos de Campo y Validaciones

### text / richtext / image
```json
{
  "type": "text",
  "validations": {
    "maxLength": 100,
    "minLength": 5
  }
}
```

### number
```json
{
  "type": "number",
  "validations": {
    "minimum": 0,
    "maximum": 100
  }
}
```

### boolean
```json
{
  "type": "boolean"
}
```

### date
```json
{
  "type": "date"
}
```
Valor debe ser ISO 8601: `"2025-11-06T10:30:00Z"`

### select
```json
{
  "type": "select",
  "options": {
    "enum": ["option1", "option2", "option3"]
  }
}
```

### json
```json
{
  "type": "json"
}
```
Permite cualquier JSON válido.

## Añadir Nuevos Metacampos

Para añadir un nuevo metacampo global:

1. **Solo crear la definición** vía POST `/admin/meta/definitions`
2. **No requiere cambios en código**
3. Automáticamente disponible para todas las categorías
4. Se inicializa con `default_value` en nuevas categorías

Ejemplo - añadir campo de prioridad:
```bash
curl -X POST http://localhost:9000/admin/meta/definitions \
  -H "Content-Type: application/json" \
  -d '{
    "scope": "category",
    "key": "display.priority",
    "label": "Display Priority",
    "type": "number",
    "required": false,
    "default_value": 0,
    "validations": {
      "minimum": 0,
      "maximum": 100
    }
  }'
```

## Integración en Store/Admin

Para exponer meta en respuestas de categorías:

```typescript
// En tu endpoint de categorías
const category = await categoryService.retrieve(id)
const meta = await metaValueService.getByCategoryId(category.id)

return {
  ...category,
  meta
}
```

## Tests

### Test 1: Crear categoría inicializa defaults
```bash
# 1. Crear categoría
POST /admin/categories
{ "name": "Test Category", "handle": "test" }

# 2. Verificar que tiene valores por defecto
GET /admin/categories/{id}/meta
# Debe devolver todos los campos con default_value
```

### Test 2: Validación exitosa
```bash
POST /admin/categories/{id}/meta
{
  "seo.meta_title": "Título válido de 50 caracteres",
  "seo.meta_description": "Descripción válida de 120 caracteres"
}
# Debe retornar 200 con los valores actualizados
```

### Test 3: Validación fallida
```bash
POST /admin/categories/{id}/meta
{
  "seo.meta_title": "Este título tiene más de 70 caracteres y debería fallar la validación según las reglas"
}
# Debe retornar 422 con detalle del error
```

### Test 4: GET devuelve combinación definición+valor
```bash
# 1. Actualizar solo un campo
POST /admin/categories/{id}/meta
{ "seo.meta_title": "Mi título" }

# 2. GET debe devolver TODOS los campos definidos
GET /admin/categories/{id}/meta
# Respuesta incluye seo.meta_title (valor custom) y otros campos (defaults)
```

## Notas Técnicas

- **Transaccional**: Todas las operaciones usan `activeManager_` del request scope
- **Validación con Ajv**: Esquemas JSON Schema generados dinámicamente según tipo
- **Cascade delete**: Al eliminar una definición, se eliminan automáticamente sus valores
- **Unique constraints**: No puede haber duplicados (scope, key) ni (scope, scope_id, def_id)
- **Sin modificar core**: Todo es modular, no toca tablas ni servicios de Medusa

## Troubleshooting

### Error: "Meta field 'X' is not defined"
Crear la definición primero con POST `/admin/meta/definitions`

### Error: "Validation failed"
Revisar que el valor cumpla con las validaciones definidas (maxLength, enum, etc.)

### Categoría no tiene defaults
Verificar que las definiciones tengan `default_value` configurado y que se esté usando el endpoint POST `/admin/categories` (no el core directo)
