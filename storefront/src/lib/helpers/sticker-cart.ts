/**
 * Funciones helper para añadir pegatinas personalizadas al carrito
 * TODO: Integrar con la API de carrito de Medusa
 */

import type { AddToCartPayload } from "@/types/sticker-configurator"

/**
 * Añade una pegatina personalizada al carrito
 * Esta es una implementación mock que debe ser reemplazada por la integración real con Medusa
 */
export async function addCustomStickerToCart(
  payload: AddToCartPayload
): Promise<{ success: boolean; message: string; cartId?: string }> {
  try {
    console.log("[addCustomStickerToCart] Payload:", payload)

    // TODO: Implementar la llamada real a la API de Medusa
    // Ejemplo de cómo debería ser:
    /*
    const response = await fetch('/api/cart/line-items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variant_id: payload.productId,
        quantity: payload.quantity,
        metadata: payload.metadata,
      }),
    })

    if (!response.ok) {
      throw new Error('Error al añadir al carrito')
    }

    const data = await response.json()
    return {
      success: true,
      message: 'Producto añadido al carrito',
      cartId: data.cart.id,
    }
    */

    // Mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Producto añadido al carrito (mock)",
          cartId: "mock-cart-id",
        })
      }, 500)
    })
  } catch (error) {
    console.error("[addCustomStickerToCart] Error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

/**
 * Valida que la imagen esté lista para subir
 */
export function validateImageForUpload(file: File): {
  valid: boolean
  error?: string
} {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"]

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Formato no válido. Solo se permiten JPG y PNG",
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: "El archivo es demasiado grande. Máximo 10MB",
    }
  }

  return { valid: true }
}

/**
 * Sube una imagen al storage
 * TODO: Implementar la subida real a S3 o el servicio que use Medusa
 */
export async function uploadStickerImage(file: File): Promise<{
  success: boolean
  url?: string
  error?: string
}> {
  try {
    const validation = validateImageForUpload(file)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      }
    }

    console.log("[uploadStickerImage] Uploading file:", file.name)

    // TODO: Implementar la subida real
    /*
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Error al subir la imagen')
    }

    const data = await response.json()
    return {
      success: true,
      url: data.url,
    }
    */

    // Mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          url: `https://example.com/uploads/${file.name}`,
        })
      }, 1000)
    })
  } catch (error) {
    console.error("[uploadStickerImage] Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error al subir imagen",
    }
  }
}
