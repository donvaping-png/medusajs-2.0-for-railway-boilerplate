# Ejemplos Prácticos - Sistema de Metafields

## Ejemplo 1: Configuración Inicial

### 1.1 Crear definiciones SEO básicas

```bash
# Definición 1: Short Description
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

# Definición 2: Meta Title
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

# Definición 3: Meta Description
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

## Ejemplo 2: Añadir Metacampos Personalizados

### 2.1 Featured Image

```bash
curl -X POST http://localhost:9000/admin/meta/definitions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "scope": "category",
    "key": "display.featured_image",
    "label": "Featured Image URL",
    "type": "image",
    "required": false,
    "default_value": null,
    "validations": {
      "maxLength": 500
    }
  }'
```

### 2.2 Display Priority

```bash
curl -X POST http://localhost:9000/admin/meta/definitions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
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

### 2.3 Category Status (Select)

```bash
curl -X POST http://localhost:9000/admin/meta/definitions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "scope": "category",
    "key": "status.visibility",
    "label": "Visibility Status",
    "type": "select",
    "required": false,
    "default_value": "public",
    "options": {
      "enum": ["public", "private", "hidden", "coming_soon"]
    }
  }'
```

### 2.4 Featured Flag (Boolean)

```bash
curl -X POST http://localhost:9000/admin/meta/definitions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "scope": "category",
    "key": "display.is_featured",
    "label": "Is Featured",
    "type": "boolean",
    "required": false,
    "default_value": false
  }'
```

### 2.5 Launch Date

```bash
curl -X POST http://localhost:9000/admin/meta/definitions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "scope": "category",
    "key": "schedule.launch_date",
    "label": "Launch Date",
    "type": "date",
    "required": false,
    "default_value": null
  }'
```

### 2.6 Custom Settings (JSON)

```bash
curl -X POST http://localhost:9000/admin/meta/definitions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "scope": "category",
    "key": "custom.settings",
    "label": "Custom Settings",
    "type": "json",
    "required": false,
    "default_value": {}
  }'
```

## Ejemplo 3: Gestión de Categorías

### 3.1 Crear categoría (defaults automáticos)

```bash
curl -X POST http://localhost:9000/admin/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Stickers Personalizados",
    "handle": "stickers-personalizados",
    "is_active": true,
    "description": "Categoría de stickers personalizados"
  }'

# Respuesta incluye el ID de la categoría
# Los valores por defecto se inicializan automáticamente
```

### 3.2 Obtener meta de una categoría

```bash
curl http://localhost:9000/admin/categories/cat_01JCEXAMPLE/meta \
  -H "Authorization: Bearer YOUR_TOKEN"

# Respuesta:
{
  "meta": {
    "seo.short_description": "",
    "seo.meta_title": "",
    "seo.meta_description": "",
    "display.featured_image": null,
    "display.priority": 0,
    "status.visibility": "public",
    "display.is_featured": false,
    "schedule.launch_date": null,
    "custom.settings": {}
  }
}
```

### 3.3 Actualizar meta de una categoría

```bash
curl -X POST http://localhost:9000/admin/categories/cat_01JCEXAMPLE/meta \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "seo.meta_title": "Stickers Personalizados | Mi Tienda",
    "seo.meta_description": "Descubre nuestra colección de stickers personalizados de alta calidad para todas las ocasiones.",
    "seo.short_description": "Stickers únicos y personalizables para expresar tu creatividad",
    "display.featured_image": "https://cdn.example.com/categories/stickers.jpg",
    "display.priority": 10,
    "display.is_featured": true,
    "status.visibility": "public"
  }'

# Respuesta 200:
{
  "meta": {
    "seo.short_description": "Stickers únicos y personalizables para expresar tu creatividad",
    "seo.meta_title": "Stickers Personalizados | Mi Tienda",
    "seo.meta_description": "Descubre nuestra colección de stickers personalizados de alta calidad para todas las ocasiones.",
    "display.featured_image": "https://cdn.example.com/categories/stickers.jpg",
    "display.priority": 10,
    "status.visibility": "public",
    "display.is_featured": true,
    "schedule.launch_date": null,
    "custom.settings": {}
  }
}
```

## Ejemplo 4: Validación de Errores

### 4.1 Meta title demasiado largo

```bash
curl -X POST http://localhost:9000/admin/categories/cat_01JCEXAMPLE/meta \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "seo.meta_title": "Este es un título muy largo que definitivamente excede los 70 caracteres permitidos y debería fallar"
  }'

# Respuesta 422:
{
  "message": "Validation failed",
  "errors": {
    "seo.meta_title": [" must NOT have more than 70 characters"]
  }
}
```

### 4.2 Valor de select inválido

```bash
curl -X POST http://localhost:9000/admin/categories/cat_01JCEXAMPLE/meta \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status.visibility": "invalid_status"
  }'

# Respuesta 422:
{
  "message": "Validation failed",
  "errors": {
    "status.visibility": [" must be equal to one of the allowed values"]
  }
}
```

### 4.3 Número fuera de rango

```bash
curl -X POST http://localhost:9000/admin/categories/cat_01JCEXAMPLE/meta \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "display.priority": 150
  }'

# Respuesta 422:
{
  "message": "Validation failed",
  "errors": {
    "display.priority": [" must be <= 100"]
  }
}
```

### 4.4 Campo no definido

```bash
curl -X POST http://localhost:9000/admin/categories/cat_01JCEXAMPLE/meta \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nonexistent.field": "value"
  }'

# Respuesta 422:
{
  "message": "Validation failed",
  "errors": {
    "nonexistent.field": ["Meta field 'nonexistent.field' is not defined for scope 'category'"]
  }
}
```

## Ejemplo 5: Integración en Store API

### 5.1 Endpoint personalizado para categorías con meta

```typescript
// src/api/store/categories/[id]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import MetaValueService from "../../../../services/meta-value.service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const categoryId = req.params.id
  const productModuleService = req.scope.resolve(Modules.PRODUCT)
  const metaValueService = req.scope.resolve<MetaValueService>("metaValueService")

  try {
    // Obtener categoría
    const category = await productModuleService.retrieveProductCategory(categoryId)
    
    // Obtener meta
    const meta = await metaValueService.getByCategoryId(categoryId)

    res.json({
      category: {
        ...category,
        meta
      }
    })
  } catch (error) {
    res.status(404).json({
      message: "Category not found",
      error: error.message
    })
  }
}
```

### 5.2 Uso en el frontend

```typescript
// storefront/src/lib/data/categories.ts
export async function getCategoryWithMeta(categoryId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/categories/${categoryId}`,
    {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY!,
      },
    }
  )

  const { category } = await response.json()
  return category
}

// Uso en componente
const category = await getCategoryWithMeta("cat_123")

// Renderizar SEO
<Head>
  <title>{category.meta["seo.meta_title"] || category.name}</title>
  <meta 
    name="description" 
    content={category.meta["seo.meta_description"] || category.description} 
  />
</Head>
```

## Ejemplo 6: Gestión de Definiciones

### 6.1 Listar todas las definiciones

```bash
curl http://localhost:9000/admin/meta/definitions?scope=category \
  -H "Authorization: Bearer YOUR_TOKEN"

# Respuesta:
{
  "definitions": [
    {
      "id": "def_01JCEXAMPLE1",
      "scope": "category",
      "key": "seo.meta_title",
      "label": "Meta Title",
      "type": "text",
      "required": false,
      "default_value": "",
      "validations": { "maxLength": 70 },
      "created_at": "2025-11-06T10:00:00Z",
      "updated_at": "2025-11-06T10:00:00Z"
    },
    // ... más definiciones
  ]
}
```

### 6.2 Actualizar una definición existente

```bash
# Cambiar el maxLength de meta_title
curl -X POST http://localhost:9000/admin/meta/definitions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "scope": "category",
    "key": "seo.meta_title",
    "label": "Meta Title (SEO)",
    "type": "text",
    "required": false,
    "default_value": "",
    "validations": {
      "maxLength": 60
    }
  }'
```

### 6.3 Eliminar una definición

```bash
curl -X DELETE "http://localhost:9000/admin/meta/definitions?scope=category&key=custom.settings" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Respuesta:
{
  "success": true
}

# Nota: Esto también eliminará todos los valores asociados (cascade delete)
```

## Ejemplo 7: Casos de Uso Avanzados

### 7.1 Rich Text Content

```bash
curl -X POST http://localhost:9000/admin/meta/definitions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "scope": "category",
    "key": "content.banner_html",
    "label": "Banner HTML Content",
    "type": "richtext",
    "required": false,
    "default_value": "",
    "validations": {
      "maxLength": 5000
    }
  }'

# Actualizar con HTML
curl -X POST http://localhost:9000/admin/categories/cat_123/meta \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "content.banner_html": "<div class=\"banner\"><h2>¡Oferta Especial!</h2><p>50% de descuento</p></div>"
  }'
```

### 7.2 Configuración JSON Compleja

```bash
# Actualizar settings JSON
curl -X POST http://localhost:9000/admin/categories/cat_123/meta \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "custom.settings": {
      "layout": "grid",
      "columns": 4,
      "showFilters": true,
      "sortOptions": ["price", "name", "newest"],
      "theme": {
        "primaryColor": "#FF6B6B",
        "secondaryColor": "#4ECDC4"
      }
    }
  }'
```

### 7.3 Programar Lanzamiento

```bash
curl -X POST http://localhost:9000/admin/categories/cat_123/meta \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "schedule.launch_date": "2025-12-01T00:00:00Z",
    "status.visibility": "coming_soon"
  }'
```

## Ejemplo 8: Migración de Datos Existentes

### 8.1 Script para migrar datos legacy

```typescript
// src/scripts/migrate-legacy-meta.ts
import { MedusaContainer } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"
import MetaValueService from "../services/meta-value.service"

export default async function migrateLegacyMeta(container: MedusaContainer) {
  const productModuleService = container.resolve(Modules.PRODUCT)
  const metaValueService = container.resolve<MetaValueService>("metaValueService")

  // Obtener todas las categorías
  const categories = await productModuleService.listProductCategories()

  for (const category of categories) {
    // Migrar datos legacy a meta
    await metaValueService.bulkUpsertCategory(category.id, {
      "seo.meta_title": category.metadata?.seo_title || "",
      "seo.meta_description": category.metadata?.seo_description || "",
      "display.priority": category.metadata?.priority || 0,
    })

    console.log(`Migrated meta for category: ${category.name}`)
  }

  console.log("Migration completed!")
}
```

## Notas Finales

- Todos los ejemplos asumen que el backend está corriendo en `localhost:9000`
- Reemplazar `YOUR_TOKEN` con un token de admin válido
- Los IDs de categoría (`cat_01JCEXAMPLE`) son ejemplos, usar IDs reales
- Las validaciones se ejecutan automáticamente en cada actualización
- Los defaults se aplican solo en la creación de categorías
