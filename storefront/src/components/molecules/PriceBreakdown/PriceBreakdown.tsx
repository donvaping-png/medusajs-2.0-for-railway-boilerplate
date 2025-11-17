"use client"

import type { PriceCalculationResult, AppliedDiscount } from '@/types/pricing-configurator'
import { formatPrice } from '@/lib/helpers/pricing-calculator'

interface PriceBreakdownProps {
  result: PriceCalculationResult
  discounts: AppliedDiscount[]
  savings: number
  nextDiscount?: { quantity: number; discount: number } | null
  className?: string
}

export function PriceBreakdown({
  result,
  discounts,
  savings,
  nextDiscount,
  className = '',
}: PriceBreakdownProps) {
  const { breakdown } = result

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-semibold mb-3">Desglose de Precio</h3>

      <div className="space-y-2 text-sm">
        {/* Precio Base */}
        <div className="flex justify-between">
          <span className="text-gray-600">Precio base:</span>
          <span className="font-medium">{formatPrice(breakdown.basePrice)}</span>
        </div>

        {/* Área (si aplica) */}
        {breakdown.area && (
          <div className="flex justify-between">
            <span className="text-gray-600">Área:</span>
            <span className="font-medium">{breakdown.area.toFixed(4)} m²</span>
          </div>
        )}

        {/* Precio por m² (si aplica) */}
        {breakdown.pricePerSqm && (
          <div className="flex justify-between">
            <span className="text-gray-600">Precio por m²:</span>
            <span className="font-medium">{formatPrice(breakdown.pricePerSqm)}</span>
          </div>
        )}

        {/* Multiplicador de Material */}
        {breakdown.materialMultiplier !== 1.0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Material:</span>
            <span className="font-medium">×{breakdown.materialMultiplier.toFixed(2)}</span>
          </div>
        )}

        {/* Multiplicador de Forma */}
        {breakdown.shapeMultiplier && breakdown.shapeMultiplier !== 1.0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Forma:</span>
            <span className="font-medium">×{breakdown.shapeMultiplier.toFixed(2)}</span>
          </div>
        )}

        {/* Multiplicador de Acabado */}
        {breakdown.finishMultiplier && breakdown.finishMultiplier !== 1.0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Acabado:</span>
            <span className="font-medium">×{breakdown.finishMultiplier.toFixed(2)}</span>
          </div>
        )}

        {/* Multiplicador de Cantidad */}
        {breakdown.quantityMultiplier && breakdown.quantityMultiplier !== 1.0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Descuento cantidad:</span>
            <span className="font-medium text-green-600">
              ×{breakdown.quantityMultiplier.toFixed(2)}
            </span>
          </div>
        )}

        {/* Descuento por Volumen */}
        {breakdown.volumeDiscount && breakdown.volumeDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-600">Descuento volumen:</span>
            <span className="font-medium text-green-600">
              -{breakdown.volumeDiscount}%
            </span>
          </div>
        )}

        {/* Precio Mínimo Aplicado */}
        {breakdown.appliedMinPrice && (
          <div className="flex justify-between">
            <span className="text-gray-600 text-xs italic">Precio mínimo aplicado</span>
          </div>
        )}
      </div>

      {/* Descuentos Aplicados */}
      {discounts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold mb-2 text-green-700">Descuentos Aplicados</h4>
          <div className="space-y-1">
            {discounts.map((discount, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">{discount.description}:</span>
                <span className="font-medium text-green-600">
                  -{discount.percent.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ahorro Total */}
      {savings > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-gray-600 font-medium">Ahorro total:</span>
            <span className="font-bold text-green-600">{formatPrice(savings)}</span>
          </div>
        </div>
      )}

      {/* Siguiente Descuento */}
      {nextDiscount && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-800">
            💡 <strong>Consejo:</strong> Compra {nextDiscount.quantity} unidades y ahorra un{' '}
            {nextDiscount.discount.toFixed(1)}% adicional
          </p>
        </div>
      )}

      {/* Precio Final */}
      <div className="mt-4 pt-4 border-t-2 border-gray-300">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Precio unitario:</span>
          <span className="text-xl font-bold text-blue-600">
            {formatPrice(result.unitPrice)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-semibold">Precio total:</span>
          <span className="text-2xl font-bold text-blue-600">
            {formatPrice(result.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  )
}

