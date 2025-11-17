/**
 * Motor de cálculo de precios para productos configurables
 * Soporta múltiples modos: tabla fija, por m², híbrido
 */

import type {
  PriceCalculationInput,
  PriceCalculationResult,
  FixedTablePricing,
  PerSqmPricing,
  HybridPricing,
  AppliedDiscount,
} from '@/types/pricing-configurator'

/**
 * Calcula el precio según la configuración del producto
 */
export function calculatePrice(input: PriceCalculationInput): PriceCalculationResult {
  const { pricingConfig } = input

  switch (pricingConfig.mode) {
    case 'fixed_table':
      return calculateFixedTablePrice(input, pricingConfig)
    case 'per_sqm':
      return calculatePerSqmPrice(input, pricingConfig)
    case 'hybrid':
      return calculateHybridPrice(input, pricingConfig)
    default:
      throw new Error(`Modo de precio desconocido: ${(pricingConfig as any).mode}`)
  }
}

/**
 * Modo 1: Tabla de precios fijos
 */
function calculateFixedTablePrice(
  input: PriceCalculationInput,
  config: FixedTablePricing
): PriceCalculationResult {
  const { quantity, materialMultiplier } = input

  // Buscar el precio en la tabla (cantidad exacta o la más cercana menor)
  const sortedQuantities = [...config.quantities].sort((a, b) => a.qty - b.qty)
  const priceEntry = sortedQuantities
    .reverse()
    .find((entry) => quantity >= entry.qty) || sortedQuantities[0]

  const basePrice = priceEntry.basePrice
  const unitPrice = (basePrice / priceEntry.qty) * materialMultiplier
  const totalPrice = unitPrice * quantity

  return {
    unitPrice,
    totalPrice,
    breakdown: {
      basePrice,
      materialMultiplier,
      appliedMinPrice: false,
    },
  }
}

/**
 * Modo 2: Precio por metro cuadrado
 */
function calculatePerSqmPrice(
  input: PriceCalculationInput,
  config: PerSqmPricing
): PriceCalculationResult {
  const { width, height, quantity, materialMultiplier, shape, finish } = input

  // Calcular área en m²
  const area = (width * height) / 10000

  // Validar área mínima
  if (config.min_area && area < config.min_area) {
    throw new Error(`El área mínima es ${config.min_area} m²`)
  }

  // Precio base por área
  let basePrice = area * config.base_price_per_sqm

  // Aplicar multiplicador de forma
  const shapeMultiplier = shape && config.shape_multipliers
    ? config.shape_multipliers[shape] || 1.0
    : 1.0
  basePrice *= shapeMultiplier

  // Aplicar multiplicador de acabado
  const finishMultiplier = finish && config.finish_multipliers
    ? config.finish_multipliers[finish] || 1.0
    : 1.0
  basePrice *= finishMultiplier

  // Aplicar multiplicador de material
  basePrice *= materialMultiplier

  // Aplicar descuento por volumen
  let volumeDiscount = 0
  if (config.volume_discounts) {
    const applicableDiscount = config.volume_discounts
      .filter((d) => quantity >= d.min_qty)
      .sort((a, b) => b.discount_percent - a.discount_percent)[0]

    if (applicableDiscount) {
      volumeDiscount = applicableDiscount.discount_percent
      basePrice *= (1 - volumeDiscount / 100)
    }
  }

  // Aplicar precio mínimo
  const appliedMinPrice = basePrice < config.min_price
  const unitPrice = Math.max(basePrice, config.min_price)
  const totalPrice = unitPrice * quantity

  return {
    unitPrice,
    totalPrice,
    breakdown: {
      basePrice: area * config.base_price_per_sqm,
      area,
      pricePerSqm: config.base_price_per_sqm,
      materialMultiplier,
      shapeMultiplier,
      finishMultiplier,
      volumeDiscount,
      appliedMinPrice,
    },
  }
}

/**
 * Modo 3: Precio híbrido (tiers de tamaño + multiplicadores de cantidad)
 */
function calculateHybridPrice(
  input: PriceCalculationInput,
  config: HybridPricing
): PriceCalculationResult {
  const { width, height, quantity, materialMultiplier, shape, finish } = input

  // Calcular área en m²
  const area = (width * height) / 10000

  // Determinar el tier de precio según el área
  const sortedTiers = [...config.size_tiers].sort((a, b) => {
    if (a.max_area === null) return 1
    if (b.max_area === null) return -1
    return a.max_area - b.max_area
  })

  const tier = sortedTiers.find(
    (t) => t.max_area === null || area <= t.max_area
  ) || sortedTiers[sortedTiers.length - 1]

  const pricePerSqm = tier.price_per_sqm

  // Precio base por área
  let basePrice = area * pricePerSqm

  // Aplicar multiplicador de cantidad
  const sortedMultipliers = [...config.quantity_multipliers].sort(
    (a, b) => b.min_qty - a.min_qty
  )
  const quantityMultiplier = sortedMultipliers.find(
    (m) => quantity >= m.min_qty
  )?.multiplier || 1.0
  basePrice *= quantityMultiplier

  // Aplicar multiplicador de forma
  const shapeMultiplier = shape && config.shape_multipliers
    ? config.shape_multipliers[shape] || 1.0
    : 1.0
  basePrice *= shapeMultiplier

  // Aplicar multiplicador de acabado
  const finishMultiplier = finish && config.finish_multipliers
    ? config.finish_multipliers[finish] || 1.0
    : 1.0
  basePrice *= finishMultiplier

  // Aplicar multiplicador de material
  basePrice *= materialMultiplier

  // Aplicar precio mínimo
  const appliedMinPrice = basePrice < config.min_price
  const unitPrice = Math.max(basePrice, config.min_price)
  const totalPrice = unitPrice * quantity

  return {
    unitPrice,
    totalPrice,
    breakdown: {
      basePrice: area * pricePerSqm,
      area,
      pricePerSqm,
      materialMultiplier,
      shapeMultiplier,
      finishMultiplier,
      quantityMultiplier,
      appliedMinPrice,
    },
  }
}

/**
 * Obtiene los descuentos aplicados
 */
export function getAppliedDiscounts(
  input: PriceCalculationInput,
  result: PriceCalculationResult
): AppliedDiscount[] {
  const discounts: AppliedDiscount[] = []
  const { pricingConfig, quantity } = input
  const { breakdown } = result

  // Descuento por volumen (per_sqm mode)
  if (pricingConfig.mode === 'per_sqm' && breakdown.volumeDiscount) {
    const discount = pricingConfig.volume_discounts?.find(
      (d) => quantity >= d.min_qty
    )
    if (discount) {
      discounts.push({
        type: 'volume',
        amount: breakdown.basePrice * (discount.discount_percent / 100),
        percent: discount.discount_percent,
        description: `Descuento por volumen (${quantity} unidades)`,
      })
    }
  }

  // Multiplicador de cantidad (hybrid mode)
  if (pricingConfig.mode === 'hybrid' && breakdown.quantityMultiplier && breakdown.quantityMultiplier < 1.0) {
    const discountPercent = (1 - breakdown.quantityMultiplier) * 100
    discounts.push({
      type: 'quantity_multiplier',
      amount: breakdown.basePrice * (1 - breakdown.quantityMultiplier),
      percent: discountPercent,
      description: `Descuento por cantidad (${quantity} unidades)`,
    })
  }

  return discounts
}

/**
 * Formatea el precio para mostrar
 */
export function formatPrice(price: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(price)
}

/**
 * Calcula el ahorro respecto al precio sin descuento
 */
export function calculateSavings(
  input: PriceCalculationInput,
  result: PriceCalculationResult
): number {
  const { breakdown } = result
  const { quantity } = input

  // Precio sin descuentos
  let priceWithoutDiscounts = breakdown.basePrice

  if (breakdown.materialMultiplier) {
    priceWithoutDiscounts *= breakdown.materialMultiplier
  }
  if (breakdown.shapeMultiplier) {
    priceWithoutDiscounts *= breakdown.shapeMultiplier
  }
  if (breakdown.finishMultiplier) {
    priceWithoutDiscounts *= breakdown.finishMultiplier
  }

  const totalWithoutDiscounts = priceWithoutDiscounts * quantity
  const savings = totalWithoutDiscounts - result.totalPrice

  return Math.max(0, savings)
}

/**
 * Obtiene el siguiente descuento disponible
 */
export function getNextDiscount(
  input: PriceCalculationInput
): { quantity: number; discount: number } | null {
  const { pricingConfig, quantity } = input

  if (pricingConfig.mode === 'per_sqm' && pricingConfig.volume_discounts) {
    const nextDiscount = pricingConfig.volume_discounts
      .filter((d) => d.min_qty > quantity)
      .sort((a, b) => a.min_qty - b.min_qty)[0]

    if (nextDiscount) {
      return {
        quantity: nextDiscount.min_qty,
        discount: nextDiscount.discount_percent,
      }
    }
  }

  if (pricingConfig.mode === 'hybrid') {
    const nextMultiplier = pricingConfig.quantity_multipliers
      .filter((m) => m.min_qty > quantity)
      .sort((a, b) => a.min_qty - b.min_qty)[0]

    if (nextMultiplier) {
      const currentMultiplier = pricingConfig.quantity_multipliers
        .filter((m) => m.min_qty <= quantity)
        .sort((a, b) => b.min_qty - a.min_qty)[0]?.multiplier || 1.0

      const discountPercent = (1 - nextMultiplier.multiplier / currentMultiplier) * 100

      return {
        quantity: nextMultiplier.min_qty,
        discount: discountPercent,
      }
    }
  }

  return null
}

