/**
 * Tipos para el configurador de pegatinas
 */

export interface StickerConfiguration {
  // Identificación
  categorySlug: string
  subcategorySlug: string
  
  // Configuración del producto
  type: string
  shape: string
  material: string
  finish: string
  
  // Tamaño
  size: {
    preset?: string
    custom?: {
      width: number
      height: number
    }
  }
  
  // Cantidad
  quantity: number
  
  // Imagen
  image?: {
    file?: File
    preview?: string
    url?: string
  }
  
  // Precio calculado
  calculatedPrice?: number
  unitPrice?: number
}

export interface ConfiguratorValidation {
  isValid: boolean
  errors: {
    type?: string
    shape?: string
    material?: string
    finish?: string
    size?: string
    quantity?: string
    image?: string
  }
}

export interface PriceCalculationParams {
  width: number
  height: number
  quantity: number
  materialMultiplier: number
  basePrice?: number
}

export interface AddToCartPayload {
  productId: string
  quantity: number
  unitPrice: number
  metadata: {
    configurationType: 'custom_sticker'
    category: string
    subcategory: string
    type: string
    shape: string
    material: string
    finish: string
    width: number
    height: number
    customQuantity: number
    imageUrl?: string
  }
}
