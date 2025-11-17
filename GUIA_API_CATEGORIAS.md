# Guía API de Categorías de Productos Personalizables

## ✅ Implementación Completada

**Commit:** `1a4bd72`  
**Estado:** ✅ Desplegado en Railway

---

## 🎯 Endpoints Disponibles

### 1. **GET /store/custom-products/categories**

Obtiene todos los productos personalizables agrupados por categoría y subcategoría.

#### Respuesta:

```json
{
  "categories": [
    {
      "category": "pegatinas",
      "name": "Pegatinas",
      "description": "Pegatinas personalizables para todo tipo de superficies",
      "totalProducts": 5,
      "subcategories": [
        {
          "subcategory": "suelo",
          "name": "Para el Suelo",
          "description": "Pegatinas resistentes para suelos",
          "products": [
            {
              "id": "prod_123",
              "title": "Pegatinas para el Suelo",
              "handle": "pegatinas-suelo",
              "thumbnail": "https://...",
              "configurator_config": {
                "shapes": ["contorneado", "cuadrado"],
                "materials": [
                  {
                    "id": "vinilo",
                    "name": "Vinilo",
                    "priceMultiplier": 1.0
                  }
                ],
                "sizes": [
                  {
                    "label": "30x15 cm",
                    "width": 30,
                    "height": 15
                  }
                ],
                "quantities": [
                  {
                    "qty": 10,
                    "basePrice": 50.0
                  }
                ],
                "finishes": [],
                "allowCustomSize": false,
                "minQuantity": 10
              },
              "raw_metadata": {
                "product_type": "custom_sticker",
                "category": "pegatinas",
                "subcategory": "suelo"
              }
            }
          ]
        }
      ]
    }
  ],
  "totalCategories": 2,
  "totalSubcategories": 5,
  "totalProducts": 10
}
```

---

## 📊 Estructura de Datos

### Categorías Soportadas

El endpoint reconoce automáticamente estas categorías:

- **pegatinas** → "Pegatinas"
- **etiquetas** → "Etiquetas"
- **vinilos** → "Vinilos"
- **otros** → "Otros"

### Subcategorías Soportadas

- **suelo** → "Para el Suelo"
- **pared** → "Para la Pared"
- **cristal** → "Para Cristal"
- **vehiculos** → "Para Vehículos"
- **productos** → "Para Productos"
- **envases** → "Para Envases"
- **general** → "General"

---

## 🚀 Cómo Usar

### 1. **Configurar Productos en el Admin**

Para que un producto aparezca en las categorías:

1. Ve al Admin de Medusa
2. Edita un producto
3. Añade metadata:
   - `product_type`: `custom_sticker`
   - `category`: `pegatinas` (o `etiquetas`, `vinilos`, etc.)
   - `subcategory`: `suelo` (o `pared`, `cristal`, etc.)
4. Configura el producto con el widget del configurador
5. Guarda

### 2. **Consumir la API desde el Frontend**

```typescript
import { getCustomProductsByCategories } from "@/lib/data/custom-products"

// En un Server Component
const categoriesData = await getCustomProductsByCategories()

// Acceder a los datos
categoriesData.categories.forEach((category) => {
  console.log(`Categoría: ${category.name}`)
  console.log(`Total productos: ${category.totalProducts}`)

  category.subcategories.forEach((subcategory) => {
    console.log(`  Subcategoría: ${subcategory.name}`)
    console.log(`  Productos: ${subcategory.products.length}`)
  })
})
```

### 3. **Ver la Página de Categorías**

```
https://tu-dominio.railway.app/es/categorias-personalizables
```

---

## 🎨 Características de la Página

### Estructura Jerárquica

```
Categorías de Productos Personalizables
├── Pegatinas (5 productos)
│   ├── Para el Suelo (2 productos)
│   │   ├── Producto 1
│   │   └── Producto 2
│   └── Para la Pared (3 productos)
│       ├── Producto 3
│       ├── Producto 4
│       └── Producto 5
└── Etiquetas (3 productos)
    └── Para Productos (3 productos)
        ├── Producto 6
        ├── Producto 7
        └── Producto 8
```

### Elementos Visuales

- **Breadcrumbs**: Navegación clara
- **Estadísticas**: Total de productos, categorías y subcategorías
- **Cards Compactas**: Diseño optimizado para mostrar muchos productos
- **Hover Effects**: Animaciones suaves al pasar el mouse
- **Badges**: Indicador "Personalizable" en cada producto
- **Precios**: Muestra el precio más bajo disponible
- **Responsive**: Se adapta a móviles, tablets y desktop

---

## 📝 Funciones Helper Disponibles

### En `storefront/src/lib/data/custom-products.ts`

```typescript
// Obtener todas las categorías agrupadas
const categories = await getCustomProductsByCategories()

// Obtener todos los productos (sin agrupar)
const products = await getCustomProducts()

// Obtener un producto específico
const product = await getCustomProduct("pegatinas-suelo")

// Verificar si un producto es personalizable
const isCustom = isCustomProduct(product)

// Obtener configuración del configurador
const config = getProductConfig(product)

// Filtrar por categoría
const pegatinas = filterProductsByCategory(products, "pegatinas")

// Filtrar por subcategoría
const suelo = filterProductsBySubcategory(products, "suelo")

// Obtener estadísticas
const stats = getCustomProductsStats(products)
```

---

## 🔧 Personalización

### Añadir Nuevas Categorías

Edita `backend/src/api/store/custom-products/categories/route.ts`:

```typescript
function getCategoryName(category: string): string {
  const names: Record<string, string> = {
    pegatinas: "Pegatinas",
    etiquetas: "Etiquetas",
    vinilos: "Vinilos",
    otros: "Otros",
    // Añade tu nueva categoría aquí
    nuevacategoria: "Nueva Categoría",
  }
  return names[category] || category.charAt(0).toUpperCase() + category.slice(1)
}
```

### Añadir Nuevas Subcategorías

```typescript
function getSubcategoryName(subcategory: string): string {
  const names: Record<string, string> = {
    suelo: "Para el Suelo",
    pared: "Para la Pared",
    // Añade tu nueva subcategoría aquí
    nuevasubcat: "Nueva Subcategoría",
  }
  return (
    names[subcategory] ||
    subcategory.charAt(0).toUpperCase() + subcategory.slice(1)
  )
}
```

---

## 🎯 Casos de Uso

### 1. **Menú de Navegación**

Usa las categorías para crear un menú dinámico:

```typescript
const { categories } = await getCustomProductsByCategories()

// Generar menú
categories.map((cat) => ({
  label: cat.name,
  href: `/categorias/${cat.category}`,
  subcategories: cat.subcategories.map((sub) => ({
    label: sub.name,
    href: `/categorias/${cat.category}/${sub.subcategory}`,
  })),
}))
```

### 2. **Página de Categoría Específica**

Crea rutas dinámicas para cada categoría:

```typescript
// app/[locale]/(main)/categorias/[category]/page.tsx
const { categories } = await getCustomProductsByCategories()
const category = categories.find((c) => c.category === params.category)
```

### 3. **Filtros Dinámicos**

Usa las categorías para crear filtros:

```typescript
const { categories } = await getCustomProductsByCategories()

// Obtener todas las opciones de filtro
const filterOptions = {
  categories: categories.map((c) => ({ value: c.category, label: c.name })),
  subcategories: categories.flatMap((c) =>
    c.subcategories.map((s) => ({ value: s.subcategory, label: s.name }))
  ),
}
```

---

## 📊 Ejemplo de Respuesta Completa

```json
{
  "categories": [
    {
      "category": "pegatinas",
      "name": "Pegatinas",
      "description": "Pegatinas personalizables para todo tipo de superficies",
      "totalProducts": 2,
      "subcategories": [
        {
          "subcategory": "suelo",
          "name": "Para el Suelo",
          "description": "Pegatinas resistentes para suelos",
          "products": [
            {
              "id": "prod_01JCQR...",
              "title": "Pegatinas para el Suelo",
              "handle": "pegatinas-suelo",
              "thumbnail": "https://...",
              "configurator_config": {
                "shapes": ["contorneado", "cuadrado", "redondo"],
                "materials": [
                  { "id": "vinilo", "name": "Vinilo", "priceMultiplier": 1.0 },
                  {
                    "id": "vinilo-premium",
                    "name": "Vinilo Premium",
                    "priceMultiplier": 1.5
                  }
                ],
                "sizes": [
                  { "label": "30x15 cm", "width": 30, "height": 15 },
                  { "label": "50x25 cm", "width": 50, "height": 25 }
                ],
                "quantities": [
                  { "qty": 10, "basePrice": 50.0 },
                  { "qty": 25, "basePrice": 100.0 },
                  { "qty": 50, "basePrice": 180.0 }
                ],
                "finishes": [
                  { "id": "mate", "name": "Acabado Mate" },
                  { "id": "brillo", "name": "Acabado Brillo" }
                ],
                "allowCustomSize": true,
                "minQuantity": 10,
                "maxWidth": 100,
                "maxHeight": 100
              }
            }
          ]
        }
      ]
    }
  ],
  "totalCategories": 1,
  "totalSubcategories": 1,
  "totalProducts": 1
}
```

---

## ✅ Checklist de Implementación

- [x] Endpoint `/store/custom-products/categories` creado
- [x] Agrupación por categoría y subcategoría
- [x] Nombres y descripciones automáticas
- [x] Parseo de configuración del configurador
- [x] Funciones helper en el frontend
- [x] Página `/categorias-personalizables` creada
- [x] Diseño responsive
- [x] Manejo de errores
- [x] Estadísticas de productos
- [x] Breadcrumbs y navegación
- [x] Documentación completa

---

## 🚀 Próximos Pasos

1. **Crear productos** con metadata de categoría y subcategoría
2. **Verificar** que aparecen en `/categorias-personalizables`
3. **Añadir al menú** principal del sitio
4. **Crear rutas dinámicas** para categorías específicas (opcional)
5. **Añadir filtros** por categoría en otras páginas (opcional)

---

## 📞 Soporte

Si necesitas ayuda o tienes preguntas:

- Revisa la documentación de Medusa
- Verifica que los productos tengan el metadata correcto
- Comprueba que el backend esté funcionando
- Revisa los logs del servidor para errores

¡Disfruta de tu sistema de categorías! 🎉
