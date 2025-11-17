/**
 * Funciones helper para cálculo de precios de pegatinas personalizadas
 * TODO: Conectar con la API de precios de Medusa cuando esté disponible
 */

export interface PricingParams {
  width: number
  height: number
  quantity: number
  materialMultiplier?: number
  basePrice?: number
}

export interface PricingResult {
  totalPrice: number
  unitPrice: number
  discount: number
  discountPercentage: number
}

/**
 * Calcula el precio de pegatinas personalizadas
 * Esta es una implementación mock que debe ser reemplazada por la lógica real
 */
export function calculateStickerPrice(params: PricingParams): PricingResult {
  const {
    width,
    height,
    quantity,
    materialMultiplier = 1.0,
    basePrice = 0.5, // €0.50 por cm² base
  } = params

  // Calcular área en cm²
  const area = width * height

  // Precio base por unidad
  let pricePerUnit = area * basePrice * materialMultiplier

  // Aplicar descuentos por volumen
  let discountPercentage = 0
  if (quantity >= 1000) discountPercentage = 30
  else if (quantity >= 500) discountPercentage = 25
  else if (quantity >= 250) discountPercentage = 20
  else if (quantity >= 100) discountPercentage = 15
  else if (quantity >= 50) discountPercentage = 10
  else if (quantity >= 25) discountPercentage = 5

  const discount = (pricePerUnit * discountPercentage) / 100
  pricePerUnit -= discount

  // Precio mínimo por unidad
  const minPricePerUnit = 0.5
  pricePerUnit = Math.max(pricePerUnit, minPricePerUnit)

  // Calcular total
  const totalPrice = pricePerUnit * quantity

  return {
    totalPrice: Math.round(totalPrice * 100) / 100,
    unitPrice: Math.round(pricePerUnit * 100) / 100,
    discount: Math.round(discount * quantity * 100) / 100,
    discountPercentage,
  }
}

/**
 * Formatea un precio en euros
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

/**
 * Calcula el ahorro por volumen
 */
export function calculateVolumeSavings(
  quantity: number,
  unitPrice: number
): { savings: number; percentage: number } {
  // Precio sin descuento (como si fuera cantidad mínima)
  const baseUnitPrice = unitPrice / 0.95 // Asumiendo 5% descuento mínimo

  const totalWithoutDiscount = baseUnitPrice * quantity
  const totalWithDiscount = unitPrice * quantity
  const savings = totalWithoutDiscount - totalWithDiscount

  const percentage = (savings / totalWithoutDiscount) * 100

  return {
    savings: Math.round(savings * 100) / 100,
    percentage: Math.round(percentage),
  }
}
