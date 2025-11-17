/**
 * Tipos para el configurador de precios avanzado
 */

// Modos de precio disponibles
export type PricingMode = 'fixed_table' | 'per_sqm' | 'hybrid'

// Configuración de precio fijo por cantidad
export interface FixedPriceEntry {
  qty: number
  basePrice: number
}

// Descuento por volumen
export interface VolumeDiscount {
  min_qty: number
  discount_percent: number
}

// Tier de precio por área
export interface SizeTier {
  max_area: number | null // null = sin límite
  price_per_sqm: number
}

// Multiplicador por cantidad
export interface QuantityMultiplier {
  min_qty: number
  multiplier: number
}

// Multiplicadores por característica
export interface ShapeMultipliers {
  [shapeId: string]: number
}

export interface FinishMultipliers {
  [finishId: string]: number
}

// Configuración de precio: Tabla Fija
export interface FixedTablePricing {
  mode: 'fixed_table'
  quantities: FixedPriceEntry[]
  min_quantity: number
}

// Configuración de precio: Por Metro Cuadrado
export interface PerSqmPricing {
  mode: 'per_sqm'
  base_price_per_sqm: number
  min_price: number
  min_area?: number
  volume_discounts?: VolumeDiscount[]
  shape_multipliers?: ShapeMultipliers
  finish_multipliers?: FinishMultipliers
}

// Configuración de precio: Híbrido
export interface HybridPricing {
  mode: 'hybrid'
  base_price_per_sqm: number
  size_tiers: SizeTier[]
  quantity_multipliers: QuantityMultiplier[]
  min_price: number
  shape_multipliers?: ShapeMultipliers
  finish_multipliers?: FinishMultipliers
}

// Unión de todos los tipos de pricing
export type PricingConfig = FixedTablePricing | PerSqmPricing | HybridPricing

// Metadata completa del producto con pricing
export interface ProductPricingMetadata {
  product_type: string
  pricing: PricingConfig
  config: {
    shapes: string[]
    materials: Array<{
      id: string
      name: string
      priceMultiplier: number
    }>
    sizes?: Array<{
      label: string
      width: number
      height: number
    }>
    finishes?: Array<{
      id: string
      name: string
    }>
    allowCustomSize: boolean
    maxWidth?: number
    maxHeight?: number
    minQuantity: number
  }
}

// Parámetros para calcular precio
export interface PriceCalculationInput {
  width: number // en cm
  height: number // en cm
  quantity: number
  materialMultiplier: number
  shape?: string
  finish?: string
  pricingConfig: PricingConfig
}

// Resultado del cálculo de precio
export interface PriceCalculationResult {
  unitPrice: number
  totalPrice: number
  breakdown: {
    basePrice: number
    area?: number // en m²
    pricePerSqm?: number
    materialMultiplier: number
    shapeMultiplier?: number
    finishMultiplier?: number
    quantityMultiplier?: number
    volumeDiscount?: number
    appliedMinPrice: boolean
  }
}

// Información de descuento aplicado
export interface AppliedDiscount {
  type: 'volume' | 'quantity_multiplier'
  amount: number
  percent: number
  description: string
}

