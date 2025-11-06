'use client'

import { HttpTypes } from '@medusajs/types'
import { useState } from 'react'
import Image from 'next/image'

type VariantImage = {
  url: string
}

type VariantImageGalleryProps = {
  variant: HttpTypes.StoreProductVariant
  productTitle: string
}

/**
 * Componente para mostrar las imágenes de una variante de producto
 * usando el plugin medusa-variant-images
 */
export function VariantImageGallery({
  variant,
  productTitle,
}: VariantImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  // Obtener imágenes desde metadata (agregadas por medusa-variant-images)
  const variantImages = variant.metadata?.images as VariantImage[] | undefined
  const variantThumbnail = variant.metadata?.thumbnail as string | undefined

  // Si no hay imágenes de variante, no mostrar nada
  if (!variantImages || variantImages.length === 0) {
    return null
  }

  const currentImage = variantImages[selectedImageIndex]

  return (
    <div className="flex flex-col gap-4">
      {/* Imagen principal */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        {currentImage && (
          <Image
            src={currentImage.url}
            alt={`${productTitle} - ${variant.title || 'Variant'}`}
            fill
            className="object-cover"
            priority={selectedImageIndex === 0}
          />
        )}
      </div>

      {/* Thumbnails */}
      {variantImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {variantImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                selectedImageIndex === index
                  ? 'border-primary'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={image.url}
                alt={`${productTitle} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Información adicional */}
      <div className="text-sm text-gray-600">
        {variantThumbnail && (
          <p>Thumbnail principal: {variantThumbnail}</p>
        )}
        <p>Total de imágenes: {variantImages.length}</p>
      </div>
    </div>
  )
}
