"use client"

import { useMemo } from 'react'
import {
  calculatePrice,
  getAppliedDiscounts,
  calculateSavings,
  getNextDiscount,
  formatPrice,
} from '@/lib/helpers/pricing-calculator'
import type {
  PricingConfig,
  PriceCalculationInput,
  PriceCalculationResult,
  AppliedDiscount,
} from '@/types/pricing-configurator'

interface UsePricingCalculatorProps {
  pricingConfig: PricingConfig
  width: number
  height: number
  quantity: number
  materialMultiplier: number
  shape?: string
  finish?: string
}

interface UsePricingCalculatorReturn {
  result: PriceCalculationResult
  discounts: AppliedDiscount[]
  savings: number
  nextDiscount: { quantity: number; discount: number } | null
  formattedUnitPrice: string
  formattedTotalPrice: string
  formattedSavings: string
  pricePerUnit: number
  hasDiscounts: boolean
}

/**
 * Hook para calcular precios con el sistema de pricing avanzado
 */
export function usePricingCalculator({
  pricingConfig,
  width,
  height,
  quantity,
  materialMultiplier,
  shape,
  finish,
}: UsePricingCalculatorProps): UsePricingCalculatorReturn {
  
  const input: PriceCalculationInput = useMemo(() => ({
    width,
    height,
    quantity,
    materialMultiplier,
    shape,
    finish,
    pricingConfig,
  }), [width, height, quantity, materialMultiplier, shape, finish, pricingConfig])

  const result = useMemo(() => {
    try {
      return calculatePrice(input)
    } catch (error) {
      console.error('[usePricingCalculator] Error calculating price:', error)
      // Retornar un resultado por defecto en caso de error
      return {
        unitPrice: 0,
        totalPrice: 0,
        breakdown: {
          basePrice: 0,
          materialMultiplier: 1,
          appliedMinPrice: false,
        },
      }
    }
  }, [input])

  const discounts = useMemo(() => {
    return getAppliedDiscounts(input, result)
  }, [input, result])

  const savings = useMemo(() => {
    return calculateSavings(input, result)
  }, [input, result])

  const nextDiscount = useMemo(() => {
    return getNextDiscount(input)
  }, [input])

  const formattedUnitPrice = useMemo(() => {
    return formatPrice(result.unitPrice)
  }, [result.unitPrice])

  const formattedTotalPrice = useMemo(() => {
    return formatPrice(result.totalPrice)
  }, [result.totalPrice])

  const formattedSavings = useMemo(() => {
    return formatPrice(savings)
  }, [savings])

  const pricePerUnit = useMemo(() => {
    return result.totalPrice / quantity
  }, [result.totalPrice, quantity])

  const hasDiscounts = useMemo(() => {
    return discounts.length > 0 || savings > 0
  }, [discounts, savings])

  return {
    result,
    discounts,
    savings,
    nextDiscount,
    formattedUnitPrice,
    formattedTotalPrice,
    formattedSavings,
    pricePerUnit,
    hasDiscounts,
  }
}

