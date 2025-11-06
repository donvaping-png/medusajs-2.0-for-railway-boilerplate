# Uso de Imágenes de Variantes en el Storefront

Este documento explica cómo usar las imágenes de variantes proporcionadas por el plugin `medusa-variant-images`.

## 📦 Componente Incluido

Se ha creado un componente `VariantImageGallery` en:
```
storefront/src/components/molecules/VariantImageGallery/
```

## 🎯 Uso Básico

### 1. Importar el Componente

```typescript
import { VariantImageGallery } from '@/components/molecules/VariantImageGallery'
```

### 2. Usar en una Página de Producto

```tsx
export default function ProductPage({ product }: { product: HttpTypes.StoreProduct }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0])

  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Galería de imágenes de la variante */}
      <VariantImageGallery
        variant={selectedVariant}
        productTitle={product.title}
      />

      {/* Selector de variantes */}
      <div>
        <h1>{product.title}</h1>
        <select onChange={(e) => {
          const variant = product.variants?.find(v => v.id === e.target.value)
          setSelectedVariant(variant)
        }}>
          {product.variants?.map(variant => (
            <option key={variant.id} value={variant.id}>
              {variant.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
```

## 🔧 Acceso Manual a las Imágenes

Si prefieres crear tu propia implementación:

```typescript
type VariantImage = {
  url: string
}

// Obtener todas las imágenes de una variante
const images = variant.metadata?.images as VariantImage[] | undefined

// Obtener el thumbnail principal
const thumbnail = variant.metadata?.thumbnail as string | undefined

// Ejemplo de uso
{images?.map((image, index) => (
  <img 
    key={index}
    src={image.url} 
    alt={`Variant image ${index + 1}`}
    className="w-full h-auto"
  />
))}
```

## 📝 Tipos TypeScript

Puedes crear tipos personalizados para mejor autocompletado:

```typescript
// storefront/src/types/variant-images.ts
export type VariantImage = {
  url: string
}

export type VariantWithImages = HttpTypes.StoreProductVariant & {
  metadata?: {
    thumbnail?: string
    images?: VariantImage[]
  }
}
```

## 🎨 Ejemplos de Implementación

### Ejemplo 1: Galería Simple

```tsx
function SimpleGallery({ variant }: { variant: HttpTypes.StoreProductVariant }) {
  const images = variant.metadata?.images as VariantImage[] | undefined

  if (!images || images.length === 0) {
    return <p>No hay imágenes disponibles</p>
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image, index) => (
        <img
          key={index}
          src={image.url}
          alt={`Image ${index + 1}`}
          className="w-full rounded-lg"
        />
      ))}
    </div>
  )
}
```

### Ejemplo 2: Carrusel con Embla

```tsx
import useEmblaCarousel from 'embla-carousel-react'

function VariantCarousel({ variant }: { variant: HttpTypes.StoreProductVariant }) {
  const [emblaRef] = useEmblaCarousel()
  const images = variant.metadata?.images as VariantImage[] | undefined

  if (!images || images.length === 0) return null

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {images.map((image, index) => (
          <div key={index} className="flex-[0_0_100%]">
            <img
              src={image.url}
              alt={`Slide ${index + 1}`}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
```

### Ejemplo 3: Lightbox con Zoom

```tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'

function VariantLightbox({ variant }: { variant: HttpTypes.StoreProductVariant }) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const images = variant.metadata?.images as VariantImage[] | undefined

  if (!images || images.length === 0) return null

  return (
    <>
      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setIsOpen(true)
            }}
            className="relative aspect-square"
          >
            <Image
              src={image.url}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover rounded"
            />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-full max-w-4xl h-full max-h-[80vh]">
            <Image
              src={images[currentIndex].url}
              alt={`Full size ${currentIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
          
          {/* Navigation */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl"
          >
            ›
          </button>
        </div>
      )}
    </>
  )
}
```

## 🔍 Verificación

Para verificar que las imágenes están disponibles:

```typescript
// En cualquier componente donde tengas acceso a una variante
console.log('Variant metadata:', variant.metadata)
console.log('Variant images:', variant.metadata?.images)
console.log('Variant thumbnail:', variant.metadata?.thumbnail)
```

## ⚠️ Notas Importantes

1. **Asegúrate de que `+metadata` esté en las peticiones**: Ya está configurado en `storefront/src/lib/data/products.ts`

2. **Las imágenes solo aparecen si se suben desde el admin**: Debes subir imágenes específicas para cada variante desde el dashboard de Medusa

3. **Fallback a imágenes del producto**: Si una variante no tiene imágenes propias, considera usar las imágenes del producto como fallback:

```typescript
const images = variant.metadata?.images as VariantImage[] | undefined
const fallbackImages = product.images?.map(img => ({ url: img.url }))
const displayImages = images && images.length > 0 ? images : fallbackImages
```

4. **Optimización de imágenes**: Usa el componente `Image` de Next.js para optimización automática

## 📚 Recursos

- [Documentación del plugin](https://www.npmjs.com/package/medusa-variant-images)
- [Guía de configuración](../backend/VARIANT_IMAGES_SETUP.md)
- [MedusaJS Docs](https://docs.medusajs.com/)
