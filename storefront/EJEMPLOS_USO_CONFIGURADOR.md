# 📚 Ejemplos de Uso del Configurador

## 🎯 Casos de Uso Comunes

### 1. Cliente Quiere Pegatinas Holográficas Pequeñas

**Escenario:** Un cliente quiere 50 pegatinas holográficas circulares de 5x5 cm para su laptop.

**Flujo:**
1. Navega a `/es/pegatinas/holograficas`
2. Selecciona:
   - Tipo: "Hojas de Pegatinas"
   - Forma: "Circular"
   - Material: "Holográfico" (ya seleccionado por defecto)
   - Acabado: "Lustroso"
   - Tamaño: "5x5 cm"
   - Cantidad: 50
3. Sube su diseño (logo.png)
4. Ve el precio: ~€18.75 (con 10% descuento por volumen)
5. Añade al carrito

**Payload generado:**
```json
{
  "productId": "custom-sticker-pegatinas-holograficas",
  "quantity": 1,
  "unitPrice": 18.75,
  "metadata": {
    "configurationType": "custom_sticker",
    "category": "pegatinas",
    "subcategory": "holograficas",
    "type": "hojas",
    "shape": "circular",
    "material": "holografico",
    "finish": "lustroso",
    "width": 5,
    "height": 5,
    "customQuantity": 50,
    "imageUrl": "https://storage.com/logo.png"
  }
}
```

---

### 2. Empresa Necesita Etiquetas Metálicas Premium

**Escenario:** Una empresa de joyería necesita 500 etiquetas metálicas doradas de 3x3 cm con su logo.

**Flujo:**
1. Navega a `/es/etiquetas/metalicas`
2. Selecciona:
   - Tipo: "Etiqueta de Marca"
   - Forma: "Cuadrada"
   - Material: "Metalizado Oro"
   - Acabado: "Brillante"
   - Tamaño: "3x3 cm"
   - Cantidad: 500
3. Sube logo de alta calidad
4. Ve el precio: ~€57.38 (con 25% descuento por volumen)
5. Añade al carrito

**Payload generado:**
```json
{
  "productId": "custom-sticker-etiquetas-metalicas",
  "quantity": 1,
  "unitPrice": 57.38,
  "metadata": {
    "configurationType": "custom_sticker",
    "category": "etiquetas",
    "subcategory": "metalicas",
    "type": "etiqueta_marca",
    "shape": "cuadrada",
    "material": "metalizado_oro",
    "finish": "brillante",
    "width": 3,
    "height": 3,
    "customQuantity": 500,
    "imageUrl": "https://storage.com/logo-joyeria.png"
  }
}
```

---

### 3. Artista Quiere Pegatinas Grandes Personalizadas

**Escenario:** Un artista quiere 25 pegatinas grandes contorneadas de su ilustración (20x15 cm).

**Flujo:**
1. Navega a `/es/pegatinas/broqueladas`
2. Selecciona:
   - Tipo: "Hojas de Pegatinas"
   - Forma: "Contorneada"
   - Material: "Vinilo Broquelado"
   - Acabado: "Satinado"
   - Tamaño: Personalizado → 20 cm ancho x 15 cm alto
   - Cantidad: 25
3. Sube su ilustración (arte.png)
4. Ve el precio: ~€92.63 (con 5% descuento por volumen)
5. Añade al carrito

**Payload generado:**
```json
{
  "productId": "custom-sticker-pegatinas-broqueladas",
  "quantity": 1,
  "unitPrice": 92.63,
  "metadata": {
    "configurationType": "custom_sticker",
    "category": "pegatinas",
    "subcategory": "broqueladas",
    "type": "hojas",
    "shape": "contorneada",
    "material": "vinilo_broquelado",
    "finish": "satinado",
    "width": 20,
    "height": 15,
    "customQuantity": 25,
    "imageUrl": "https://storage.com/arte.png"
  }
}
```

---

### 4. Tienda Online Necesita Etiquetas Colgantes

**Escenario:** Una tienda de ropa necesita 1000 etiquetas colgantes rectangulares de 7x12 cm.

**Flujo:**
1. Navega a `/es/pegatinas/etiquetas-colgantes`
2. Selecciona:
   - Tipo: "Etiqueta con Cuerda"
   - Forma: "Rectangular"
   - Material: "Cartón Plastificado"
   - Acabado: "Lustroso"
   - Tamaño: "7x12 cm"
   - Cantidad: 1000
3. Sube diseño de etiqueta
4. Ve el precio: ~€352.80 (con 30% descuento por volumen)
5. Añade al carrito

**Payload generado:**
```json
{
  "productId": "custom-sticker-pegatinas-etiquetas-colgantes",
  "quantity": 1,
  "unitPrice": 352.80,
  "metadata": {
    "configurationType": "custom_sticker",
    "category": "pegatinas",
    "subcategory": "etiquetas_colgantes",
    "type": "etiqueta_con_cuerda",
    "shape": "rectangular",
    "material": "carton_plastificado",
    "finish": "lustroso",
    "width": 7,
    "height": 12,
    "customQuantity": 1000,
    "imageUrl": "https://storage.com/etiqueta-ropa.png"
  }
}
```

---

## 🔧 Ejemplos de Código

### Añadir Nueva Subcategoría

```typescript
// En src/config/sticker-categories.ts

transparentes: {
  id: "transparentes",
  name: "Pegatinas Transparentes",
  slug: "transparentes",
  description: "Pegatinas con fondo transparente para cualquier superficie",
  allowedTypes: COMMON_TYPES,
  allowedShapes: COMMON_SHAPES,
  allowedMaterials: [
    { 
      id: "vinilo_transparente", 
      name: "Vinilo Transparente", 
      description: "Material transparente de alta calidad",
      priceMultiplier: 1.2 
    },
  ],
  allowedFinishes: COMMON_FINISHES,
  presetSizes: COMMON_PRESET_SIZES,
  allowCustomSize: true,
  quantitySteps: COMMON_QUANTITY_STEPS,
  minQuantity: 10,
  maxWidth: 50,
  maxHeight: 50,
}
```

### Usar el Configurador en una Página Personalizada

```typescript
// En cualquier página de Next.js

import { StickerConfigurator } from "@/components/organisms/StickerConfigurator"
import { getSubcategory } from "@/config/sticker-categories"

export default function MiPaginaPersonalizada() {
  const subcategory = getSubcategory("pegatinas", "holograficas")
  
  if (!subcategory) return null

  const handleAddToCart = async (payload: any) => {
    console.log("Producto configurado:", payload)
    // Tu lógica personalizada aquí
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1>Configurador Personalizado</h1>
      <StickerConfigurator
        subcategoryConfig={subcategory}
        categorySlug="pegatinas"
        onAddToCart={handleAddToCart}
      />
    </div>
  )
}
```

### Calcular Precio Manualmente

```typescript
import { calculateStickerPrice } from "@/lib/helpers/sticker-pricing"

// Ejemplo 1: Pegatina pequeña
const precio1 = calculateStickerPrice({
  width: 5,
  height: 5,
  quantity: 50,
  materialMultiplier: 1.5, // Holográfico
  basePrice: 0.5
})
console.log(precio1)
// {
//   totalPrice: 18.75,
//   unitPrice: 0.38,
//   discount: 1.88,
//   discountPercentage: 10
// }

// Ejemplo 2: Pegatina grande con descuento alto
const precio2 = calculateStickerPrice({
  width: 20,
  height: 15,
  quantity: 1000,
  materialMultiplier: 1.3, // Broquelado
  basePrice: 0.5
})
console.log(precio2)
// {
//   totalPrice: 1365.00,
//   unitPrice: 1.37,
//   discount: 585.00,
//   discountPercentage: 30
// }
```

### Validar Imagen Antes de Subir

```typescript
import { validateImageForUpload } from "@/lib/helpers/sticker-cart"

const handleFileSelect = (file: File) => {
  const validation = validateImageForUpload(file)
  
  if (!validation.valid) {
    alert(validation.error)
    return
  }
  
  // Proceder con la subida
  uploadImage(file)
}
```

### Obtener Todas las Subcategorías de una Categoría

```typescript
import { getSubcategories } from "@/config/sticker-categories"

const subcategoriasPegatinas = getSubcategories("pegatinas")
console.log(subcategoriasPegatinas)
// [
//   { id: "holograficas", name: "Pegatinas Holográficas", ... },
//   { id: "broqueladas", name: "Pegatinas Broqueladas", ... },
//   ...
// ]
```

---

## 🎨 Ejemplos de Personalización de Estilos

### Cambiar Colores del Configurador

```typescript
// En tailwind.config.ts, define tus colores
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B', // Tu color principal
      }
    }
  }
}

// Los componentes usarán automáticamente estos colores
```

### Personalizar Sección del Configurador

```typescript
// Crear tu propia sección personalizada

import { ConfiguratorSection } from "@/components/organisms/StickerConfigurator"

export function MiSeccionPersonalizada() {
  return (
    <ConfiguratorSection
      title="Opciones Especiales"
      description="Añade características premium a tu pedido"
    >
      <div className="space-y-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Laminado UV (+€5)</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" />
          <span>Empaque Premium (+€3)</span>
        </label>
      </div>
    </ConfiguratorSection>
  )
}
```

---

## 📊 Ejemplos de Analytics

### Trackear Eventos del Configurador

```typescript
// En el componente StickerConfigurator

import { useEffect } from "react"

// Trackear cuando se inicia una configuración
useEffect(() => {
  analytics.track("Configurator Started", {
    category: categorySlug,
    subcategory: subcategoryConfig.slug,
  })
}, [])

// Trackear cuando se completa una configuración
const handleAddToCart = () => {
  analytics.track("Configurator Completed", {
    category: categorySlug,
    subcategory: subcategoryConfig.slug,
    totalPrice: currentPrice,
    quantity: config.quantity,
    hasImage: !!config.image,
  })
  
  // ... resto del código
}
```

---

## 🧪 Ejemplos de Testing

### Test de Validación

```typescript
import { useStickerConfigurator } from "@/hooks/useStickerConfigurator"

describe("StickerConfigurator Validation", () => {
  it("should validate required fields", () => {
    const { validation } = useStickerConfigurator({
      subcategoryConfig: mockSubcategory,
      categorySlug: "pegatinas"
    })
    
    expect(validation.isValid).toBe(false)
    expect(validation.errors.type).toBeDefined()
  })
  
  it("should validate size limits", () => {
    // ... test code
  })
})
```

---

## 💡 Tips y Trucos

### 1. Precargar Configuración desde URL

```typescript
// Permitir compartir configuraciones via URL
const searchParams = useSearchParams()
const preloadedConfig = {
  type: searchParams.get("type") || "",
  shape: searchParams.get("shape") || "",
  // ... más campos
}
```

### 2. Guardar Configuración en LocalStorage

```typescript
// Guardar configuración para que el usuario pueda volver
useEffect(() => {
  localStorage.setItem(
    `config-${categorySlug}-${subcategoryConfig.slug}`,
    JSON.stringify(config)
  )
}, [config])
```

### 3. Mostrar Precio en Tiempo Real

```typescript
// Actualizar precio mientras el usuario configura
useEffect(() => {
  const timer = setTimeout(() => {
    // Calcular precio después de 500ms de inactividad
    calculatePrice()
  }, 500)
  
  return () => clearTimeout(timer)
}, [config])
```

---

## 🚀 Próximos Pasos

Estos ejemplos te ayudarán a:
1. Entender cómo funciona el configurador
2. Personalizarlo para tus necesidades
3. Integrarlo con tu sistema
4. Extenderlo con nuevas funcionalidades

¡Explora y experimenta con el configurador! 🎨
